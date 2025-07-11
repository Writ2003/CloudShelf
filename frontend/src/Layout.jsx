import React from 'react';
import Header from './componenets/ui/Header';
import Sidebar from './componenets/ui/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const navigate = useLocation();
  const currentPath = navigate.pathname;
  return (
    <div className='h-full w-full bg-slate-100'>
        <div className='grid grid-cols-6'>
          <div className='col-span-1 z-10'>
            <Sidebar/>
          </div>
          <div className='col-span-5 z-0'>
            {!currentPath.split('/').includes('readbook') && <Header/>}
            <Outlet/>
          </div>
        </div>
      </div>
  );
};

export default Layout;