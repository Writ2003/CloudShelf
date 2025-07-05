import React, { useEffect, useState, useRef } from 'react'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Tooltip, IconButton } from '@mui/material';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import VoiceOverOffRoundedIcon from '@mui/icons-material/VoiceOverOffRounded';
import TintSelector from './ui/TintSelector'
import { useParams } from 'react-router-dom'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import axios from 'axios';

const tintClasses = {
  default: "bg-white text-black",
  sepia: "bg-[#f4ecd8] text-[#5b4636]",
  night: "bg-[#121212] text-white",
};

const fontSizeLabels = {
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px'
};

const fontSizes = ['sm', 'base', 'lg', 'xl'];

const ReadBook = () => {
    const [isMarked, setIsMarked] = useState(false);
    const [markedPage, setMarkedPage] = useState(0);
    const [isCoupleModeActive, setIsCoupleModeActive] = useState(false);
    const [isTextToSpeechActive, setIsTextToSpeechActive] = useState(false);
    const [tint, setTint] = useState("default");
    const { bookid } = useParams();
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayHTML, setDisplayHTML] = useState('');
    const [textSize, setTextSize] = useState('base');
    const audioRef = useRef(null); 

    const increaseTextSize = () => {
      const index = fontSizes.indexOf(textSize);
      if (index < fontSizes.length - 1) {
        setTextSize(fontSizes[index + 1]);
      }
    };
    const decreaseTextSize = () => {
      const index = fontSizes.indexOf(textSize);
      if (index > 0) {
        setTextSize(fontSizes[index - 1]);
      }
    };
    const applyHighlight = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        if (!selectedText.trim()) return;

        try {
            const span = document.createElement('span');
            span.style.backgroundColor = '#fff59d'; // soft yellow
            span.classList.add('highlighted');
            range.surroundContents(span);
            selection.removeAllRanges();  // clear selection

            const updatedHTML = document.getElementById('page-content').innerHTML;
            localStorage.setItem(`highlight-${bookid}-${currentPage}`, updatedHTML);
        } catch (err) {
            console.warn('Highlight failed:', err.message);
        }
    };
    const getPreviousPage = () => {
        if(currentPage > 1) {
            let previous = currentPage - 1;
            setCurrentPage(previous);
        }
    }
    const getNextPage = () => {
        if(currentPage < totalPages) {
            let next = currentPage + 1;
            setCurrentPage(next);
        }
    }
    const handlePageInput = (e) => {
        const pageNumber = e.target.value;
        if(pageNumber <= 0 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    }
    useEffect(() => {
        const fetchBook = async() => {
            try {
                
            } catch (error) {
                
            }
        }
        fetchBook();
    },[])
    useEffect(() => {
        const cached = localStorage.getItem(`highlight-${bookid}-${currentPage}`);
        if (cached) {
          setDisplayHTML(cached);
        } else {
          //setDisplayHTML(htmlContent); // fallback from backend
        }
    }, [bookid, currentPage, /*htmlContent*/]);
    const playTextToSpeech = async (text) => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        const response = await axios.post(
          'http://localhost:5000/api/tts/convertToAudio', // your backend route
          { text },
          { responseType: 'blob', withCredentials: true } // important: expect audio blob
        );
      
        const blob = new Blob([response.data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
      
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.play();
      } catch (err) {
        console.error('Playback failed:', err);
      }
    };
    const getPlainText = (html) => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || '';
    };
    useEffect(() => {
      if (isTextToSpeechActive) {
        const text = getPlainText(pages[currentPage]?.html || '');
        if (text) playTextToSpeech(text);
      } else {
         if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    }, [isTextToSpeechActive, currentPage]);
    useEffect(() => {
      const handleKeyDown = (e) => {
        // Prevent navigation if user is typing in an input or textarea
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') {
          return;
        }
        if (e.key === 'ArrowLeft') {
          getPreviousPage(); // custom function to go back
        } else if (e.key === 'ArrowRight') {
          getNextPage(); // custom function to go forward
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [currentPage, getNextPage, getPreviousPage]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header / Toolbar */}
        <div className="w-full h-12 bg-gray-200 grid grid-cols-3 gap-3 px-6 sm:px-8 shadow">
          {/* Book ID */}
          <div className="col-start-1 col-end-2 flex items-center justify-center h-12">
            <p className="font-bold tracking-wider truncate font-mono text-sm sm:text-base">{bookid}</p>
          </div>

          {/* Pagination Controls */}
          <div className="grid grid-cols-3 items-center gap-2 justify-center h-12">
            <div className="flex justify-end">
              {currentPage > 1 && (
                <IconButton onClick={getPreviousPage}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
              )}
            </div>
            <div className="flex gap-1.5 justify-center items-center">
              <input
                type="number"
                value={currentPage}
                onChange={handlePageInput} // handle this to avoid uncontrolled warning
                className="w-12 text-center bg-white rounded-md p-1 outline-none text-[14px] font-semibold tracking-wide"
              />
              <p className="text-[14px] font-semibold tracking-wide">
                of <span>{totalPages}</span>
              </p>
            </div>
            <div>
              {currentPage < totalPages && (
                <IconButton onClick={getNextPage}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="col-start-3 flex flex-row-reverse h-12">
            <Tooltip title="Bookmark">
              <IconButton
                sx={{ borderRadius: "50%", padding: "20px", width: "40px", height: "40px" }}
                onClick={() => setIsMarked(prev => !prev)}
              >
                {isMarked ? <BookmarkIcon /> : <BookmarkAddOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Couple Mode">
              <IconButton
                sx={{ borderRadius: "50%", padding: "20px", width: "40px", height: "40px" }}
                onClick={() => setIsCoupleModeActive(prev => !prev)}
              >
                {!isCoupleModeActive ? <HouseRoundedIcon /> : <CancelRoundedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Text to Speech">
              <IconButton
                sx={{ borderRadius: "50%", padding: "20px", width: "40px", height: "40px" }}
                onClick={() => setIsTextToSpeechActive(prev => !prev)}
              >
                {!isTextToSpeechActive ? <RecordVoiceOverRoundedIcon /> : <VoiceOverOffRoundedIcon />}
              </IconButton>
            </Tooltip>
            <TintSelector onTintChange={setTint} />
          </div>
        </div>

        {/* Book Content Display */}
        <div
          className={`flex-1 flex justify-center items-center px-4 sm:px-12 overflow-y-auto no-scrollbar transition-all duration-300`}
        >
          <div
            className={`prose max-w-none p-6 sm:p-8 shadow-md rounded-md transition-all duration-300 ease-in-out
                      ${textSize === 'sm' ? 'text-sm lg:w-[75%]' : ''}
                      ${textSize === 'base' ? 'text-base lg:w-[70%]' : ''}
                      ${textSize === 'lg' ? 'text-lg lg:w-[60%]' : ''}
                      ${textSize === 'xl' ? 'text-xl lg:w-[50%]' : ''}
                      ${tint === 'dark' ? 'prose-invert' : ''}
                      ${tintClasses[tint]}
                  `}   
          >
            {/* Book content goes here */}
            {/*displayHTML && (
              <div id="page-content" dangerouslySetInnerHTML={{ __html: displayHTML }} />
            )*/}
          </div>
        </div>
        {isCoupleModeActive && (
          <CouplePanel
            bookId={bookid}
            onJoin={(finalCoupleId) => {
              socket.emit("join_couple_room", { bookid, coupleId: finalCoupleId });
              setCoupleId(finalCoupleId);
            }}
          />
        )}
        <div className="fixed bottom-44 right-6 z-50">
          <Tooltip title="Highlight Selection" placement='top-start' arrow>
              <IconButton
                onClick={applyHighlight}
                sx={{
                  backgroundColor: '#fff59d',
                  '&:hover': { backgroundColor: '#fce87c' },
                  width: '40px',
                  height: '40px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <BorderColorRoundedIcon sx={{ color: '#333' }} />
              </IconButton>
          </Tooltip>
        </div>

        <div className="fixed bottom-16 right-4 z-50">
          <div className="flex flex-col-reverse items-center gap-1 border rounded-md px-2 py-1 bg-white shadow-md">
            <IconButton
              size="small"
              onClick={decreaseTextSize}
              disabled={textSize === 'sm'}
            >
              <RemoveRoundedIcon fontSize="small" />
            </IconButton>
            <p className="text-xs font-semibold w-8 text-center capitalize">{fontSizeLabels[textSize]}</p>
            <IconButton
              size="small"
              onClick={increaseTextSize}
              disabled={textSize === 'xl'}
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
    </div>
  )
}

export default ReadBook