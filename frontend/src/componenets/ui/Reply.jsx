import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Reply = ({commentId}) => {
    const [replies, setReplies] = useState([]);
    useEffect(() => {
        const fetchReplies = async() => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reply/fetchReplies/${commentId}`);
    
            } catch (error) {
                console.error('Error while fetching reply, error: ',error?.response?.data?.message || error);
            }
        }
        fetchReplies();
    })
  return (
    <div className='border-l-2 p-3 mx-4 border-slate-300 text-sm'>Reply</div>
  )
}

export default Reply