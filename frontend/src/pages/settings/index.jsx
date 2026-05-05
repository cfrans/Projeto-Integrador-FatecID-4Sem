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
import { CogIcon } from '@heroicons/react/24/solid'

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

  const [usuariosSistema, setUsuariosSistema] = useState([])
  const [tiposAcesso, setTiposAcesso] = useState([])
  const [searchUsuario, setSearchUsuario] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [filtroRole, setFiltroRole] = useState('')

  const [confirmacaoRole, setConfirmacaoRole] = useState(null)

  useEffect(() => {
    carregarUsuario()
    if (user?.role === 'Admin') {
      carregarDadosAdmin()
    }
  }, [user?.role])

  useEffect(() => {
    setPaginaAtual(1)
  }, [searchUsuario])

  async function carregarDadosAdmin() {
    try {
      const [resUsuarios, resTipos] = await Promise.all([
        api.get('/api/auth/usuarios'),
        api.get('/api/auth/tipos-acesso')
      ])
      setUsuariosSistema(resUsuarios)
      setTiposAcesso(resTipos)
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

  const usuariosFiltrados = usuariosSistema.filter(u => {
    const termo = searchUsuario.toLowerCase()
    const matchesBusca = (u.nome && u.nome.toLowerCase().includes(termo)) || (u.email && u.email.toLowerCase().includes(termo))
    
    if (filtroRole && filtroRole !== 'todos') {
      return matchesBusca && u.tipoAcesso === filtroRole
    }
    return matchesBusca
  })

  const totalUsuarios = usuariosFiltrados.length
  const totalPaginas = Math.ceil(totalUsuarios / pageSize) || 1
  const paginados = usuariosFiltrados.slice((paginaAtual - 1) * pageSize, paginaAtual * pageSize)

  function solicitarAlteracaoRole(u, novoIdTipoAcesso) {
    const tipo = tiposAcesso.find(t => String(t.idTipoAcesso) === String(novoIdTipoAcesso))
    if (!tipo) return

    setConfirmacaoRole({
      usuario: u,
      novoIdTipoAcesso: novoIdTipoAcesso,
      nomeRole: tipo.tipoAcesso
    })
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coluna 1: Foto */}
            <Card className="p-6 flex flex-col items-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <input
                id="foto-input"
                type="file"
                accept="image/*"
                onChange={handleAtualizarFoto}
                className="hidden"
              />

              <label htmlFor="foto-input" className="w-full">
                <Button className="cursor-pointer w-full mb-4">
                  Alterar Foto
                </Button>
              </label>

              <div className="border-t border-slate-200 pt-4 w-full flex justify-center">
                <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-slate-300 mb-4">
                  {fotoPreview ? (
                    <img src={fotoPreview} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400">Foto</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2">JPG, PNG até 5MB</p>
            </Card>

            {/* Coluna 2: Informações e Editar Perfil */}
            <Card className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-6">
                {/* Botão editar perfil no topo */}
                <div>
                  {!editMode ? (
                    <Button onClick={() => setEditMode(true)} className="w-full">
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSalvarPerfil} className="flex-1">
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={handleCancelarEdicao} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-4">
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
              </div>
            </Card>

            {/* Coluna 3: Trocar Senha */}
            <Card className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-4">
                <Button className="w-full" type="button">
                  Trocar Senha
                </Button>

                <form onSubmit={handleTrocarSenha} className="grid gap-4 border-t pt-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Senha atual
                    </Label>
                    <Input
                      type="password"
                      placeholder="Senha atual"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nova senha
                    </Label>
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Confirmar nova senha
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirmar nova senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {user?.role === 'Admin' && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Gerenciamento de Usuários do Sistema</h2>
              <Card className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="mb-6">
                  <FilterBar
                    label="Filtrar"
                    isOpen={mostrarFiltros}
                    onToggle={() => setMostrarFiltros(!mostrarFiltros)}
                    isActive={(!!filtroRole && filtroRole !== 'todos') || searchUsuario.length > 0}
                    activeCount={((filtroRole && filtroRole !== 'todos') ? 1 : 0) + (searchUsuario.length > 0 ? 1 : 0)}
                    onClear={() => { setFiltroRole('todos'); setSearchUsuario(''); setMostrarFiltros(false); setPaginaAtual(1); }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 w-full items-end">
                      <div className="flex-1 w-full">
                        <Label className="text-xs text-slate-500 mb-1.5 block font-semibold">Pesquisar</Label>
                        <Input
                          placeholder="Nome ou e-mail..."
                          value={searchUsuario}
                          onChange={(e) => setSearchUsuario(e.target.value)}
                        />
                      </div>
                      <div className="w-full sm:w-64">
                        <Label className="text-xs text-slate-500 mb-1.5 block font-semibold">Tipo de Acesso</Label>
                        <Select value={filtroRole || 'todos'} onValueChange={(val) => { setFiltroRole(val); setPaginaAtual(1); }}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Todos os papéis">
                              {filtroRole === 'todos' || !filtroRole ? 'Todos os papéis' : filtroRole}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos os papéis</SelectItem>
                            {tiposAcesso.map(t => (
                              <SelectItem key={t.idTipoAcesso} value={t.tipoAcesso}>
                                {t.tipoAcesso}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </FilterBar>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">E-mail</th>
                        <th className="px-4 py-3">Acesso</th>
                        <th className="px-4 py-3">Último Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginados.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                            Nenhum usuário encontrado.
                          </td>
                        </tr>
                      ) : (
                        paginados.map((u) => {
                          const tipoAtual = tiposAcesso.find(t => t.tipoAcesso === u.tipoAcesso)
                          const idTipoAtual = tipoAtual ? String(tipoAtual.idTipoAcesso) : ""

                          return (
                            <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-medium text-slate-900">{u.nome}</td>
                              <td className="px-4 py-3">{u.email}</td>
                              <td className="px-4 py-3">
                                <Select
                                  value={idTipoAtual}
                                  onValueChange={(val) => solicitarAlteracaoRole(u, val)}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecione...">
                                      {tipoAtual ? tipoAtual.tipoAcesso : "Selecione..."}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tiposAcesso.map(t => (
                                      <SelectItem key={t.idTipoAcesso} value={String(t.idTipoAcesso)}>
                                        {t.tipoAcesso}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-3">
                                {u.primeiroAcesso || !u.ultimoLogin ? (
                                  <span className="text-slate-400 italic">Nunca acessou</span>
                                ) : (
                                  new Date(u.ultimoLogin).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <PaginationBar
                  inicio={(paginaAtual - 1) * pageSize}
                  fim={paginaAtual * pageSize}
                  total={totalUsuarios}
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  pageSize={pageSize}
                  setPage={setPaginaAtual}
                  setPageSize={setPageSize}
                  borderTop
                />
              </Card>
            </div>
          )}

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