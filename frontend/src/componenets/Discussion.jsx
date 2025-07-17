import React, { useState, useRef, useEffect } from 'react'
import Pagination from './ui/Pagination';
import PostCard from './ui/PostCard'
import QuickReplyBox from './ui/QuickReplyBox'
import minion from '/src/assets/minion.png?url';
import { discussionSocket } from '../socket'
import { useParams } from 'react-router-dom'
import axios from 'axios';

const Discussion = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { discussionId, bookId } = useParams();
  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({currentPage: 1, totalPages: 1, totalMessages: 0});

  // ✅ Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (newHTMLContent) => {
  // Save to backend
    const newMessage = {
      topicId: discussionId,
      userId: user._id,
      message: newHTMLContent, // Assuming QuickReplyBox gives HTML or text
      timestamp: Date.now(),
      username: user.username
    };

    discussionSocket.emit("discussion_send_message", newMessage);

    //setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
    console.log('Submit:', newHTMLContent);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndJoin = async () => {
      setUserLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/protectedRoute/auth/verify",
          { withCredentials: true }
        );

        if (!isMounted) return;

        const fetchedUser = response.data.populatedUser;
        setUser(fetchedUser);

        // ✅ Now join topic after user is set
        discussionSocket.emit("join_topic", {
          topicId: discussionId,
          userId: fetchedUser._id,
          username: fetchedUser.username,
        });

        // ✅ Listen for incoming messages
        discussionSocket.on("discussion_receive_message", (data) => {
          setMessages((prev) => [...prev, data]);
          scrollToBottom();
        });
      } catch (error) {
        console.error(
          "Error while fetching user info in discussion page, error: ",
          error?.response?.data?.message || error.message
        );
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserAndJoin();

    const fetchMessages = async() => {
      setMessagesLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/discussionMessages/get/${discussionId}`,{withCredentials: true});
        setMessages(response.data.messages);
        const totalPages = ceil(response.data.messages.length/5);
        setPageInfo({currentPage: totalPages, totalPages, totalMessages:response.data.totalMessages})
      } catch (error) {
        console.log('Error while fetching messages, error: ',error?.response?.data?.message || error.message)
      } finally {
        setMessagesLoading(false);
      }
    }

    fetchMessages();

    return () => {
      isMounted = false;

      if (user?._id) {
        discussionSocket.emit("leave_topic", {
          topicId: discussionId,
          userId: user._id,
          username: user.username,
        });
      }

      discussionSocket.off();
    };
  }, [discussionId, bookId]);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 my-3 rounded-lg shadow-xl">
      {!messagesLoading && messages && messages.slice((pageInfo.currentPage-1)*5,pageInfo.currentPage*5).map((message) => (
        <PostCard key={message._id || message.timestamp} post={message}/>
      ))}
      <Pagination currentPage={pageInfo.currentPage} totalPages={pageInfo.totalPages} onPageChange={onPageChange}/>
      <div className='flex gap-3'>
        <img src={minion} height={36} width={36} className='mb-auto mt-10 rounded-full ml-3 ring ring-amber-500 ring-offset-2'/>
        <div className='flex-1'>
          {!messagesLoading && <QuickReplyBox onSubmit={handleSubmit} />}
        </div>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  )
}

export default Discussion