import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import peixeSurpreso from '@/assets/peixe-icons/peixe-icon-surpreso.png'
import peixeHappy from '@/assets/peixe-icons/peixe-icon-happy.png'
import peixeDuvidoso from '@/assets/peixe-icons/peixe-icon-duvidoso.png'

// Força o browser a buscar e cachear as imagens imediatamente
;[peixeSurpreso, peixeHappy, peixeDuvidoso].forEach(src => {
  const img = new Image()
  img.src = src
})

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
