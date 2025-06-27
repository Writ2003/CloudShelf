import React, { useEffect, useState } from 'react'
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

const tintClasses = {
  default: "bg-white text-black",
  sepia: "bg-[#f4ecd8] text-[#5b4636]",
  night: "bg-[#121212] text-white",
};

const ReadBook = () => {
    const [isMarked, setIsMarked] = useState(false);
    const [markedPage, setMarkedPage] = useState(0);
    const [isCoupleModeActive, setIsCoupleModeActive] = useState(false);
    const [isTextToSpeechActive, setIsTextToSpeechActive] = useState(false);
    const [tint, setTint] = useState("default");
    const { bookid } = useParams();
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageContents, setPageContents] = useState([]);

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

    useEffect(() => {
        const fetchBook = async() => {
            try {
                
            } catch (error) {
                
            }
        }
        fetchBook();
    },[])
  return (
    <div className='h-screen flex flex-col'>
        <div className='w-full h-12 bg-gray-200 grid grid-cols-3 gap-3 px-12'>
            <div className='col-start-1 col-end-2 content-center'>
                <p className='font-bold tracking-wider truncate font-mono'>{bookid}</p>
            </div>
            <div className='grid grid-cols-3 items-center gap-2 justify-center'>
                <div className='flex justify-end'>
                    {currentPage > 1 && <IconButton onClick={getPreviousPage}>
                        <KeyboardArrowLeftIcon/>
                    </IconButton>}
                </div>
                <div className='flex gap-1.5 justify-center items-center'>
                    <input type="number" value={currentPage} className='w-12 text-center bg-white rounded-md p-1 outline-none text-[14px] font-semibold tracking-wide'/>
                    <p>of <span className='text-[14px] font-semibold tracking-wide'>{totalPages}</span></p>
                </div>
                <div>
                    {currentPage < totalPages && <IconButton onClick={getNextPage}>
                        <KeyboardArrowRightIcon/>
                    </IconButton>}
                </div>
            </div>
            <div className='col-start-3 flex flex-row-reverse h-12'>
                <Tooltip title='Bookmark'>
                    <IconButton sx={{
                        borderRadius:"50%",
                        padding:"20px",
                        width:"40px",
                        height:"40px"
                    }}
                       onClick={() => setIsMarked(prev => !prev)}
                    >
                        {isMarked? <BookmarkIcon/> : <BookmarkAddOutlinedIcon/>}
                    </IconButton>
                </Tooltip>
                <Tooltip title='Couple Mode'>
                    <IconButton sx={{
                        borderRadius:"50%",
                        padding:"20px",
                        width:"40px",
                        height:"40px"
                    }}
                       onClick={() => setIsCoupleModeActive(prev => !prev)}
                    >
                        {!isCoupleModeActive? <HouseRoundedIcon/> : <CancelRoundedIcon/>}
                    </IconButton>
                </Tooltip>
                <Tooltip title='Text to Speech'>
                    <IconButton sx={{
                        borderRadius:"50%",
                        padding:"20px",
                        width:"40px",
                        height:"40px"
                    }}
                       onClick={() => setIsTextToSpeechActive(prev => !prev)}
                    >
                        {!isTextToSpeechActive? <RecordVoiceOverRoundedIcon/> : <VoiceOverOffRoundedIcon/>}
                    </IconButton>
                </Tooltip>
                <TintSelector onTintChange={setTint}/>
            </div>
        </div>
        <div className={`flex-1 flex justify-center items-center transition-all duration-300 overflow-y-auto no-scrollbar ${tintClasses[tint]}`}>
            Hello
        </div>
    </div>
  )
}

export default ReadBook