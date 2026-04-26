import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import PrivateRoute from "../components/routing/PrivateRoute"
import AdminRoute from "../components/routing/AdminRoute"
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
import ChangePasswordPage from "../pages/change-password"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/trocar-senha" element={<ChangePasswordPage />} />

        {/* Autenticadas — qualquer role */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Autenticadas — somente Admin */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AppShellLayout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/create" element={<CampaignsPage />} />
              <Route path="/graphics" element={<GraphicsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/models" element={<ModelsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/modelosTeste" element={<Navigate to="/models" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}