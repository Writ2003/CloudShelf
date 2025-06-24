import { ChevronRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'

const getScreenSize = () => {
    if (window.innerWidth >= 1280 && window.innerWidth < 1536) return 'medium'; // Medium screen
    return 'large'; // Large screen
};

const Card = () => {
    const [books, setBooks] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const screenSize = getScreenSize();
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/book/getBooks?screenSize=${screenSize}`);
                console.log(response);
                if(!response.data.success) console.error("Error: ", response.data.message);
                setBooks(response.data.data);
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
  return (
    <>
        <div className='m-3 bg-white p-3 rounded-xl'>
            <div className='flex justify-between px-2'>
                <p className='font-bold tracking-wide'>Recommended</p>
                <div className='bg-blue-100/75 text-[12px] p-1 rounded-md text-blue-500 font-medium flex justify-center items-center cursor-pointer'>
                    See All <ChevronRight height={12} width={12} />
                </div>
            </div>
            
            {loading ? (
                <div className='mt-3 mb-2 px-2 grid grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-6 h-64 justify-items-center'>
                    {[...Array(getScreenSize()==="large"?6:5)].map((_, index) => (
                        <div key={index} className='w-36 shadow-lg rounded-b-lg'>
                            <Skeleton variant='rectangular' width={144} height={160} className='rounded-t-lg' />
                            <div className='flex flex-col gap-1 px-3 pt-0.5'>
                                <Skeleton variant='text' width={120} height={20} />
                                <Skeleton variant='text' width={100} height={16} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                books?.length > 0 && (
                    <div className='mt-3 mb-2 px-2 grid grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-6 h-64 justify-items-center'>
                        {books.map(book => (
                            <Link to={`/bookInfo/${book._id}`} key={book?._id} className='w-36 shadow-lg rounded-b-lg cursor-pointer'>
                                <img src={book?.coverImage} alt={book?.title} className='h-52 bg-amber-900 rounded-t-lg text-2xl flex justify-center items-center text-white'/>
                                <div className='flex flex-col gap-1 px-3 pt-0.5'>
                                    <p title={book?.title} className='truncate font-semibold text-[14px]'>{book?.title}</p>
                                    <p title={book?.author} className='truncate text-[12px]'>{book?.author}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>
    </>
  )
}

export default Card