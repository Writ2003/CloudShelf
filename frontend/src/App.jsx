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
import AdminLayout from './AdminLayout'
import AdminDashboard from './componenets/AdminDashboard'
import AddBookForm from './componenets/AddBookForm'
import AddBookContent from './componenets/addBookContent'
import RemoveBook from './componenets/RemoveBook'
import FindBook from './componenets/FindBook'
import { Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        <Route element={<ProtectedRoute allowedUser="Reader" />} >
          <Route path='/reader' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='bookinfo/:bookid' element={<BookInfo/>}/>
            <Route path='readbook/:bookid' element={<ReadBook/>}/>
            <Route path='book/:bookId/discussion/:discussionId' element={<Discussion/>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedUser="Admin" />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path='addbook' element={<AddBookForm />} />
            <Route path='addcontent' element={<AddBookContent/>} />
            <Route path='removebook' element={<RemoveBook/>} />
            <Route path='findbook' element={<FindBook/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
