import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import '@/assets/peixe-icons/peixe-icon-surpreso.svg'
import '@/assets/peixe-icons/peixe-icon-happy.svg'
import '@/assets/peixe-icons/peixe-icon-duvidoso.svg'

document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('button, [role="button"]').forEach((el) => {
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
