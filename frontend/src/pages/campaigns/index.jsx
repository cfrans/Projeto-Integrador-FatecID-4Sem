import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InfoHint } from "@/components/ui/InfoHint";
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
import { FilterBar } from "@/components/ui/FilterBar";
import { api } from "@/lib/api";
import { PaginationBar } from "@/components/ui/PaginationBar";

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
const IconHook = ({ className = "size-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.91" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="3.41" r="1.91" />
    <path d="M12,5.32v.21a8.5,8.5,0,0,0,3.49,6.7,5.73,5.73,0,1,1-9.22,4.54" />
    <polyline points="9.14 16.77 6.27 13.91 6.27 16.77" />
  </svg>
);
const IconArchive = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
    <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);
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
const STATUSES = ["Pendente", "Enviando", "Concluída", "Erro"];

function CampaignList({ campanhas, archivedIds, onNova, onMonitorar, onArquivar }) {
  const [parent] = useAutoAnimate();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [mostrarArquivados, setMostrarArquivados] = useState(false);
  const [filtroAberto, setFiltroAberto] = useState(false);

  const [sortCol, setSortCol] = useState("Criação");
  const [sortDir, setSortDir] = useState("desc");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const limparFiltros = () => { setDataInicio(""); setDataFim(""); setFiltroStatus("todos"); setPaginaAtual(1); };

  const campanhasFiltradas = useMemo(() => campanhas.filter((c) => {
    const arquivada = archivedIds.has(c.idCampanha);
    if (mostrarArquivados ? !arquivada : arquivada) return false;
    if (!mostrarArquivados && filtroStatus !== "todos" && c.statusEnvio !== filtroStatus) return false;
    if (!dataInicio && !dataFim) return true;
    const criacao = new Date(c.dataCriacao);
    if (dataInicio) {
      const ini = new Date(dataInicio);
      ini.setHours(0, 0, 0, 0);
      if (criacao < ini) return false;
    }
    if (dataFim) {
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);
      if (criacao > fim) return false;
    }
    return true;
  }), [campanhas, archivedIds, mostrarArquivados, filtroStatus, dataInicio, dataFim]);

  const filtroAtivo = dataInicio || dataFim || filtroStatus !== "todos";
  const totalVisiveis = useMemo(
    () => campanhas.filter((c) => mostrarArquivados ? archivedIds.has(c.idCampanha) : !archivedIds.has(c.idCampanha)).length,
    [campanhas, archivedIds, mostrarArquivados]
  );

  const SORT_KEYS = {
    Nome: "nomeCampanha",
    Modelo: "nomeModelo",
    Status: "statusEnvio",
    "Criação": "dataCriacao",
  };

  const sorted = useMemo(() => {
    return [...campanhasFiltradas].sort((a, b) => {
      if (!sortCol) return 0;
      const key = SORT_KEYS[sortCol];
      const va = a[key];
      const vb = b[key];
      let cmp;
      if (key === "dataCriacao") {
        cmp = new Date(va) - new Date(vb);
      } else {
        cmp = String(va).localeCompare(String(vb), "pt-BR");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [campanhasFiltradas, sortCol, sortDir]);

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

  return (
    <div className="grid gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="hook-badge flex items-center justify-center size-12 rounded-xl bg-orange-500 shrink-0 cursor-default">
            <IconHook className="hook-icon size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campanhas</h1>
            <p className="mt-1 text-sm text-slate-600">Gerencie e monitore as campanhas de simulação de phishing.</p>
          </div>
        </div>
        <Button onClick={onNova} className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-4">
          <span className="mr-2"><IconPlus /></span> Nova Campanha
        </Button>
      </header>

      <FilterBar
        label="Filtrar campanhas"
        isOpen={filtroAberto}
        onToggle={() => setFiltroAberto((v) => !v)}
        isActive={filtroAtivo}
        activeCount={[dataInicio, dataFim, filtroStatus !== "todos" ? filtroStatus : ""].filter(Boolean).length}
        onClear={limparFiltros}
        rightSlot={
          <Button
            type="button" variant="outline" size="sm"
            onClick={() => { setMostrarArquivados((v) => !v); limparFiltros(); }}
            className={`h-9 gap-1.5 ${mostrarArquivados ? "border-slate-400 bg-slate-100 text-slate-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
          >
            <IconArchive /> {mostrarArquivados ? "Ver ativas" : "Arquivadas"}
          </Button>
        }
      >
        <Field className="w-auto shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data inicial</FieldLabel>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} max={dataFim || undefined} className="h-9 w-40" />
        </Field>
        <Field className="w-auto shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data final</FieldLabel>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} min={dataInicio || undefined} className="h-9 w-40" />
        </Field>
        {!mostrarArquivados && (
          <Field className="w-auto shrink-0">
            <FieldLabel className="text-xs text-slate-500">Status</FieldLabel>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="h-9 w-40 text-sm">
                <SelectValue>{filtroStatus === "todos" ? "Todos status" : filtroStatus}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos status</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        )}
      </FilterBar>

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-w-0 w-full">
        {campanhasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-12 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
            <p className="text-sm">
              {mostrarArquivados ? "Nenhuma campanha arquivada." : filtroAtivo ? "Nenhuma campanha no período/status selecionado." : "Nenhuma campanha criada ainda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Nome")}>
                  Nome <SortIcon col="Nome" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Modelo")}>
                  Modelo <SortIcon col="Modelo" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Status")}>
                  Status <SortIcon col="Status" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 select-none" onClick={() => handleSort("Criação")}>
                  Criação <SortIcon col="Criação" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody ref={parent} className="divide-y divide-slate-100">
              {pagina.map((c) => {
                const arquivada = archivedIds.has(c.idCampanha);
                return (
                  <tr key={c.idCampanha} className={`transition-colors ${arquivada ? "opacity-60 bg-slate-50" : "hover:bg-slate-50"}`}>
                    <td className="px-4 py-3 font-medium text-slate-900">{c.nomeCampanha}</td>
                    <td className="px-4 py-3 text-slate-600">{c.nomeModelo}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.statusEnvio} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(c.dataCriacao).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {!arquivada && (
                          <Button variant="outline" size="sm" onClick={() => onMonitorar(c)} className="text-teal-700 border-teal-200 hover:bg-teal-50">
                            <span className="mr-1"><IconChart /></span> Monitorar
                          </Button>
                        )}
                        <Button
                          variant="outline" size="sm"
                          onClick={() => onArquivar(c.idCampanha)}
                          className={arquivada ? "text-slate-600 border-slate-200 hover:bg-slate-100 gap-1.5" : "text-orange-600 border-orange-200 hover:bg-orange-50 gap-1.5"}
                        >
                          <IconArchive /> {arquivada ? "Desarquivar" : "Arquivar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
  const [previewAnexo, setPreviewAnexo] = useState({ open: false, html: "" });
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState({ open: false, title: "", description: "", variant: "error", onCloseCallback: null });

  const showModal = (title, description, variant = "error", onCloseCallback = null) =>
    setModal({ open: true, title, description, variant, onCloseCallback });

  useEffect(() => {
    api.get("/api/modelos").then(res => setModelos(res.filter(m => m.isAtivo !== false))).catch(() => setModelos([]));
    api.get("/api/setores").then(setSetores).catch(() => setSetores([]));
    api.get("/api/usuarios-destino").then(setUsuarios).catch(() => setUsuarios([]));
  }, []);

  const selectedModelData = modelos.find((m) => String(m.idModelo) === selectedModel);

  const handleModelChange = (value) => {
    setSelectedModel(value);
    const modelo = modelos.find((m) => String(m.idModelo) === value);
    if (modelo) {
      setEmailSubject(modelo.assuntoPadrao);
      let sugestion = "documento-importante.pdf";
      const dom = modelo.dominioAlvo.toLowerCase();
      const nom = modelo.nomeModelo.toLowerCase();
      if (dom.includes("rh")) sugestion = "relatorio_demissoes.pdf";
      else if (dom.includes("bradesco") || dom.includes("banco")) sugestion = "comprovante.pdf";
      else if (dom.includes("ti") || dom.includes("suporte")) sugestion = "politica-senhas.pdf";
      else if (nom.includes("consórcio") || nom.includes("consorcio")) sugestion = "carta-contemplacao.pdf";
      setAttachmentName(sugestion);
    }
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
      showModal("Campanha criada!", "O envio está em progresso em background. Você pode acompanhar o progresso na aba Monitorar.", "success", () => {
        handleClear();
        onSuccess?.();
      });
    } catch {
      showModal("Erro ao criar campanha", "Ocorreu um erro ao salvar a campanha. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewAnexo = () => {
    const nome = attachmentName || "documento.pdf";
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${nome}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#404040;min-height:100vh;font-family:Arial,sans-serif;display:flex;flex-direction:column}.bar{background:#3a3a3a;padding:10px 20px;color:#ccc;font-size:13px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a}.wrap{flex:1;overflow:auto;padding:28px;display:flex;justify-content:center}.page{background:#fff;width:min(794px,100%);min-height:900px;padding:56px 64px;box-shadow:0 4px 24px rgba(0,0,0,.5)}.heading{border-bottom:2px solid #e0e0e0;padding-bottom:16px;margin-bottom:28px;text-align:center}.heading h1{font-size:18px;color:#1a1a1a}.heading p{font-size:11px;color:#999;margin-top:4px}p{font-size:14px;line-height:1.8;color:#444;margin-bottom:12px}.warn{background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:16px 20px;margin:24px 0}.warn p{color:#856404;font-size:13px}.btn{display:inline-block;background:#0052cc;color:#fff;padding:11px 28px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold;margin-top:14px}.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;z-index:999;transition:opacity .4s}.spin{width:44px;height:44px;border:4px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:sp .8s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}</style></head><body><div class="bar"><span>${nome}</span></div><div class="wrap"><div class="page"><div class="heading"><h1>DOCUMENTO CONFIDENCIAL</h1><p>Uso interno — não divulgar</p></div><div class="warn"><p><strong>⚠ Acesso restrito.</strong> Para visualizar o conteúdo completo, realize a autenticação corporativa.</p><a href="#" class="btn">Autenticar e Visualizar</a></div><p>Este documento contém informações confidenciais destinadas exclusivamente ao destinatário identificado.</p></div></div><div class="overlay" id="ov"><div class="spin"></div><p>Carregando documento...</p></div><script>setTimeout(()=>{const o=document.getElementById('ov');o.style.opacity='0';setTimeout(()=>o.remove(),400)},1800)</script></body></html>`;
    setPreviewAnexo({ open: true, html });
  };


  return (
    <div className="grid gap-4">
      <Modal open={modal.open} onClose={() => {
        setModal((m) => ({ ...m, open: false }));
        if (modal.onCloseCallback) modal.onCloseCallback();
      }} title={modal.title} description={modal.description} variant={modal.variant} />
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
              <FieldLabel>
                Nome da Campanha
                <InfoHint text="Nome interno para identificar esta campanha nos relatórios. O alvo não vê esse nome. Ex: 'Phishing RH Q3'." />
              </FieldLabel>
              <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Ex: Phishing RH Q3" className="h-9" />
            </Field>
            <Field>
              <FieldLabel>
                Modelo de E-mail
                <InfoHint text="Modelo criado na aba 'Modelos' que será enviado aos alvos. Ele define o remetente, o assunto e o conteúdo do e-mail." />
              </FieldLabel>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecione um modelo...">
                    {selectedModel ? (modelos.find((m) => String(m.idModelo) === String(selectedModel))?.nomeModelo ?? "Selecione um modelo...") : "Selecione um modelo..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {modelos.map((m) => (
                    <SelectItem key={m.idModelo} value={String(m.idModelo)}>{m.nomeModelo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>
                Assunto do E-mail
                <InfoHint text="Assunto que o alvo verá na caixa de entrada. Vem pré-preenchido pelo modelo, mas você pode ajustar só para esta campanha." />
              </FieldLabel>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Selecione um modelo para pré-preencher" className="h-9" />
            </Field>
          </section>

          {/* Linha 2 */}
          <section className="grid gap-4 md:grid-cols-2 md:items-start">
            {/* Domínio: informativo, definido pelo modelo (não é um campo editável) */}
            <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span aria-hidden className="text-base leading-none mt-0.5">🔗</span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Página falsa da simulação</p>
                {selectedModelData ? (
                  <p className="font-medium text-slate-700 break-all">{selectedModelData.dominioAlvo}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Escolha um modelo para ver o domínio.</p>
                )}
                <p className="mt-0.5 text-xs text-slate-400">Definida automaticamente pelo modelo. É para onde o alvo é levado ao clicar no link.</p>
              </div>
            </div>
            <Field>
              <FieldLabel>
                Anexo Falso (nome do arquivo)
                <InfoHint text="Opcional. É só o NOME de um arquivo falso que aparece anexado ao e-mail (ex: relatorio_demissoes.pdf). Não envia um arquivo real: ao 'abrir', o alvo cai numa página simulada e o sistema registra. Marque 'Incluir' para ativar e use 'Ver' para pré-visualizar." />
              </FieldLabel>
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
              <FieldLabel>
                Departamentos Alvo (Deixe vazio para envio global)
                <InfoHint text="Escolha os setores que receberão a simulação. Se não selecionar nenhum, o envio vai para todos os colaboradores da base (exceto administradores)." />
              </FieldLabel>
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
                    <span className="text-sm text-slate-400 italic">Todos os usuários da base serão afetados ({usuarios.filter(u => u.isAtivo !== false && (!u.tipoAcesso || !u.tipoAcesso.toLowerCase().includes('admin'))).length} alvos).</span>
                  ) : (
                    <>
                      {chosenSectors.map((setor) => (
                        <span key={setor.idSetor} className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800 border border-teal-200">
                          {setor.nomeSetor}
                          <button type="button" onClick={() => handleRemoveSector(setor.idSetor)} className="text-teal-600 hover:text-teal-900">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                            </svg>
                          </button>
                        </span>
                      ))}
                      <span className="text-sm text-slate-400 italic ml-2">
                        Total: {usuarios.filter(u => u.isAtivo !== false && (!u.tipoAcesso || !u.tipoAcesso.toLowerCase().includes('admin')) && chosenSectors.find(cs => String(cs.idSetor) === String(u.idSetor))).length} alvos
                      </span>
                    </>
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

      {/* Modal Pré-visualização do Anexo */}
      {previewAnexo.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setPreviewAnexo({ open: false, html: "" })}></div>
          <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-700">Pré-visualização do Anexo</h3>
              <button onClick={() => setPreviewAnexo({ open: false, html: "" })} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                <IconX className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-slate-100">
              <iframe srcDoc={previewAnexo.html} className="w-full h-full border-0" title="Pré-visualização do Anexo" />
            </div>
          </div>
        </div>
      )}
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

const PAGE_SIZE = 10;


function MonitoringView({ campanha, onBack }) {
  const [parent2] = useAutoAnimate();
  const [disparos, setDisparos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [setorFiltro, setSetorFiltro] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totais, setTotais] = useState({ total: 0, clicouLink: 0, abriuAnexo: 0, reportouPhishing: 0 });

  const fetchAllDisparos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/api/campanhas/${campanha.idCampanha}/disparos`);
      setTotais({
        total: data.length,
        clicouLink: data.filter((d) => d.clicouLink).length,
        abriuAnexo: data.filter((d) => d.abriuAnexo).length,
        reportouPhishing: data.filter((d) => d.reportouPhishing).length,
      });
      setDisparos(data);
    } catch {
      setDisparos([]);
    } finally {
      setLoading(false);
    }
  }, [campanha.idCampanha]);

  useEffect(() => {
    fetchAllDisparos();
  }, [fetchAllDisparos]);

  const handleFiltro = (key) => {
    setFiltroAtivo(key);
    setPage(1);
    setPesquisa("");
    setSetorFiltro("todos");
  };

  useEffect(() => { setPage(1); }, [pesquisa, setorFiltro, filtroAtivo]);

  const setoresUnicos = useMemo(
    () => [...new Set(disparos.map((d) => d.setor).filter(Boolean))].sort(),
    [disparos]
  );

  const disparosFiltrados = useMemo(() => disparos
    .filter((d) => {
      if (filtroAtivo === "todos") return true;
      if (filtroAtivo === "clicouLink") return d.clicouLink;
      if (filtroAtivo === "abriuAnexo") return d.abriuAnexo;
      if (filtroAtivo === "reportouPhishing") return d.reportouPhishing;
      if (filtroAtivo === "semInteracao") return !d.clicouLink && !d.abriuAnexo && !d.reportouPhishing;
      return true;
    })
    .filter((d) => setorFiltro === "todos" || d.setor === setorFiltro)
    .filter((d) => {
      if (!pesquisa.trim()) return true;
      const q = pesquisa.toLowerCase();
      return (
        (d.nomeDestinatario ?? "").toLowerCase().includes(q) ||
        (d.emailDestinatario ?? "").toLowerCase().includes(q) ||
        (d.setor ?? "").toLowerCase().includes(q)
      );
    }), [disparos, filtroAtivo, setorFiltro, pesquisa]);

  const totalPaginas = Math.max(1, Math.ceil(disparosFiltrados.length / pageSize));
  const paginaAtual = Math.min(page, totalPaginas);
  const inicio = (paginaAtual - 1) * pageSize;
  const fim = inicio + pageSize;
  const disparosPagina = disparosFiltrados.slice(inicio, fim);

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
        <Button variant="outline" size="sm" onClick={fetchAllDisparos} disabled={loading} className="bg-white border-slate-200 shadow-sm shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 mr-1 ${loading ? "animate-spin" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Atualizar
        </Button>
      </header>

      {/* Cards de estatística */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total de alvos" value={totais.total} total={totais.total} color="slate" />
        <StatCard label="Clicaram no link" value={totais.clicouLink} total={totais.total} color="red" />
        <StatCard label="Abriram anexo" value={totais.abriuAnexo} total={totais.total} color="orange" />
        <StatCard label="Reportaram" value={totais.reportouPhishing} total={totais.total} color="teal" />
      </div>

      {/* Tabela */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-w-0 w-full">
        {/* Filtros */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 flex-wrap">
          {FILTROS.map((f) => (
            <FilterChip key={f.key} label={f.label} active={filtroAtivo === f.key} onClick={() => handleFiltro(f.key)} />
          ))}
          {setoresUnicos.length > 0 && (
            <div className="ml-auto">
              <Select value={setorFiltro} onValueChange={setSetorFiltro}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue>{setorFiltro === "todos" ? "Todos setores" : setorFiltro}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos setores</SelectItem>
                  {setoresUnicos.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Busca de texto */}
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <Input
              placeholder="Buscar por nome, e-mail ou departamento..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-3">
            <svg className="animate-spin size-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando disparos...
          </div>
        ) : disparosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <p className="text-sm">
              {pesquisa ? "Nenhum resultado para a busca." : "Nenhum registro encontrado para este filtro."}
            </p>
          </div>
        ) : (
          <>
            <PaginationBar
              inicio={inicio} fim={fim} total={disparosFiltrados.length}
              paginaAtual={paginaAtual} totalPaginas={totalPaginas}
              pageSize={pageSize} setPage={setPage} setPageSize={setPageSize}
            />
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Destinatário</th>
                  <th className="px-6 py-4">Setor</th>
                  <th className="px-6 py-4 text-center">Pontuação</th>
                  <th className="px-6 py-4 text-center">Link</th>
                  <th className="px-6 py-4 text-center">Anexo</th>
                  <th className="px-6 py-4 text-center">Reportou</th>
                  <th className="px-6 py-4 text-slate-400 text-right">Envio</th>
                </tr>
              </thead>
              <tbody ref={parent2} className="divide-y divide-slate-100">
                {disparosPagina.map((d) => (
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
                      <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
                        {d.pontuacao ?? 0}
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
            </div>

            <PaginationBar
              inicio={inicio} fim={fim} total={disparosFiltrados.length}
              paginaAtual={paginaAtual} totalPaginas={totalPaginas}
              pageSize={pageSize} setPage={setPage} setPageSize={setPageSize}
              borderTop
            />
          </>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — Orquestra as três views
// ═══════════════════════════════════════════════════════════════════════════════
const ARCHIVE_KEY = "nemo_archived_campaigns";

export default function CampaignsPage() {
  const location = useLocation();
  const [view, setView] = useState(location.state?.view || "list"); // "list" | "form" | "monitoring"
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaAtiva, setCampanhaAtiva] = useState(null);
  const [modal, setModal] = useState({ open: false, title: "", description: "", variant: "error" });
  const [confirmArchive, setConfirmArchive] = useState({ open: false, id: null, arquivada: false });
  const [archivedIds, setArchivedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(ARCHIVE_KEY) ?? "[]")); }
    catch { return new Set(); }
  });

  const loadCampanhas = useCallback(() => {
    api.get("/api/campanhas").then((data) => {
      setCampanhas(data);
      if (location.state?.campanhaId && location.state?.view === "monitoring") {
        const found = data.find((c) => c.idCampanha === location.state.campanhaId);
        if (found) setCampanhaAtiva(found);
      }
    }).catch(() => setCampanhas([]));
  }, [location.state]);

  useEffect(() => { loadCampanhas(); }, [loadCampanhas]);

  const handleArquivar = (id) => {
    setConfirmArchive({ open: true, id, arquivada: archivedIds.has(id) });
  };

  const confirmarArquivar = () => {
    const { id } = confirmArchive;
    setConfirmArchive({ open: false, id: null, arquivada: false });
    if (id == null) return;
    setArchivedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleMonitorar = (campanha) => {
    setCampanhaAtiva(campanha);
    setView("monitoring");
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <Modal open={modal.open} onClose={() => setModal((m) => ({ ...m, open: false }))} title={modal.title} description={modal.description} variant={modal.variant} />
      <Modal
        open={confirmArchive.open}
        onClose={() => setConfirmArchive({ open: false, id: null, arquivada: false })}
        title={confirmArchive.arquivada ? "Desarquivar campanha?" : "Arquivar campanha?"}
        description={confirmArchive.arquivada ? "A campanha voltará para a lista ativa." : "A campanha será movida para o arquivo. Você pode reativá-la depois."}
        variant="warning"
        confirm
        confirmLabel={confirmArchive.arquivada ? "Desarquivar" : "Arquivar"}
        onConfirm={confirmarArquivar}
      />

      {view === "list" && (
        <CampaignList
          campanhas={campanhas}
          archivedIds={archivedIds}
          onNova={() => setView("form")}
          onMonitorar={handleMonitorar}
          onArquivar={handleArquivar}
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