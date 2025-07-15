import minion from '/src/assets/minion.png?url';
import { Quote, User } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-start gap-4 mb-2">
        <img src={minion} className="w-10 h-10 rounded-full" alt="" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold">{post.username}</h4>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 mt-2 justify-end">
        <button className='flex items-center gap-1 cursor-pointer'><Quote size={16}/> Quote</button>
        <button className='flex items-center gap-1 cursor-pointer'><User size={16}/> Profile</button>
      </div>
    </div>
  );
};

export default PostCard;