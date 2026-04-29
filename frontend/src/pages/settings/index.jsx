import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [editMode, setEditMode] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')

  const [mostrarTrocarSenha, setMostrarTrocarSenha] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [fotoPreview, setFotoPreview] = useState(null)
  const [usuarioInfo, setUsuarioInfo] = useState(null)

  useEffect(() => {
    carregarUsuario()
  }, [])

  async function carregarUsuario() {
    try {
      const dados = await api.get('/api/auth/me')
      setUsuarioInfo(dados)
      setNome(dados.nome)
      setEmail(dados.email)

      if (dados.foto && dados.foto.length > 0) {
        const blob = new Blob([new Uint8Array(dados.foto)], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        setFotoPreview(url)
      }
    } catch (e) {
      console.error('Erro ao carregar usuário:', e)
    }
  }

  async function handleSalvarPerfil(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome.trim()) {
      setErro('Nome não pode estar vazio')
      return
    }

    if (!email.trim()) {
      setErro('Email não pode estar vazio')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErro('Email inválido')
      return
    }

    try {
      setLoading(true)
      const dados = await api.put('/api/auth/me', {
        nome: nome.trim(),
        email: email.trim(),
      })
      setUsuarioInfo(dados)
      setSucesso('Perfil atualizado com sucesso!')
      setEditMode(false)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  function handleCancelarEdicao() {
    setNome(usuarioInfo?.nome || '')
    setEmail(usuarioInfo?.email || '')
    setEditMode(false)
    setErro('')
  }

  async function handleTrocarSenha(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      setLoading(true)
      await api.put('/api/auth/trocar-senha', {
        senhaAtual,
        novaSenha,
      })
      setSucesso('Senha alterada com sucesso!')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      setMostrarTrocarSenha(false)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao trocar senha')
    } finally {
      setLoading(false)
    }
  }

  async function handleAtualizarFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setErro('')
    setSucesso('')

    if (!file.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem válido')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setErro('A imagem deve ter no máximo 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setFotoPreview(event.target.result)
    }
    reader.readAsDataURL(file)

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('foto', file)

      await api.put('/api/auth/me/foto', formData)
      setSucesso('Foto atualizada com sucesso!')
      await carregarUsuario()
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao atualizar foto')
      setFotoPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <LoadingOverlay visible={loading} />

      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="mt-0.5 text-sm text-slate-600">Gerencie sua conta e preferências</p>
        </header>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{erro}</p>
          </div>
        )}

        {sucesso && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{sucesso}</p>
          </div>
        )}

        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Perfil do Usuário</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Foto */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-slate-300 mb-4">
                {fotoPreview ? (
                  <img src={fotoPreview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400">Foto</span>
                )}
              </div>

              <input
                id="foto-input"
                type="file"
                accept="image/*"
                onChange={handleAtualizarFoto}
                className="hidden"
              />

              <label htmlFor="foto-input">
                <Button variant="outline" className="cursor-pointer">
                  Alterar Foto
                </Button>
              </label>

              <p className="text-xs text-slate-500 mt-2">JPG, PNG até 5MB</p>
            </div>

            {/* Infos */}
            <div className="grid gap-6">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
  Nome
</Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'bg-slate-100' : ''}
                />
              </div>

              <div>
               <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
  Email
</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'bg-slate-100' : ''}
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
  Tipo de acesso
</Label>
                <Input
                  value={usuarioInfo?.tipoAcesso || user?.role || ''}
                  disabled
                  className="bg-slate-100"
                />
              </div>

              {/* Botões principais */}
              <div className="flex gap-2 flex-wrap">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSalvarPerfil}>Salvar</Button>
                    <Button variant="outline" onClick={handleCancelarEdicao}>
                      Cancelar
                    </Button>
                  </>
                )}
              </div>

              {/* Botão trocar senha separado e verde */}
              <div>
                <Button onClick={() => setMostrarTrocarSenha(!mostrarTrocarSenha)}>
                  Trocar senha
                </Button>
              </div>

              {/* Form senha */}
              {mostrarTrocarSenha && (
                <form onSubmit={handleTrocarSenha} className="grid gap-4 mt-2 border-t pt-4">
                  <Input
                    type="password"
                    placeholder="Senha atual"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Salvar senha</Button>
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
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}