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
import CouplePanel from './ui/CouplePanel'
import { useSearchParams } from 'react-router-dom';
import { coupleSocket } from '../socket';
import { toast, ToastContainer } from 'react-toastify';
import CoupleChatAndCall from './ui/CoupleChatAndCall';

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
    const [searchParams, setSearchParams] = useSearchParams();
    const coupleIdParam = searchParams.get('coupleId');
    const [coupleId, setCoupleId] = useState('');
    const [hasCoupleJoined, setHasCoupleJoined] = useState(false); 

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
    const onJoin = (finalCoupleId) => {
      console.log('Couple Id: ',finalCoupleId)
      coupleSocket.emit("join_couple_room", { bookId: bookid, coupleId: finalCoupleId });
      setCoupleId(finalCoupleId);
    };
    useEffect(() => {
      console.log(coupleIdParam);
      if(coupleIdParam) {
        setCoupleId(coupleIdParam);
        coupleSocket.emit('join_couple_room', { bookId: bookid, coupleId: coupleIdParam });
        console.log('Couple joined');
      }
      const handleCoupleReady = (data) => {
        toast.success(data.message);
        setHasCoupleJoined(true);
      };
    
      coupleSocket.on('couple_ready', handleCoupleReady);

      coupleSocket.on("user_disconnected", ({ socketId }) => {
        console.log(`⚠️ User disconnected: ${socketId}`);
        setHasCoupleJoined(false);
      });
    
      // Cleanup listener on unmount
      return () => {
        coupleSocket.off('couple_ready');
        coupleSocket.off('user_disconnected');
        coupleSocket.off();
      };
    },[coupleSocket, bookid])
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

    const sendPageChange = (page) => {
      if (!hasCoupleJoined) return;
      coupleSocket.emit("couple_page_change", { page });
    };

    const onPageChange = (callback) => {
      coupleSocket.on("sync_page_change", ({ page }) => {
        callback(page);
      });
    };

    const sendOffer = (offer) => {
      coupleSocket.emit("couple_webrtc_offer", offer);
    };

    const onOffer = (callback) => {
      coupleSocket.on("couple_webrtc_offer", callback);
    };

    const sendAnswer = (answer) => {
      coupleSocket.emit("couple_webrtc_answer", answer);
    };

    const onAnswer = (callback) => {
      coupleSocket.on("couple_webrtc_answer", callback);
    };

    const sendCandidate = (candidate) => {
      coupleSocket.emit("couple_webrtc_candidate", candidate);
    };

    const onCandidate = (callback) => {
      coupleSocket.on("couple_webrtc_candidate", callback);
    };

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
            {!(coupleIdParam || hasCoupleJoined) && <Tooltip title="Couple Mode">
              <IconButton
                sx={{ borderRadius: "50%", padding: "20px", width: "40px", height: "40px" }}
                onClick={() => setIsCoupleModeActive(prev => !prev)}
              >
                {!isCoupleModeActive ? <HouseRoundedIcon /> : <CancelRoundedIcon />}
              </IconButton>
            </Tooltip>
            }
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
          className={`flex-1 flex justify-center items-center pl-6 sm:pl-8 overflow-y-auto no-scrollbar transition-all duration-300`}
        >
          <div
            className={`prose max-w-none mx-auto p-6 sm:p-8 shadow-md rounded-md transition-all duration-300 ease-in-out
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
          {isCoupleModeActive && !(coupleIdParam || hasCoupleJoined) && (
            <CouplePanel
              bookId={bookid}
              onJoin={onJoin}
            />
          )}
          {hasCoupleJoined && <CoupleChatAndCall
              hasCoupleJoined={hasCoupleJoined}
              onSendMessage={(text) => coupleSocket.emit("couple_send_message", { text, coupleId, bookId:bookid })}
              onReceiveMessage={(callback) =>
                coupleSocket.on("couple_receive_message", ({ text }) => {console.log(text);callback(text)})
              }
              sendOffer={(offer) => coupleSocket.emit("couple_webrtc_offer", offer)}
              onOffer={(callback) => coupleSocket.on("couple_webrtc_offer", callback)}
              sendAnswer={(answer) => coupleSocket.emit("couple_webrtc_answer", answer)}
              onAnswer={(callback) => coupleSocket.on("couple_webrtc_answer", callback)}
              sendCandidate={(candidate) =>
                coupleSocket.emit("couple_webrtc_candidate", candidate)
              }
              onCandidate={(callback) =>
                coupleSocket.on("couple_webrtc_candidate", callback)
              }
            />
          }
        </div>
        <div className="fixed bottom-34 right-6 z-50">
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

        <div className="fixed bottom-8 right-4 z-50">
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
        <ToastContainer position='top-center'/>
    </div>
  )
};

export default ReadBook