import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/login/login"
import Home from "../pages/home/home"
import AdminPortal from "../pages/admin/admin"
import About from "../pages/about/about"
import CreateCampaign from "../pages/createCampaign"
import Graphics from "../pages/graphics"
import Settings from "../pages/settings"
import Templates from "../pages/templates"
import Users from "../pages/users"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/graphics" element={<Graphics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}