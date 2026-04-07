import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import AppShellLayout from "../layouts/AppShellLayout"
import LoginPage from "../pages/login"
import HomePage from "../pages/home"
import AdminPage from "../pages/admin"
import AboutPage from "../pages/about"
import CampaignsPage from "../pages/campaigns"
import GraphicsPage from "../pages/graphics"
import SettingsPage from "../pages/settings"
import TemplatesPage from "../pages/templates"
import UsersPage from "../pages/users"
import ModelsPage from "../pages/models"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<AppShellLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/create" element={<CampaignsPage />} />
          <Route path="/graphics" element={<GraphicsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/models" element={<ModelsPage />} />
        </Route>
        <Route path="/modelosTeste" element={<Navigate to="/models" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}