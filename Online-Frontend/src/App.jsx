import React from 'react'
import { Routes, Route,Link } from "react-router";
import Nav from "./section/Nav.jsx"
import Cart from "./section/Cart.jsx"
import Home from "./section/Home.jsx"


const App = () => {
  return (
    <div className='overflow-x-hidden'>
    <Nav/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
    </div>
  )
}

export default App