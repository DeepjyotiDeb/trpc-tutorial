import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserInput } from '../schema/user.schema'
import { trpc } from '../utils/trpc'

function VerifyToken({hash}:{hash:string}){
  const {data, isLoading} = trpc.useQuery(['users.verify-otp', {hash}])
  const router = useRouter()
  if(isLoading){
    return <>Verifying...</>
  }

  router.push(data?.redirect.includes('login') ? '/': data?.redirect || '/')
  return <>Redirecting...</>
}

function LoginForm() {
  const router = useRouter()
  const {handleSubmit, register} = useForm<CreateUserInput>()
  const [success, setSuccess] = useState(false)
  const {mutate, error} = trpc.useMutation(['users.request-otp'], {
      onSuccess: (success) => {
        setSuccess(true)
      },
    })

  function onSubmit(values: CreateUserInput) {
    mutate({...values, redirect: router.asPath})
  }

  const hash = router.asPath.split('#token=')[1]
  if(hash) {
    return <VerifyToken hash={hash}/>
  }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      {success && <p>Check your email</p>}
      <h1>Log in</h1>
      <input type='email' placeholder='janedoe@mail.com' {...register('email')}/>
      <br/>
      <button type='submit'>Login</button>
    </form>
    <Link href='/register'>Register</Link>
    </>
  )
}

export default LoginForm