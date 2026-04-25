import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/branding/Logo'
import { CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AnimatedBackground from '@/components/effects/AnimatedBackground'
import Modal from '@/components/ui/Modal'
import { useState } from 'react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [erro, setErro] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        senha: formData.get('password'),
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      setErro(data.erro || 'Credenciais inválidas.')
      return
    }
    const data = await res.json()
    localStorage.setItem('token', data.token)

    if (data.primeiroAcesso) {
      navigate('/trocar-senha')
      return
    }

    if (data.role === 'Admin') {
      navigate('/admin')
    } else {
      navigate('/home')
    }
  }

  return (
    // Linha abaixo comentada caso queira remover o fundo animado
    // <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_14%_20%,rgba(13,148,136,0.2),transparent_35%),radial-gradient(circle_at_82%_78%,rgba(30,64,175,0.22),transparent_35%),linear-gradient(145deg,#051524_0%,#0b2538_55%,#0f172a_100%)] p-6 sm:p-3"></main>
    <AnimatedBackground>
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-400/30 shadow-2xl shadow-slate-950/60 backdrop-blur-xs lg:grid-cols-[1.2fr_1fr]">
        <aside className="grid content-between gap-8 bg-[linear-gradient(165deg,rgba(15,23,42,0.82)_0%,rgba(15,118,110,0.5)_100%),linear-gradient(120deg,#0b1729_0%,#0e2a3c_100%)] p-7 text-slate-200 sm:gap-5 sm:p-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-center">
              <Logo className="w-100 h-100 justify-center" />
            </div>

            <CardDescription className="text-slate-300">
              <div className="mt-10 grid gap-4 rounded-xl border justify-center justify-items-center border-slate-400/25 bg-slate-900/35 p-4" aria-label="Fluxo de uso do portal">
                <h3 className="text-sm text-bold text-slate-200">Como funciona </h3>
                <ol className="grid list-none gap-2 p-0">
                  <li className="flex items-center gap-2 text-sm text-blue-100">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-300 text-xs font-bold text-teal-950">1</span>
                    <span>Entrar com credenciais corporativas</span>
                  </li>
                  <li className="flex items-center justify-center text-sm leading-none text-teal-200" aria-hidden="true">↓</li>
                  <li className="flex items-center gap-2 text-sm text-blue-100">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-300 text-xs font-bold text-teal-950">2</span>
                    <span>Realizar treinamentos e simulações</span>
                  </li>
                  <li className="flex items-center justify-center text-sm leading-none text-teal-200" aria-hidden="true">↓</li>
                  <li className="flex items-center gap-2 text-sm text-blue-100">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-300 text-xs font-bold text-teal-950">3</span>
                    <span>Acompanhar evolução e indicadores</span>
                  </li>
                </ol>
              </div>
            </CardDescription>

          </div>
        </aside>
        <section className="grid content-center bg-slate-50/95 p-6 text-slate-900 sm:p-5">
          <header className="mb-5">
            <h1 className='text-lg font-bold'>Acesso ao portal corporativo</h1>
            <p className="mt-2 text-slate-700">Use suas credenciais para autenticacao e entre no ambiente correto do seu perfil.</p>
          </header>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input
                className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] text-slate-900 focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
                id="email"
                type="email"
                name="email"
                placeholder="exemplo@nemo.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] text-slate-900 focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                minLength={0}
                required
              />
            </div>

            <Modal
              open={!!erro}
              onClose={() => setErro(null)}
              title="Não foi possível entrar"
              description="E-mail ou senha incorretos. Verifique suas credenciais e tente novamente."
              variant="error"
            />

            <div className="mt-1 flex items-center justify-between gap-3 text-sm sm:flex-col sm:items-start">
              <Label className="inline-flex items-center gap-2 text-slate-700" htmlFor="keepConnected">
                <input className="h-4 w-4" id="keepConnected" type="checkbox" name="keepConnected" />
                Lembrar de mim
              </Label>
              <a className="font-bold text-teal-700 hover:underline" href="#" aria-label="Recuperar senha">
                Esqueci minha senha (fazer ainda)
              </a>
            </div>

            <div className="mt-1 grid gap-3">
              <Button type="submit">
                Entrar no portal
              </Button>
              <Button
                type="button"
                variant="link"
              >
                Solicitar suporte de acesso
              </Button>
            </div>
          </form>

        </section>
      </section>
    </AnimatedBackground>
    // Linha abaixo comentada caso queira remover o fundo animado
    // </main>
  )
}