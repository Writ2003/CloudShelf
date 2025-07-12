import React from 'react';
import Header from './componenets/ui/Header';
import Sidebar from './componenets/ui/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const navigate = useLocation();
  const currentPath = navigate.pathname;
  return (
    <div className='h-full w-full bg-slate-100'>
        <div className='flex'>
          <div className=''>
            <Sidebar/>
          </div>
          <div className='flex-1'>
            {!currentPath.split('/').includes('readbook') && <Header/>}
            <Outlet/>
          </div>
        </div>
      </div>
  );
};

export default Layout;