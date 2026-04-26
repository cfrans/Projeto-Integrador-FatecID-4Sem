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
} from "@heroicons/react/24/solid";
import Modal from "@/components/ui/Modal";

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

const DOMAINS = [
  { id: 1, name: "ti.acesso-seguro.top" },
  { id: 2, name: "rh.acesso-seguro.top" },
  { id: 3, name: "bradesco.acesso-seguro.top" },
  { id: 4, name: "consorcio.acesso-seguro.top" },
  { id: 5, name: "microsoft.acesso-seguro.top" },
];

const API = "http://localhost:8080/api/modelos";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
  };
}

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modelName, setModelName] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [fakeSender, setFakeSender] = useState("");
  const [defaultSubject, setDefaultSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [modal, setModal] = useState({ open: false, title: '', description: '', variant: 'error' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const showModal = (title, description, variant = 'error') =>
    setModal({ open: true, title, description, variant });

  useEffect(() => {
    fetch(API, { headers: authHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar modelos");
        return r.json();
      })
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
      showModal('Campos obrigatórios', 'Preencha todos os campos antes de salvar o modelo.', 'warning');
      return;
    }
    if (!SENDER_REGEX.test(fakeSender)) {
      showModal('Remetente inválido', 'O remetente deve estar no formato: Nome <email@dominio.com>', 'warning');
      return;
    }
    if (!htmlContent.includes("{{LINK_AQUI}}")) {
      showModal('Tag obrigatória ausente', 'Insira a tag {{LINK_AQUI}} no corpo do e-mail. Sem ela o alvo não terá onde clicar.', 'warning');
      return;
    }

    const body = JSON.stringify({
      nomeModelo: modelName,
      dominioAlvo: targetDomain,
      remetenteFalso: fakeSender,
      assuntoPadrao: defaultSubject,
      textoHtml: htmlContent,
    });

    try {
      if (editingId) {
        const res = await fetch(`${API}/${editingId}`, { method: "PUT", headers: authHeaders(), body });
        const updated = await res.json();
        setModels((prev) => prev.map((m) => (m.idModelo === editingId ? updated : m)));
      } else {
        const res = await fetch(API, { method: "POST", headers: authHeaders(), body });
        const created = await res.json();
        setModels((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
      showModal('Modelo salvo!', editingId ? 'O modelo foi atualizado com sucesso.' : 'Novo modelo criado com sucesso.', 'success');
    } catch {
      showModal('Erro ao salvar', 'Ocorreu um erro ao salvar o modelo. Tente novamente.', 'error');
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    setDeleteModal({ open: false, id: null });
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
      setModels((prev) => prev.filter((m) => m.idModelo !== id));
      showModal('Modelo excluído', 'O modelo foi removido com sucesso.', 'success');
    } catch {
      showModal('Erro ao excluir', 'Não foi possível excluir o modelo. Tente novamente.', 'error');
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Modelos</h1>
          <p className="mt-1 text-sm text-slate-600">Lista de e-mails de phishing configurados no sistema.</p>
        </div>
        <Button onClick={openCreateMode} className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-4">
          <PlusIcon className="size-5 mr-2" /> Novo Modelo
        </Button>
      </header>

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Nome do Modelo</th>
              <th className="px-6 py-4">Domínio Alvo</th>
              <th className="px-6 py-4">Remetente</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((model) => (
              <tr key={model.idModelo} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{model.nomeModelo}</td>
                <td className="px-6 py-4 text-slate-600">{model.dominioAlvo}</td>
                <td className="px-6 py-4 text-slate-500">{model.remetenteFalso}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditMode(model)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    <PencilIcon className="size-4 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(model.idModelo)} className="text-red-600 border-red-200 hover:bg-red-50">
                    <TrashIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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