import axios from 'axios';
import { useEffect, useState, useRef, createContext } from 'react'
import { useParams } from 'react-router-dom'
import {BookHeart, BookOpen, SendHorizonal} from 'lucide-react'
import { Stack, Rating, Box} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import minion from '/src/assets/minion.png?url';
import avatar from '/src/assets/avatar.jpg?url';
import CreateDiscussionTopic from './ui/CreateDiscussionTopic';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Comment from './ui/Comment';
import { Skeleton } from '@mui/material';

export const DiscussionContext = createContext();
export const DiscussionContextProvider = DiscussionContext.Provider;

const label = {1:'Very Poor',2:'Poor',3:'Average',4:'Good',5:'Excellent'}
function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${label[value]}`;
}


const BookInfo = () => {
    const { bookid } = useParams();
    const [bookInfo, setBookInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(-1);
    const [userReview, setUserReview] = useState('');
    const [isReviewPosted, setIsReviewPosted] = useState(false);
    const [isRatingPosted, setIsRatingPosted] = useState(false);
    const textareaRef = useRef(null);
    const [createDiscussion,setCreateDiscussion] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentInfo, setCommentInfo] = useState({page: 1, totalPages: -1, totalComments: -1});
    const [discussionTopics, setDiscussionTopics] = useState([]);
    const [isTopicsLoading, setIsTopicsLoading] = useState(false);
    const [topicsInfo, setTopicsInfo] = useState({maxToBeShown: 5, count:0, showAll: false});
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        const fetchBookInfo = async() => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/book/getBook/${bookid}`,{withCredentials: true});
                console.log(response.data)
                setBookInfo(response.data.book)
                setIsFavorite(response.data.isFavourite);
            } catch (error) {
                console.error("Error: ",error);
            }
        }
        const fetchUserReviewInfo = async() => {
            try {
                const response = await axios.get(`http://localhost:5000/api/review/fetchReview/${bookid}`,{withCredentials: true});
                console.log(response.data.review);
                if(response.data.review?.comment !== '') {
                    setUserReview(response.data.review.comment);
                    setIsReviewPosted(true);
                }
                if(response.data.review?.rating > 0) {
                    setRating(response.data.review.rating);
                    setIsRatingPosted(true);
                }
            } catch (error) {
                console.error('Error while fetching user review, error: ',error);
            } finally {
                setLoading(false);
            }
        }
        const fetchComments = async() => {
            setCommentsLoading(true);
            try {
               const response = await axios.get(`http://localhost:5000/api/review/allReviews/${bookid}?page=${commentInfo.page}&limit=${15}`,{withCredentials: true});
               console.log('Comments: ',response.data.reviews);
               if(response.data?.reviews) setComments(response.data.reviews);
               setCommentInfo({page: response.data.currentPage, totalComments: response.data.totalReviews, totalPages: response.data.totalPages});
            } catch (error) {
                console.error('Error while fetching comments, error: ',error);
            } finally {
                setCommentsLoading(false);
            }
        }
        const fetchDiscussionTopics = async() => {
            setIsTopicsLoading(true);
            try {
                const response = await axios(`http://localhost:5000/api/discussionTopic/getTopics?bookId=${bookid}`,{withCredentials: true});
                console.log('Topics: ',response?.data?.topics)
                setDiscussionTopics(response?.data?.topics);
                setTopicsInfo(prev => ({...prev, count: response?.data?.noOfTopics}));
            } catch (error) {
                console.error('Error while fetching discussion topics, error: ',error?.response?.data?.message || error)
            } finally {
                setIsTopicsLoading(false);
            }
        }
        fetchBookInfo();
        fetchUserReviewInfo();
        fetchComments();
        fetchDiscussionTopics();
    },[bookid])
    const capitalizeWords = (str) => {
        if (!str || typeof str !== 'string') return '';
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
    },[userReview])
    const saveRating = async(newValue) => {
        try {
            const response = !isReviewPosted? await axios.post(`http://localhost:5000/api/review/addReview/${bookid}`,{rating: newValue*2},{withCredentials: true}): await axios.patch(`http://localhost:5000/api/review/updateReview/${bookid}`,{rating: newValue*2, comment: userReview},{withCredentials: true});
            console.log(response.data);
            setIsRatingPosted(true);
        } catch (error) {
            console.log('Error while posting rating: , ',error);
        }
    }
    const saveReview = async() => {
        try {
            const response = !isRatingPosted? await axios.post(`http://localhost:5000/api/review/addReview/${bookid}`,{comment: userReview},{withCredentials: true}): 
            await axios.patch(`http://localhost:5000/api/review/updateReview/${bookid}`,{rating, comment: userReview},{withCredentials: true});
            console.log(response.data);
            setIsReviewPosted(true);
        } catch (error) {
            console.log('Error while posting review, ',error);
        }
    }
    const handleSetCreateDiscussion = (e = null) => {
        if(e) e.preventDefault();
        setCreateDiscussion(prev => !prev);
    }
    const handleDiscussionTopic = async(title, description) => {
        if(!title) return;
        setIsTopicsLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/discussionTopic/createTopic`,{title, description, bookId:bookid}, {withCredentials: true});
            console.log(response.data.newTopic);
            setDiscussionTopics(prev => ([response.data.newTopic, ...prev]));
            setTopicsInfo(prev => ({...prev, count: prev.count + 1}));
        } catch (error) {
            console.error('Error while creating discussion topic, error: ',error?.response?.data?.message || error);
        } finally {
            setCreateDiscussion(false);
            setIsTopicsLoading(false)
        }
    }
    const displayTopics = () => {
        if(topicsInfo.showAll) return discussionTopics;
        else {
            let noOfTopics = discussionTopics.length;
            let toBeShown = noOfTopics < topicsInfo.maxToBeShown ? noOfTopics : topicsInfo.maxToBeShown;
            return discussionTopics.slice(0,toBeShown);
        }
    };
    const incrementReadCount = async() => {
        try {
            const response = await axios.post(`http://localhost:5000/api/book/read/${bookid}`,{},{withCredentials: true});
            console.log(response.data.message);
        } catch (error) {
            console.log('Error while incrementing read count, ',error);
        }
    }
    const addToFavourite = async() => {
        try {
            const response = await axios.post(`http://localhost:5000/api/book/addToFavourite/${bookid}`,{},{withCredentials: true});
            console.log(response.data.message);
        } catch (error) {
            console.log('Error while adding this to favourites, ',error);
        }
    }
  return (
    <DiscussionContextProvider value={{handleSetCreateDiscussion, handleDiscussionTopic, isTopicsLoading}}>
        {!loading && <div className={`px-3 py-3`}>
            <div className={`flex bg-slate-50 rounded-lg min-h-96 ${createDiscussion?'blur-[2px]':''}`}>
                <div className='flex gap-6 items-center justify-start m-6 h-80'>
                    {!bookInfo?.coverImage || !isImageLoaded ? (
                       <Skeleton
                         variant="rectangular"
                         width={240}
                         height="100%"
                         animation="wave"
                         sx={{
                           borderRadius: '1rem',
                           boxShadow: 2,
                           border: '1px solid #9ca3af'
                         }}
                       />
                     ) : null}
                    
                     {bookInfo?.coverImage && (
                       <img
                         src={bookInfo.coverImage}
                         onLoad={() => setIsImageLoaded(true)}
                         className={`h-full max-w-60 rounded-2xl object-cover border border-gray-500 shadow-md ${
                           isImageLoaded ? '' : 'hidden'
                         }`}
                         alt="Book Cover"
                       />
                     )}
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
                        <Link to={`/readbook/${bookid}`}>
                            <button onClick={incrementReadCount} 
                                className='bg-blue-500 shadow-lg cursor-pointer 
                                text-white font-serif px-3 py-4 rounded-md mt-2 
                                w-36 inline-flex gap-2 items-center justify-center'>Read Now 
                                <BookOpen width={20} height={20}/>
                            </button>
                        </Link>
                         <IconButton 
                            onClick={() => {setIsFavorite(prev => !prev); addToFavourite()}}
                            sx={{
                                  backgroundColor: isFavorite ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0,0,0,0.05)',
                                  borderRadius: '50%', // Makes it circular
                                  padding: '20px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: isFavorite ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0,0,0,0.1)',
                                  },
                                }}
                            >
                            {isFavorite ? (
                              <FavoriteIcon sx={{ color: 'red' }} />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className={`bg-slate-50 p-3 mt-3 rounded-lg relative ${createDiscussion?'blur-[2px]':''}`}>
                <div className='border-b border-gray-400 pb-2 flex justify-between items-center'>
                    <p className='text-lg tracking-wide font-semibold text-gray-700 mx-3'>Recent Discussions</p>
                    <button onClick={handleSetCreateDiscussion} className='text-blue-500 mx-3 font-medium cursor-pointer text-[14px]'>New Topic</button>
                </div>
                <div className='grid grid-cols-2 px-6 my-1.5 font-medium text-[12px] items-center border-b border-gray-400 pb-2'>
                    <p className=''>TITLE</p>
                    <div className='grid grid-cols-3 justify-items-center'>
                        <p>REPLIES</p>
                        <p>VIEWS</p>
                        <p>LATEST POST</p>
                    </div>
                </div>
                {!isTopicsLoading && displayTopics().map(discussion => (<div key={discussion._id} className={`grid grid-cols-2 px-6 mt-1.5 font-medium text-[12px] border-b border-gray-400 pb-2`}>
                    <div className='flex items-center gap-3'>
                        <Link to={`/book/${bookid}/discussion/${discussion._id}`}><img src={avatar} alt="profile-pic" className='rounded-full h-[24px] w-[24px] ring ring-offset-2 ring-gray-400'/></Link>
                        <div className='flex flex-col'>
                            <Link to={`/book/${bookid}/discussion/${discussion._id}`}><p className='text-[14px] text-blue-500 cursor-pointer'>{discussion?.title}</p></Link>
                            <p className='text-sm text-slate-500 font-medium'>by {discussion?.user}</p>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 justify-items-center items-center'>
                        <p>5</p>
                        <p>342</p>
                        <div className='flex gap-3 items-center'>
                            <Link><img src={minion} alt="avatar" className='rounded-full h-[24px] w-[24px] ring ring-offset-2 ring-gray-400 cursor-pointer'/></Link>
                            <div className='flex flex-col gap-1'>
                                <p>Minion</p>
                                <p className='text-gray-500'>Apr 24, 2025</p>
                            </div>
                        </div>
                    </div>
                </div>))}
                {topicsInfo.count >5 && !topicsInfo.showAll ? <div className={`flex justify-center items-center rounded-b-lg p-1 bg-slate-200/60`}><button onClick={() => setTopicsInfo(prev => ({...prev, showAll: true}))} className='cursor-pointer text-[14px] text-blue-600 font-medium tracking-wide'>View all</button></div>:''}
                {topicsInfo.count >5 && topicsInfo.showAll ? <div className={`flex justify-center items-center rounded-b-lg p-1 bg-slate-200/60`}><button onClick={() => setTopicsInfo(prev => ({...prev, showAll: false}))} className='cursor-pointer text-[14px] text-blue-600 font-medium tracking-wide'>Show less</button></div>:''}
            </div>
            {createDiscussion && <CreateDiscussionTopic/>}
            <div className={`bg-slate-50 p-3 mt-3 rounded-lg ${createDiscussion?'blur-[2px]':''}`}>
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
                            value={rating}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                              setRating(newValue);
                              saveRating(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover(newHover);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        {rating !== null && (
                            <Box sx={{ ml: 1, display:'flex', justifyContent:'center', textAlign:'center', textWrap:'nowrap', minWidth:100 }}>{label[hover !== -1 ? hover : rating]}</Box>
                        )}
                    </Box>
                </div>
                <div className='flex items-center gap-3 mx-3'>
                    <textarea type="text" value={userReview} onChange={handleReview} placeholder='Type your review...' className='border border-gray-400 p-3 overflow-y-auto resize-none leading-5 text-[16px] w-2xl outline-none' rows={2}/>
                    <button onClick={saveReview} className='bg-slate-400 shadow-lg p-2 rounded-lg cursor-pointer'><SendHorizonal width={20} height={20} color='white'/></button>
                </div>
                <p className='text-xl font-semibold tracking-wide mx-3 my-6 border-b border-gray-400 pb-3'>Reviews ({commentInfo?.totalComments})</p>
                <div className='mx-3'>
                    {!commentsLoading && comments.map((comment,ind) =>(<Comment key={comment._id} comment={comment} ind={ind} />))}
                </div>
                <div className='mx-3 w-full flex justify-center items-center font-medium text-white'><button className='bg-blue-400 shadow-md py-1 px-3 cursor-pointer rounded-md'>Load More</button></div>
            </div>
        </div>}
    </DiscussionContextProvider>
  )
}

export default BookInfo