import React from 'react'
import { BookOpen, BookUp2, BookX, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className='p-6 mx-32 bg-slate-200 my-3 rounded-md'>
      <p className='text-center mb-3 text-lg font-bold tracking-wider p-1.5 bg-white mx-auto rounded-lg'>Actions</p>
      <div className='grid grid-cols-4 gap-6'>
        <Link to='addbook' className='cursor-pointer bg-gradient-to-br from-amber-300 to-amber-500 p-6 rounded-2xl shadow-md'>
          <div className='flex items-center justify-evenly text-white gap-6'>
            <div className='flex justify-center items-center h-16 w-16 rounded-full bg-white'>
              <BookOpen className='text-black' size={32}/>
            </div>
            <p className='text-2xl font-bold'>Add Book</p>
          </div>
        </Link>
        <Link to='addcontent' className='cursor-pointer bg-gradient-to-br from-green-300 to-green-500 p-6 rounded-2xl shadow-md'>
          <div className='flex items-center justify-evenly text-white gap-6'>
            <div className='flex justify-center items-center h-16 w-16 rounded-full bg-white'>
              <BookUp2 className='text-black' size={32}/>
            </div>
            <p className='text-2xl font-bold '>Add Content</p>
          </div>
        </Link>
        <Link to='removebook' className='cursor-pointer bg-gradient-to-br from-red-300 to-red-500 p-6 rounded-2xl shadow-md'>
          <div className='flex items-center justify-evenly text-white gap-6'>
            <div className='flex justify-center items-center h-16 w-16 rounded-full bg-white'>
              <BookX className='text-black' size={32}/>
            </div>
            <p className='text-2xl font-bold '>Remove</p>
          </div>
        </Link>
        <Link to='findbook' className='cursor-pointer bg-gradient-to-br from-blue-300 to-blue-500 p-6 rounded-2xl shadow-md'>
          <div className='flex items-center justify-evenly text-white gap-6'>
            <div className='flex justify-center items-center h-16 w-16 rounded-full bg-white'>
              <Search className='text-black' size={32}/>
            </div>
            <p className='text-2xl font-bold '>Find Book</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard