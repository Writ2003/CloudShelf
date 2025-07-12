import React, { useState } from 'react'
import axios from 'axios';
import ExpandableInlineText from './ExpandableInlineText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import minion from '/src/assets/minion.png?url';
import { SendHorizonal } from 'lucide-react'
import Reply from './Reply';
import { PulseLoader } from 'react-spinners'

const colors = [
    'ring-amber-400 from-amber-500 to-amber-400',
    'ring-purple-400 from-purple-500 to-purple-400',
    'ring-cyan-400 from-cyan-500 to-cyan-400',
    'ring-teal-400 from-teal-500 to-teal-400',
    'ring-lime-400 from-lime-500 to-lime-400',
    'ring-red-400 from-red-500 to-red-400'
];


const Comment = ({comment, ind}) => {
    const [commentReply, setCommentReply] = useState('');
    const [currentComment, setCurrentComment] = useState({...comment});
    const [replies, setReplies] = useState([]);
    const [replyInfo, setReplyInfo] = useState({currentPage: 1, totalReplies: 0, totalPages: -1, limit:5});
    const [isRepliesLoading, setIsRepliesLoading] = useState(false);
    const [isShowRepliesClicked, setIsShowRepliesClicked] = useState(false);
    const [isReplyClicked, setIsReplyClicked] = useState(false);
    const [replyToUser, setReplyToUser] = useState(null);

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
        setCurrentComment(prevComment => ({...prevComment, isLiked, likeCount:noOfLikes }));
      } catch (error) {
        console.error('Error in handle like, error: ',error);
      }
    };
    
    const handleReplySubmit = async(e) => {
      e.preventDefault();
      console.log(`Replying to ${currentComment._id}:`, commentReply);
      if(commentReply.trim()==='') return;

      try {
        const response = await axios.post(`http://localhost:5000/api/reply/addReply/${ currentComment._id}`,{text: commentReply},{withCredentials: true});
        console.log(response.data);
        const { noOfReplies } = response.data;
        setCurrentComment(prevComment => ({...prevComment, noOfReplies}));
      } catch (error) {
        console.error('Error while handling reply to a comment, error: ',error);
      } finally {
        setCommentReply('');
        setIsReplyClicked(false);
        setReplyToUser(null);
        setActiveReplyId(null);
      }
    };

    const fetchReplies = async(e) => {
      e.preventDefault();
      setIsRepliesLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/reply/fetchReplies/${currentComment._id}?page=${replyInfo.currentPage}&limit=${replyInfo.limit}`,{withCredentials: true});
        console.log('Reply: ',response.data.replies);
        const {currentPage, totalPages, totalReplies, replies} = response.data;
        setReplies(replies);
        setReplyInfo({currentPage: currentPage, totalPages, totalReplies});
      } catch (error) {
        console.error(`Error while fetching replies for ${currentComment._id}, error: `,error?.response?.data?.message || error)
      } finally {
        setIsRepliesLoading(false);
      }
    };

    const handleReplyClick = (user) => {
      setReplyToUser(user);
      setIsReplyClicked(true);   // triggers showing the reply input
      setCommentReply(`@${user} `);
    };


  return (
    <div className='relative w-full my-3 bg-slate-200/50 rounded-xl p-3'>
        <div className='flex items-center gap-3'>
            <img src={minion} alt="minion.png" height={26} width={26} className={`rounded-full ring ${colors[ind%6].split(' ')[0]} ring-offset-2`}/>
            <p className={`text-[12px] tracking-wide font-medium shadow-md bg-gradient-to-br ${colors[ind%6].split(' ')[1]} ${colors[ind%6].split(' ')[2]} p-1 rounded-lg text-white`}>{currentComment?.user}</p>
            <span className={`text-sm text-slate-500`}>{currentComment?.createdAt?.slice(0,currentComment?.createdAt?.length-3)}</span>
        </div>
        <div className="my-1.5 ml-10">
            <ExpandableInlineText key={2} text={currentComment?.text}/>
        </div>
        <div className='flex gap-4 ml-7 mt-1 text-sm text-gray-500 items-center'>
          {currentComment?.noOfReplies > 0 && <button className={`flex items-center gap-1 text-blue-500 cursor-pointer text-sm font-medium px-2 py-1 rounded-xl transition duration-200 active:bg-blue-100`}
              onClick={(e) => {setIsShowRepliesClicked(prev => !prev); fetchReplies(e)}}
          >   
              {!isShowRepliesClicked? <ArrowDropDownIcon fontSize='small'/> : <ArrowDropUp fontSize='small'/>}
              {!isShowRepliesClicked ? `${currentComment?.noOfReplies} ${currentComment?.noOfReplies > 1? 'Replies': 'Reply'}`: `Show less`}
          </button>}
          <button
            className={`flex items-center gap-1 font-medium  transition duration-200 cursor-pointer ${
              currentComment?.isLiked ? `text-red-500` :`hover:text-red-500`
            }`}
            onClick={() => handleLike(currentComment._id)}
          >
            {currentComment?.isLiked ? (
              <FavoriteIcon fontSize='small' className="align-middle"/>
            ) : (
              <FavoriteBorderIcon fontSize='small' className="align-middle"/>
            )}
            <span>{currentComment?.likeCount}</span>
          </button>
          <button
            className='hover:text-blue-600 cursor-pointer font-medium flex items-center gap-1 transition'
            onClick={() => setIsReplyClicked(prev => !prev)}
          >
            <ChatBubbleOutlineIcon fontSize='small' className="align-middle"/>
            <span className="relative -top-[1px]">Reply</span>
          </button>
        </div>
        {isShowRepliesClicked && 
          <div className='border-l-2 px-3 mt-3 mx-11 border-slate-300 text-sm'>
            {isRepliesLoading? <PulseLoader color="#3b82f6" size={8}/> : replies.map((reply, ind) => (<Reply key={reply._id} reply={reply} ind={ind} onReplyClick={handleReplyClick}/>))}
          </div>
        }
        {isReplyClicked && (
          <form onSubmit={handleReplySubmit} className='absolute -bottom-10 grid grid-cols-6 items-center'>
            <input value={commentReply} onChange={(e) => setCommentReply(e.target.value)}
              className={`outline-none border bg-slate-100 h-9 border-slate-200 rounded-xl rounded-r-none w-xl px-2 py-1 col-span-5`}
              placeholder='Write a reply...'
            />
            <button className='w-9 h-9 flex justify-center items-center bg-slate-500 cursor-pointer shadow-lg rounded-l-none rounded-3xl transition active:bg-slate-400 duration-200'
              type='submit'
            >
              <SendHorizonal className='text-white'/>
            </button>
          </form>
        )}
    </div>
  )
}

export default Comment