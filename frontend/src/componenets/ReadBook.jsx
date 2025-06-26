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
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageContents, setPageContents] = useState([]);

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
            <div className='col-start-2 col-end-3'>

            </div>
            <div className='col-start-3 flex flex-row-reverse'>
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
        <div className={`flex-1 flex justify-center items-center transition-all duration-300 ${tintClasses[tint]}`}>
            Hello
        </div>
    </div>
  )
}

export default ReadBook