import { useState, useEffect } from "react";
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Modal from "@/components/ui/Modal";

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, nome: "Fulano de Tal da Silva", cargo: "Algum aí Senior", setor: "Aquele lá da empresa", email: "FulanoDeTalDaSilva@gmail.com" },
];

const CARGOS = ["Analista Junior", "Analista Pleno", "Analista Senior", "Algum aí Senior", "Gestor"];
const SETORES = ["TI", "RH", "Financeiro", "Aquele lá da empresa", "Comercial"];

// ── Helpers ──────────────────────────────────────────────────────────────────
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 border border-teal-200">
      {children}
    </span>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
        checked
          ? "bg-teal-600 border-teal-600"
          : "border-slate-400 bg-white hover:border-teal-500"
      }`}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white stroke-[3]" />}
    </button>
  );
}

function FishIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* body */}
      <ellipse cx="18" cy="21" rx="13" ry="9" fill="#F97316" />
      {/* tail */}
      <polygon points="5,21 0,13 0,29" fill="#FB923C" />
      {/* fin top */}
      <ellipse cx="20" cy="13" rx="6" ry="3.5" fill="#FDBA74" transform="rotate(-20 20 13)" />
      {/* eye */}
      <circle cx="27" cy="19" r="2.5" fill="white" />
      <circle cx="27.8" cy="19" r="1.2" fill="#1e293b" />
      {/* white stripe */}
      <ellipse cx="20" cy="21" rx="2.5" ry="8.5" fill="white" opacity="0.55" />
      {/* mouth */}
      <path d="M30 22 Q32 24 30 25" stroke="#c2410c" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── Broom / clear icon ────────────────────────────────────────────────────────
function BroomIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17l8-8M14 3l-3 3 3 3 3-3-3-3zM11 6L3 14v3h3l8-8-3-3z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Add/Edit Modal Form ───────────────────────────────────────────────────────
function UserFormModal({ open, onClose, onSave, editingUser }) {
  const emptyForm = { nome: "", setor: "", cargo: "", email: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(editingUser || emptyForm);
  }, [open]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: typeof e === "string" ? e : e.target.value }));

  const handleClear = () => setForm(emptyForm);

  const handleSave = (andClose) => {
    if (!form.nome || !form.cargo || !form.setor || !form.email) return;
    onSave(form, andClose);
    if (!andClose) setForm(emptyForm);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <FishIcon />
            <h2 className="text-lg font-semibold text-slate-800">
              {editingUser ? "Editar Usuário" : "Cadastro de Usuário"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 grid gap-4">
          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">Nome</FieldLabel>
            <Input
              value={form.nome}
              onChange={set("nome")}
              className="h-10 bg-slate-100 border-slate-200 rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">Setor</FieldLabel>
            <Select value={form.setor} onValueChange={set("setor")}>
              <SelectTrigger className="h-10 bg-slate-100 border-slate-200 rounded-lg">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {SETORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">Cargo</FieldLabel>
            <Select value={form.cargo} onValueChange={set("cargo")}>
              <SelectTrigger className="h-10 bg-slate-100 border-slate-200 rounded-lg">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {CARGOS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-slate-700">E-mail</FieldLabel>
            <Input
              value={form.email}
              onChange={set("email")}
              type="email"
              className="h-10 bg-slate-100 border-slate-200 rounded-lg"
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          {/* Left: Limpar */}
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <BroomIcon />
            LIMPAR
          </button>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-9 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold tracking-wide rounded-lg"
              onClick={() => handleSave(false)}
            >
              SALVAR E CONTINUAR
            </Button>
            <Button
              size="sm"
              className="h-9 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold tracking-wide rounded-lg"
              onClick={() => handleSave(true)}
            >
              SALVAR E FECHAR
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [selected, setSelected] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [filterNome, setFilterNome] = useState("");
  const [filterCargo, setFilterCargo] = useState("");
  const [filterSetor, setFilterSetor] = useState("");

  // Modals
  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [feedback, setFeedback] = useState({ open: false, title: "", description: "", variant: "success" });

  const showFeedback = (title, description, variant = "success") =>
    setFeedback({ open: true, title, description, variant });

  // ── Filtering ──
  const filtered = users.filter((u) => {
    const nameMatch = u.nome.toLowerCase().includes(filterNome.toLowerCase());
    const cargoMatch = !filterCargo || u.cargo === filterCargo;
    const setorMatch = !filterSetor || u.setor === filterSetor;
    return nameMatch && cargoMatch && setorMatch;
  });

  const clearFilters = () => { setFilterNome(""); setFilterCargo(""); setFilterSetor(""); };

  const hasActiveFilters = filterNome || filterCargo || filterSetor;

  // ── Selection ──
  const toggleSelect = (id) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((u) => u.id));

  // ── CRUD ──
  const handleSave = (form, andClose) => {
    if (formModal.user) {
      setUsers((us) => us.map((u) => u.id === formModal.user.id ? { ...u, ...form } : u));
      showFeedback("Usuário atualizado", "As alterações foram salvas com sucesso.");
    } else {
      setUsers((us) => [...us, { ...form, id: Date.now() }]);
      showFeedback("Usuário adicionado", "O novo usuário foi cadastrado com sucesso.");
    }
    if (andClose) setFormModal({ open: false, user: null });
  };

  const confirmDelete = () => {
    setUsers((us) => us.filter((u) => u.id !== deleteModal.id));
    setSelected((s) => s.filter((x) => x !== deleteModal.id));
    setDeleteModal({ open: false, id: null });
    showFeedback("Usuário removido", "O usuário foi excluído com sucesso.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      {/* Feedback modal */}
      <Modal
        open={feedback.open}
        onClose={() => setFeedback((f) => ({ ...f, open: false }))}
        title={feedback.title}
        description={feedback.description}
        variant={feedback.variant}
      />

      {/* Delete confirmation */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Remover usuário"
        description="Tem certeza que deseja remover este usuário? Essa ação não pode ser desfeita."
        variant="warning"
        confirm
        confirmLabel="Sim, remover"
        onConfirm={confirmDelete}
      />

      {/* User form modal */}
      <UserFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, user: null })}
        onSave={handleSave}
        editingUser={formModal.user}
      />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lista de Usuários Cadastrados</h1>
          <p className="mt-1 text-sm text-slate-600">Adicione, edite e exclua usuários cadastrados no sistema.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => setFormModal({ open: true, user: null })}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Adicionar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`h-9 px-4 border transition-colors ${
              filterOpen || hasActiveFilters
                ? "border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
            onClick={() => setFilterOpen((v) => !v)}
          >
            <FunnelIcon className="w-4 h-4 mr-1.5" />
            Filtrar Usuários
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                {[filterNome, filterCargo, filterSetor].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          filterOpen ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="flex items-end gap-4">
            <Field className="flex-1">
              <FieldLabel>Nome</FieldLabel>
              <Input
                value={filterNome}
                onChange={(e) => setFilterNome(e.target.value)}
                placeholder="Buscar por nome..."
                className="h-9"
              />
            </Field>
            <Field className="w-52">
              <FieldLabel>Cargo</FieldLabel>
              <Select value={filterCargo} onValueChange={setFilterCargo}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {CARGOS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field className="w-52">
              <FieldLabel>Setor</FieldLabel>
              <Select value={filterSetor} onValueChange={setFilterSetor}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {SETORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex gap-2 pb-0.5">
              <Button
                size="sm"
                className="h-9 w-9 p-0 bg-teal-600 hover:bg-teal-700 text-white"
                title="Pesquisar"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </Button>
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-3 text-slate-500 border-slate-300 hover:bg-slate-50 text-xs"
                  onClick={clearFilters}
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <Checkbox
                  checked={filtered.length > 0 && selected.length === filtered.length}
                  onChange={toggleAll}
                />
              </th>
              {["Nome", "Cargo", "Setor", "E-mail", "Ações"].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                    h === "Ações" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const isSelected = selected.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isSelected ? "bg-teal-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox checked={isSelected} onChange={() => toggleSelect(user.id)} />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{user.nome}</td>
                    <td className="px-4 py-3 text-slate-600">{user.cargo}</td>
                    <td className="px-4 py-3 text-slate-500">{user.setor}</td>
                    <td className="px-4 py-3 text-slate-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setFormModal({ open: true, user })}
                          className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: user.id })}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remover"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            {selected.length > 0
              ? `${selected.length} de ${filtered.length} selecionado(s)`
              : `${filtered.length} usuário(s) encontrado(s)`}
          </span>
          {selected.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                setUsers((us) => us.filter((u) => !selected.includes(u.id)));
                setSelected([]);
                showFeedback("Usuários removidos", `${selected.length} usuário(s) excluído(s) com sucesso.`);
              }}
            >
              Remover selecionados ({selected.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

