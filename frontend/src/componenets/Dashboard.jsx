import React from 'react'
import Card from './Recommendation'
import Category from './Category'
import PopularBook from './PopularBook'

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