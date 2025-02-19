import { ChevronRight } from 'lucide-react'
import React from 'react'

const Card = () => {
  return (
    <>
        <div className='m-3 bg-white p-3 rounded-xl'>
            <div className='flex justify-between px-2'>
                <p className='font-bold tracking-wide'>Recommended</p>
                <div className='bg-blue-100/75 text-[12px] p-1 rounded-md text-blue-500 font-medium flex justify-center items-center cursor-pointer'>See All <ChevronRight height={12} width={12}/></div>
            </div>
            <div className='mt-3 mb-2 px-2 grid grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-6 h-64 justify-items-center'>
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
                {/*<div className='w-36 shadow-lg rounded-lg rounded-b-lg'><div className='h-8/10 bg-indigo-400 rounded-t-lg text-2xl flex justify-center items-center text-white'>Book</div>
                <div></div></div>*/}
            </div>
        </div>
    </>
  )
}

export default Card