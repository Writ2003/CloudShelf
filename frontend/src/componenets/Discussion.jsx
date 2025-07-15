import React, { useState } from 'react'
import Pagination from './ui/Pagination';
import PostCard from './ui/PostCard'
import QuickReplyBox from './ui/QuickReplyBox'
import minion from '/src/assets/minion.png?url';

const Discussion = () => {
    const [posts, setPosts] = useState([
      {
        id: '1',
        user: {
          name: 'Alice',
          avatar: 'https://i.pravatar.cc/40?img=1',
        },
        content: `Loved this chapter! The character growth is insane 😍<br>Also, check this out: <a href="https://mydramanovel.com/chapter-1">Chapter 1</a>`,
        createdAt: '2025-07-13T14:20:00Z',
      },
      {
        id: '2',
        user: {
          name: 'Bob',
          avatar: 'https://i.pravatar.cc/40?img=2',
        },
        content: `Haha the plot twist at the end had me SHOCKED 😂<br><strong>Spoiler alert</strong>: He’s not really dead!`,
        createdAt: '2025-07-13T16:45:00Z',
      },
      {
        id: '3',
        user: {
          name: 'Clara',
          avatar: 'https://i.pravatar.cc/40?img=3' ,
        },
        content: `This series really makes you think...<br><em>"What if we could rewrite our past?"</em>`,
        createdAt: '2025-07-14T09:10:00Z',
      },
      {
        id: '4',
        user: {
          name: 'David',
          avatar: 'https://i.pravatar.cc/40?img=4',
        },
        content: `Can someone explain the ending of Episode 6? I'm so confused 😭`,
        createdAt: '2025-07-14T10:05:00Z',
      },
      {
        id: '5',
        user: {
          name: 'Ella',
          avatar: 'https://i.pravatar.cc/40?img=5',
        },
        content: `Replying to <strong>@Bob</strong> — Yeah, I had to rewatch that twice!`,
        createdAt: '2025-07-14T11:22:00Z',
      },
    ]); // fetched posts

    const handleSubmit = (newHTMLContent) => {
    // Save to backend
      console.log('Submit:', newHTMLContent);
    };
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 my-3 rounded-lg shadow-xl">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <Pagination />
      <div className='flex gap-3'>
        <img src={minion} height={36} width={36} className='mb-auto mt-10 rounded-full ml-3 ring ring-amber-500 ring-offset-2'/>
        <div className='flex-1'>
          <QuickReplyBox onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Discussion