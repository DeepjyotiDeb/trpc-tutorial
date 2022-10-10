import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserInput } from '../schema/user.schema'
import { trpc } from '../utils/trpc'

function RegisterPage() {
  const router = useRouter()
    const {handleSubmit, register} = useForm<CreateUserInput>()
    const {mutate, error} = trpc.useMutation(['usersregister'], {
      onSuccess: (success) => {
        router.push('/login')
      },
    })

    function onSubmit(values: CreateUserInput) {
      mutate(values)
    }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <h1>Register</h1>
      <input type='email' placeholder='janedoe@mail.com' {...register('email')}/>
      <br/>
      <input type='text' placeholder='name' {...register('name')}/>
      <br/>
      <button type='submit'>Submit</button>
    </form>
    <Link href='/login'>Login</Link>
    </>
  )
}

export default RegisterPage