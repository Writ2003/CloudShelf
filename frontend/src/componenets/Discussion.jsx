import React, { useState, useRef } from 'react'
import Pagination from './ui/Pagination';
import PostCard from './ui/PostCard'
import QuickReplyBox from './ui/QuickReplyBox'
import minion from '/src/assets/minion.png?url';
import { discussionSocket } from '../socket'
import { useParams } from 'react-router-dom'

const Discussion = ({ user, bookId }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { discussionId } = useParams();

  // ✅ Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (newHTMLContent) => {
  // Save to backend
    const newMessage = {
      topicId: discussionId,
      bookId,
      userId: user._id,
      text: newHTMLContent, // Assuming QuickReplyBox gives HTML or text
    };

    discussionSocket.emit("send_message", newMessage);

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
    console.log('Submit:', newHTMLContent);
  };

  useEffect(() => {
    // ✅ Join discussion room
    discussionSocket.emit("join_topic", { topicId: discussionId, userId: user._id, username: user.name });

    // ✅ Listen for incoming messages
    discussionSocket.on("discussion_receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    return () => {
      discussionSocket.emit("leave_topic", { topicId: discussionId, userId: user._id, username: user.name });
      discussionSocket.off();
    };
  }, [discussionId, bookId, user._id]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 my-3 rounded-lg shadow-xl">
      {messages && messages.map((message) => (
        <PostCard key={message._id} post={message} />
      ))}
      <Pagination />
      <div className='flex gap-3'>
        <img src={minion} height={36} width={36} className='mb-auto mt-10 rounded-full ml-3 ring ring-amber-500 ring-offset-2'/>
        <div className='flex-1'>
          <QuickReplyBox onSubmit={handleSubmit} />
        </div>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  )
}

export default Discussion