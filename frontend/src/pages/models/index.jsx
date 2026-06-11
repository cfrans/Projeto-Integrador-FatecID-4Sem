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
import { InfoHint } from "@/components/ui/InfoHint";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { PaginationBar } from "@/components/ui/PaginationBar";

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
function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <IconSortNone />;
  return sortDir === "asc" ? <IconSortAsc /> : <IconSortDesc />;
}

const DOMAINS = [
  { id: 1, name: "ti.acesso-seguro.top" },
  { id: 2, name: "rh.acesso-seguro.top" },
  { id: 3, name: "bradesco.acesso-seguro.top" },
  { id: 4, name: "consorcio.acesso-seguro.top" },
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
  const [filterStatus, setFilterStatus] = useState("ativos");

  const filterActive = !!(filterNome || filterDominio || filterDataInicio || filterDataFim || filterStatus !== "ativos");
  const activeCount = [filterNome, filterDominio, filterDataInicio, filterDataFim, filterStatus !== "ativos" ? "1" : ""].filter(Boolean).length;
  
  const [sortCol, setSortCol] = useState("Criado em");
  const [sortDir, setSortDir] = useState("desc");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const clearFilters = () => {
    setFilterNome(""); setFilterDominio(""); setFilterDataInicio(""); setFilterDataFim(""); setFilterStatus("ativos"); setPaginaAtual(1);
  };

  const uniqueDomains = useMemo(
    () => [...new Set(models.map((m) => m.dominioAlvo))].sort(),
    [models]
  );

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (filterNome && !m.nomeModelo.toLowerCase().includes(filterNome.toLowerCase())) return false;
      if (filterDominio && m.dominioAlvo !== filterDominio) return false;
      if (filterStatus === "ativos" && m.isAtivo === false) return false;
      if (filterStatus === "inativos" && m.isAtivo !== false) return false;
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
  }, [models, filterNome, filterDominio, filterDataInicio, filterDataFim, filterStatus]);

  const SORT_KEYS = {
    "Nome do Modelo": "nomeModelo",
    "Domínio Alvo": "dominioAlvo",
    "Remetente": "remetenteFalso",
    "Criado em": "data",
  };

  const sorted = useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      if (!sortCol) return 0;
      const key = SORT_KEYS[sortCol];
      const va = a[key];
      const vb = b[key];
      let cmp;
      if (key === "data") {
        cmp = new Date(va || 0) - new Date(vb || 0);
      } else {
        cmp = String(va || "").localeCompare(String(vb || ""), "pt-BR");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredModels, sortCol, sortDir]);

  const handleSort = (col) => {
    if (!SORT_KEYS[col]) return;
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
    setPaginaAtual(1);
  };

  const total = sorted.length;
  const totalPaginas = Math.max(1, Math.ceil(total / pageSize));
  const inicio = (paginaAtual - 1) * pageSize;
  const fim = Math.min(inicio + pageSize, total);
  const pagina = sorted.slice(inicio, fim);

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
      setModels((prev) => prev.map((m) => m.idModelo === id ? { ...m, isAtivo: false } : m));
      showModal("Modelo desativado", "O modelo foi desativado com sucesso.", "success");
    } catch {
      showModal("Erro ao excluir", "Não foi possível excluir o modelo. Tente novamente.", "error");
    }
  };

  const handleReativar = async (id) => {
    try {
      await api.put(`/api/modelos/${id}/reativar`);
      setModels((prev) => prev.map((m) => m.idModelo === id ? { ...m, isAtivo: true } : m));
      showModal("Modelo reativado", "O modelo foi reativado com sucesso.", "success");
    } catch {
      showModal("Erro ao reativar", "Não foi possível reativar o modelo. Tente novamente.", "error");
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
      <header className="flex flex-wrap items-center justify-between gap-3">
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
        <Field className="w-auto flex-1 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Buscar por nome</FieldLabel>
          <Input
            value={filterNome}
            onChange={(e) => setFilterNome(e.target.value)}
            placeholder="Nome do modelo..."
            className="h-9 w-full"
          />
        </Field>
        <Field className="w-64 shrink-0">
          <FieldLabel className="text-xs text-slate-500">Domínio alvo</FieldLabel>
          <Select value={filterDominio} onValueChange={setFilterDominio}>
            <SelectTrigger className="h-9 w-full text-sm">
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
        <Field className="w-40 shrink-0">
          <FieldLabel className="text-xs text-slate-500">Status</FieldLabel>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 w-full text-sm">
              <SelectValue placeholder="Status">
                {filterStatus === "todos" ? "Todos" : filterStatus === "ativos" ? "Ativos" : "Inativos"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativos">Ativos</SelectItem>
              <SelectItem value="inativos">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field className="w-auto shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data inicial</FieldLabel>
          <Input
            type="date"
            value={filterDataInicio}
            onChange={(e) => setFilterDataInicio(e.target.value)}
            max={filterDataFim || undefined}
            className="h-9 w-40"
          />
        </Field>
        <Field className="w-auto shrink-0">
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

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-w-0 w-full">
        {filteredModels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <EnvelopeIcon className="size-10 opacity-30" />
            <p className="text-sm">
              {filterActive ? "Nenhum modelo encontrado para os filtros aplicados." : "Nenhum modelo criado ainda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Nome do Modelo")}>
                    Nome do Modelo <SortIcon col="Nome do Modelo" sortCol={sortCol} sortDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Domínio Alvo")}>
                    Domínio Alvo <SortIcon col="Domínio Alvo" sortCol={sortCol} sortDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Remetente")}>
                    Remetente <SortIcon col="Remetente" sortCol={sortCol} sortDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Criado em")}>
                    Criado em <SortIcon col="Criado em" sortCol={sortCol} sortDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagina.map((model) => (
                  <tr key={model.idModelo} className={`transition-colors ${model.isAtivo === false ? 'bg-slate-100 opacity-60 grayscale' : 'hover:bg-slate-50'}`}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {model.nomeModelo}
                      {model.isAtivo === false && <span className="ml-2 text-[10px] uppercase font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">Inativo</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{model.dominioAlvo}</td>
                    <td className="px-4 py-3 text-slate-500">{model.remetenteFalso}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {model.data ? new Date(model.data).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {model.isAtivo !== false && (
                          <Button variant="outline" size="sm" onClick={() => openEditMode(model)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <PencilIcon className="size-4 mr-1" /> Editar
                          </Button>
                        )}
                        {model.isAtivo !== false ? (
                          <Button variant="outline" size="sm" onClick={() => handleDelete(model.idModelo)} className="text-red-600 border-red-200 hover:bg-red-50" title="Desativar modelo">
                            <TrashIcon className="size-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleReativar(model.idModelo)} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" title="Reativar modelo">
                            <CheckIcon className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 0 && (
          <PaginationBar
            inicio={inicio}
            fim={fim}
            total={total}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            pageSize={pageSize}
            setPage={setPaginaAtual}
            setPageSize={setPageSize}
            borderTop={true}
          />
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
                <FieldLabel>
                  Nome do Modelo (Uso Interno)
                  <InfoHint text="Nome só para você identificar este modelo na lista. O alvo nunca vê esse nome. Ex: 'Falso RH - Recadastramento'." />
                </FieldLabel>
                <Input value={modelName} onChange={(e) => setModelName(e.target.value)} className="h-9" placeholder="Ex: Falso RH - Recadastramento" />
              </Field>
              <Field>
                <FieldLabel>
                  Domínio Alvo (Página Falsa)
                  <InfoHint text="Endereço da página falsa que abre quando o alvo clica no link do e-mail. É para onde a vítima é levada na simulação." />
                </FieldLabel>
                <SelectField value={targetDomain} onChange={setTargetDomain} options={DOMAINS} placeholder="Selecione o subdomínio" />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">2. Dados do E-mail (Envelopamento)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>
                  Remetente Falso (Spoofing)
                  <InfoHint text="Quem aparece como remetente do e-mail para o alvo. Use o formato: Nome <email@dominio.acesso-seguro.top>. Ex: RH <rh@nemo.acesso-seguro.top>." />
                </FieldLabel>
                <Input value={fakeSender} onChange={(e) => setFakeSender(e.target.value)} className="h-9" placeholder="Ex: RH <rh@empresa.acesso-seguro.top>" />
              </Field>
              <Field>
                <FieldLabel>
                  Assunto Padrão
                  <InfoHint text="Assunto que aparece no e-mail recebido pelo alvo. Frases com urgência costumam ser mais convincentes. Ex: 'URGENTE: Atualize seus dados'." />
                </FieldLabel>
                <Input value={defaultSubject} onChange={(e) => setDefaultSubject(e.target.value)} className="h-9" placeholder="Ex: URGENTE: Atualize seus dados" />
              </Field>
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-2 border-b pb-2">3. Corpo do E-mail</h2>
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 border border-blue-200">
              <InformationCircleIcon className="size-6 text-blue-600 shrink-0" />
              <div className="text-sm text-blue-900 leading-relaxed space-y-2">
                <p>
                  <strong>A tag <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">{`{{LINK_AQUI}}`}</code> é obrigatória.</strong> Ela marca onde fica o link da simulação:
                  na hora do envio, o sistema troca essa tag por um link único e rastreável para cada alvo. Sem ela, ninguém teria onde clicar e não haveria como medir os cliques.
                </p>
                <p className="text-blue-800">
                  <strong>Como inserir:</strong> selecione um texto ou botão no editor abaixo → clique no botão de link (🔗) → no campo de
                  endereço/URL, cole exatamente <code className="bg-white px-1 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">{`{{LINK_AQUI}}`}</code> (com as duas chaves de cada lado).
                </p>
              </div>
            </div>
            <Field>
              <div className="border border-slate-300 rounded-md overflow-hidden bg-white">
                <JoditEditor value={htmlContent} config={editorConfig} tabIndex={1} onBlur={(newContent) => setHtmlContent(newContent)} onChange={() => { }} />
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
        title="Desativar modelo"
        description="Tem certeza que deseja desativar este modelo? Ele não aparecerá mais para novos envios."
        variant="warning"
        confirm
        confirmLabel="Sim, desativar"
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
