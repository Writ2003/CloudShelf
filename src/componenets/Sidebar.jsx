import React from 'react';
import { AlignJustify, Bookmark, BookOpen, Download, Heart, LogOut, Mail } from 'lucide-react';
import CloudShelfLogo from '/src/assets/CloudShelf_logo_small.png?url';


const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-xl h-full p-4 rounded-l-xl">
      <div className="text-2xl font-bold mb-10 flex gap-1 items-center">
        <img src={CloudShelfLogo} height={60} width={60}/>
        <span className='font-extrabold'>Cloud</span>Shelf
      </div>
      <div className="flex flex-col gap-6 px-5">
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <BookOpen height={20} width={20} />
          <span>Discover</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <AlignJustify height={20} width={20}/>
          <span>Category</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <Bookmark height={20} width={20}/>
          <span>My Library</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <Download height={20} width={20}/>
          <span>Downloads</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <Heart height={20} width={20}/>
          <span>Favourite</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <Mail width={20} height={20}/>
          <span>Support</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <LogOut width={20} height={20}/>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;