import React, { useEffect, useState } from 'react'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { BookOpen } from 'lucide-react';
import axios from 'axios';

const PopularBook = () => {
    const [popularBook, setPopularBook] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const fetchData = async() => {
            try {
                const response = await axios.get("http://localhost:5000/api/book/popular");
                console.log(response);
                setPopularBook(response.data.data[0]);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[]);
  return (
    <div className='h-screen sticky top-0 bottom-0 bg-blue-950 2xl:px-3 py-24'>
        <div className='flex flex-col items-center gap-3'>
            <div className='h-64 w-32 mb-3'>
                {!loading && popularBook && <img src={popularBook?.coverImage} className='h-8/10 bg-gray-300 rounded-lg text-2xl flex justify-center items-center text-black'/>}
                <div className='h-2/10 flex flex-col gap-2 items-center text-white text-sm mt-1'>
                    {!loading && popularBook && <p className='text-center text-wrap w-full max-h-3/4'>{popularBook?.title}</p>}
                    {!loading && popularBook && <p className='text-[12px] text-white/70'>{popularBook?.author}</p>}
                </div>
            </div>
            <Stack spacing={1} marginTop={2}>
                {!loading && popularBook && <Rating name="half-rating-read" defaultValue={(popularBook?.rating)/2} precision={0.1} style={{height:10}} readOnly />}
            </Stack>
            <p className='text-white text-[12px] mt-1'>{Number(((popularBook?.rating)/2).toPrecision(2))}</p>
            {!loading && popularBook && <div className='px-1 2xl:px-0 grid grid-cols-3 text-white/75 text-[12px] text-center justify-items-center xl:gap-3'>
                <div className='border-r border-white/75 flex flex-col gap-1 align-middle pr-1 2xl:pr-3'>
                    <div>{popularBook?.noOfPages}</div>
                    <div>Pages</div>
                </div>
                <div className='border-r border-white/75 flex flex-col gap-1 pr-1 2xl:pr-3'>
                    <div>{popularBook?.weeklyReaders}</div>
                    <div>Downloads</div>
                </div>
                <div className='flex flex-col gap-1 pl-1 2xl:pl-0'>
                    <div>{popularBook?.reviews.length}</div>
                    <div>Reviews</div>
                </div>
            </div>}
            {!loading && popularBook && <p className='text-[12px] text-white/75 m-3 max-h-40 overflow-hidden xl:w-44 w-32'>
                {popularBook?.description}
            </p>}
            <div className='text-white bg-blue-700 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-lg'>
                <button className='flex justify-center items-center gap-2 cursor-pointer'>
                    <p className='leading-5'>Read Now</p>
                    <BookOpen height={18} width={18}/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default PopularBook