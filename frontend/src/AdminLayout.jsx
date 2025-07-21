import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='h-full w-full bg-slate-100'>
      <div className='flex'>
        <Outlet/>
      </div>
    </div>
  )
};

export default AdminLayout