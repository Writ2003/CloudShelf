import { Bell } from "lucide-react";
import avatar from '/src/assets/avatar.jpg?url';
import { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import debounce from 'lodash/debounce';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  const fetchSuggestions = async (q) => {
    if (q.trim() === '') {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/search/searchBooks?searchQuery=${q}`);
      console.log('Suggestions: ',res);
      setSuggestions(res.data.data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    debouncedFetch(searchQuery);

    // Cancel debounce on unmount
    return () => debouncedFetch.cancel();
  }, [searchQuery, debouncedFetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4">

      {/* Search Bar */}
      <div ref={wrapperRef} className="flex flex-1 max-w-md mx-6 relative">
        <input
          type="text"
          placeholder={`Search your favourite books`}
          className="w-full p-2 bg-gray-100 placeholder:text-gray-500 font-normal rounded-lg outline-none text-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
          if (searchQuery.length > 0) setShowResults(true);
        }}
        />
        {searchQuery.length > 0 && showResults && <ul className="absolute border border-gray-400 top-10 bg-gray-100 w-full max-h-44 rounded-md px-2 overflow-auto no-scrollbar">
          {suggestions.length > 0 ? (suggestions.map((book,ind) => (
            <Link to={`/bookinfo/${book._id}`}>
              <li key={book._id} 
                className={`my-2 text-gray-700 font-serif pb-1 flex gap-2 text-sm tracking-wide ${ind===suggestions.length-1?'':'border-b'} cursor-pointer border-gray-400`}
                onClick={() => {
                  setSearchQuery(book?.title);
                  setShowResults(false);
                }}
              >
                <img
                  src={book?.coverImage}
                  height={28}
                  width={28}
                />
                <div className="flex flex-col gap-1">
                  <div className="truncate max-w-92">
                    <Highlighter
                      highlightClassName="bg-yellow-300 font-semibold"
                      searchWords={[searchQuery]}
                      autoEscape={true}
                      textToHighlight={`${book.title} by ${book.author}`}
                    />
                  </div>
                  <div className="truncate max-w-full">
                    <Highlighter
                      highlightClassName="bg-yellow-300 font-semibold"
                      searchWords={[searchQuery]}
                      autoEscape={true}
                      textToHighlight={`Published by ${book.publisher}`}
                    />
                  </div>
                </div>
              </li>
            </Link>
          ))): (
            <li className="px-4 py-2 text-gray-400">No results</li>)
          }
        </ul>}
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
