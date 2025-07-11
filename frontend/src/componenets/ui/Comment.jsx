import React, { useState } from 'react'
import axios from 'axios';
import ExpandableInlineText from './ExpandableInlineText';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import minion from '/src/assets/minion.png?url';
import { SendHorizonal } from 'lucide-react'
import Reply from './Reply';

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

const Comment = ({comment, ind}) => {
    const [commentReply, setCommentReply] = useState('');
    const [currentComment, setCurrentComment] = useState({...comment});
    const [isShowRepliesClicked, setIsShowRepliesClicked] = useState(false);
    const [isReplyClicked, setIsReplyClicked] = useState(false);
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
            const response = await axios.post(`http://localhost:5000/api/reply/addReply/${currentComment._id}`,{text: commentReply},{withCredentials: true});
            console.log(response.data);
            const { noOfReplies } = response.data;
            setCurrentComment(prevComment => ({...prevComment, noOfReplies}));
        } catch (error) {
            console.error('Error while handling reply to a comment, error: ',error);
        } finally {
            setCommentReply('');
            setIsReplyClicked(false);
        }
    };
  return (
    <div key={currentComment._id} className='relative w-full my-3 bg-slate-200/50 rounded-xl p-3'>
        <div className='flex items-center gap-3'>
            <img src={minion} alt="minion.png" height={26} width={26} className={`rounded-full ring ${colors[ind%6].split(' ')[0]} ring-offset-2`}/>
            <p className={`text-[12px] tracking-wide font-medium shadow-md bg-gradient-to-br ${colors[ind%6].split(' ')[1]} ${colors[ind%6].split(' ')[2]} p-1 rounded-lg text-white`}>{currentComment?.user}</p>
            <span className={`text-sm text-slate-500`}>{currentComment?.createdAt?.slice(0,currentComment?.createdAt?.length-3)}</span>
        </div>
        <div className="my-1.5">
            <ExpandableInlineText key={2} text={currentComment?.text}/>
        </div>
        <div className='flex gap-6 mt-1 text-sm text-gray-500 items-center'>
            {currentComment?.noOfReplies > 0 && <button className={`flex items-center gap-1 text-blue-500 cursor-pointer text-sm font-medium px-2 py-1 rounded-xl transition duration-200 active:bg-blue-100`}
                onClick={(e) => setIsShowRepliesClicked(prev => !prev)}
            >   
                {!isShowRepliesClicked? <ArrowDropDownIcon fontSize='small'/> : <ArrowDropUp fontSize='small'/>}
                {!isShowRepliesClicked ? `${currentComment?.noOfReplies} ${currentComment?.noOfReplies > 1? 'Replies': 'Reply'}`: `Show less`}
            </button>}
            <button
              className={`flex items-center gap-1 font-medium  transition duration-200 cursor-pointer ${
                currentComment?.isLiked ? `${likeButtonColors[ind%6].split(' ')[0]}` :`hover:text-blue-600`
              }`}
              onClick={() => handleLike(currentComment._id)}
            >
              {currentComment?.isLiked ? (
                <ThumbUpAltIcon fontSize='small' />
              ) : (
                <ThumbUpAltOutlinedIcon fontSize='small' />
              )}
              <span>{currentComment?.likeCount}</span>
            </button>
            <button
              className='hover:text-blue-600 cursor-pointer font-medium flex items-center gap-1 transition'
              onClick={() => setIsReplyClicked(prev => !prev)}
            >
              <ReplyOutlinedIcon fontSize='small' />
              Reply
            </button>
        </div>
        {isShowRepliesClicked && <Reply commentId={currentComment._id}/>}
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