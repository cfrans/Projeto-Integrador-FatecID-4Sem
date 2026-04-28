import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";


export default function CampaignsPage() {
  const [modelos, setModelos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chosenSectors, setChosenSectors] = useState([]);
  const [attachmentName, setAttachmentName] = useState("");
  const [includeAnexo, setIncludeAnexo] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", description: "", variant: "error" });
  const [loading, setLoading] = useState(false);


  const showModal = (title, description, variant = "error") =>
    setModal({ open: true, title, description, variant });


  useEffect(() => {
    api.get("/api/modelos").then(setModelos).catch(() => setModelos([]));
    api.get("/api/setores").then(setSetores).catch(() => setSetores([]));
  }, []);


  const selectedModelData = modelos.find((m) => String(m.idModelo) === selectedModel);


  const handleModelChange = (value) => {
    setSelectedModel(value);
    const modelo = modelos.find((m) => String(m.idModelo) === value);
    if (modelo) setEmailSubject(modelo.assuntoPadrao);
  };


  const handleClear = () => {
    setCampaignName(""); setEmailSubject(""); setSelectedModel("");
    setChosenSectors([]); setAttachmentName(""); setIncludeAnexo(false);
  };


  const handleAddSector = (idSetor) => {
    if (idSetor && !chosenSectors.find((s) => s.idSetor === Number(idSetor))) {
      const setor = setores.find((s) => s.idSetor === Number(idSetor));
      if (setor) setChosenSectors([...chosenSectors, setor]);
    }
  };


  const handleRemoveSector = (idSetor) => {
    setChosenSectors(chosenSectors.filter((s) => s.idSetor !== idSetor));
  };


  const handleSubmit = async () => {
    if (!campaignName || !emailSubject || !selectedModel) {
      showModal("Campos obrigatórios", "Preencha o nome da campanha, assunto e selecione um modelo.", "warning");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/campanhas", {
        nomeCampanha: campaignName,
        assuntoEmail: emailSubject,
        nomeAnexo: includeAnexo && attachmentName ? attachmentName : null,
        idModelo: Number(selectedModel),
        idSetores: chosenSectors.map((s) => s.idSetor),
      });
      showModal("Campanha criada!", "A campanha foi salva e os tokens foram gerados com sucesso.", "success");
      handleClear();
    } catch {
      showModal("Erro ao criar campanha", "Ocorreu um erro ao salvar a campanha. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };


  const handlePreviewAnexo = () => {
    const nome = attachmentName || "documento.pdf";
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${nome}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#404040;min-height:100vh;font-family:Arial,sans-serif;display:flex;flex-direction:column}
    .bar{background:#3a3a3a;padding:10px 20px;color:#ccc;font-size:13px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a}
    .wrap{flex:1;overflow:auto;padding:28px;display:flex;justify-content:center}
    .page{background:#fff;width:min(794px,100%);min-height:900px;padding:56px 64px;box-shadow:0 4px 24px rgba(0,0,0,.5)}
    .heading{border-bottom:2px solid #e0e0e0;padding-bottom:16px;margin-bottom:28px;text-align:center}
    .heading h1{font-size:18px;color:#1a1a1a}
    .heading p{font-size:11px;color:#999;margin-top:4px}
    p{font-size:14px;line-height:1.8;color:#444;margin-bottom:12px}
    .warn{background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:16px 20px;margin:24px 0}
    .warn p{color:#856404;font-size:13px}
    .btn{display:inline-block;background:#0052cc;color:#fff;padding:11px 28px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold;margin-top:14px}
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;z-index:999;transition:opacity .4s}
    .spin{width:44px;height:44px;border:4px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:sp .8s linear infinite}
    @keyframes sp{to{transform:rotate(360deg)}}
  </style>
</head>
<body>
  <div class="bar">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ccc"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8" stroke="#ccc" stroke-width="1.5" fill="none"/></svg>
    <span>${nome}</span>
  </div>
  <div class="wrap">
    <div class="page">
      <div class="heading"><h1>DOCUMENTO CONFIDENCIAL</h1><p>Uso interno — não divulgar</p></div>
      <div class="warn">
        <p><strong>⚠ Acesso restrito.</strong> Para visualizar o conteúdo completo, realize a autenticação corporativa.</p>
        <a href="#" class="btn">Autenticar e Visualizar</a>
      </div>
      <p>Este documento contém informações confidenciais destinadas exclusivamente ao destinatário identificado. Qualquer acesso não autorizado é estritamente proibido.</p>
      <p>Em caso de recebimento indevido, entre em contato com o remetente imediatamente e exclua este arquivo.</p>
    </div>
  </div>
  <div class="overlay" id="ov"><div class="spin"></div><p>Carregando documento...</p></div>
  <script>setTimeout(()=>{const o=document.getElementById('ov');o.style.opacity='0';setTimeout(()=>o.remove(),400)},1800)</script>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  };


  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <Modal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        description={modal.description}
        variant={modal.variant}
      />

      <LoadingOverlay
        open={loading}
        message="Gerando tokens da campanha..."
        description="Isso pode levar alguns segundos"
      />

      <header className="flex items-center gap-3">
        {/* Anzol (SVG) — temático: phishing = pescar */}
        <div className="flex items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-rose-500 p-2.5 shadow-md shadow-orange-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 text-white"
            aria-hidden="true"
          >
            {/* Olhal */}
            <circle cx="16.5" cy="5" r="2" />
            {/* Haste + curva + ponta voltando para cima */}
            <path d="M16.5 7v9a4.5 4.5 0 0 1-9 0v-1.5" />
            {/* Barba (farpa) */}
            <path d="M7.5 14l2 1.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Criação de Campanhas</h1>
          <p className="mt-0.5 text-sm text-slate-600">Configure e dispare novas simulações de phishing.</p>
        </div>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-6">

          {/* Linha 1 — Nome da campanha + Modelo + Assunto (3 colunas) */}
          <section className="grid gap-4 md:grid-cols-3">
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
              <FieldLabel>Modelo de E-mail</FieldLabel>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecione um modelo HTML">
                    {selectedModelData ? selectedModelData.nomeModelo : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  {modelos.map((m) => (
                    <SelectItem key={m.idModelo} value={String(m.idModelo)} textValue={m.nomeModelo}>
                      {m.nomeModelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Assunto do E-mail</FieldLabel>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Selecione um modelo para pré-preencher"
                className="h-9"
              />
            </Field>
          </section>

          {/* Linha 2 — Domínio Alvo + Anexo Falso (2 colunas) */}
          <section className="grid gap-4 md:grid-cols-2">

            {/* Domínio (read-only) */}
            <Field>
              <FieldLabel className="text-xs text-slate-500">🔗 Domínio Alvo da Simulação</FieldLabel>
              <Input
                value={selectedModelData ? selectedModelData.dominioAlvo : ""}
                readOnly
                disabled
                placeholder="Carregado com o modelo..."
                className="h-9 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed italic text-sm"
              />
            </Field>

            {/* Anexo: checkbox + input + botão tudo na mesma linha */}
            <Field>
              <FieldLabel>Anexo Falso</FieldLabel>
              <div className="flex items-center gap-2">
                <label className="flex shrink-0 items-center gap-1.5 cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 h-9">
                  <input
                    type="checkbox"
                    checked={includeAnexo}
                    onChange={(e) => {
                      setIncludeAnexo(e.target.checked);
                      if (!e.target.checked) setAttachmentName("");
                    }}
                    className="w-3.5 h-3.5 rounded accent-orange-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 select-none font-medium">Incluir</span>
                </label>

                <Input
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="relatorio_demissoes.pdf"
                  disabled={!includeAnexo}
                  className="h-9 flex-1 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:italic"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="h-9 shrink-0 border-orange-400 text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!includeAnexo || !attachmentName}
                  onClick={handlePreviewAnexo}
                  title="Visualizar como o anexo aparecerá para o alvo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Ver
                </Button>
              </div>
            </Field>

          </section>

          {/* Linha 3 — Departamentos alvo */}
          <section className="grid gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50">
            <Field>
              <FieldLabel>Departamentos Alvo (Deixe vazio para envio global)</FieldLabel>
              <div className="flex items-start gap-3 flex-col sm:flex-row">
                <div className="w-full sm:w-1/3">
                  <Select value="" onValueChange={handleAddSector}>
                    <SelectTrigger className="h-9 bg-white">
                      <SelectValue placeholder="Adicionar setor..." />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {setores.map((s) => (
                        <SelectItem key={s.idSetor} value={String(s.idSetor)}>
                          {s.nomeSetor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 flex-1 min-h-9 items-center">
                  {chosenSectors.length === 0 ? (
                    <span className="text-sm text-slate-400 italic">Todos os usuários da base serão afetados.</span>
                  ) : (
                    chosenSectors.map((setor) => (
                      <span key={setor.idSetor} className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800 border border-teal-200">
                        {setor.nomeSetor}
                        <button type="button" onClick={() => handleRemoveSector(setor.idSetor)} className="text-teal-600 hover:text-teal-900">
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

          {/* Linha 4 — Preview do modelo */}
          <section className="grid gap-2 mt-2">
            <FieldLabel>Pré-visualização do Modelo</FieldLabel>
            <div className="w-full h-64 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner flex items-center justify-center">
              {selectedModelData ? (
                <iframe
                  title="Preview do Email"
                  srcDoc={selectedModelData.textoHtml}
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

          {/* Footer — ações */}
          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button type="button" variant="outline" size="sm" onClick={handleClear} className="h-10 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
              Limpar
            </Button>
            <Button type="button" size="sm" onClick={handleSubmit} className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
              Enviar Campanha
            </Button>
          </footer>

        </CardContent>
      </Card>
    </div>
  );
}