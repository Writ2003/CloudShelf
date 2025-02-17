import { Bell } from "lucide-react";
import avatar from '/src/assets/avatar.jpg?url';
const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4">

      {/* Search Bar */}
      <div className="flex flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder={`Search your favourite books`}
          className="w-full p-2 bg-gray-100 placeholder:text-gray-500 font-normal rounded-lg outline-none text-sm"
        />
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <img
          src={avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Header;
