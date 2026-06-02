import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseRemetente(raw) {
  if (!raw) return { nome: "Desconhecido", email: "" };
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { nome: m[1] || m[2], email: m[2] };
  return { nome: raw.split("@")[0], email: raw };
}

function StatusChips({ email }) {
  const chips = [];
  if (email.clicouLink) chips.push(["Clicou", "bg-red-100 text-red-700 border-red-200"]);
  if (email.abriuAnexo) chips.push(["Abriu anexo", "bg-orange-100 text-orange-700 border-orange-200"]);
  if (email.reportouPhishing) chips.push(["Reportou", "bg-teal-100 text-teal-700 border-teal-200"]);
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {chips.map(([label, cls]) => (
        <span key={label} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${cls}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────────
export default function CaixaEntradaPage() {
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaId, setCampanhaId] = useState("");
  const [emails, setEmails] = useState([]);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [reportando, setReportando] = useState(false);

  // Carrega campanhas (rota pública, sem auth)
  useEffect(() => {
    api.get("/api/campanhas", { auth: false })
      .then((data) => {
        const ordenadas = [...data].sort(
          (a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)
        );
        setCampanhas(ordenadas);
        if (ordenadas.length > 0) setCampanhaId(String(ordenadas[0].idCampanha));
      })
      .catch(() => setCampanhas([]));
  }, []);

  const carregarInbox = (id) => {
    if (!id) return;
    setCarregando(true);
    api.get(`/api/simulacao/campanhas/${id}/inbox`, { auth: false })
      .then((data) => {
        setEmails(data);
        setSelecionadoId(data.length > 0 ? data[0].idDisparo : null);
      })
      .catch(() => setEmails([]))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarInbox(campanhaId);
  }, [campanhaId]);

  const selecionado = useMemo(
    () => emails.find((e) => e.idDisparo === selecionadoId) || null,
    [emails, selecionadoId]
  );

  const reportar = async () => {
    if (!selecionado) return;
    setReportando(true);
    try {
      await api.post(`/api/tracking/webhook/reporte/${selecionado.token}`, undefined, { auth: false });
      carregarInbox(campanhaId);
    } catch {
      // silencioso — é uma ferramenta de demonstração
    } finally {
      setReportando(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-800">
      {/* Barra superior — webmail genérico */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <span className="text-base font-bold text-slate-700">WebMail</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={campanhaId}
            onChange={(e) => setCampanhaId(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {campanhas.length === 0 && <option value="">Nenhuma campanha</option>}
            {campanhas.map((c) => (
              <option key={c.idCampanha} value={String(c.idCampanha)}>
                {c.nomeCampanha}
              </option>
            ))}
          </select>
          <button
            onClick={() => carregarInbox(campanhaId)}
            className="flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            title="Atualizar caixa de entrada"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`size-4 ${carregando ? "animate-spin" : ""}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Atualizar
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Lista de e-mails */}
        <aside className="flex w-[340px] shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <h2 className="text-sm font-semibold text-slate-700">Caixa de entrada</h2>
            <p className="text-xs text-slate-400">{emails.length} mensagem(ns)</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {carregando ? (
              <p className="p-4 text-sm text-slate-400">Carregando...</p>
            ) : emails.length === 0 ? (
              <p className="p-4 text-sm text-slate-400">
                Nenhum e-mail. Dispare uma campanha com usuários reais (is_real) para vê-los aqui.
              </p>
            ) : (
              emails.map((e) => {
                const rem = parseRemetente(e.remetente);
                const ativo = e.idDisparo === selecionadoId;
                return (
                  <button
                    key={e.idDisparo}
                    onClick={() => setSelecionadoId(e.idDisparo)}
                    className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors ${ativo ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 uppercase">
                      {rem.nome.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-800">{rem.nome}</span>
                      </span>
                      <span className="block truncate text-sm text-slate-600">{e.assunto}</span>
                      <span className="block truncate text-xs text-slate-400">para {e.emailDestinatario}</span>
                      <StatusChips email={e} />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Painel de leitura */}
        <main className="flex min-w-0 flex-1 flex-col bg-white">
          {!selecionado ? (
            <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-16 opacity-40">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <p className="mt-3 text-sm">Selecione um e-mail para visualizar.</p>
            </div>
          ) : (
            <>
              {/* Cabeçalho do e-mail */}
              <div className="border-b border-slate-200 px-6 py-4">
                <h1 className="text-lg font-bold text-slate-900">{selecionado.assunto}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span><span className="font-medium text-slate-600">De:</span> {selecionado.remetente}</span>
                  <span><span className="font-medium text-slate-600">Para:</span> {selecionado.nomeDestinatario} &lt;{selecionado.emailDestinatario}&gt;</span>
                </div>
                <StatusChips email={selecionado} />
              </div>

              {/* Corpo (links de tracking funcionando de verdade) */}
              <div className="min-h-0 flex-1 overflow-hidden bg-slate-50">
                <iframe
                  title="Conteúdo do e-mail"
                  key={selecionado.idDisparo}
                  srcDoc={`<base target="_blank">` + selecionado.corpoHtml}
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  className="h-full w-full border-0 bg-white"
                />
              </div>

              {/* Rodapé — anexo + reportar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-3">
                <div>
                  {selecionado.nomeAnexo && (
                    <a
                      href={selecionado.linkAnexo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                      </svg>
                      {selecionado.nomeAnexo}
                    </a>
                  )}
                </div>
                <button
                  onClick={reportar}
                  disabled={reportando || selecionado.reportouPhishing}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                  {selecionado.reportouPhishing ? "Reportado" : "Reportar phishing"}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
