import React from 'react'
import { ChevronRight } from 'lucide-react'

const Category = () => {
  return (
    <>
        <div className='m-3 mt-6 bg-white p-3 rounded-xl'>
            <div className='flex justify-between px-2'>
                <p className='font-bold tracking-wide'>Categories</p>
            </div>
            <div className='flex items-center gap-5 px-2 my-3 overflow-x-auto no-scrollbar'>
                <div className='   bg-blue-600 text-[14px] px-2 py-1 rounded-md text-white font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>All</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Sci-Fi</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Geography</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>History</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Science</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Spirituality</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Fantasy</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Drama</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Business</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Technology</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Education</div>
                <div className='bg-blue-100 text-[14px] px-2 py-1 rounded-md text-black font-medium flex justify-center items-center cursor-pointer whitespace-nowrap'>Adventure</div>
            </div>
            <div className='mt-3 mb-2 px-2 grid grid-cols-6 gap-6 h-64 justify-items-center'>
                <div className='w-36 shadow-lg rounded-b-lg'>
                    <div className='h-8/10 bg-amber-900 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                    <div></div>
                </div>
                <div className='w-36 shadow-lg rounded-lg rounded-b-lg'><div className='h-8/10 bg-red-400 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                <div></div></div>
                <div className='w-36 shadow-lg rounded-lg rounded-b-lg'><div className='h-8/10 bg-orange-400 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                <div></div></div>
                <div className='w-36 shadow-lg rounded-lg rounded-b-lg'><div className='h-8/10 bg-fuchsia-600 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                <div></div></div>
                <div className='w-36 shadow-lg rounded-lg rounded-b-lg'><div className='h-8/10 bg-rose-600 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                <div></div></div>
                <div className='w-36 shadow-lg rounded-lg rounded-b-lg'><div className='h-8/10 bg-indigo-400 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                <div></div></div>
            </div>
        </div>
    </>
  )
}

export default Category