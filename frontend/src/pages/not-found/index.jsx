import { useNavigate } from 'react-router-dom'
import AnimatedBackground from '@/components/effects/AnimatedBackground'
import { LogoHorizontal } from '@/components/branding/LogoHorizontal'
import { Button } from '@/components/ui/button'
import peixeConfuso from '@/assets/peixe-icons/peixe-icon-duvidoso.png'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <AnimatedBackground>
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '520px', margin: '0 auto' }}>
        {/* Card glassmorphism */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(13, 148, 136, 0.25)',
          borderRadius: '20px',
          padding: '44px 40px 40px',
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

          <style>{`
            @keyframes nemo404Bob {
              0%, 100% { transform: translateY(0) rotate(-4deg); }
              50%      { transform: translateY(-12px) rotate(4deg); }
            }
          `}</style>

          {/* Logo oficial */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <LogoHorizontal style={{ height: '48px', width: 'auto' }} variant="dark" />
          </div>

          {/* Peixe confuso boiando */}
          <img
            src={peixeConfuso}
            alt="Peixe confuso"
            style={{
              height: '110px',
              width: 'auto',
              margin: '0 auto 8px',
              display: 'block',
              animation: 'nemo404Bob 3s ease-in-out infinite',
              filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.45))',
            }}
          />

          {/* 404 */}
          <h1 style={{
            fontSize: '64px', fontWeight: 800, lineHeight: 1,
            margin: '8px 0 4px',
            background: 'linear-gradient(180deg, #2dd4bf, #0d9488)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            404
          </h1>

          {/* Título */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>
            Página não encontrada
          </h2>

          {/* Mensagem */}
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94a3b8', marginBottom: '28px' }}>
            Parece que esse peixe nadou para águas desconhecidas. A página que você procura
            não existe, foi movida ou o endereço está incorreto.
          </p>

          {/* Botão */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Voltar ao início
          </Button>
        </div>
      </div>
    </AnimatedBackground>
  )
}
