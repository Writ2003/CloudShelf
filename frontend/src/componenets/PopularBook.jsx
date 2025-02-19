import React from 'react'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { BookOpen } from 'lucide-react';

const PopularBook = () => {
  return (
    <div className='h-full bg-blue-950 2xl:px-3 py-12'>
        <div className='flex flex-col items-center gap-3'>
            <div className='h-64 w-32 mb-3'>
                <div className='h-8/10 bg-gray-300 rounded-lg text-2xl flex justify-center items-center text-black'>Book</div>
                <div className='h-2/10 flex flex-col gap-2 items-center text-white text-sm mt-1'>
                    <p className='text-center text-wrap w-full max-h-3/4'>Whispers of the Forgotten Realm</p>
                    <p className='text-[12px] text-white/70'>Lyra A. Callan</p>
                </div>
            </div>
            <Stack spacing={1} marginTop={2}>
                <Rating name="half-rating-read" defaultValue={4.6} precision={0.1} style={{height:10}} readOnly />
            </Stack>
            <p className='text-white text-[12px] mt-1'>4.6</p>
            <div className='px-1 2xl:px-0 grid grid-cols-3 text-white/75 text-[12px] text-center justify-items-center xl:gap-3'>
                <div className='border-r border-white/75 flex flex-col gap-1 align-middle pr-1 2xl:pr-3'>
                    <div>320</div>
                    <div>Pages</div>
                </div>
                <div className='border-r border-white/75 flex flex-col gap-1 pr-1 2xl:pr-3'>
                    <div>643</div>
                    <div>Ratings</div>
                </div>
                <div className='flex flex-col gap-1 pl-1 2xl:pl-0'>
                    <div>110</div>
                    <div>Reviews</div>
                </div>
            </div>
            <p className='text-[12px] text-white/75 m-3 h-40 overflow-hidden xl:w-44 w-32'>
            In a world where time and memory are intertwined, Whispers of the Forgotten Realm follows the journey of Elara, a young historian who stumbles upon an ancient artifact hidden deep within the archives of a crumbling library. The artifact, a mysterious pocket watch, begins to unravel fragments of a forgotten era—a realm erased from history, where magic thrived and mythical creatures walked among humans.As Elara delves deeper into the secrets of the watch, she discovers that her own memories are tied to this lost world. Guided by cryptic visions and aided by a reluctant thief with a shadowy past, she embarks on a perilous quest across treacherous landscapes and enchanted ruins. Along the way, she uncovers truths about her family’s legacy, the cost of preserving history, and the power of choices long buried.But not all is as it seems. A sinister force seeks to reclaim the watch, intent on rewriting reality itself. With time running out—literally—Elara must decide whether to restore the forgotten realm or let it remain lost forever, knowing that either choice will change her life and the fate of countless others.Blending rich world-building, heart-pounding adventure, and poignant reflections on identity and belonging, Whispers of the Forgotten Realm is a spellbinding tale that will leave readers questioning the boundaries between memory and imagination, past and present, destiny and free will.
            </p>
            <div className='text-white bg-blue-700 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-lg'>
                <button className='flex justify-center items-center gap-2 cursor-pointer'>
                    <p>Read Now</p>
                    <BookOpen height={18} width={18}/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default PopularBook