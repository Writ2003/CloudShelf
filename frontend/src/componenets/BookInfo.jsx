import axios, { AxiosHeaders } from 'axios';
import { useEffect, useState, useRef, createContext } from 'react'
import { useParams } from 'react-router-dom'
import {BookHeart, BookOpen, SendHorizonal} from 'lucide-react'
import { Stack, Rating, Box} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import minion from '/src/assets/minion.png?url';
import avatar from '/src/assets/avatar.jpg?url';
import ExpandableInlineText from './ui/ExpandableInlineText';
import CreateDiscussionTopic from './ui/CreateDiscussionTopic';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const DiscussionContext = createContext();
export const DiscussionContextProvider = DiscussionContext.Provider;

const label = {1:'Very Poor',2:'Poor',3:'Average',4:'Good',5:'Excellent'}
function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${label[value]}`;
}

const colors = [
    'ring-amber-400 from-amber-500 to-amber-400',
    'ring-purple-400 from-purple-500 to-purple-400',
    'ring-cyan-400 from-cyan-500 to-cyan-400',
    'ring-teal-400 from-teal-500 to-teal-400',
    'ring-lime-400 from-lime-500 to-lime-400',
    'ring-red-400 from-red-500 to-red-400'
];

const likeButtonColors = [
    'text-amber-400 from-amber-500 to-amber-400',
    'text-purple-400 from-purple-500 to-purple-400',
    'text-cyan-400 from-cyan-500 to-cyan-400',
    'text-teal-400 from-teal-500 to-teal-400',
    'text-lime-400 from-lime-500 to-lime-400',
    'text-red-400 from-red-500 to-red-400'
]

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
    const [commentInfo, setCommentInfo] = useState({page: 0, totalPages: 0, totalComments: 0});
    const [commentReply, setCommentReply] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);

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
               const response = await axios.get(`http://localhost:5000/api/review/allReviews/${bookid}?page=${commentInfo.page+1}&limit=${15}`,{withCredentials: true});
               console.log('Comments: ',response.data.reviews);
               if(response.data?.reviews) setComments(response.data.reviews);
               setCommentInfo({page: response.data.currentPage, totalComments: response.data.totalReviews, totalPages: response.data.totalPages});
            } catch (error) {
                console.error('Error while fetching comments, error: ',error);
            } finally {
                setCommentsLoading(false);
            }
        }
        fetchBookInfo();
        fetchUserReviewInfo();
        fetchComments();
    },[bookid])
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
    const handleLike = async(commentId) => {
        console.log("Liked comment:", commentId);
        // Optionally send to backend or update local state
        try {
          const response = await axios.patch(`http://localhost:5000/api/like/toggleLike/${commentId}`,{}, {withCredentials: true});
          console.log(response.data);
          const updatedComment = response.data.likedComment;
          const user = response.data.userId; 
          const likedBy = updatedComment.likedBy || [];
          const isLiked = likedBy.includes(user);
          const noOfLikes = response.data.noOfLikes;
          setComments(prevComments =>
            prevComments.map(comment =>
              comment._id === commentId
                ? {
                    ...comment,
                    isLiked,
                    likeCount: noOfLikes
                  }
                : comment
              )
          )
        } catch (error) {
          console.error('Error in handle like, error: ',error);
        }
    };

    const handleReply = (commentId) => {
        console.log("Replying to:", commentId);
        setActiveReplyId(prev => (prev === commentId ? null : commentId)); // toggle
        setCommentReply(''); // reset reply input
    };
    const handleReplySubmit = async(e) => {
        e.preventDefault();
        console.log(`Replying to ${activeReplyId}:`, commentReply);
        try {
            const response = await axios.post(`http://localhost:5000/api/reply/addReply/${activeReplyId}`,{text: commentReply},{withCredentials: true});
            console.log(response.data);
            const { noOfReplies } = response.data;
            setComments(prevComments => prevComments.map(comment => {
                if(comment._id === activeReplyId) {
                    return {
                        ...comment,
                        noOfReplies
                    }
                }
            }))
        } catch (error) {
            console.error('Error while handling reply to a comment, error: ',error);
        } finally {
            setCommentReply('');
            setActiveReplyId(null);
        }
    };
  return (
    <DiscussionContextProvider value={{handleSetCreateDiscussion}}>
        {!loading && <div className={`px-3 py-3`}>
            <div className={`flex bg-slate-50 rounded-lg min-h-96 ${createDiscussion?'blur-[2px]':''}`}>
                <div className='flex gap-6 items-center justify-start m-6 h-80'>
                    <img src={bookInfo?.coverImage} className='h-full max-w-60 rounded-2xl object-cover border border-gray-500 shadow-md'/>
                </div>
                <div className='col-span-2 my-6 mx-3 flex flex-col gap-1.5 tracking-wide'>
                    <p className='text-2xl font-semibold font-serif pt-3'>{!loading && capitalizeWords(bookInfo?.title)}</p>
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
                <div className={`grid grid-cols-2 px-6 mt-1.5 font-medium text-[12px] border-b border-gray-400 pb-2`}>
                    <div className='flex items-center gap-3'>
                        <Link><img src={avatar} alt="profile-pic" className='rounded-full h-[24px] w-[24px] ring ring-offset-2 ring-gray-400'/></Link>
                        <Link><p className='text-[14px] text-blue-500 cursor-pointer'>Ending Spoiler alert, discussion on the movie</p></Link>
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
                </div>
                <div className={`flex justify-center items-center rounded-b-lg p-1 bg-slate-200/60`}><button className='cursor-pointer text-[14px] text-blue-600 font-medium tracking-wide'>View all</button></div>
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
                <p className='text-xl font-semibold tracking-wide mx-3 my-6 border-b border-gray-400 pb-3'>User Reviews</p>
                <div className='mx-3'>
                    {!commentsLoading && comments.map( (comment,ind) =>(<div key={comment._id} className='relative w-full my-3 bg-slate-200 rounded-xl p-3'>
                        <div className='flex items-center gap-3'>
                            <img src={minion} alt="minion.png" height={26} width={26} className={`rounded-full ring ${colors[ind%6].split(' ')[0]} ring-offset-2`}/>
                            <p className={`text-[12px] tracking-wide font-medium shadow-md bg-gradient-to-br ${colors[ind%6].split(' ')[1]} ${colors[ind%6].split(' ')[2]} p-1 rounded-lg text-white`}>{comment?.user}</p>
                            <span className={`text-sm text-slate-500`}>{comment?.createdAt?.slice(0,comment?.createdAt?.length-3)}</span>
                        </div>
                        <div className="my-1.5">
                            <ExpandableInlineText key={2} text={comment?.text}/>
                        </div>
                        <div className='flex gap-6 mt-1 text-sm text-gray-500 items-center'>
                            {comment?.noOfReplies > 0 && <button className={`flex items-center gap-1 text-blue-500 cursor-pointer text-sm font-medium`}>
                                <ArrowDropDownIcon fontSize='small'/>
                                {comment?.noOfReplies} {comment?.noOfReplies > 1? 'Replies': 'Reply'}
                            </button>}
                            <button
                              className={`flex items-center gap-1 font-medium transition cursor-pointer ${
                                comment?.isLiked ? `${likeButtonColors[ind%6].split(' ')[0]}` :`hover:text-blue-600`
                              }`}
                              onClick={() => handleLike(comment._id)}
                            >
                              {comment?.isLiked ? (
                                <ThumbUpAltIcon fontSize='small' />
                              ) : (
                                <ThumbUpAltOutlinedIcon fontSize='small' />
                              )}
                              <span>{comment?.likeCount}</span>
                            </button>
                            
                            <button
                              className='hover:text-blue-600 cursor-pointer font-medium flex items-center gap-1 transition'
                              onClick={() => handleReply(comment._id)}
                            >
                              <ReplyOutlinedIcon fontSize='small' />
                              Reply
                            </button>
                        </div>
                        {activeReplyId === comment._id && (
                            <form onSubmit={handleReplySubmit} className='absolute -bottom-10 grid grid-cols-6 items-center'>
                                <input value={commentReply} onChange={(e) => setCommentReply(e.target.value)}
                                    className={`outline-none border bg-slate-100 h-9 border-slate-200 rounded-xl rounded-r-none w-xl px-2 py-1 col-span-5`}
                                    placeholder='Write a reply...'
                                />
                                <button className='w-9 h-9 flex justify-center items-center bg-slate-400 cursor-pointer shadow-lg rounded-l-none rounded-lg'
                                    type='submit'
                                >
                                    <SendHorizonal className='text-white'/>
                                </button>
                            </form>
                        )}
                    </div>))}
                </div>
                <div className='mx-3 w-full flex justify-center items-center font-medium text-white'><button className='bg-blue-400 shadow-md py-1 px-3 cursor-pointer rounded-md'>Load More</button></div>
            </div>
        </div>}
    </DiscussionContextProvider>
  )
}

export default BookInfo