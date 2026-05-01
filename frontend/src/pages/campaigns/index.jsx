import { useState, useEffect, useCallback } from "react";
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

// ─── Ícones inline ────────────────────────────────────────────────────────────
const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
  </svg>
);
const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);
const IconChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
  </svg>
);
const IconCheck = ({ className = "size-4 text-teal-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);
const IconX = ({ className = "size-4 text-slate-300" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
  </svg>
);
const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

// ─── Badge de status da campanha ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Enviando: "bg-blue-100 text-blue-800 border-blue-200",
    Concluída: "bg-teal-100 text-teal-800 border-teal-200",
    Erro: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
      {status}
    </span>
  );
}

// ─── Card de estatística ──────────────────────────────────────────────────────
function StatCard({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const colorMap = {
    red: { bar: "bg-red-500", text: "text-red-600", bg: "bg-red-50" },
    orange: { bar: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50" },
    teal: { bar: "bg-teal-500", text: "text-teal-600", bg: "bg-teal-50" },
    slate: { bar: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-50" },
  };
  const c = colorMap[color] ?? colorMap.slate;
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm`}>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${c.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-400">{pct}% do total</p>
    </div>
  );
}

// ─── Chip de filtro ───────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-teal-500 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 1 — Lista de campanhas
// ═══════════════════════════════════════════════════════════════════════════════
function CampaignList({ campanhas, onNova, onMonitorar, onDeletar }) {
  return (
    <div className="grid gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campanhas</h1>
          <p className="mt-1 text-sm text-slate-600">Gerencie e monitore as campanhas de simulação de phishing.</p>
        </div>
        <Button onClick={onNova} className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-4">
          <span className="mr-2"><IconPlus /></span> Nova Campanha
        </Button>
      </header>

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {campanhas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-12 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
            <p className="text-sm">Nenhuma campanha criada ainda.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Modelo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Criação</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campanhas.map((c) => (
                <tr key={c.idCampanha} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{c.nomeCampanha}</td>
                  <td className="px-6 py-4 text-slate-600">{c.nomeModelo}</td>
                  <td className="px-6 py-4"><StatusBadge status={c.statusEnvio} /></td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(c.dataCriacao).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline" size="sm"
                        onClick={() => onMonitorar(c)}
                        className="text-teal-700 border-teal-200 hover:bg-teal-50"
                      >
                        <span className="mr-1"><IconChart /></span> Monitorar
                      </Button>
                      <Button
                        variant="outline" size="sm"
                        onClick={() => onDeletar(c.idCampanha)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <IconTrash />
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
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 2 — Formulário (mantido idêntico ao original)
// ═══════════════════════════════════════════════════════════════════════════════
function CampaignForm({ onBack, onSuccess }) {
  const [modelos, setModelos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chosenSectors, setChosenSectors] = useState([]);
  const [attachmentName, setAttachmentName] = useState("");
  const [includeAnexo, setIncludeAnexo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", description: "", variant: "error" });

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
      onSuccess?.();
    } catch {
      showModal("Erro ao criar campanha", "Ocorreu um erro ao salvar a campanha. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewAnexo = () => {
    const nome = attachmentName || "documento.pdf";
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${nome}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#404040;min-height:100vh;font-family:Arial,sans-serif;display:flex;flex-direction:column}.bar{background:#3a3a3a;padding:10px 20px;color:#ccc;font-size:13px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a}.wrap{flex:1;overflow:auto;padding:28px;display:flex;justify-content:center}.page{background:#fff;width:min(794px,100%);min-height:900px;padding:56px 64px;box-shadow:0 4px 24px rgba(0,0,0,.5)}.heading{border-bottom:2px solid #e0e0e0;padding-bottom:16px;margin-bottom:28px;text-align:center}.heading h1{font-size:18px;color:#1a1a1a}.heading p{font-size:11px;color:#999;margin-top:4px}p{font-size:14px;line-height:1.8;color:#444;margin-bottom:12px}.warn{background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:16px 20px;margin:24px 0}.warn p{color:#856404;font-size:13px}.btn{display:inline-block;background:#0052cc;color:#fff;padding:11px 28px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold;margin-top:14px}.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;z-index:999;transition:opacity .4s}.spin{width:44px;height:44px;border:4px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:sp .8s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}</style></head><body><div class="bar"><span>${nome}</span></div><div class="wrap"><div class="page"><div class="heading"><h1>DOCUMENTO CONFIDENCIAL</h1><p>Uso interno — não divulgar</p></div><div class="warn"><p><strong>⚠ Acesso restrito.</strong> Para visualizar o conteúdo completo, realize a autenticação corporativa.</p><a href="#" class="btn">Autenticar e Visualizar</a></div><p>Este documento contém informações confidenciais destinadas exclusivamente ao destinatário identificado.</p></div></div><div class="overlay" id="ov"><div class="spin"></div><p>Carregando documento...</p></div><script>setTimeout(()=>{const o=document.getElementById('ov');o.style.opacity='0';setTimeout(()=>o.remove(),400)},1800)</script></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  return (
    <div className="grid gap-4">
      <Modal open={modal.open} onClose={() => setModal((m) => ({ ...m, open: false }))} title={modal.title} description={modal.description} variant={modal.variant} />
      <LoadingOverlay open={loading} message="Gerando tokens da campanha..." description="Isso pode levar alguns segundos" />

      <header className="flex items-start gap-3">
        <button onClick={onBack} className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" title="Voltar">
          <IconBack />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nova Campanha</h1>
          <p className="mt-1 text-sm text-slate-600">Configure e dispare uma nova simulação de phishing.</p>
        </div>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-6">

          {/* Linha 1 */}
          <section className="grid gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel>Nome da Campanha</FieldLabel>
              <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Ex: Phishing RH Q3" className="h-9" />
            </Field>
            <Field>
              <FieldLabel>Modelo de E-mail</FieldLabel>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecione um modelo..." /></SelectTrigger>
                <SelectContent>
                  {modelos.map((m) => (
                    <SelectItem key={m.idModelo} value={String(m.idModelo)}>{m.nomeModelo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Assunto do E-mail</FieldLabel>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Selecione um modelo para pré-preencher" className="h-9" />
            </Field>
          </section>

          {/* Linha 2 */}
          <section className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel className="text-xs text-slate-500">🔗 Domínio Alvo da Simulação</FieldLabel>
              <Input value={selectedModelData ? selectedModelData.dominioAlvo : ""} readOnly disabled placeholder="Carregado com o modelo..." className="h-9 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed italic text-sm" />
            </Field>
            <Field>
              <FieldLabel>Anexo Falso</FieldLabel>
              <div className="flex items-center gap-2">
                <label className="flex shrink-0 items-center gap-1.5 cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 h-9">
                  <input type="checkbox" checked={includeAnexo} onChange={(e) => { setIncludeAnexo(e.target.checked); if (!e.target.checked) setAttachmentName(""); }} className="w-3.5 h-3.5 rounded accent-orange-500 cursor-pointer" />
                  <span className="text-xs text-slate-600 select-none font-medium">Incluir</span>
                </label>
                <Input value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} placeholder="relatorio_demissoes.pdf" disabled={!includeAnexo} className="h-9 flex-1 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:italic" />
                <Button type="button" variant="outline" size="default" className="h-9 shrink-0 border-orange-400 text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!includeAnexo || !attachmentName} onClick={handlePreviewAnexo}>
                  <span className="mr-1"><IconEye /></span> Ver
                </Button>
              </div>
            </Field>
          </section>

          {/* Linha 3 — Setores */}
          <section className="grid gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50">
            <Field>
              <FieldLabel>Departamentos Alvo (Deixe vazio para envio global)</FieldLabel>
              <div className="flex items-start gap-3 flex-col sm:flex-row">
                <div className="w-full sm:w-1/3">
                  <Select value="" onValueChange={handleAddSector}>
                    <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Adicionar setor..." /></SelectTrigger>
                    <SelectContent align="start">
                      {setores.map((s) => (
                        <SelectItem key={s.idSetor} value={String(s.idSetor)}>{s.nomeSetor}</SelectItem>
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

          {/* Preview */}
          <section className="grid gap-2">
            <FieldLabel>Pré-visualização do Modelo</FieldLabel>
            <div className="w-full h-64 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner flex items-center justify-center">
              {selectedModelData ? (
                <iframe title="Preview do Email" srcDoc={selectedModelData.textoHtml} className="w-full h-full border-none" sandbox="allow-same-origin" />
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

          {/* Footer */}
          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button type="button" variant="outline" size="sm" onClick={handleClear} className="h-10 px-4">
              <span className="mr-2"><IconTrash /></span> Limpar
            </Button>
            <Button type="button" size="sm" onClick={handleSubmit} className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white">
              <span className="mr-2"><IconSend /></span> Enviar Campanha
            </Button>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 3 — Monitoramento
// ═══════════════════════════════════════════════════════════════════════════════
const FILTROS = [
  { label: "Todos", key: "todos" },
  { label: "Clicou no link", key: "clicouLink" },
  { label: "Abriu anexo", key: "abriuAnexo" },
  { label: "Reportou", key: "reportouPhishing" },
  { label: "Sem interação", key: "semInteracao" },
];

function MonitoringView({ campanha, onBack }) {
  const [disparos, setDisparos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const fetchDisparos = useCallback(async (filtro) => {
    setLoading(true);
    try {
      let params = "";
      if (filtro === "clicouLink")       params = "?clicouLink=true";
      else if (filtro === "abriuAnexo")  params = "?abriuAnexo=true";
      else if (filtro === "reportouPhishing") params = "?reportouPhishing=true";
      // semInteracao: busca tudo e filtra no client (nenhum dos três é true)

      const data = await api.get(`/api/campanhas/${campanha.idCampanha}/disparos${params}`);
      if (filtro === "semInteracao") {
        setDisparos(data.filter((d) => !d.clicouLink && !d.abriuAnexo && !d.reportouPhishing));
      } else {
        setDisparos(data);
      }
    } catch {
      setDisparos([]);
    } finally {
      setLoading(false);
    }
  }, [campanha.idCampanha]);

  // Carrega sem filtro uma vez pra ter os totais
  const [totais, setTotais] = useState({ total: 0, clicouLink: 0, abriuAnexo: 0, reportouPhishing: 0 });
  useEffect(() => {
    api.get(`/api/campanhas/${campanha.idCampanha}/disparos`)
      .then((data) => {
        setTotais({
          total: data.length,
          clicouLink: data.filter((d) => d.clicouLink).length,
          abriuAnexo: data.filter((d) => d.abriuAnexo).length,
          reportouPhishing: data.filter((d) => d.reportouPhishing).length,
        });
        setDisparos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [campanha.idCampanha]);

  const handleFiltro = (key) => {
    setFiltroAtivo(key);
    if (key === "todos") {
      fetchDisparos("todos");
    } else {
      fetchDisparos(key);
    }
  };

  return (
    <div className="grid gap-4">
      {/* Header */}
      <header className="flex items-start gap-3">
        <button onClick={onBack} className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" title="Voltar">
          <IconBack />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{campanha.nomeCampanha}</h1>
            <StatusBadge status={campanha.statusEnvio} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Modelo: <span className="font-medium text-slate-700">{campanha.nomeModelo}</span>
            {" · "}
            Domínio: <span className="font-medium text-slate-700">{campanha.dominioAlvo}</span>
          </p>
        </div>
      </header>

      {/* Cards de estatística */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total de alvos" value={totais.total} total={totais.total} color="slate" />
        <StatCard label="Clicaram no link" value={totais.clicouLink} total={totais.total} color="red" />
        <StatCard label="Abriram anexo" value={totais.abriuAnexo} total={totais.total} color="orange" />
        <StatCard label="Reportaram" value={totais.reportouPhishing} total={totais.total} color="teal" />
      </div>

      {/* Tabela */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Filtros */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 flex-wrap">
          {FILTROS.map((f) => (
            <FilterChip key={f.key} label={f.label} active={filtroAtivo === f.key} onClick={() => handleFiltro(f.key)} />
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-3">
            <svg className="animate-spin size-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando disparos...
          </div>
        ) : disparos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <p className="text-sm">Nenhum registro encontrado para este filtro.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Destinatário</th>
                <th className="px-6 py-4">Setor</th>
                <th className="px-6 py-4 text-center">Link</th>
                <th className="px-6 py-4 text-center">Anexo</th>
                <th className="px-6 py-4 text-center">Reportou</th>
                <th className="px-6 py-4 text-slate-400 text-right">Envio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disparos.map((d) => (
                <tr key={d.idDisparo} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-slate-900">{d.nomeDestinatario}</p>
                    <p className="text-xs text-slate-400">{d.emailDestinatario}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 border border-slate-200">
                      {d.setor}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    {d.clicouLink ? <IconCheck className="size-5 text-red-500 mx-auto" /> : <IconX className="size-5 text-slate-200 mx-auto" />}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {d.abriuAnexo ? <IconCheck className="size-5 text-orange-500 mx-auto" /> : <IconX className="size-5 text-slate-200 mx-auto" />}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {d.reportouPhishing ? <IconCheck className="size-5 text-teal-500 mx-auto" /> : <IconX className="size-5 text-slate-200 mx-auto" />}
                  </td>
                  <td className="px-6 py-3 text-right text-xs text-slate-400">
                    {new Date(d.dataEnvio).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — Orquestra as três views
// ═══════════════════════════════════════════════════════════════════════════════
export default function CampaignsPage() {
  const [view, setView] = useState("list"); // "list" | "form" | "monitoring"
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaAtiva, setCampanhaAtiva] = useState(null);
  const [modal, setModal] = useState({ open: false, title: "", description: "", variant: "error" });

  const showModal = (title, description, variant = "error") =>
    setModal({ open: true, title, description, variant });

  const loadCampanhas = useCallback(() => {
    api.get("/api/campanhas").then(setCampanhas).catch(() => setCampanhas([]));
  }, []);

  useEffect(() => { loadCampanhas(); }, [loadCampanhas]);

  const handleDeletar = async (id) => {
    if (!window.confirm("Deletar esta campanha? Esta ação não pode ser desfeita.")) return;
    try {
      await api.delete(`/api/campanhas/${id}`);
      loadCampanhas();
    } catch {
      showModal("Erro", "Não foi possível deletar a campanha.", "error");
    }
  };

  const handleMonitorar = (campanha) => {
    setCampanhaAtiva(campanha);
    setView("monitoring");
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <Modal open={modal.open} onClose={() => setModal((m) => ({ ...m, open: false }))} title={modal.title} description={modal.description} variant={modal.variant} />

      {view === "list" && (
        <CampaignList
          campanhas={campanhas}
          onNova={() => setView("form")}
          onMonitorar={handleMonitorar}
          onDeletar={handleDeletar}
        />
      )}

      {view === "form" && (
        <CampaignForm
          onBack={() => setView("list")}
          onSuccess={() => { loadCampanhas(); setView("list"); }}
        />
      )}

      {view === "monitoring" && campanhaAtiva && (
        <MonitoringView
          campanha={campanhaAtiva}
          onBack={() => setView("list")}
        />
      )}
    </div>
  );
}