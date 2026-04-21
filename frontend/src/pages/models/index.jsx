import { useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import { 
  CheckIcon, 
  TrashIcon, 
  XMarkIcon, 
  InformationCircleIcon, 
  PencilIcon, 
  PlusIcon 
} from "@heroicons/react/24/solid";

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

// 1. Simulação de Dados Iniciais (Para a tabela não começar vazia)
const INITIAL_MODELS = [
  { 
    id: 1, 
    name: "Alerta de Senha Expirada", 
    domain: "ti.acesso-seguro.top", 
    sender: "Suporte TI <ti@ti.acesso-seguro.top>", 
    subject: "Sua senha expira em 24h", 
    html: "<div style='font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #ccc; border-radius: 8px;'><h2>⚠️ Aviso da TI</h2><p>A sua senha de rede expira em 2 dias.</p><p>Por favor, atualize imediatamente clicando no botão abaixo:</p><a href='{{LINK_AQUI}}' style='display: inline-block; background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;'>Atualizar Senha</a></div>" 
  },
  { 
    id: 2, 
    name: "Falso Alerta de Segurança", 
    domain: "bradesco.acesso-seguro.top", 
    sender: "Segurança Bradesco <seguranca@bradesco.acesso-seguro.top>", 
    subject: "Alerta de Segurança - Atividade Suspeita", 
    html: "<div style='font-family: sans-serif; color: #333; padding: 20px; background-color: #f8fafc; border-left: 4px solid #0284c7;'><h2>🏦 Banco Bradesco</h2><p>Detetámos uma atividade suspeita na sua conta salário.</p><p>Aceda ao link para confirmar a sua identidade: <a href='{{LINK_AQUI}}'>Confirmar Dados Bancários</a></p></div>" 
  },
  { 
    id: 3, 
    name: "Recadastramento RH", 
    domain: "rh.acesso-seguro.top", 
    sender: "RH <rh@rh.acesso-seguro.top>", 
    subject: "Atualização Cadastral Obrigatória", 
    html: "<div style='font-family: sans-serif; color: #333; padding: 20px;'><h2>Prezado Colaborador,</h2><p>O setor de Recursos Humanos solicita a revisão dos seus dados cadastrais para o fecho do mês.</p><p>Aceda ao portal: <a href='{{LINK_AQUI}}'>Portal do Colaborador</a></p></div>" 
  },
];

const DOMAINS = [
  { id: 1, name: "ti.acesso-seguro.top" },
  { id: 2, name: "rh.acesso-seguro.top" },
  { id: 3, name: "bradesco.acesso-seguro.top" },
  { id: 4, name: "consorcio.acesso-seguro.top" },
  { id: 5, name: "microsoft.acesso-seguro.top" },
];

export default function ModelsPage() {
  // --- ESTADOS DE CONTROLE DE TELA ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Modo Criar, Número = Modo Editar

  // --- ESTADOS DOS CAMPOS DO FORMULÁRIO ---
  const [modelName, setModelName] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [fakeSender, setFakeSender] = useState("");
  const [defaultSubject, setDefaultSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  // --- FUNÇÕES DE NAVEGAÇÃO E PREENCHIMENTO ---
  const openCreateMode = () => {
    setEditingId(null);
    clearFields();
    setIsFormOpen(true);
  };

  const openEditMode = (model) => {
    setEditingId(model.id);
    setModelName(model.name);
    setTargetDomain(model.domain);
    setFakeSender(model.sender);
    setDefaultSubject(model.subject);
    setHtmlContent(model.html);
    setIsFormOpen(true);
  };

  const clearFields = () => {
    setModelName("");
    setTargetDomain("");
    setFakeSender("");
    setDefaultSubject("");
    setHtmlContent("");
  };

  // --- LÓGICA DE SALVAMENTO COM VALIDAÇÃO ---
  const handleSave = () => {
    // Validação de Segurança Front-end
    if (!htmlContent.includes("{{LINK_AQUI}}")) {
      alert("⚠️ ERRO: Você esqueceu de inserir a tag curinga {{LINK_AQUI}} no corpo do e-mail. O alvo não terá onde clicar!");
      return;
    }

    if (!modelName || !targetDomain || !fakeSender || !defaultSubject) {
      alert("⚠️ ERRO: Preencha todos os campos do cabeçalho antes de salvar.");
      return;
    }

    const payload = { modelName, targetDomain, fakeSender, defaultSubject, html: htmlContent };

    if (editingId) {
      console.log(`EFETUANDO UPDATE NO BANCO (ID ${editingId}):`, payload);
      alert("✅ Modelo atualizado com sucesso!");
    } else {
      console.log("EFETUANDO CREATE (POST) NO BANCO:", payload);
      alert("✅ Novo modelo criado com sucesso!");
    }

    setIsFormOpen(false); // Fecha o formulário e volta para a tabela
  };

  // --- CONFIGURAÇÕES DO JODIT EDITOR ---
  const editorConfig = useMemo(() => ({
    height: 400,
    language: "pt_br",
    placeholder: "Escreva o corpo do e-mail de phishing aqui...",
    uploader: { 
      insertImageAsBase64URI: false // Força o uso de URL para as imagens
    }
  }), []);

  // --- RENDERIZAÇÃO DA TABELA (LISTA DE MODELOS) ---
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
            {INITIAL_MODELS.map((model) => (
              <tr key={model.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{model.name}</td>
                <td className="px-6 py-4 text-slate-600">{model.domain}</td>
                <td className="px-6 py-4 text-slate-500">{model.sender}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditMode(model)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    <PencilIcon className="size-4 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
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

  // --- RENDERIZAÇÃO DO FORMULÁRIO (CRIAR/EDITAR) ---
  const renderForm = () => (
    <div className="grid gap-4">
       <header>
        <h1 className="text-2xl font-bold text-slate-900">
            {editingId ? `Editando Modelo: ${modelName}` : "Criar Novo Modelo"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Desenhe o e-mail malicioso e configure os parâmetros de envio padrão.
        </p>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-8">
          
          {/* SEÇÃO 1: Configurações da Simulação */}
          <section>
             <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">1. Configurações da Simulação</h2>
             <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Nome do Modelo (Uso Interno)</FieldLabel>
                  <Input
                    value={modelName}
                    onChange={(event) => setModelName(event.target.value)}
                    className="h-9"
                    placeholder="Ex: Falso RH - Recadastramento"
                  />
                </Field>

                <Field>
                  <FieldLabel>Domínio Alvo (Página Falsa)</FieldLabel>
                  <SelectField 
                    value={targetDomain} 
                    onChange={setTargetDomain} 
                    options={DOMAINS} 
                    placeholder="Selecione o subdomínio que será acessado" 
                  />
                </Field>
             </div>
          </section>

          {/* SEÇÃO 2: Envelopamento do E-mail */}
          <section>
             <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">2. Dados do E-mail (Envelopamento)</h2>
             <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Remetente Falso (Spoofing)</FieldLabel>
                  <Input
                    value={fakeSender}
                    onChange={(event) => setFakeSender(event.target.value)}
                    className="h-9"
                    placeholder="Ex: Recursos Humanos <rh@emicol-intranet.com>"
                  />
                </Field>

                <Field>
                  <FieldLabel>Assunto Padrão</FieldLabel>
                  <Input
                    value={defaultSubject}
                    onChange={(event) => setDefaultSubject(event.target.value)}
                    className="h-9"
                    placeholder="Ex: URGENTE: Atualize seus dados cadastrais"
                  />
                </Field>
             </div>
          </section>

          {/* SEÇÃO 3: Construção Visual */}
          <section className="grid gap-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-2 border-b pb-2">3. Corpo do E-mail</h2>
            
            {/* Aviso Estratégico */}
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 border border-blue-200">
               <InformationCircleIcon className="size-6 text-blue-600 shrink-0" />
               <p className="text-sm text-blue-900 leading-relaxed">
                 <strong>Dica Estratégica:</strong> Utilize a tag <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200 font-bold">{`{{LINK_AQUI}}`}</code> no campo de URL (link) dos botões ou textos. O sistema substituirá essa tag automaticamente pelo Token do usuário e o Domínio Alvo na hora do disparo.
               </p>
            </div>

            {/* Editor de Texto Rico (Jodit) */}
            <Field>
               <div className="border border-slate-300 rounded-md overflow-hidden bg-white">
                  <JoditEditor
                    value={htmlContent}
                    config={editorConfig}
                    tabIndex={1}
                    onBlur={newContent => setHtmlContent(newContent)}
                    onChange={(newContent) => {}}
                  />
               </div>
            </Field>
          </section>

          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)} className="h-10 px-4">
              <XMarkIcon className="size-4 mr-2" />
              Cancelar
            </Button>

            <Button type="button" variant="primary" size="sm" onClick={handleSave} className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
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
      {/* O Operador Ternário que faz a troca de tela acontecer */}
      {isFormOpen ? renderForm() : renderTable()}
    </div>
  );
}

// Componente SelectField reutilizável
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