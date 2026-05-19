import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { FilterBar } from '@/components/ui/FilterBar'
import Modal from '@/components/ui/modal'
import { CogIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [usuarioInfo, setUsuarioInfo] = useState(null)

  const [confirmacaoRole, setConfirmacaoRole] = useState(null)

  const [pergunta1, setPergunta1] = useState('')
  const [resposta1, setResposta1] = useState('')
  const [pergunta2, setPergunta2] = useState('')
  const [resposta2, setResposta2] = useState('')

  useEffect(() => {
    carregarUsuario()
    if (user?.role === 'Admin') {
      carregarDadosAdmin()
    }
  }, [user?.role])

  async function carregarDadosAdmin() {
    try {
      await Promise.all([
        api.get('/api/auth/usuarios'),
        api.get('/api/auth/tipos-acesso')
      ])
    } catch (e) {
      console.error('Erro ao carregar dados admin:', e)
    }
  }

  async function handleAlterarRole(idUsuario, idTipoAcesso) {
    if (!idTipoAcesso) return
    try {
      setLoading(true)
      await api.put(`/api/auth/usuarios/${idUsuario}/role`, { idTipoAcesso: Number(idTipoAcesso) })
      setSucesso('Acesso do usuário atualizado com sucesso!')
      await carregarDadosAdmin()
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao alterar acesso')
    } finally {
      setLoading(false)
    }
  }

  async function confirmarAlteracaoRole() {
    if (!confirmacaoRole) return
    const { usuario, novoIdTipoAcesso } = confirmacaoRole
    
    setConfirmacaoRole(null)
    await handleAlterarRole(usuario.id, novoIdTipoAcesso)
  }

  async function carregarUsuario() {
    try {
      const dados = await api.get('/api/auth/me')
      setUsuarioInfo(dados)
      setNome(dados.nome)
      setEmail(dados.email)
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
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  function handleCancelarEdicao() {
    setNome(usuarioInfo?.nome || '')
    setEmail(usuarioInfo?.email || '')
    setErro('')
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <LoadingOverlay visible={loading} />

      <header className="flex items-center gap-3 mb-6">
        <div className="settings-badge flex items-center justify-center size-12 rounded-xl bg-slate-800 shrink-0 cursor-default shadow-sm">
          <CogIcon className="settings-icon size-9 text-white transition-transform duration-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie sua conta e preferências</p>
        </div>
      </header>

      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-6">
                <div>
                  <p className="text-sm text-slate-700 mb-4">
                    Selecione duas perguntas de segurança a seguir. Elas ajudarão a verificar sua identidade caso você esqueça sua senha.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Pergunta de Segurança 1
                    </Label>
                    <Select value={pergunta1} onValueChange={setPergunta1}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione uma pergunta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Em que cidade você conheceu seu primeiro cônjuge/parceiro?">Em que cidade você conheceu seu primeiro cônjuge/parceiro?</SelectItem>
                        <SelectItem value="Qual é o nome do meio da sua mãe?">Qual é o nome do meio da sua mãe?</SelectItem>
                        <SelectItem value="Qual é o nome da primeira escola que frequentou?">Qual é o nome da primeira escola que frequentou?</SelectItem>
                        <SelectItem value="Qual foi seu apelido na infância?">Qual foi seu apelido na infância?</SelectItem>
                        <SelectItem value="Em que país você nasceu?">Em que país você nasceu?</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Resposta 1
                    </Label>
                    <Input
                      value={resposta1}
                      onChange={(e) => setResposta1(e.target.value)}
                      placeholder="Digite sua resposta"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Pergunta de Segurança 2
                    </Label>
                    <Select value={pergunta2} onValueChange={setPergunta2}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione uma pergunta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Qual é o nome do seu primeiro animal de estimação?">Qual é o nome do seu primeiro animal de estimação?</SelectItem>
                        <SelectItem value="Qual é o nome do seu tio favorito?">Qual é o nome do seu tio favorito?</SelectItem>
                        <SelectItem value="Qual é o nome do seu primo mais velho?">Qual é o nome do seu primo mais velho?</SelectItem>
                        <SelectItem value="Qual é o nome do seu filho mais novo?">Qual é o nome do seu filho mais novo?</SelectItem>
                        <SelectItem value="Onde você passou sua lua-de-mel?">Onde você passou sua lua-de-mel?</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Resposta 2
                    </Label>
                    <Input
                      value={resposta2}
                      onChange={(e) => setResposta2(e.target.value)}
                      placeholder="Digite sua resposta"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 grid gap-4">
                  <p className="text-sm text-slate-700">Se desejar, troque sua senha aqui.</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Senha atual
                      </Label>
                      <Input
                        type="password"
                        placeholder=""
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Nova senha
                      </Label>
                      <Input
                        type="password"
                        placeholder=""
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Confirmar nova senha
                      </Label>
                      <Input
                        type="password"
                        placeholder=""
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button type="button" variant="secondary" size="sm" onClick={handleCancelarEdicao} className="h-10 px-4">
              <XMarkIcon className="size-4 mr-2" /> Cancelar
            </Button>
            <Button type="button" size="sm" onClick={handleSalvarPerfil} className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
              <CheckIcon className="size-4 mr-2" /> Salvar Alterações
            </Button>
          </div>

        <Modal
        open={!!confirmacaoRole}
        onClose={() => setConfirmacaoRole(null)}
        title="Alterar permissão de acesso"
        description={`Tem certeza que deseja alterar o acesso de ${confirmacaoRole?.usuario?.nome} para ${confirmacaoRole?.nomeRole}?`}
        variant="warning"
        confirm
        confirmLabel="Sim, alterar acesso"
        onConfirm={confirmarAlteracaoRole}
      />

      <Modal
        open={!!sucesso}
        onClose={() => setSucesso('')}
        title="Sucesso!"
        description={sucesso}
        variant="success"
      />
    </div>
  )
}