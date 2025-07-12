import React from 'react';
import { AlignJustify, Bookmark, BookOpen, Download, Heart, LogOut, Mail } from 'lucide-react';
import CloudShelfLogo from '/src/assets/CloudShelf_logo_small.png?url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async() => {
    try {
      await axios.post('http://localhost:5000/api/user/logout',{},{withCredentials:true});
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/login",{replace:true})
      },1000);
    } catch (error) {
      console.error("Error while logging out, error: ",error);
    }
  }
  return (
    <div className="hidden md:block w-56 sticky bottom-0 top-0 2xl:w-64 bg-white shadow-xl h-screen p-1.5 2xl:p-4 rounded-l-xl">
      <div className="text-lg 2xl:text-2xl font-bold mb-10 flex gap-1 items-center">
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
        <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:font-bold cursor-pointer">
          <LogOut width={20} height={20}/>
          <span>Logout</span>
        </button>
      </div>
      <ToastContainer position='top-center'/>
    </div>
  );
};

export default Sidebar;