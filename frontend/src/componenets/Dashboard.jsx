import React from 'react'
import Card from './ui/Recommendation'
import Category from './ui/Category'
import PopularBook from './ui/PopularBook'

const Dashboard = () => {
  return (
    <div className='grid grid-cols-5 gap-3'>
        <div className='col-span-4'>
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