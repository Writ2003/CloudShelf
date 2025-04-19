import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {BookHeart, BookOpen, SendHorizonal} from 'lucide-react'
import { Stack, Rating, Box} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import minion from '/src/assets/minion.png?url'
import ExpandableInlineText from './ExpandableInlineText';

const label = {1:'Very Poor',2:'Poor',3:'Average',4:'Good',5:'Excellent'}
function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${label[value]}`;
}

const BookInfo = () => {
    const { bookid } = useParams();
    const [bookInfo, setBookInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);
    const [userReview, setUserReview] = useState("");
    const textareaRef = useRef(null);
    //const [colorIndex, setColorIndex] = useState(Math.floor(Math.random() * 6));

    const colors = [
        'ring-amber-400 from-amber-500 to-amber-400',
        'ring-purple-400 from-purple-500 to-purple-400',
        'ring-cyan-400 from-cyan-500 to-cyan-400',
        'ring-teal-400 from-teal-500 to-teal-400',
        'ring-lime-400 from-lime-500 to-lime-400',
        'ring-red-400 from-red-500 to-red-400'
    ];

    useEffect(() => {
        const fetchBookInfo = async() => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/book/getBook/${bookid}`);
                console.log(response.data)
                setBookInfo(response.data)
            } catch (error) {
                console.error("Error: ",error);
            } finally {
                setLoading(false);
            }
        }
        fetchBookInfo();
    },[])
    const capitalizeWords = (str) => {
        return str.toLowerCase().split(' ').map(function(word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
    const handleReview = (e) => setUserReview(e.target.value);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = 'auto'; // Reset height
          textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
        }
    },[value])
    const saveReview = async(e) => {
        e.preventDefault();
    }
    const getRandomColor = (color,index) => {
        const template = chooseRandomColor[index % chooseRandomColor.length];
        return color.replace("something", template);
    }
  return (
    <>
        {!loading && <div className='px-3 py-3'>
            <div className='flex bg-slate-50 rounded-lg min-h-96'>
                <div className='flex gap-6 items-center justify-start m-6 h-80'>
                    <img src={bookInfo?.coverImage} className='h-full max-w-60 rounded-2xl object-cover border border-gray-500 shadow-md'/>
                </div>
                <div className='col-span-2 my-6 mx-3 flex flex-col gap-1.5 tracking-wide'>
                    <p className='text-2xl font-semibold font-serif pt-3'>{capitalizeWords(bookInfo?.title)}</p>
                    <p className='text-lg font-medium font-serif'><span className='font-normal'>Author: </span>{bookInfo?.author}</p>
                    <p className='text-[14px] font-serif max-h-32 overflow-clip'><span className='text-[16px] font-medium'>Description</span>: {bookInfo?.description}</p>
                    <p className='text-sm font-serif'>Publisher: {bookInfo?.publisher}</p>
                    <p className='text-sm font-serif'>Genre: {bookInfo?.genre?.map((g,index) => (<span key={index}>{g}{index!==bookInfo?.genre?.length-1?", ":""}</span>))}</p>
                    <div className='grid grid-cols-3 gap-3 w-72 mt-1.5 bg-blue-400 shadow-md p-1.5 rounded-md text-white'>
                        <div className='border-r border-white flex flex-col items-center font-serif'>
                            <p>Rating</p>
                            <p className='-ml-2'>⭐{((Number(bookInfo?.rating))/2).toFixed(1)}</p>
                        </div>
                        <div className='border-r border-white flex flex-col items-center font-serif'>
                            <p>Pages</p>
                            <p>{bookInfo?.noOfPages}</p>
                        </div>
                        <div className='flex flex-col items-center font-serif'>
                            <p>Readers</p>
                            <p>{bookInfo?.totalReaders}</p>
                        </div>
                    </div>
                    <div className='w-72 flex gap-2 justify-center'>
                        <button className='bg-blue-500 shadow-lg cursor-pointer text-white font-serif px-3 py-4 rounded-md mt-2 w-36 inline-flex gap-2 items-center justify-center'>Read Now <BookOpen width={20} height={20}/></button>
                        <button className='bg-amber-400 shadow-lg cursor-pointer text-white font-serif px-3 py-4 rounded-md mt-2 w-36 inline-flex gap-2 items-center justify-center'>Favourite <BookHeart width={20} height={20}/></button>
                    </div>
                </div>
            </div>
            <div className='bg-slate-50 p-3 mt-3 rounded-lg'>
                <div className='grid grid-cols-3 gap-3 p-3 tracking-wide'>
                    <div className='flex flex-col items-center gap-1 border-r border-black'>
                        <p className=''>Weekly Readers</p>
                        <p className='font-semibold text-xl'>{bookInfo?.weeklyReaders}</p>
                    </div>
                    <div className='flex flex-col items-center gap-1 border-r border-black'>
                        <p className=''>Total Readers</p>
                        <p className='font-semibold text-xl'>{bookInfo?.totalReaders}</p>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                        <p className=''>Average Rating</p>
                        <Stack spacing={1} marginTop={0}>
                            <Rating name="half-rating-read" defaultValue={(bookInfo?.rating)/2} precision={0.1} style={{height:20}} readOnly />
                        </Stack>
                    </div>
                </div>
                <div className='m-3 flex gap-3 items-center'>
                    <p className='text-xl font-semibold'>Rate this book</p>
                    <Box sx={{ minWidth: 200, display: 'flex', alignItems: 'center' }}>
                        <Rating
                            name="hover-feedback"
                            value={value}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover(newHover);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        {value !== null && (
                            <Box sx={{ ml: 1, display:'flex', justifyContent:'center', textAlign:'center', textWrap:'nowrap', minWidth:100 }}>{label[hover !== -1 ? hover : value]}</Box>
                        )}
                    </Box>
                </div>
                <div className='flex items-center gap-3 mx-3'>
                    <textarea type="text" value={userReview} onChange={handleReview} placeholder='Type your review' className='border-b border-gray-400 py-3.5 overflow-y-auto resize-none leading-5 text-[16px] w-2xl outline-none' rows={1}/>
                    <button onClick={saveReview} className='bg-slate-400 shadow-lg p-2 rounded-lg cursor-pointer'><SendHorizonal width={20} height={20} color='white'/></button>
                </div>
                <p className='text-xl font-semibold tracking-wide mx-3 my-6'>User Reviews</p>
                <div className='mx-3'>
                    {Array.from({length:6},(ele,ind) =>(<div key={ind} className='w-full my-6'>
                        <div className='flex items-center gap-3'>
                            <img src={minion} alt="minion.png" height={26} width={26} className={`rounded-full ring ${colors[ind%6].split(' ')[0]} ring-offset-2`}/>
                            <p className={`text-[12px] tracking-wide font-medium shadow-md bg-gradient-to-br ${colors[ind%6].split(' ')[1]} ${colors[ind%6].split(' ')[2]} p-1 rounded-lg text-white`}>Supratim Das</p>
                        </div>
                        <div className="my-1.5">
                            <ExpandableInlineText key={2} text="Just finished The Night Circus and wow... it’s like reading a dream. The writing is so visual and poetic, I felt like I was actually walking through the circus. The love story was subtle but beautiful, and the whole atmosphere was pure magic. Definitely one of those books that stays with you. 10/10 recommend if you love fantasy with a slow burn vibe. ✨📖🎪 another few line here and there, i need to write more line to check if it's working properly or not" />
                        </div>
                    </div>))}
                </div>
                <div className='mx-3 w-full flex justify-center items-center font-medium text-white'><button className='bg-blue-400 shadow-md py-1 px-3 cursor-pointer rounded-md'>Load More</button></div>
            </div>
        </div>}
    </>
  )
}

export default BookInfo