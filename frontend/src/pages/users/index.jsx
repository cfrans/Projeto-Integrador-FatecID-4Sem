import { useState, useEffect, useCallback } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  PlusIcon,
  PencilIcon,
  XCircleIcon,
  UserIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import peixeHappy from "@/assets/peixe-icons/peixe-icon-happy.png";
import peixeDuvidoso from "@/assets/peixe-icons/peixe-icon-duvidoso.png";
import peixeSurpreso from "@/assets/peixe-icons/peixe-icon-surpreso.png";
import { FilterBar } from "@/components/ui/FilterBar";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { InfoHint } from "@/components/ui/InfoHint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { PaginationBar } from "@/components/ui/PaginationBar";

// ── Ícones ────────────────────────────────────────────────────────────────────
function IconSortAsc() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5 inline ml-1">
      <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
    </svg>
  );
}
function IconSortDesc() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5 inline ml-1">
      <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
    </svg>
  );
}
function IconSortNone() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5 inline ml-1 opacity-30">
      <path fillRule="evenodd" d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02L7.33 3.18a.75.75 0 0 0-1.1 0L3.7 5.74a.75.75 0 0 0 .04 1.06Zm9.96 6.4a.75.75 0 0 1-1.06.04l-1.95-2.1v-8.59a.75.75 0 0 1 1.5 0v8.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-2.54 2.56Z" clipRule="evenodd" />
    </svg>
  );
}


// ── Helpers ───────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
        checked ? "bg-teal-600 border-teal-600" : "border-slate-400 bg-white hover:border-teal-500"
      }`}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white stroke-[3]" />}
    </button>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <IconSortNone />;
  return sortDir === "asc" ? <IconSortAsc /> : <IconSortDesc />;
}

function classeBadgePontuacao(pts) {
  if (pts >= 700) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (pts >= 300) return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-rose-50 text-rose-700 border border-rose-200";
}

// ── Add/Edit Modal Form ───────────────────────────────────────────────────────
const EMPTY_FORM = { matricula: "", nome: "", email: "", idSetor: "", idTipoAcesso: "2" };

function UserFormModal({ open, onClose, onSave, editingUser, setores, tiposAcesso }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sincroniza o form com o usuario que esta sendo editado quando o modal abre.
  useEffect(() => {
    if (editingUser) {
      const tipo = tiposAcesso.find(t => t.tipoAcesso === editingUser.tipoAcesso);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        matricula: String(editingUser.matricula),
        nome: editingUser.nome,
        email: editingUser.email,
        idSetor: String(editingUser.idSetor),
        idTipoAcesso: tipo ? String(tipo.idTipoAcesso) : "2",
      });
    } else {
      setForm(EMPTY_FORM);
      setErrorMsg("");
    }
  }, [open, editingUser, tiposAcesso]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: typeof e === "string" ? e : e.target.value }));

  const handleSubmit = () => {
    if (!form.matricula || !form.nome || !form.email || !form.idSetor || !form.idTipoAcesso) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }
    setErrorMsg("");
    
    const formData = {
      ...form,
      matricula: Number(form.matricula),
      idSetor: Number(form.idSetor),
      idTipoAcesso: Number(form.idTipoAcesso)
    };

    onSave(formData);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onKeyDown={handleKeyDown}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transition-all duration-200 ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            {editingUser && <PencilIcon className="w-4 h-4 text-slate-400" />}
            <h2 className="text-lg font-semibold text-slate-800">
              {editingUser ? "Editar Usuário" : "Cadastro de Usuário"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-sm font-medium text-slate-700">
                Matrícula
                <InfoHint text="Número de matrícula ou registro funcional único do colaborador. Serve para identificá-lo na empresa." />
              </FieldLabel>
              <Input value={form.matricula} onChange={set("matricula")} type="number" className="h-10 bg-slate-100 border-slate-200 rounded-lg" />
            </Field>
            <Field>
              <FieldLabel className="text-sm font-medium text-slate-700">Setor</FieldLabel>
              <Select value={form.idSetor} onValueChange={(v) => setForm((f) => ({ ...f, idSetor: v }))}>
                <SelectTrigger className="h-10 bg-slate-100 border-slate-200 rounded-lg">
                  <SelectValue placeholder="Selecione">
                    {form.idSetor ? (setores.find((s) => String(s.idSetor) === String(form.idSetor))?.nomeSetor ?? "Selecione") : "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {setores.map((s) => (
                    <SelectItem key={s.idSetor} value={String(s.idSetor)}>{s.nomeSetor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">Nome</FieldLabel>
            <Input value={form.nome} onChange={set("nome")} className="h-10 bg-slate-100 border-slate-200 rounded-lg" />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">E-mail</FieldLabel>
            <Input value={form.email} onChange={set("email")} type="email" className="h-10 bg-slate-100 border-slate-200 rounded-lg" />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">
              Papel / Tipo de Usuário
              <InfoHint text="Define as permissões no sistema. Admin gerencia campanhas, modelos e usuários; Colaborador apenas participa das simulações e treinamentos." />
            </FieldLabel>
            <Select value={form.idTipoAcesso} onValueChange={(v) => setForm((f) => ({ ...f, idTipoAcesso: v }))}>
              <SelectTrigger className="h-10 bg-slate-100 border-slate-200 rounded-lg">
                <SelectValue placeholder="Selecione">
                  {form.idTipoAcesso ? (tiposAcesso.find((t) => String(t.idTipoAcesso) === String(form.idTipoAcesso))?.tipoAcesso ?? "Selecione") : "Selecione"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tiposAcesso.map((t) => (
                  <SelectItem key={t.idTipoAcesso} value={String(t.idTipoAcesso)}>{t.tipoAcesso}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {errorMsg && (
            <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 text-center">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
            <Button
              size="sm"
              disabled={saving}
              variant="outline"
              className="h-9 px-4 text-xs font-bold tracking-wide rounded-lg border-slate-300 text-slate-600 hover:bg-slate-50"
              onClick={onClose}
            >
              CANCELAR
            </Button>
            <Button
              size="sm"
              disabled={saving}
              className="h-9 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold tracking-wide rounded-lg"
              onClick={handleSubmit}
            >
              {editingUser ? "ALTERAR" : "SALVAR"}
            </Button>
          </div>
        </div>
      </div>
  );
}

// ── Import Modal ──────────────────────────────────────────────────────────────
function ImportModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fishImage = errorMsg
    ? peixeSurpreso
    : result
      ? result.criados === 0
        ? peixeSurpreso
        : result.erros?.length > 0
          ? peixeDuvidoso
          : peixeHappy
      : null;

  useEffect(() => {
    if (open) {
      setFile(null);
      setImporting(false);
      setResult(null);
      setErrorMsg("");
    }
  }, [open]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f && !f.name.toLowerCase().endsWith(".csv")) {
      setErrorMsg("O arquivo deve ter extensão .csv");
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(f || null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setImporting(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/api/usuarios-destino/importar", formData);
      setResult(res);
      onImported?.();
    } catch (err) {
      setErrorMsg(err?.message || "Erro ao importar arquivo.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transition-all duration-200 ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-slate-800">Importar Usuários</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 grid gap-4 max-h-[70vh] overflow-y-auto">
          {result || errorMsg ? (
            <div className="grid gap-3">
              <div className="flex flex-col items-center gap-1 pt-2 pb-1">
                <img src={fishImage} alt="" className="h-18 w-auto" />
              </div>
              {errorMsg ? (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
                  <p className="text-sm font-semibold text-red-700">{errorMsg}</p>
                </div>
              ) : (
                <>
                  <div className="rounded-lg bg-teal-50 border border-teal-200 p-4 text-center">
                    <p className="text-sm text-teal-700">
                      <span className="text-2xl font-bold block">{result.criados}</span>
                      usuário(s) importado(s) com sucesso
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                      <p className="text-xs text-slate-500">Total no arquivo</p>
                      <p className="text-lg font-bold text-slate-700">{result.total}</p>
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-center">
                      <p className="text-xs text-yellow-700">Ignorados (duplicados)</p>
                      <p className="text-lg font-bold text-yellow-800">{result.ignorados}</p>
                    </div>
                  </div>
                  {result.erros?.length > 0 && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                      <p className="text-xs font-semibold text-red-700 mb-2">{result.erros.length} erro(s):</p>
                      <ul className="text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
                        {result.erros.map((e, i) => (
                          <li key={i} className="font-mono">• {e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 leading-relaxed">
                <p className="mb-2">
                  <strong>Formato esperado:</strong> arquivo <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">.csv</code> em UTF-8, com separador <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">,</code> ou <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">;</code>
                </p>
                <p className="mb-2">
                  <strong>Colunas obrigatórias</strong> (cabeçalho na primeira linha):
                </p>
                <ul className="ml-4 list-disc text-xs space-y-0.5">
                  <li><code className="font-bold">matricula</code> — número inteiro único</li>
                  <li><code className="font-bold">nome</code> — nome completo</li>
                  <li><code className="font-bold">email</code> — e-mail único</li>
                  <li><code className="font-bold">setor</code> — nome do setor (deve existir no sistema)</li>
                </ul>
                <p className="mt-2 text-xs">A senha inicial é a própria matrícula. Linhas com matrícula ou e-mail já cadastrados são ignoradas.</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 overflow-x-auto">
                <p className="text-slate-400 mb-1">Exemplo:</p>
                <pre>matricula,nome,email,setor{"\n"}12345,João Silva,joao@empresa.com,TI{"\n"}67890,Maria Souza,maria@empresa.com,RH</pre>
              </div>

              <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50 cursor-pointer p-6 transition-colors">
                <DocumentTextIcon className="w-8 h-8 text-slate-400" />
                {file ? (
                  <span className="text-sm font-medium text-teal-700">{file.name}</span>
                ) : (
                  <span className="text-sm text-slate-500">Clique para selecionar um arquivo .csv</span>
                )}
                <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
              </label>

              {errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
          {result || errorMsg ? (
            <Button
              size="sm"
              className="h-9 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold tracking-wide rounded-lg"
              onClick={onClose}
            >
              CONCLUIR
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={importing}
                className="h-9 px-4 text-xs font-bold tracking-wide rounded-lg border-slate-300 text-slate-600 hover:bg-slate-50"
                onClick={onClose}
              >
                CANCELAR
              </Button>
              <Button
                size="sm"
                disabled={!file || importing}
                className="h-9 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold tracking-wide rounded-lg disabled:opacity-50"
                onClick={handleSubmit}
              >
                {importing ? "IMPORTANDO..." : "ENVIAR"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const PAGE_SIZE_DEFAULT = 15;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [setores, setSetores] = useState([]);
  const [tiposAcesso, setTiposAcesso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [parent] = useAutoAnimate();

  const [filterNome, setFilterNome] = useState("");
  const [filterSetor, setFilterSetor] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterAtivo, setFilterAtivo] = useState("ativos");

  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState({ open: false, id: null, bulk: false, type: 'desativar' });
  const [confirmSave, setConfirmSave] = useState({ open: false, formData: null, isRoleChange: false, roleName: "" });
  const [feedback, setFeedback] = useState({ open: false, title: "", description: "", variant: "success" });

  const showFeedback = (title, description, variant = "success") =>
    setFeedback({ open: true, title, description, variant });

  const loadUsers = useCallback(() => {
    setLoading(true);
    api.get("/api/usuarios-destino")
      .then(setUsers)
      .catch(() => showFeedback("Erro", "Não foi possível carregar os usuários.", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Carga inicial dos dados auxiliares e da lista de usuarios.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
    api.get("/api/setores").then(setSetores).catch(() => {});
    api.get("/api/auth/tipos-acesso").then(setTiposAcesso).catch(() => {});
  }, [loadUsers]);

  // ── Filtro ──
  const filtered = users.filter((u) => {
    const nomeMatch = u.nome.toLowerCase().includes(filterNome.toLowerCase()) ||
      u.email.toLowerCase().includes(filterNome.toLowerCase());
    const setorMatch = !filterSetor || String(u.idSetor) === filterSetor;
    const roleMatch = !filterRole || filterRole === "todos" || u.tipoAcesso === filterRole;
    const ativoMatch = filterAtivo === "todos" || (filterAtivo === "ativos" ? u.isAtivo : !u.isAtivo);
    return nomeMatch && setorMatch && roleMatch && ativoMatch;
  });

  // ── Ordenação ──
  const SORT_KEYS = {
    Matrícula: "matricula",
    Nome: "nome",
    Setor: "nomeSetor",
    "E-mail": "email",
    Pontuação: "pontuacao",
    "Último Login": "ultimoLogin",
  };

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const key = SORT_KEYS[sortCol];
        const va = a[key] ?? null;
        const vb = b[key] ?? null;
        // Nulos (nunca acessou) sempre vão para o fim, independente da direção
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;
        // Comparação por tipo
        let cmp;
        if (key === "ultimoLogin") {
          cmp = new Date(va) - new Date(vb);
        } else if (typeof va === "number") {
          cmp = va - vb;
        } else {
          cmp = String(va).localeCompare(String(vb), "pt-BR");
        }
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const handleSort = (col) => {
    if (!SORT_KEYS[col]) return;
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
    setPaginaAtual(1);
  };

  // ── Paginação ──
  const total = sorted.length;
  const totalPaginas = Math.max(1, Math.ceil(total / pageSize));
  const inicio = (paginaAtual - 1) * pageSize;
  const fim = inicio + pageSize;
  const pagina = sorted.slice(inicio, fim);

  const clearFilters = () => { setFilterNome(""); setFilterSetor(""); setFilterRole(""); setFilterAtivo("ativos"); setPaginaAtual(1); };
  const hasActiveFilters = filterNome || filterSetor || (filterRole && filterRole !== "todos") || filterAtivo !== "ativos";

  const selectedUsersData = selected.map(id => users.find(u => u.idUsuarioDestino === id)).filter(Boolean);
  const allSelectedInactive = selectedUsersData.length > 0 && selectedUsersData.every(u => !u.isAtivo);

  const toggleSelect = (id) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === pagina.length ? [] : pagina.map((u) => u.idUsuarioDestino));

  // ── CRUD ──
  const handleSave = async (formData) => {
    if (formModal.user) {
      // Editando: checar o que mudou
      const tipoOriginal = tiposAcesso.find(t => t.tipoAcesso === formModal.user.tipoAcesso);
      const idTipoOriginal = tipoOriginal ? Number(tipoOriginal.idTipoAcesso) : 2;
      
      const roleChanged = formData.idTipoAcesso !== idTipoOriginal;
      const otherChanged = formData.matricula !== formModal.user.matricula ||
                           formData.nome !== formModal.user.nome ||
                           formData.email !== formModal.user.email ||
                           formData.idSetor !== formModal.user.idSetor;

      if (roleChanged) {
        const novoTipo = tiposAcesso.find(t => Number(t.idTipoAcesso) === formData.idTipoAcesso);
        setConfirmSave({ 
          open: true, 
          formData, 
          isRoleChange: true, 
          roleName: novoTipo?.tipoAcesso || "" 
        });
      } else if (otherChanged) {
        setConfirmSave({ 
          open: true, 
          formData, 
          isRoleChange: false, 
          roleName: "" 
        });
      } else {
        setFormModal({ open: false, user: null }); // Nada mudou
      }
    } else {
      // Novo usuário: salva direto
      realSave(formData);
    }
  };

  const realSave = async (formData) => {
    setConfirmSave({ open: false, formData: null, isRoleChange: false, roleName: "" });
    try {
      if (formModal.user) {
        const updated = await api.put(`/api/usuarios-destino/${formModal.user.idUsuarioDestino}`, formData);
        setUsers((us) => us.map((u) => u.idUsuarioDestino === updated.idUsuarioDestino ? updated : u));
        showFeedback("Usuário atualizado", "As alterações foram salvas com sucesso.");
      } else {
        const created = await api.post("/api/usuarios-destino", formData);
        setUsers((us) => [...us, created]);
        showFeedback("Usuário cadastrado", "O novo usuário foi adicionado com sucesso.");
      }
      setFormModal({ open: false, user: null });
    } catch (err) {
      showFeedback("Erro", err.message || "Não foi possível salvar o usuário.", "error");
    }
  };

  const confirmAction = async () => {
    const { id, bulk, type } = actionModal;
    setActionModal({ open: false, id: null, bulk: false, type: 'desativar' });
    try {
      if (type === 'reativar') {
        if (bulk) {
          await Promise.all(selected.map((sid) => api.put(`/api/usuarios-destino/${sid}/reativar`)));
          setUsers((us) => us.map((u) => selected.includes(u.idUsuarioDestino) ? { ...u, isAtivo: true } : u));
          setSelected([]);
          showFeedback("Usuários reativados", `${selected.length} usuário(s) reativado(s) com sucesso.`);
        } else {
          await api.put(`/api/usuarios-destino/${id}/reativar`);
          setUsers((us) => us.map((u) => u.idUsuarioDestino === id ? { ...u, isAtivo: true } : u));
          showFeedback("Usuário reativado", "O usuário foi reativado com sucesso.");
        }
      } else {
        if (bulk) {
          await Promise.all(selected.map((sid) => api.delete(`/api/usuarios-destino/${sid}`)));
          setUsers((us) => us.map((u) => selected.includes(u.idUsuarioDestino) ? { ...u, isAtivo: false } : u));
          setSelected([]);
          showFeedback("Usuários desativados", `${selected.length} usuário(s) desativado(s) com sucesso.`);
        } else {
          await api.delete(`/api/usuarios-destino/${id}`);
          setUsers((us) => us.map((u) => u.idUsuarioDestino === id ? { ...u, isAtivo: false } : u));
          setSelected((s) => s.filter((x) => x !== id));
          showFeedback("Usuário desativado", "O usuário foi desativado com sucesso.");
        }
      }
    } catch (err) {
      showFeedback("Erro", err.message || `Não foi possível ${type} o(s) usuário(s).`, "error");
    }
  };

  const handleReactivate = async (id) => {
    setActionModal({ open: true, id, bulk: false, type: 'reativar' });
  };

  const COLUNAS = ["Matrícula", "Nome", "Setor", "E-mail", "Pontuação", "Último Login", "Ações"];

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <UserFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, user: null })}
        onSave={handleSave}
        editingUser={formModal.user}
        setores={setores}
        tiposAcesso={tiposAcesso}
      />
      <ImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImported={loadUsers}
      />

      {/* Modais de confirmação e feedback (devem vir por último para sobrepor outros modais se necessário) */}
      <Modal open={feedback.open} onClose={() => setFeedback((f) => ({ ...f, open: false }))} title={feedback.title} description={feedback.description} variant={feedback.variant} />
      <Modal
        open={actionModal.open}
        onClose={() => setActionModal({ open: false, id: null, bulk: false, type: 'desativar' })}
        title={actionModal.type === 'reativar' 
          ? (actionModal.bulk ? "Reativar usuários selecionados?" : "Reativar usuário?") 
          : (actionModal.bulk ? "Desativar usuários selecionados?" : "Desativar usuário?")}
        description={actionModal.type === 'reativar'
          ? (actionModal.bulk ? `Tem certeza que deseja reativar ${selected.length} usuário(s)? Eles voltarão a receber envios de campanhas.` : "Tem certeza que deseja reativar este usuário? Ele voltará a receber envios de campanhas.")
          : (actionModal.bulk ? `Tem certeza que deseja desativar ${selected.length} usuário(s)? Eles não poderão receber novos envios de campanhas.` : "Tem certeza que deseja desativar este usuário? Ele não poderá receber novos envios de campanhas.")}
        variant={actionModal.type === 'reativar' ? 'success' : 'warning'} confirm confirmLabel={`Sim, ${actionModal.type}`} onConfirm={confirmAction}
      />
      <Modal
        open={confirmSave.open}
        onClose={() => setConfirmSave({ open: false, formData: null, isRoleChange: false, roleName: "" })}
        title={confirmSave.isRoleChange ? "Alterar permissão de acesso" : "Salvar alterações?"}
        description={confirmSave.isRoleChange 
          ? `Tem certeza que deseja alterar o acesso de ${formModal.user?.nome} para ${confirmSave.roleName}?`
          : "Tem certeza que deseja salvar as alterações realizadas no perfil do usuário?"
        }
        variant="warning"
        confirm
        confirmLabel={confirmSave.isRoleChange ? "Sim, alterar acesso" : "Sim, salvar"}
        onConfirm={() => realSave(confirmSave.formData)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="user-badge flex items-center justify-center size-12 rounded-xl bg-teal-800 shrink-0 cursor-default">
            <UserIcon className="user-icon size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Usuários destino</h1>
            <p className="mt-1 text-sm text-slate-600">Gerencie os colaboradores alvos das campanhas de phishing.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selected.length > 0 && (
            allSelectedInactive ? (
              <Button size="sm" variant="outline" className="h-9 px-4 border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors" onClick={() => setActionModal({ open: true, id: null, bulk: true, type: 'reativar' })}>
                <CheckIcon className="w-4 h-4 mr-1.5 stroke-[3]" />
                Reativar ({selected.length})
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 transition-colors" onClick={() => setActionModal({ open: true, id: null, bulk: true, type: 'desativar' })}>
                <XCircleIcon className="w-4 h-4 mr-1.5" />
                Desativar ({selected.length})
              </Button>
            )
          )}
          <Button size="sm" className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setFormModal({ open: true, user: null })}>
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Adicionar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 px-4 gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setImportModalOpen(true)}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Importar
          </Button>
        </div>
      </div>

      <FilterBar
        label="Filtrar usuários"
        isOpen={filterOpen}
        onToggle={() => setFilterOpen((v) => !v)}
        isActive={hasActiveFilters}
        activeCount={[filterNome, filterSetor, (filterRole && filterRole !== "todos"), (filterAtivo !== "ativos")].filter(Boolean).length}
        onClear={clearFilters}
      >
        <Field className="w-auto flex-1 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Nome ou e-mail</FieldLabel>
          <Input value={filterNome} onChange={(e) => { setFilterNome(e.target.value); setPaginaAtual(1); }} placeholder="Buscar..." className="h-9 w-full" />
        </Field>
        <Field className="w-auto shrink-0 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Setor</FieldLabel>
          <Select value={filterSetor} onValueChange={(v) => { setFilterSetor(v); setPaginaAtual(1); }}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos">
                {filterSetor ? (setores.find((s) => String(s.idSetor) === filterSetor)?.nomeSetor ?? "Todos") : "Todos"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os setores</SelectItem>
              {setores.map((s) => (
                <SelectItem key={s.idSetor} value={String(s.idSetor)}>{s.nomeSetor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field className="w-auto shrink-0 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Papel</FieldLabel>
          <Select value={filterRole || "todos"} onValueChange={(v) => { setFilterRole(v); setPaginaAtual(1); }}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos">
                {filterRole === "todos" || !filterRole ? "Todos os papéis" : filterRole}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os papéis</SelectItem>
              {tiposAcesso.map((t) => (
                <SelectItem key={t.idTipoAcesso} value={t.tipoAcesso}>{t.tipoAcesso}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field className="w-auto shrink-0 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Status</FieldLabel>
          <Select value={filterAtivo} onValueChange={(v) => { setFilterAtivo(v); setPaginaAtual(1); }}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Ativos">
                {filterAtivo === "todos" ? "Todos" : filterAtivo === "ativos" ? "Ativos" : "Desativados"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativos">Ativos</SelectItem>
              <SelectItem value="inativos">Desativados</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FilterBar>

      {/* Table */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-3">
            <svg className="animate-spin size-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando usuários...
          </div>
        ) : (
          <>
            <PaginationBar inicio={inicio} fim={fim} total={total} paginaAtual={paginaAtual} totalPaginas={totalPaginas} pageSize={pageSize} setPage={setPaginaAtual} setPageSize={setPageSize} />
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <Checkbox checked={pagina.length > 0 && selected.length === pagina.length} onChange={toggleAll} />
                  </th>
                  {COLUNAS.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${SORT_KEYS[col] ? "cursor-pointer hover:text-slate-800 select-none" : ""} ${col === "Ações" || col === "Pontuação" ? "text-right" : ""}`}
                    >
                      {col}
                      {SORT_KEYS[col] && <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody ref={parent} className="divide-y divide-slate-100">
                {pagina.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  pagina.map((user) => {
                    const isSelected = selected.includes(user.idUsuarioDestino);

                    return (
                      <tr key={user.idUsuarioDestino} className={`transition-colors ${isSelected ? "bg-teal-50/60" : "hover:bg-slate-50"} ${!user.isAtivo ? "opacity-60 grayscale-[0.5]" : ""}`}>
                        <td className="px-4 py-3">
                          <Checkbox checked={isSelected} onChange={() => toggleSelect(user.idUsuarioDestino)} />
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">{user.matricula}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{user.nome}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 border border-slate-200">{user.nomeSetor}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{user.email}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classeBadgePontuacao(user.pontuacao ?? 0)}`}>
                            {user.pontuacao ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {!user.ultimoLogin ? (
                            <span className="text-slate-400 italic">Nunca acessou</span>
                          ) : (
                            new Date(user.ultimoLogin).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {user.isAtivo ? (
                              <>
                                <button onClick={() => setFormModal({ open: true, user })} className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="Editar">
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => setActionModal({ open: true, id: user.idUsuarioDestino, bulk: false, type: 'desativar' })} className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Desativar">
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button onClick={() => handleReactivate(user.idUsuarioDestino)} className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Reativar">
                                <ArrowPathIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            </div>
            <PaginationBar inicio={inicio} fim={fim} total={total} paginaAtual={paginaAtual} totalPaginas={totalPaginas} pageSize={pageSize} setPage={setPaginaAtual} setPageSize={setPageSize} borderTop />
          </>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            {selected.length > 0 ? `${selected.length} selecionado(s)` : `${total} usuário(s) encontrado(s)`}
          </span>
          {selected.length > 0 && (
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteModal({ open: true, id: null, bulk: true })}>
              Desativar selecionados ({selected.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}