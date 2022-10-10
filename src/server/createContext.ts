import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../utils/jwt';
import { prisma } from '../utils/prisma'

interface CtxUser {
    id: string
    email: string
    name: string
    iat: string
    exp: string
}

function getUserFromRequest(req: NextApiRequest) {
    const token = req.cookies.token

    if (token) {
        try {
            const verified = verifyJwt<CtxUser>(token)
            return verified
        } catch (e) {
            return null
        }
    }

    return null
}
//context or ctx is now accessible?
export function createContext({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const user = getUserFromRequest(req)

    return { req, res, prisma, user }
}

export type Context = ReturnType<typeof createContext>

// # Environment variables declared in this file are automatically made available to Prisma.
// # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

// # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
// # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

// # DATABASE_URL = "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
// DATABASE_URL = "mongodb+srv://deep123:kT6WzAk1GvrPAeGW@cluster0.odmoqbp.mongodb.net/trpc_tut?retryWrites=true&w=majority"