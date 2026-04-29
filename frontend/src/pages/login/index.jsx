import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import AnimatedBackground from '@/components/effects/AnimatedBackground'

export default function ConfiguracoesPage() {
  const [editMode, setEditMode] = useState(false)
  const [mostrarTrocarSenha, setMostrarTrocarSenha] = useState(false)

  const [nome, setNome] = useState('Seu Nome')
  const [email, setEmail] = useState('seu@email.com')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  function handleSalvarPerfil() {
    setEditMode(false)
  }

  function handleCancelarEdicao() {
    setEditMode(false)
  }

  function handleTrocarSenha(e) {
    e.preventDefault()
    setMostrarTrocarSenha(false)
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
  }

  return (
    <AnimatedBackground>
      <section className="grid w-full max-w-3xl mx-auto rounded-2xl border border-slate-400/30 shadow-2xl shadow-slate-950/60 backdrop-blur-xs bg-slate-50/95 p-6 sm:p-5 text-slate-900">

        <header className="mb-5">
          <h1 className="text-lg font-bold">Configurações da conta</h1>
          <p className="mt-2 text-slate-700">
            Gerencie suas informações pessoais e mantenha seu acesso seguro.
          </p>
        </header>

        <Card className="p-6">
          <CardHeader className="p-0 mb-5">
            <CardTitle className="text-base font-bold">
              Perfil
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 grid gap-4">

            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={nome}
                disabled={!editMode}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
              />
            </div>

            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input
                value={email}
                disabled={!editMode}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
              />
            </div>

            <div className="mt-2 grid gap-3">
              {!editMode ? (
                <Button onClick={() => setEditMode(true)}>
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button type="button" onClick={handleSalvarPerfil}>
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelarEdicao}
                  >
                    Cancelar
                  </Button>
                </div>
              )}

              {/* Botão verde abaixo */}
              <Button
                type="button"
                onClick={() => setMostrarTrocarSenha(!mostrarTrocarSenha)}
              >
                Trocar senha
              </Button>
            </div>

            {mostrarTrocarSenha && (
              <form onSubmit={handleTrocarSenha} className="grid gap-4 mt-2 border-t pt-4">

                <div className="grid gap-2">
                  <Label>Senha atual</Label>
                  <Input
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Nova senha</Label>
                  <Input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Confirmar nova senha</Label>
                  <Input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full rounded-[10px] border-slate-300 bg-white px-3 py-3 text-[0.96rem] focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-teal-400/30"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    Salvar senha
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarTrocarSenha(false)}
                  >
                    Cancelar
                  </Button>
                </div>

              </form>
            )}

          </CardContent>
        </Card>

      </section>
    </AnimatedBackground>
  )
}