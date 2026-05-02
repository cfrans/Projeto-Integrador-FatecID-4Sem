import { useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import {
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import Modal from "@/components/ui/Modal";
import { FilterBar } from "@/components/ui/FilterBar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

const DOMAINS = [
  { id: 1, name: "ti.acesso-seguro.top" },
  { id: 2, name: "rh.acesso-seguro.top" },
  { id: 3, name: "bradesco.acesso-seguro.top" },
  { id: 4, name: "consorcio.acesso-seguro.top" },
  { id: 5, name: "microsoft.acesso-seguro.top" },
];

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modelName, setModelName] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [fakeSender, setFakeSender] = useState("");
  const [defaultSubject, setDefaultSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [modal, setModal] = useState({ open: false, title: "", description: "", variant: "error" });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterDominio, setFilterDominio] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");

  const filterActive = !!(filterNome || filterDominio || filterDataInicio || filterDataFim);
  const activeCount = [filterNome, filterDominio, filterDataInicio, filterDataFim].filter(Boolean).length;
  const clearFilters = () => {
    setFilterNome(""); setFilterDominio(""); setFilterDataInicio(""); setFilterDataFim("");
  };

  const uniqueDomains = useMemo(
    () => [...new Set(models.map((m) => m.dominioAlvo))].sort(),
    [models]
  );

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (filterNome && !m.nomeModelo.toLowerCase().includes(filterNome.toLowerCase())) return false;
      if (filterDominio && m.dominioAlvo !== filterDominio) return false;
      if (m.data) {
        const d = new Date(m.data);
        if (filterDataInicio) {
          const ini = new Date(filterDataInicio);
          ini.setHours(0, 0, 0, 0);
          if (d < ini) return false;
        }
        if (filterDataFim) {
          const fim = new Date(filterDataFim);
          fim.setHours(23, 59, 59, 999);
          if (d > fim) return false;
        }
      }
      return true;
    });
  }, [models, filterNome, filterDominio, filterDataInicio, filterDataFim]);

  // ─────────────────────────────────────────────────────────────────────────

  const showModal = (title, description, variant = "error") =>
    setModal({ open: true, title, description, variant });

  useEffect(() => {
    api.get("/api/modelos")
      .then(setModels)
      .catch(() => setModels([]));
  }, []);

  const openCreateMode = () => { setEditingId(null); clearFields(); setIsFormOpen(true); };

  const openEditMode = (model) => {
    setEditingId(model.idModelo);
    setModelName(model.nomeModelo);
    setTargetDomain(model.dominioAlvo);
    setFakeSender(model.remetenteFalso);
    setDefaultSubject(model.assuntoPadrao);
    setHtmlContent(model.textoHtml);
    setIsFormOpen(true);
  };

  const clearFields = () => {
    setModelName(""); setTargetDomain(""); setFakeSender(""); setDefaultSubject(""); setHtmlContent("");
  };

  const SENDER_REGEX = /^.+\s<[^@\s]+@[^@\s]+\.[^@\s]+>$/;

  const handleSave = async () => {
    if (!modelName || !targetDomain || !fakeSender || !defaultSubject) {
      showModal("Campos obrigatórios", "Preencha todos os campos antes de salvar o modelo.", "warning");
      return;
    }
    if (!SENDER_REGEX.test(fakeSender)) {
      showModal("Remetente inválido", "O remetente deve estar no formato: Nome <email@dominio.com>", "warning");
      return;
    }
    if (!htmlContent.includes("{{LINK_AQUI}}")) {
      showModal("Tag obrigatória ausente", "Insira a tag {{LINK_AQUI}} no corpo do e-mail. Sem ela o alvo não terá onde clicar.", "warning");
      return;
    }

    const body = {
      nomeModelo: modelName,
      dominioAlvo: targetDomain,
      remetenteFalso: fakeSender,
      assuntoPadrao: defaultSubject,
      textoHtml: htmlContent,
    };

    try {
      if (editingId) {
        const updated = await api.put(`/api/modelos/${editingId}`, body);
        setModels((prev) => prev.map((m) => (m.idModelo === editingId ? updated : m)));
      } else {
        const created = await api.post("/api/modelos", body);
        setModels((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
      showModal("Modelo salvo!", editingId ? "O modelo foi atualizado com sucesso." : "Novo modelo criado com sucesso.", "success");
    } catch {
      showModal("Erro ao salvar", "Ocorreu um erro ao salvar o modelo. Tente novamente.", "error");
    }
  };

  const handleDelete = (id) => setDeleteModal({ open: true, id });

  const confirmDelete = async () => {
    const id = deleteModal.id;
    setDeleteModal({ open: false, id: null });
    try {
      await api.delete(`/api/modelos/${id}`);
      setModels((prev) => prev.filter((m) => m.idModelo !== id));
      showModal("Modelo excluído", "O modelo foi removido com sucesso.", "success");
    } catch {
      showModal("Erro ao excluir", "Não foi possível excluir o modelo. Tente novamente.", "error");
    }
  };

  const editorConfig = useMemo(() => ({
    height: 400,
    language: "pt_br",
    placeholder: "Escreva o corpo do e-mail de phishing aqui...",
    uploader: { insertImageAsBase64URI: false },
  }), []);

  const renderTable = () => (
    <div className="grid gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="envelope-badge flex items-center justify-center size-12 rounded-xl bg-violet-600 shrink-0 cursor-default">
            <EnvelopeIcon className="envelope-icon size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modelos</h1>
            <p className="mt-1 text-sm text-slate-600">Lista de e-mails de phishing configurados no sistema.</p>
          </div>
        </div>
        <Button onClick={openCreateMode} className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-4">
          <PlusIcon className="size-5 mr-2" /> Novo Modelo
        </Button>
      </header>

      <FilterBar
        label="Filtrar modelos"
        isOpen={filterOpen}
        onToggle={() => setFilterOpen((v) => !v)}
        isActive={filterActive}
        activeCount={activeCount}
        onClear={clearFilters}
      >
        <Field className="flex-1 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Buscar por nome</FieldLabel>
          <Input
            value={filterNome}
            onChange={(e) => setFilterNome(e.target.value)}
            placeholder="Nome do modelo..."
            className="h-9"
          />
        </Field>
        <Field className="w-52 shrink-0">
          <FieldLabel className="text-xs text-slate-500">Domínio alvo</FieldLabel>
          <Select value={filterDominio} onValueChange={setFilterDominio}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {uniqueDomains.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field className="shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data inicial</FieldLabel>
          <Input
            type="date"
            value={filterDataInicio}
            onChange={(e) => setFilterDataInicio(e.target.value)}
            max={filterDataFim || undefined}
            className="h-9 w-40"
          />
        </Field>
        <Field className="shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data final</FieldLabel>
          <Input
            type="date"
            value={filterDataFim}
            onChange={(e) => setFilterDataFim(e.target.value)}
            min={filterDataInicio || undefined}
            className="h-9 w-40"
          />
        </Field>
      </FilterBar>

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
          <span className="text-xs text-slate-400">
            {filteredModels.length} de {models.length} modelo(s)
          </span>
        </div>

        {filteredModels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <EnvelopeIcon className="size-10 opacity-30" />
            <p className="text-sm">
              {filterActive ? "Nenhum modelo encontrado para os filtros aplicados." : "Nenhum modelo criado ainda."}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Nome do Modelo</th>
                <th className="px-6 py-4">Domínio Alvo</th>
                <th className="px-6 py-4">Remetente</th>
                <th className="px-6 py-4">Criado em</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredModels.map((model) => (
                <tr key={model.idModelo} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{model.nomeModelo}</td>
                  <td className="px-6 py-4 text-slate-600">{model.dominioAlvo}</td>
                  <td className="px-6 py-4 text-slate-500">{model.remetenteFalso}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {model.data ? new Date(model.data).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditMode(model)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <PencilIcon className="size-4 mr-1" /> Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(model.idModelo)} className="text-red-600 border-red-200 hover:bg-red-50">
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );

  const renderForm = () => (
    <div className="grid gap-4">
      <header className="flex items-start gap-3">
        <button
          onClick={() => setIsFormOpen(false)}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
          title="Voltar"
        >
          <ArrowLeftIcon className="size-4 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {editingId ? `Editando Modelo: ${modelName}` : "Criar Novo Modelo"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">Desenhe o e-mail malicioso e configure os parâmetros de envio padrão.</p>
        </div>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">1. Configurações da Simulação</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Nome do Modelo (Uso Interno)</FieldLabel>
                <Input value={modelName} onChange={(e) => setModelName(e.target.value)} className="h-9" placeholder="Ex: Falso RH - Recadastramento" />
              </Field>
              <Field>
                <FieldLabel>Domínio Alvo (Página Falsa)</FieldLabel>
                <SelectField value={targetDomain} onChange={setTargetDomain} options={DOMAINS} placeholder="Selecione o subdomínio" />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">2. Dados do E-mail (Envelopamento)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Remetente Falso (Spoofing)</FieldLabel>
                <Input value={fakeSender} onChange={(e) => setFakeSender(e.target.value)} className="h-9" placeholder="Ex: RH <rh@empresa-intranet.com>" />
              </Field>
              <Field>
                <FieldLabel>Assunto Padrão</FieldLabel>
                <Input value={defaultSubject} onChange={(e) => setDefaultSubject(e.target.value)} className="h-9" placeholder="Ex: URGENTE: Atualize seus dados" />
              </Field>
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-2 border-b pb-2">3. Corpo do E-mail</h2>
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 border border-blue-200">
              <InformationCircleIcon className="size-6 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>Dica Estratégica:</strong> Utilize a tag <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">{`{{LINK_AQUI}}`}</code> no campo de URL dos botões ou textos.
              </p>
            </div>
            <Field>
              <div className="border border-slate-300 rounded-md overflow-hidden bg-white">
                <JoditEditor value={htmlContent} config={editorConfig} tabIndex={1} onBlur={(newContent) => setHtmlContent(newContent)} onChange={() => {}} />
              </div>
            </Field>
          </section>

          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)} className="h-10 px-4">
              <XMarkIcon className="size-4 mr-2" /> Cancelar
            </Button>
            <Button type="button" size="sm" onClick={handleSave} className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
              <CheckIcon className="size-4 mr-2" />
              {editingId ? "Atualizar Modelo" : "Salvar Modelo"}
            </Button>
          </footer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <Modal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        description={modal.description}
        variant={modal.variant}
      />
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Excluir modelo"
        description="Tem certeza que deseja excluir este modelo? Essa ação não pode ser desfeita."
        variant="warning"
        confirm
        confirmLabel="Sim, excluir"
        onConfirm={confirmDelete}
      />
      {isFormOpen ? renderForm() : renderTable()}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem key={option.name} value={String(option.name)}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
