import {useEffect, useState} from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { Link } from 'react-router-dom';

const ContinueReading = () => {
  const [booksReading, setBooksReading] = useState([]);
  const loadBooksReading = async () => {

  };
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        
      } catch (error) {
        
      }
    }
    fetchBooks();
  },[]) 
  const normalise = (value) => ((value - 0) * 100) / (282 - 0);
  return (
    <div className='m-3 bg-white p-3 rounded-xl'>
      <p className='font-bold mb-3 mx-3'>Continue reading</p>
      <div className='mb-3 flex flex-col gap-1.5'>
        <div className='grid grid-cols-5 gap-6 mx-3 items-center'>
          <div className='col-span-2 flex items-center gap-6'>
            <Link to={`#`}><div className='bg-amber-800 h-12 w-12 rounded-md'></div></Link>
            <p className='font-semibold text-xs truncate'>Growth Community Movie</p>
            <p className='font-semibold text-xs truncate'>John Kirby</p>
          </div>
          <p className='col-span-1 text-center font-semibold text-xs'>Last read 15h ago</p>
          <div className='flex gap-3 col-span-2 items-center ml-auto'>
            <label for='progress' className='font-semibold text-xs'>Progress</label>
            <LinearProgress variant="determinate" 
              sx={{
              height: 5,
              width: '15vw',
              borderRadius: '5px',
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3b82f6', // Tailwind's blue-500
              },
            }}
            value={normalise(180)} />
            <p className='text-xs font-semibold'>{normalise(180).toFixed(0)+'%'}</p>
          </div>
        </div>
        <div className='grid grid-cols-5 gap-6 mx-3 items-center'>
          <div className='col-span-2 flex items-center gap-6'>
            <div className='bg-amber-800 h-12 w-12 rounded-md'></div>
            <p className='font-semibold text-xs truncate'>Growth Community Movie</p>
            <p className='font-semibold text-xs truncate'>John Kirby</p>
          </div>
          <p className='col-span-1 text-center font-semibold text-xs'>Last read 15h ago</p>
          <div className='flex gap-3 col-span-2 items-center ml-auto'>
            <label for='progress' className='font-semibold text-xs'>Progress</label>
            <LinearProgress variant="determinate" 
              sx={{
              height: 5,
              width: '15vw',
              borderRadius: '5px',
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3b82f6', // Tailwind's blue-500
              },
            }}
            value={normalise(180)} />
            <p className='text-xs font-semibold'>{normalise(180).toFixed(0)+'%'}</p>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center'><button onClick={loadBooksReading} className='text-xs px-2 py-1 bg-blue-100 text-blue-500 rounded-full cursor-pointer font-semibold'>Load more</button></div>
    </div>
  )
}

export default ContinueReading