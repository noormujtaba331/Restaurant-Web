import React from 'react'
import Dashboard from './sections/Dashboard'
import AdminNavbar from './sections/AdminNavbar'
import { BrowserRouter, Routes, Route } from 'react-router'
import Products from './sections/Products'
import Orders from './sections/Order'
import Sales from './sections/Sales'

const App = () => {
  return (
    <div>
      <AdminNavbar/>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/sales" element={<Sales/>} />
      </Routes>

    </div>
  )
}

export default App
