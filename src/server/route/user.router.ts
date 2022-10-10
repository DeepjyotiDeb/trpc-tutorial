import * as trpc from '@trpc/server'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { createUserSchema, requestOtpSchema, verifyOtpSchema } from '../../schema/user.schema';
import { createRouter } from '../createRouter';
import { sendLoginEmail } from '../../utils/mailer';
import { baseUrl, url } from '../../constants';
import { decode, encode } from '../../utils/base64';
import { signJwt } from '../../utils/jwt';
import { serialize } from 'cookie';

export const userRouter = createRouter().mutation('register', {

    input: createUserSchema,

    resolve: async ({ ctx, input }) => {
        const { email, name } = input
        try {
            const user = await ctx.prisma.uSER.create({
                data: {
                    email, name
                }
            })
            return user
        } catch (e) {
            //
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new trpc.TRPCError({
                        code: 'CONFLICT',
                        message: 'User already exists'
                    })
                }
            }

            throw new trpc.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong'
            })
        }
    },
}).mutation('request-otp', {
    input: requestOtpSchema,
    async resolve({ ctx, input }) {
        const { email, redirect } = input

        const user = await ctx.prisma.uSER.findUnique({
            where: {
                email,
            }
        })
        if (!user) {
            throw new trpc.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
            })
        }

        const token = await ctx.prisma.loginToken.create({
            data: {
                redirect,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        await sendLoginEmail({
            token: encode(`${token.id}:${user.email}`),
            url: baseUrl,
            email: user.email
        })
        return true
    }
}).query('verify-otp', {
    input: verifyOtpSchema,
    async resolve({ input, ctx }) {
        const decoded = decode(input.hash).split(':')

        const [id, email] = decoded
        const token = await ctx.prisma.loginToken.findFirstOrThrow({
            where: {
                id: id,
                user: {
                    email: email
                }
            },
            include: {
                user: true
            }
        });

        // console.log('token', token)
        if (!token) {
            throw new trpc.TRPCError({
                code: 'FORBIDDEN',
                message: 'Invalid token'
            })
        }

        const jwt = signJwt({
            email: token.user.email, //passing only necessary stuff into the token
            id: token.user.id
        })

        ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }))

        return {
            redirect: token.redirect
        }
    }
}).query('me', {
    resolve({ ctx }) {
        return ctx.user
    }
})