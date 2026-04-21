import { useState } from "react";
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
import { Button } from "@/components/ui/button";

// Modelos atualizados com o subdomínio correspondente a cada cenário
const MODELS = [
  { 
    id: 1, 
    name: "Alerta de Senha Expirada", 
    domain: "https://ti.acesso-seguro.top",
    html: "<div style='font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #ccc; border-radius: 8px;'><h2>⚠️ Aviso da TI</h2><p>A sua senha de rede expira em 2 dias.</p><p>Por favor, atualize imediatamente clicando no botão abaixo:</p><a href='{{LINK_AQUI}}' style='display: inline-block; background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;'>Atualizar Senha</a></div>" 
  },
  { 
    id: 2, 
    name: "Verificacao de Conta Bancaria", 
    domain: "https://bradesco.acesso-seguro.top",
    html: "<div style='font-family: sans-serif; color: #333; padding: 20px; background-color: #f8fafc; border-left: 4px solid #0284c7;'><h2>🏦 Banco Bradesco</h2><p>Detetámos uma atividade suspeita na sua conta salário.</p><p>Aceda ao link para confirmar a sua identidade: <a href='{{LINK_AQUI}}'>Confirmar Dados Bancários</a></p></div>" 
  },
  { 
    id: 3, 
    name: "Atualizacao de Cadastro RH", 
    domain: "https://rh.acesso-seguro.top",
    html: "<div style='font-family: sans-serif; color: #333; padding: 20px;'><h2>Prezado Colaborador,</h2><p>O setor de Recursos Humanos solicita a revisão dos seus dados cadastrais para o fecho do mês.</p><p>Aceda ao portal: <a href='{{LINK_AQUI}}'>Portal do Colaborador</a></p></div>" 
  },
];

const SECTORS = [
  { id: 1, name: "Financeiro" },
  { id: 2, name: "TI" },
  { id: 3, name: "RH" },
  { id: 4, name: "Comercial" },
  { id: 5, name: "Diretoria" },
];

export default function ModelsPage() {
  const [campaignName, setCampaignName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chosenSectors, setChosenSectors] = useState([]);
  const [attachmentName, setAttachmentName] = useState("");

  const handleClear = () => {
    setCampaignName("");
    setEmailSubject("");
    setSelectedModel("");
    setChosenSectors([]);
    setAttachmentName("");
  };

  const handleAddSector = (sectorName) => {
    if (sectorName && !chosenSectors.includes(sectorName)) {
      setChosenSectors([...chosenSectors, sectorName]);
    }
  };

  const handleRemoveSector = (sectorToRemove) => {
    setChosenSectors(chosenSectors.filter(sector => sector !== sectorToRemove));
  };

  // Busca os dados do modelo selecionado (HTML e Domínio)
  const selectedModelData = MODELS.find(m => String(m.name) === selectedModel);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Criação de Campanhas
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure e dispare novas simulações de phishing.
        </p>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-6">
          
          {/* Linha 1: Dados Básicos */}
          <section className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Nome da Campanha (Uso Interno)</FieldLabel>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Ex: Phishing Férias - Maio/2026"
                className="h-9"
              />
            </Field>

            <Field>
              <FieldLabel>Assunto do E-mail</FieldLabel>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Ex: URGENTE: Atualize a sua senha"
                className="h-9"
              />
            </Field>
          </section>

          {/* Linha 2: Modelo, Domínio e Anexo Falso */}
          <section className="grid gap-4 md:grid-cols-2">
            
            <div className="flex flex-col gap-3">
               <Field>
                <FieldLabel>Modelo de E-mail</FieldLabel>
                <SelectField 
                  value={selectedModel} 
                  onChange={setSelectedModel} 
                  options={MODELS} 
                  placeholder="Selecione um modelo HTML" 
                />
              </Field>
              
              {/* Opção A: Domínio Alvo em formato Read-only */}
              <Field>
                <FieldLabel className="text-xs text-slate-500">🔗 Domínio Alvo da Simulação</FieldLabel>
                <Input
                  value={selectedModelData ? selectedModelData.domain : ""}
                  readOnly
                  disabled
                  placeholder="O domínio será carregado com o modelo..."
                  className="h-8 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed italic text-sm"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Nome do Anexo Falso (Opcional)</FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="Ex: relatorio_demissoes.pdf"
                  className="h-9 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="h-9 border-orange-500 text-orange-600 hover:bg-orange-50"
                  title="Simula um anexo malicioso"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  Anexo
                </Button>
              </div>
            </Field>
          </section>

          {/* Linha 3: Setores (Chips) */}
          <section className="grid gap-4 md:grid-cols-1 border border-slate-100 p-4 rounded-xl bg-slate-50">
            <Field>
              <FieldLabel>Departamentos Alvo (Deixe vazio para envio global)</FieldLabel>
              <div className="flex items-start gap-3 flex-col sm:flex-row">
                <div className="w-full sm:w-1/3">
                  <Select value="" onValueChange={handleAddSector}>
                    <SelectTrigger className="h-9 bg-white">
                      <SelectValue placeholder="Adicionar setor..." />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {SECTORS.map((option) => (
                        <SelectItem key={option.name} value={String(option.name)}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Renderização dos Chips */}
                <div className="flex flex-wrap gap-2 flex-1 min-h-9 items-center">
                  {chosenSectors.length === 0 ? (
                    <span className="text-sm text-slate-400 italic">Todos os utilizadores da base serão afetados.</span>
                  ) : (
                    chosenSectors.map((sector) => (
                      <span 
                        key={sector} 
                        className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800 border border-teal-200"
                      >
                        {sector}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSector(sector)}
                          className="text-teal-600 hover:text-teal-900 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </Field>
          </section>

          {/* Linha 4: Preview do Modelo */}
          <section className="grid gap-2 md:grid-cols-1 mt-2">
             <FieldLabel>Pré-visualização do Modelo</FieldLabel>
             <div className="w-full h-64 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner flex items-center justify-center">
                {selectedModelData ? (
                  <iframe 
                    title="Preview do Email"
                    srcDoc={selectedModelData.html}
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <p className="text-sm">Selecione um modelo acima para visualizar como o e-mail será exibido.</p>
                  </div>
                )}
             </div>
          </section>

          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button type="button" variant="outline" size="sm" onClick={handleClear} className="h-10 px-4">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
              Limpar
            </Button>
            
            <Button type="button" variant="primary" size="sm" className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
              Enviar Campanha
            </Button>
          </footer>

        </CardContent>
      </Card>
    </div >
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