import React from 'react'
import Card from './ui/Recommendation'
import Category from './ui/Category'
import PopularBook from './ui/PopularBook'
import ContinueReading from './ui/ContinueReading'

const Dashboard = () => {
  return (
    <div className='grid grid-cols-5 gap-3'>
        <div className='col-span-4'>
            <ContinueReading/>
            <Card/>
            <Category/>
        </div>
        <div>
            <PopularBook/>
        </div>
    </div>
  )
}

export default Dashboard