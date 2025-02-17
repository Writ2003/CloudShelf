import { useState } from 'react'
import Header from './componenets/Header'
import Sidebar from './componenets/Sidebar'
import Card from './componenets/Recommendation'
import Category from './componenets/Category'
import PopularBook from './componenets/PopularBook'

function App() {

  return (
    <>
      <div className='h-full w-full bg-slate-100'>
        <div className='grid grid-cols-6'>
          <div className='col-span-1 z-10'>
            <Sidebar/>
          </div>
          <div className='col-span-5 z-0'>
            <Header/>
            <div className='grid grid-cols-5 gap-3'>
              <div className='col-span-4'>
                <Card/>
                <Category/>
              </div>
              <div>
                <PopularBook/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
