import React, { useState } from 'react'
import libraryBackground from '/src/assets/janko-ferlic-sfL_QOnmy00-unsplash.jpg?url'
import cloudShelfLogo from '/src/assets/CloudShelf logo.png?url'
import { Link } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submitRegister = () => {

  }
  return (
    <>
      <div className='w-full h-screen grid grid-cols-2 box-border p-0 m-0'>
        <div className=''>
          <img src={libraryBackground} alt='Library Background' className='object-cover h-screen w-full p-12'/>
        </div>
        <div className=' p-12'>
          <div className='border border-black p-3 h-full flex flex-col gap-1.5'>
            <div className='flex items-center justify-center gap-6'>
              <img src={cloudShelfLogo} alt='CloudShelf Logo' width={120} height={120} className='rounded-full'/>
              <p className='text-4xl tracking-wider font-medium font-serif text-gray-600'><span className='text-blue-400 font-extrabold'>Cloud</span>Shelf</p>
            </div>
            <form onSubmit={submitRegister} className='flex flex-col gap-6 justify-center p-6'>
              <div className='flex flex-col gap-2'>
                <label for="email address" className='font-medium'>Email</label>
                <input type="email" id='email address' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Type email here' className='outline-none border-b border-gray-400 pb-2' required/>
              </div>
              <div className='flex flex-col gap-2'>
                <label for="username" className='font-medium'>Username</label>
                <input type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Type username here' className='outline-none border-b border-gray-400 pb-2' required/>
              </div>
              <div className='flex flex-col gap-2'>
                <label for="password" className='font-medium'>Password</label>
                <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Type password here' className='outline-none border-b border-gray-400 pb-2' required/>
              </div>
              <button type='submit' className='bg-blue-400 p-2 font-medium text-white cursor-pointer tracking-wide text-lg'> Register </button>
            </form>
            <div className='flex justify-center -mt-3'>
              <Link to='/login' className='bg-red-500 w-full p-2 mx-6 font-medium text-center text-white cursor-pointer tracking-wide text-lg'>Have an existing account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register