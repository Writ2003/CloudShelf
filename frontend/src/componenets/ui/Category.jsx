import React, { useState, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const getScreenSize = () => {
    if (window.innerWidth >= 1280 && window.innerWidth < 1536) return 'medium'; // Medium screen
    return 'large'; // Large screen
};
let noOfBooks;
const Category = () => {
    const [genres, setGenres] = useState(null);
    const [currentGenre, setCurrentGenre] = useState(null);
    const [books, setBooks] = useState(null);
    const [loading, setLoading] = useState(false);
    const genreRefs = useRef({});
    useEffect(() => {
        const screenSize = getScreenSize();
        noOfBooks = screenSize === 'medium' ? 5:6;
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/book/categories?screenSize=${screenSize}`);
                console.log(response.data);
                setCurrentGenre(response.data.data[0]._id);
                setGenres(response.data.data);
                setBooks(response.data.data[0].books);
                console.log(noOfBooks)
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false); 
            }
        };
        fetchData();
    }, []);
    const changeGenre = (genre) => {
        console.log(genre);
        setCurrentGenre(genre);
        setBooks([]);
        setTimeout(() => {
            requestAnimationFrame(() => {
                const target = genreRefs.current[genre];
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                    });
                }
            });
        }, 50);
        setLoading(true);
        const genreData = genres.find(data => data._id === genre);
        if (genreData) {
            setTimeout(() => {
                setBooks(genreData.books);
                setLoading(false);
            }, 100);
        } else {
            console.warn(`Genre ${genre} not found.`);
            setBooks([]); // fallback just in case
            setLoading(false)
        }
    }
  return (
    <>
        <div className='m-3 mt-6 bg-white p-3 rounded-xl'>
            <div className='flex justify-between px-2'>
                <p className='font-bold tracking-wide'>Categories</p>
            </div>
            {!loading && genres?.length>0 && genres && <div className='flex items-center gap-5 px-2 my-3 overflow-x-auto no-scrollbar'>
                {genres.map((genre,index) => (<button onClick={() => changeGenre(genre._id)} ref={(el) => (genreRefs.current[genre._id] = el)} key={genre._id} className={`${currentGenre===genre._id?'bg-blue-600 text-white':'bg-blue-100 text-black'} text-[14px] px-2 py-1 rounded-md  font-medium flex justify-center items-center cursor-pointer whitespace-nowrap`}>{genre._id}</button>))}
            </div>}
            {!loading && books?.length>0 && books && <div className='mt-3 mb-2 px-2 grid grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-6 h-64 justify-items-center'>
                {books.slice(0,noOfBooks).map((book,index) => (<Link to={`/bookinfo/${book._id}`} key={index} className='w-36 shadow-lg rounded-b-lg cursor-pointer'>
                    <img src={book?.coverImage} className='h-52 w-full bg-amber-900 rounded-t-lg text-2xl object-cover'/>
                    <div className='flex flex-col gap-1 px-3 py-1'>
                        <p title={book?.title} className='truncate font-semibold text-[14px]'>{book?.title}</p>
                        <p title={book?.author} className='truncate text-[12px]'>{book?.author}</p>
                    </div>
                </Link>))}
            </div>}
        </div>
    </>
  )
}

export default Category