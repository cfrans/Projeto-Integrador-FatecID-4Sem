import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AnimatedBackground from '@/components/effects/AnimatedBackground'
import { LogoHorizontal } from '@/components/branding/LogoHorizontal'
import { Button } from '@/components/ui/button'

export default function AlertaPhishingPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Quem cai aqui chegou por um link de phishing. Encerramos qualquer sessão
  // existente (ex.: admin durante a demonstração) para que o Portal de
  // Treinamentos seja sempre acessado com o login correto do colaborador.
  useEffect(() => {
    logout()
  }, [logout])

  return (
    <AnimatedBackground>
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
      }}>
        {/* Card glassmorphism */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(13, 148, 136, 0.25)',
          borderRadius: '20px',
          padding: '48px 40px 40px',
          textAlign: 'center',
          boxShadow: '0 0 0 1px rgba(13,148,136,0.08), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
        }}>

          {/* Borda superior em gradiente */}
          <div style={{
            position: 'absolute',
            top: 0, left: '10%', right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #0d9488, #ea580c, #0d9488, transparent)',
            borderRadius: '0 0 2px 2px',
          }} />

          {/* Logo oficial */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <LogoHorizontal style={{ height: '56px', width: 'auto' }} variant="dark" />
          </div>

          {/* Ícone de alerta pulsante */}
          <style>{`
            @keyframes pulse-ring {
              0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.25); }
              50%       { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
            }
          `}</style>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'pulse-ring 2.5s ease-in-out infinite',
          }}>
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: '22px', fontWeight: 800,
            color: '#f1f5f9', lineHeight: 1.3,
            marginBottom: '16px',
          }}>
            Você clicou em um link de phishing
          </h1>

          {/* Badge "seguro" */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(13,148,136,0.15)',
            border: '1px solid rgba(13,148,136,0.30)',
            color: '#2dd4bf',
            fontSize: '12px', fontWeight: 600,
            padding: '5px 12px', borderRadius: '999px',
            marginBottom: '20px',
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Seus dados estão seguros
          </div>

          {/* Parágrafos */}
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94a3b8', marginBottom: '14px' }}>
            Este foi um{' '}
            <span style={{ color: '#2dd4bf', fontWeight: 600 }}>teste de conscientização</span>{' '}
            realizado pela sua empresa com o Projeto Nemo.
            Nenhum dado foi coletado e nenhum sistema foi comprometido.
          </p>

          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94a3b8', marginBottom: '0' }}>
            Porém, em um ataque real, um clique como este poderia ter entregado suas{' '}
            <span style={{ color: '#f87171', fontWeight: 600 }}>credenciais corporativas</span>{' '}
            a cibercriminosos e comprometido toda a rede da organização.
          </p>

          {/* Divisor */}
          <div style={{ height: '1px', background: 'rgba(13,148,136,0.15)', margin: '24px 0' }} />

          {/* Botão */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Acessar o Portal de Treinamentos
          </Button>

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#475569' }}>
            Entre com seu login para realizar um treinamento no painel{' '}
            <span style={{ color: '#0d9488', fontWeight: 600 }}>Nemo</span>{' '}
            e recuperar os pontos perdidos.
          </p>
        </div>
      </div>
    </AnimatedBackground>
  )
}
