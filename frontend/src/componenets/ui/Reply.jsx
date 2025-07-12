import React, { useEffect, useState } from 'react'
import axios from 'axios';
import minion from '/src/assets/minion.png?url';
import ExpandableInlineText from './ExpandableInlineText';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { SendHorizonal } from 'lucide-react';

const colors = [
    'ring-amber-400 from-amber-500 to-amber-400',
    'ring-purple-400 from-purple-500 to-purple-400',
    'ring-cyan-400 from-cyan-500 to-cyan-400',
    'ring-teal-400 from-teal-500 to-teal-400',
    'ring-lime-400 from-lime-500 to-lime-400',
    'ring-red-400 from-red-500 to-red-400'
];


const Reply = ({reply, ind, onReplyClick}) => {
    const [currentReply, setCurrentReply] = useState({...reply});

    const handleLike = async() => {
      console.log("Liked Reply:", currentReply._id);
      // Optionally send to backend or update local state
      try {
        const response = await axios.patch(`http://localhost:5000/api/like/toggleLike/${currentReply._id}`,{}, {withCredentials: true});
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

  return (
    <div className='mb-3 w-full'>
      <div className='flex items-center gap-3'>
          <img src={minion} alt="minion.png" height={26} width={26} className={`rounded-full ring ${colors[ind%6].split(' ')[0]} ring-offset-2`}/>
          <p className={`text-[12px] tracking-wide font-medium shadow-md bg-gradient-to-br ${colors[ind%6].split(' ')[1]} ${colors[ind%6].split(' ')[2]} p-1 rounded-lg text-white`}>{currentReply?.user?.email || currentReply?.user?.name}</p>
          <span className={`text-sm text-slate-500`}>{currentReply?.createdAt?.slice(0,currentReply?.createdAt?.length-3)}</span>
      </div>
      <div className='my-1.5 ml-10'>
          <ExpandableInlineText key={2} text={reply?.text}/>
      </div>
      <div className='flex gap-6 mt-2.5 ml-10 text-slate-500'>
        <button
          className={`flex items-center gap-1 font-medium  transition duration-200 cursor-pointer ${
            currentReply?.isLiked ? `text-red-500` :`hover:text-red-500`
          }`}
          onClick={() => handleLike()}
        >
          {currentReply?.isLiked ? (
            <FavoriteIcon fontSize='small' className="align-middle"/>
            ) : (
            <FavoriteBorderIcon fontSize='small' className="align-middle"/>
          )}
          <span>{currentReply?.likeCount || 0}</span>
        </button>
        <button
          className='hover:text-blue-600 cursor-pointer font-medium flex items-center gap-1 transition'
          onClick={() => onReplyClick(currentReply?.user?.email || currentReply?.user?.name)}
        >
          <ChatBubbleOutlineIcon fontSize='small' className="align-middle"/>
          <span className="relative -top-[1px]">Reply</span>
        </button>
      </div>
    </div>
  )
}

export default Reply