import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './componenets/Dashboard'
import BookInfo from './componenets/BookInfo'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='/bookinfo/:bookid' element={<BookInfo/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
