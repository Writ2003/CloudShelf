import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './componenets/Dashboard'
import BookInfo from './componenets/BookInfo'
import Login from './componenets/Login'
import Register from './componenets/Register'
import ProtectedRoute from "./componenets/ProtectedRoutes";
import ReadBook from './componenets/ReadBook'
import Discussion from './componenets/Discussion'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='bookinfo/:bookid' element={<BookInfo/>}/>
            <Route path='readbook/:bookid' element={<ReadBook/>}/>
            <Route path='book/:bookId/discussion/:discussionId' element={<Discussion/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
