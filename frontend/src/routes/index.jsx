import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import PrivateRoute from "../components/routing/PrivateRoute"
import AdminRoute from "../components/routing/AdminRoute"
import ColaboradorRoute from "../components/routing/ColaboradorRoute"
import AppShellLayout from "../layouts/AppShellLayout"
import LoginPage from "../pages/login"
import ForgotPasswordPage from "../pages/forgot-password"
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

// ── Páginas do Colaborador ────────────────────────────────────────────────────
import QuizPage from "../pages/quiz"
import ConteudosPage from "../pages/conteudos"
import MeusGraficosPage from "../pages/meus-graficos"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/trocar-senha" element={<ChangePasswordPage />} />

        {/* ── Rotas Protegidas e com Layout ── */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppShellLayout />}>
            
            {/* Rotas Compartilhadas */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* ── Rotas exclusivas do Admin ── */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/create" element={<CampaignsPage />} />
              <Route path="/graphics" element={<GraphicsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/models" element={<ModelsPage />} />
            </Route>

            {/* ── Rotas exclusivas do Colaborador ── */}
            <Route element={<ColaboradorRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/conteudos" element={<ConteudosPage />} />
              <Route path="/meus-graficos" element={<MeusGraficosPage />} />
            </Route>

          </Route>
        </Route>

        <Route path="/modelosTeste" element={<Navigate to="/models" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
