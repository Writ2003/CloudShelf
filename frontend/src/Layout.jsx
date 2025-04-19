import React from 'react';
import Header from './componenets/Header';
import Sidebar from './componenets/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='h-full w-full bg-slate-100'>
        <div className='grid grid-cols-6'>
          <div className='col-span-1 z-10'>
            <Sidebar/>
          </div>
          <div className='col-span-5 z-0'>
            <Header/>
            <Outlet/>
          </div>
        </div>
      </div>
  );
};

export default Layout;