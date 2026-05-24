import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoHorizontal } from '@/components/branding/LogoHorizontal'
import AnimatedBackground from '@/components/effects/AnimatedBackground'
import Modal from '@/components/ui/Modal'
import { api, ApiError } from '@/lib/api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  
  // Step 1: email
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1) // 1 = email, 2 = perguntas
  const [perguntas, setPerguntas] = useState([])
  
  // Step 2: form
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleBuscarPerguntas(event) {
    event.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const data = await api.get(`/api/auth/recuperar-senha/perguntas?email=${encodeURIComponent(email)}`, { auth: false })
      setPerguntas(data)
      setStep(2)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao buscar usuário. Verifique o e-mail.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRecuperarSenha(event) {
    event.preventDefault()
    setErro('')

    if (novaSenha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    const formData = new FormData(event.currentTarget)
    setLoading(true)

    try {
      await api.post('/api/auth/recuperar-senha', {
        email,
        resposta1: formData.get('resposta1'),
        resposta2: formData.get('resposta2'),
        novaSenha
      }, { auth: false })
      
      setSucesso(true)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao trocar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedBackground>
      <section className="grid w-full max-w-md overflow-hidden rounded-2xl border border-slate-400/30 shadow-2xl shadow-slate-950/60 backdrop-blur-xs">
        <div className="grid content-center bg-slate-50/95 p-8 text-slate-900">
          <div className="mb-6 flex justify-center">
            <LogoHorizontal className="w-140" variant="white"/>
          </div>
          
          <header className="mb-5">
            <h1 className="text-lg font-bold">Recuperação de Senha</h1>
            <p className="mt-2 text-slate-700">
              {step === 1 
                ? 'Informe seu e-mail corporativo para localizar suas perguntas de segurança.' 
                : 'Responda as perguntas de segurança abaixo para definir sua nova senha.'}
            </p>
          </header>

          {step === 1 ? (
            <form className="grid gap-4" onSubmit={handleBuscarPerguntas}>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  name="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  autoComplete="email"
                  required 
                />
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
                <Button type="button" variant="link" onClick={() => navigate('/login')}>
                  Voltar para o login
                </Button>
              </div>
            </form>
          ) : (
            <form className="grid gap-4" onSubmit={handleRecuperarSenha} autoComplete="off">
              {/* Fake inputs to stop aggressive autofill */}
              <input type="email" name="fake_email" style={{display: 'none'}} aria-hidden="true" />
              
              <div className="grid gap-2">
                <Label htmlFor="resposta1">1. {perguntas[0]?.texto}</Label>
                <Input id="resposta1" type="text" name="resposta1" autoComplete="off" data-lpignore="true" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resposta2">2. {perguntas[1]?.texto}</Label>
                <Input id="resposta2" type="text" name="resposta2" autoComplete="off" data-lpignore="true" required />
              </div>

              <div className="border-t border-slate-200 my-2 pt-4 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="novaSenha">Nova senha</Label>
                  <Input 
                    id="novaSenha" 
                    type="password" 
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    minLength={6} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmar">Confirmar nova senha</Label>
                  <Input 
                    id="confirmar" 
                    type="password" 
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    minLength={6} 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Redefinir senha'}
                </Button>
                <Button type="button" variant="link" onClick={() => setStep(1)} disabled={loading}>
                  Voltar
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Modal
        open={!!erro}
        onClose={() => setErro('')}
        title="Ocorreu um erro"
        description={erro}
        variant="error"
      />

      <Modal
        open={sucesso}
        onClose={() => navigate('/login')}
        title="Senha alterada!"
        description="Sua senha foi redefinida com sucesso. Faça login com a nova senha."
        variant="success"
      />
    </AnimatedBackground>
  )
}
