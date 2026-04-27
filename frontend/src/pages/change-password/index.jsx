import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoHorizontal } from '@/components/branding/LogoHorizontal'
import { useAuth } from '../../contexts/AuthContext'
import AnimatedBackground from '@/components/effects/AnimatedBackground'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [erro, setErro] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const novaSenha = formData.get('novaSenha')
    const confirmar = formData.get('confirmar')

    if (novaSenha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    const res = await fetch('http://localhost:8080/api/auth/trocar-senha', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        senhaAtual: formData.get('senhaAtual'),
        novaSenha,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.erro || 'Erro ao trocar senha.')
      return
    }

    navigate('/admin')
  }

  return (
    <AnimatedBackground>
      <section className="grid w-full max-w-md overflow-hidden rounded-2xl border border-slate-400/30 shadow-2xl shadow-slate-950/60 backdrop-blur-xs">
        <div className="grid content-center bg-slate-50/95 p-8 text-slate-900">
          <div className="mb-6 flex justify-center">
            <LogoHorizontal className="w-140" variant="white"/>
          </div>
          <header className="mb-5">
            <h1 className="text-lg font-bold">Troque sua senha</h1>
            <p className="mt-2 text-slate-700">Este é seu primeiro acesso. Defina uma nova senha para continuar.</p>
          </header>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="senhaAtual">Senha atual</Label>
              <Input id="senhaAtual" type="password" name="senhaAtual" minLength={5} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="novaSenha">Nova senha</Label>
              <Input id="novaSenha" type="password" name="novaSenha" minLength={6} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmar">Confirmar nova senha</Label>
              <Input id="confirmar" type="password" name="confirmar" minLength={6} required />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <Button type="submit" className="mt-2">Salvar nova senha</Button>
          </form>
        </div>
      </section>
    </AnimatedBackground>
  )
}