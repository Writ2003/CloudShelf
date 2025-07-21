import React, { useState } from 'react'
import libraryBackground from '/src/assets/janko-ferlic-sfL_QOnmy00-unsplash.jpg?url'
import cloudShelfLogo from '/src/assets/CloudShelf logo.png?url'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Reader');
  const navigate = useNavigate();
  const submitLogin = async(e) => {
    e.preventDefault();
    if(!usernameOrEmail || !password) return;
    try {
      const response = await axios.post("http://localhost:5000/api/user/login",{
        usernameOrEmail,password,userType
      },{withCredentials: true});
      console.log(response.data);
      console.log(response.data.message);
      toast.success(response.data.message);
      setTimeout(() => {
        if (response.data.user.userType === "Reader") {
          navigate("/reader");
        } else if (response.data.user.userType === "Admin") {
          navigate("/admin");
        }
      },1000);
    } catch (error) {
      if(error.status>=400 && error.status<500) toast.error("User not found!");
      else toast.error("Server error!");
      console.error("Error while logging in, error: ",error);
      if(error.status===400) setTimeout(() => {
        navigate("/register",{replace:true});
      },1000)
    }
  }
  const handleUserType = (e,userType) => {
    e.preventDefault();
    setUserType(userType);
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
                <form onSubmit={submitLogin} className='flex flex-col gap-6 justify-center p-6'>
                  <div className='flex mx-auto cursor-pointer items-center justify-between text-lg tracking-wide font-medium font-serif border rounded-full text-slate-600 bg-gray-100 border-gray-100'>
                    <button onClick={(e) => handleUserType(e,"Reader")} className={`cursor-pointer px-6 py-3 rounded-full ${userType==='Reader'?'bg-gray-200':''}`}>Reader</button>
                    <button onClick={(e) => handleUserType(e,"Admin")} className={`cursor-pointer px-6 py-3 rounded-full ${userType==='Admin'?'bg-gray-200':''}`}>Admin</button>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor="email address or username" className='font-medium'>Username or Email</label>
                    <input type="text" id='email address or username' value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} placeholder='Type email or username here' className='outline-none border-b border-gray-400 pb-2' autoComplete='username' required/>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor="password" className='font-medium'>Password</label>
                    <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Type password here' className='outline-none border-b border-gray-400 pb-2' autoComplete='current-password' required/>
                  </div>
                  <button type='submit' className='bg-blue-400 p-2 font-medium text-white cursor-pointer tracking-wide text-lg'> Login </button>
                </form>
                <div className='flex justify-center -mt-3'>
                  <Link to='/register' className='bg-red-500 w-full p-2 mx-6 font-medium text-center text-white cursor-pointer tracking-wide text-lg'>Don't have an account? Register</Link>
                </div>
              </div>
            </div>
            <ToastContainer position='top-center'/>
        </div>
    </>
  )
}

export default Login