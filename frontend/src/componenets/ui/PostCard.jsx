import minion from '/src/assets/minion.png?url';
import { Quote, User } from 'lucide-react';

const colors = [
  'ring-amber-400 from-amber-500 to-amber-400',
  'ring-purple-400 from-purple-500 to-purple-400',
  'ring-cyan-400 from-cyan-500 to-cyan-400',
  'ring-teal-400 from-teal-500 to-teal-400',
  'ring-lime-400 from-lime-500 to-lime-400',
  'ring-red-400 from-red-500 to-red-400'
];

const PostCard = ({ post, ind}) => {
  console.log('Post: ',post);
  return (
    <div className={`bg-white ring ${colors[ind%6].split(' ')[0]} rounded-lg p-4 shadow-sm mb-6`}>
      <div className="flex items-start gap-4 mb-2">
        <img src={minion} className={`w-10 h-10 rounded-full ring ${colors[ind%6].split(' ')[0]} ring-offset-2`} alt="" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className={`text-[12px] tracking-wide font-medium shadow-md bg-gradient-to-br ${colors[ind%6].split(' ')[1]} ${colors[ind%6].split(' ')[2]} text-white p-1 rounded-lg`}>{post.user}</h4>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={{ __html: post.text }}
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