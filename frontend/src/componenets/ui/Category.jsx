import React, { useState, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';

const getScreenSize = () => {
    if(window.innerWidth < 1280) return 'small'
    if (window.innerWidth >= 1280 && window.innerWidth < 1536) return 'medium'; // Medium screen
    return 'large'; // Large screen
};
const noOfBookByWidth = {
    'small':4,
    'medium':5,
    'large':6
}
let noOfBooks;
const Category = () => {
    const [genres, setGenres] = useState(null);
    const [currentGenre, setCurrentGenre] = useState(null);
    const [books, setBooks] = useState(null);
    const [loading, setLoading] = useState(false);
    const genreRefs = useRef({});
    const [imageLoading, setImageLoading] = useState({}); // track image loading
    useEffect(() => {
        const screenSize = getScreenSize();
        noOfBooks = noOfBookByWidth[screenSize];
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
    };
    const handleImageLoad = (bookId) => {
      setImageLoading((prev) => ({ ...prev, [bookId]: false }));
    };

  return (
    <>
        <div className='m-3 bg-white p-3 rounded-xl'>
            <div className='flex justify-between px-2'>
                <p className='font-bold tracking-wide'>Categories</p>
            </div>
            {/* ✅ Genres */}
            {!loading && genres?.length > 0 && (
              <div className="flex items-center gap-5 px-2 my-3 overflow-x-auto no-scrollbar">
                {genres.map((genre) => (
                  <button
                    ref={genreRefs}
                    onClick={() => changeGenre(genre._id)}
                    key={genre._id}
                    className={`${
                      currentGenre === genre._id
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-black"
                    } text-[14px] px-2 py-1 rounded-md font-medium flex justify-center items-center cursor-pointer whitespace-nowrap`}
                  >
                    {genre._id}
                  </button>
                ))}
              </div>
            )}

            {/* ✅ Books */}
            {!loading && books?.length > 0 && (
              <div className="mt-3 mb-2 px-2 grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-6 h-64 justify-items-center">
                {books.slice(0, noOfBooks).map((book) => (
                  <Link
                    to={`/bookinfo/${book._id}`}
                    key={book._id}
                    className="w-36 shadow-lg rounded-b-lg cursor-pointer"
                  >
                    {/* Show skeleton until image is loaded */}
                    {imageLoading[book._id] !== false && (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width="100%"
                        height={208} // 52*4 (h-52 = 208px)
                        className="rounded-t-lg"
                      />
                    )}
                    <img
                      src={book?.coverImage}
                      className={`h-52 w-full bg-amber-900 rounded-t-lg text-2xl object-cover ${
                        imageLoading[book._id] === false ? "block" : "hidden"
                      }`}
                      onLoad={() => handleImageLoad(book._id)}
                      alt={book?.title}
                    />

                    <div className="flex flex-col gap-1 px-3 py-1">
                      <p
                        title={book?.title}
                        className="truncate font-semibold text-[14px]"
                      >
                        {book?.title}
                      </p>
                      <p
                        title={book?.author}
                        className="truncate text-[12px]"
                      >
                        {book?.author}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* ✅ Global loading skeleton (when full loading=true) */}
            {loading && (
              <div className="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-6 mt-3 px-2">
                {Array.from({ length: noOfBooks }).map((_, i) => (
                  <div key={i} className="w-36">
                    <Skeleton variant="rectangular" height={208} animation="wave" />
                    <Skeleton variant="text" height={20} width="80%" />
                    <Skeleton variant="text" height={15} width="60%" />
                  </div>
                ))}
              </div>
            )}
        </div>
    </>
  )
}

export default Category