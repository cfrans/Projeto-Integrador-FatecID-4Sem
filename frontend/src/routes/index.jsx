import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from '../pages/home/home'
import Login from '../pages/login/login'
import AdminPortal from '../pages/admin/admin'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}