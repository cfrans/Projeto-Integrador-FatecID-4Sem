import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import PrivateRoute from "../components/routing/PrivateRoute"
import AdminRoute from "../components/routing/AdminRoute"
import ColaboradorRoute from "../components/routing/ColaboradorRoute"
import AppShellLayout from "../layouts/AppShellLayout"
import LoadingOverlay from "../components/ui/LoadingOverlay"

// ── Eager: páginas de entrada e erros (sem lazy — carregam imediatamente) ──────
import LoginPage from "../pages/login"
import LoginBetaPage from "../pages/login-beta"
import AlertaPhishingPage from "../pages/alerta-phishing"
import ChangePasswordPage from "../pages/change-password"
import NotFoundPage from "../pages/not-found"
import ForbiddenPage from "../pages/forbidden"

// ── Lazy: todas as demais (carregam só quando o usuário navegar até elas) ──────
const BackgroundDemoPage  = lazy(() => import("../pages/background-demo"))
const CaixaEntradaPage    = lazy(() => import("../pages/caixa-entrada"))
const ForgotPasswordPage  = lazy(() => import("../pages/forgot-password"))
const HomePage            = lazy(() => import("../pages/home"))
const AdminPage           = lazy(() => import("../pages/admin"))
const AboutPage           = lazy(() => import("../pages/about"))
const CampaignsPage       = lazy(() => import("../pages/campaigns"))
const GraphicsPage        = lazy(() => import("../pages/graphics"))
const SettingsPage        = lazy(() => import("../pages/settings"))
const TemplatesPage       = lazy(() => import("../pages/templates"))
const UsersPage           = lazy(() => import("../pages/users"))
const ModelsPage          = lazy(() => import("../pages/models"))
const QuizPage            = lazy(() => import("../pages/quiz"))
const ConteudosPage       = lazy(() => import("../pages/conteudos"))
const MeusGraficosPage    = lazy(() => import("../pages/meus-graficos"))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay open />}>
        <Routes>
          {/* Pública */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginbeta" element={<LoginBetaPage />} />
          <Route path="/bg-demo" element={<BackgroundDemoPage />} />
          <Route path="/alerta-phishing" element={<AlertaPhishingPage />} />
          <Route path="/caixa-entrada" element={<CaixaEntradaPage />} />
          <Route path="/acesso-negado" element={<ForbiddenPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

