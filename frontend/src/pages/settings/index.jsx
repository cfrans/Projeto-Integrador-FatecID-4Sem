import { useState, useEffect } from 'react'
import { api, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Modal from '@/components/ui/modal'
import { CogIcon, CheckIcon, KeyIcon } from '@heroicons/react/24/solid'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [perguntas, setPerguntas] = useState([])
  const [idPergunta1, setIdPergunta1] = useState('')
  const [resposta1, setResposta1] = useState('')
  const [idPergunta2, setIdPergunta2] = useState('')
  const [resposta2, setResposta2] = useState('')

  // Carga inicial: perguntas disponiveis + perguntas atuais do usuario.
  useEffect(() => {
    api.get('/api/auth/perguntas-seguranca').then(setPerguntas).catch(() => setPerguntas([]))
    api.get('/api/auth/me')
      .then((dados) => {
        if (dados.idPergunta1) setIdPergunta1(String(dados.idPergunta1))
        if (dados.idPergunta2) setIdPergunta2(String(dados.idPergunta2))
      })
      .catch(() => {})
  }, [])

  const perguntasGrupo1 = perguntas.filter((p) => p.grupo === 1)
  const perguntasGrupo2 = perguntas.filter((p) => p.grupo === 2)

  function nomePergunta(id) {
    return perguntas.find((p) => String(p.idPergunta) === String(id))?.texto ?? 'Selecione uma pergunta'
  }

  async function handleSalvarPerguntas() {
    setErro('')
    setSucesso('')

    if (!idPergunta1 || !idPergunta2) {
      setErro('Selecione as duas perguntas de segurança')
      return
    }
    if (!resposta1.trim() || !resposta2.trim()) {
      setErro('Preencha as duas respostas')
      return
    }

    try {
      setLoading(true)
      await api.put('/api/auth/me/perguntas-seguranca', {
        idPergunta1: Number(idPergunta1),
        resposta1: resposta1.trim(),
        idPergunta2: Number(idPergunta2),
        resposta2: resposta2.trim(),
      })
      setResposta1('')
      setResposta2('')
      setSucesso('Perguntas de segurança salvas com sucesso!')
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao salvar perguntas')
    } finally {
      setLoading(false)
    }
  }

  async function handleTrocarSenha() {
    setErro('')
    setSucesso('')

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro('Preencha todos os campos da senha')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setErro('A nova senha e a confirmação não coincidem')
      return
    }
    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      setLoading(true)
      await api.put('/api/auth/trocar-senha', { senhaAtual, novaSenha })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      setSucesso('Senha alterada com sucesso!')
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao trocar senha')
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

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6">
            <div>
              <h2 className="text-base font-semibold text-slate-800 mb-1">Perguntas de segurança</h2>
              <p className="text-sm text-slate-600">
                Selecione duas perguntas a seguir. Elas ajudarão a verificar sua identidade caso você esqueça sua senha. As respostas não são sensíveis a maiúsculas/minúsculas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pergunta de Segurança 1
                </Label>
                <Select value={idPergunta1} onValueChange={setIdPergunta1}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione uma pergunta">
                      {idPergunta1 ? nomePergunta(idPergunta1) : 'Selecione uma pergunta'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {perguntasGrupo1.map((p) => (
                      <SelectItem key={p.idPergunta} value={String(p.idPergunta)}>{p.texto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pergunta de Segurança 2
                </Label>
                <Select value={idPergunta2} onValueChange={setIdPergunta2}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione uma pergunta">
                      {idPergunta2 ? nomePergunta(idPergunta2) : 'Selecione uma pergunta'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {perguntasGrupo2.map((p) => (
                      <SelectItem key={p.idPergunta} value={String(p.idPergunta)}>{p.texto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
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

            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={handleSalvarPerguntas} className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
                <CheckIcon className="size-4 mr-2" /> Salvar perguntas
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6">
            <div>
              <h2 className="text-base font-semibold text-slate-800 mb-1">Trocar senha</h2>
              <p className="text-sm text-slate-600">Defina uma nova senha de no mínimo 6 caracteres.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Senha atual
                </Label>
                <Input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nova senha
                </Label>
                <Input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Confirmar nova senha
                </Label>
                <Input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={handleTrocarSenha} className="h-10 px-6 bg-slate-800 hover:bg-slate-900 text-white">
                <KeyIcon className="size-4 mr-2" /> Trocar senha
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        open={!!sucesso}
        onClose={() => setSucesso('')}
        title="Sucesso!"
        description={sucesso}
        variant="success"
      />
      <Modal
        open={!!erro}
        onClose={() => setErro('')}
        title="Erro"
        description={erro}
        variant="error"
      />
    </div>
  )
}