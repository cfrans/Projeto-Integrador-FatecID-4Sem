import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  MegaphoneIcon,
  UsersIcon,
  CursorArrowRippleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/ui/FilterBar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const TEAL = "#1D9E75";
const ORANGE = "#D85A30";
const NAVY2 = "#1E3A5F";
const AMBER = "#F59E0B";
const PIE_COLORS = [ORANGE, TEAL, NAVY2, "#0F6E56", "#BA7517", "#888780"];

const BASE_PLUGINS = {
  legend: {
    position: "bottom",
    labels: {
      usePointStyle: true,
      pointStyle: "circle",
      boxWidth: 8,
      padding: 14,
      color: "#475569",
      font: { size: 11, family: "inherit", weight: "500" },
    },
  },
  tooltip: {
    backgroundColor: "#0F172A",
    titleColor: "#FFFFFF",
    bodyColor: "#E2E8F0",
    padding: 10,
    cornerRadius: 8,
    displayColors: true,
    usePointStyle: true,
    boxPadding: 4,
    titleFont: { size: 12, weight: "600" },
    bodyFont: { size: 12 },
  },
};

const BAR_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGINS,
  scales: {
    x: { grid: { display: false }, ticks: { color: "#64748B", font: { size: 11 } } },
    y: { grid: { color: "#E2E8F0" }, ticks: { color: "#64748B", font: { size: 11 } }, beginAtZero: true },
  },
};

const DOUGHNUT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: BASE_PLUGINS,
};

const LINE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGINS,
  scales: {
    x: { grid: { display: false }, ticks: { color: "#64748B", font: { size: 11 } } },
    y: { grid: { color: "#E2E8F0" }, ticks: { color: "#64748B", font: { size: 11 } }, beginAtZero: true },
  },
  elements: {
    point: { radius: 3, hoverRadius: 6, borderWidth: 2, backgroundColor: "#FFFFFF" },
    line: { borderWidth: 2 },
  },
};

const TAXA_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    ...BASE_PLUGINS,
    legend: { display: false },
    tooltip: {
      ...BASE_PLUGINS.tooltip,
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.x.toFixed(1)}% de cliques`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      grid: { color: "#E2E8F0" },
      ticks: { color: "#64748B", font: { size: 11 }, callback: (v) => `${v}%` },
    },
    y: { grid: { display: false }, ticks: { color: "#475569", font: { size: 11, weight: "500" } } },
  },
};

function corPorTaxa(pct) {
  if (pct < 15) return TEAL;
  if (pct < 40) return AMBER;
  return ORANGE;
}

function classeBadgePct(pct) {
  if (pct < 15) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (pct < 40) return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

const PERIODOS = [
  { label: "Últimos 7 dias",  value: "7d"   },
  { label: "Últimos 30 dias", value: "30d"  },
  { label: "Últimos 6 meses", value: "6m"   },
  { label: "Tudo",            value: "tudo" },
];

const DEFAULT_PERIODO = "30d";
const TODOS = "__todos__";

export default function Graphics() {
  const navigate = useNavigate();

  // Filtros
  const [periodo, setPeriodo]       = useState(DEFAULT_PERIODO);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim]       = useState("");
  const [idSetor, setIdSetor]       = useState("");
  const [idModelo, setIdModelo]     = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Catalogos pros selects
  const [setores, setSetores] = useState([]);
  const [modelos, setModelos] = useState([]);

  // Dados do dashboard
  const [dados, setDados]           = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro]             = useState("");

  // Carrega catalogos uma vez
  useEffect(() => {
    api.get("/api/setores").then(setSetores).catch(() => setSetores([]));
    api.get("/api/modelos").then(setModelos).catch(() => setModelos([]));
  }, []);

  // Busca dashboard sempre que algum filtro mudar
  useEffect(() => {
    let cancelado = false;
    async function fetchDados() {
      setCarregando(true);
      setErro("");
      try {
        const params = new URLSearchParams();
        params.set("periodo", periodo);
        if (dataInicio) params.set("dataInicio", dataInicio);
        if (dataFim)    params.set("dataFim",    dataFim);
        if (idSetor)    params.set("idSetor",    idSetor);
        if (idModelo)   params.set("idModelo",   idModelo);
        const res = await api.get(`/api/graficos/dashboard?${params.toString()}`);
        if (!cancelado) setDados(res);
      } catch (e) {
        if (!cancelado) setErro(e instanceof ApiError ? e.message : "Erro ao carregar gráficos");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    fetchDados();
    return () => { cancelado = true; };
  }, [periodo, dataInicio, dataFim, idSetor, idModelo]);

  const totaisDados   = dados?.porSetor          ?? [];
  const totais        = dados?.totais            ?? { campanhas: 0, usuarios: 0, percentualCliques: 0, percentualReportes: 0 };
  const evolucao      = dados?.evolucao          ?? [];
  const campanhas     = dados?.campanhasRecentes ?? [];

  // Mostra skeleton so na primeira carga; em refreshes (filtro mudou) mantem dados antigos.
  const skeleton = carregando && !dados;

  const cliquesSetor = {
    labels: totaisDados.map((s) => s.setor),
    datasets: [
      { label: "Clicou",   data: totaisDados.map((s) => s.cliques),  backgroundColor: ORANGE, borderRadius: 6, maxBarThickness: 28 },
      { label: "Anexo",    data: totaisDados.map((s) => s.anexos),   backgroundColor: TEAL,   borderRadius: 6, maxBarThickness: 28 },
      { label: "Reportou", data: totaisDados.map((s) => s.reportes), backgroundColor: NAVY2,  borderRadius: 6, maxBarThickness: 28 },
    ],
  };

  const distribuicaoPizza = {
    labels: totaisDados.map((s) => s.setor),
    datasets: [
      {
        data: totaisDados.map((s) => s.cliques),
        backgroundColor: PIE_COLORS,
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const evolucaoMensal = {
    labels: evolucao.map((e) => e.label),
    datasets: [
      {
        label: "Cliques",
        data: evolucao.map((e) => e.cliques),
        borderColor: ORANGE,
        backgroundColor: "rgba(216,90,48,0.12)",
        fill: true,
        tension: 0.4,
        pointBorderColor: ORANGE,
      },
      {
        label: "Reportes",
        data: evolucao.map((e) => e.reportes),
        borderColor: TEAL,
        backgroundColor: "rgba(29,158,117,0.12)",
        fill: true,
        tension: 0.4,
        pointBorderColor: TEAL,
      },
    ],
  };

  const taxaPorSetorDados = totaisDados
    .map((s) => ({
      setor: s.setor,
      pct: s.disparos > 0 ? (s.cliques / s.disparos) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  const taxaCliquePorSetor = {
    labels: taxaPorSetorDados.map((s) => s.setor),
    datasets: [
      {
        label: "Taxa de clique",
        data: taxaPorSetorDados.map((s) => s.pct),
        backgroundColor: taxaPorSetorDados.map((s) => corPorTaxa(s.pct)),
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  // Filtros considerados "ativos" para badge da FilterBar
  const filtrosAtivos = [
    periodo !== DEFAULT_PERIODO,
    !!dataInicio,
    !!dataFim,
    !!idSetor,
    !!idModelo,
  ].filter(Boolean).length;

  const hasActiveFilters = filtrosAtivos > 0;

  function limparFiltros() {
    setPeriodo(DEFAULT_PERIODO);
    setDataInicio("");
    setDataFim("");
    setIdSetor("");
    setIdModelo("");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="graphics-badge flex items-center justify-center size-12 rounded-xl bg-indigo-700 shrink-0 cursor-default shadow-sm overflow-hidden">
          <ChartBadgeIcon className="size-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gráficos</h1>
          <p className="mt-1 text-sm text-slate-600">
            Análise detalhada das campanhas e métricas de desempenho.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        label="Filtrar dashboard"
        isOpen={filterOpen}
        onToggle={() => setFilterOpen((v) => !v)}
        isActive={hasActiveFilters}
        activeCount={filtrosAtivos}
        onClear={limparFiltros}
      >
        <Field className="w-auto shrink-0 min-w-44">
          <FieldLabel className="text-xs text-slate-500">Período</FieldLabel>
          <Select
            value={periodo}
            onValueChange={(v) => { setPeriodo(v); setDataInicio(""); setDataFim(""); }}
          >
            <SelectTrigger className="h-9">
              <SelectValue>
                {PERIODOS.find((p) => p.value === periodo)?.label ?? ""}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PERIODOS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="w-auto shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data início</FieldLabel>
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="h-9 w-40"
          />
        </Field>

        <Field className="w-auto shrink-0">
          <FieldLabel className="text-xs text-slate-500">Data fim</FieldLabel>
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="h-9 w-40"
          />
        </Field>

        <Field className="w-auto shrink-0 min-w-40">
          <FieldLabel className="text-xs text-slate-500">Setor</FieldLabel>
          <Select
            value={idSetor || TODOS}
            onValueChange={(v) => setIdSetor(v === TODOS ? "" : v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos">
                {idSetor ? (setores.find((s) => String(s.idSetor) === idSetor)?.nomeSetor ?? "Todos") : "Todos"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {setores.map((s) => (
                <SelectItem key={s.idSetor} value={String(s.idSetor)}>{s.nomeSetor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="w-auto shrink-0 min-w-48">
          <FieldLabel className="text-xs text-slate-500">Modelo</FieldLabel>
          <Select
            value={idModelo || TODOS}
            onValueChange={(v) => setIdModelo(v === TODOS ? "" : v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos">
                {idModelo ? (modelos.find((m) => String(m.idModelo) === idModelo)?.nomeModelo ?? "Todos") : "Todos"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {modelos.map((m) => (
                <SelectItem key={m.idModelo} value={String(m.idModelo)}>{m.nomeModelo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FilterBar>

      {erro && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campanhas", value: String(totais.campanhas),               icon: MegaphoneIcon,          accent: "bg-indigo-600",  iconBg: "bg-indigo-50",  iconColor: "text-indigo-600"  },
          { label: "Usuários",  value: String(totais.usuarios),                icon: UsersIcon,              accent: "bg-sky-600",     iconBg: "bg-sky-50",     iconColor: "text-sky-600"     },
          { label: "Cliques",   value: `${totais.percentualCliques}%`,         icon: CursorArrowRippleIcon,  accent: "bg-orange-500",  iconBg: "bg-orange-50",  iconColor: "text-orange-500"  },
          { label: "Reportes",  value: `${totais.percentualReportes}%`,        icon: ShieldCheckIcon,        accent: "bg-emerald-600", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
        ].map((m) => (
          <Card key={m.label} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-full w-1 ${m.accent}`} />
            <CardContent className="p-4 pl-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{m.label}</p>
                  {skeleton ? (
                    <Skeleton className="mt-2 h-7 w-16" />
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{m.value}</p>
                  )}
                </div>
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${m.iconBg}`}>
                  <m.icon className={`size-5 ${m.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-800 mb-4">Interações por setor</p>
            <div className="h-[280px]">
              {skeleton ? <Skeleton className="h-full w-full" /> : <Bar data={cliquesSetor} options={BAR_OPTIONS} />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-800 mb-4">Distribuição de cliques</p>
            <div className="relative h-[280px]">
              {skeleton ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="size-44 rounded-full" />
                </div>
              ) : (
                <>
                  <Doughnut data={distribuicaoPizza} options={DOUGHNUT_OPTIONS} />
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-10">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Taxa de clique</p>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">
                      {`${totais.percentualCliques}%`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-slate-800 mb-4">Evolução mensal</p>
          <div className="h-[280px]">
            {skeleton ? <Skeleton className="h-full w-full" /> : <Line data={evolucaoMensal} options={LINE_OPTIONS} />}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-sm font-semibold text-slate-800">Taxa de clique por setor</p>
            <p className="text-[11px] text-slate-500">cliques ÷ disparos no período</p>
          </div>
          {skeleton ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5" style={{ width: `${90 - i * 15}%` }} />
              ))}
            </div>
          ) : taxaPorSetorDados.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">Sem dados no período</p>
          ) : (
            <div style={{ height: Math.max(140, taxaPorSetorDados.length * 34 + 60) }}>
              <Bar data={taxaCliquePorSetor} options={TAXA_OPTIONS} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold mb-4">Últimas campanhas</p>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground text-xs">
                <tr>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Nome</th>
                  <th className="text-center p-2">Alvos</th>
                  <th className="text-center p-2">Cliques</th>
                  <th className="text-center p-2">%</th>
                  <th className="text-center p-2">Reportes</th>
                </tr>
              </thead>
              <tbody>
                {skeleton && [1, 2, 3, 4].map((i) => (
                  <tr key={`sk-${i}`} className="border-t">
                    <td className="p-2"><Skeleton className="h-4 w-10" /></td>
                    <td className="p-2"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-2"><Skeleton className="mx-auto h-4 w-8" /></td>
                    <td className="p-2"><Skeleton className="mx-auto h-4 w-8" /></td>
                    <td className="p-2"><Skeleton className="mx-auto h-5 w-12 rounded-full" /></td>
                    <td className="p-2"><Skeleton className="mx-auto h-4 w-8" /></td>
                  </tr>
                ))}
                {!skeleton && campanhas.length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Sem campanhas no período</td></tr>
                )}
                {!skeleton && campanhas.map((c) => {
                  const pct = c.alvos > 0 ? Math.round((c.cliques / c.alvos) * 100) : 0;
                  return (
                    <tr key={c.id} className="border-t cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/create', { state: { view: 'monitoring', campanhaId: c.id } })}>
                      <td className="p-2">{formatarData(c.data)}</td>
                      <td className="p-2 font-medium text-indigo-700 hover:underline">{c.nome}</td>
                      <td className="p-2 text-center tabular-nums">{c.alvos}</td>
                      <td className="p-2 text-center text-orange-500 tabular-nums">{c.cliques}</td>
                      <td className="p-2 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[44px] rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${classeBadgePct(pct)}`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="p-2 text-center text-green-500 tabular-nums">{c.reportes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

function ChartBadgeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="14" width="4" height="6" rx="1" className="animate-chart-wave-1" />
      <rect x="10" y="8" width="4" height="12" rx="1" className="animate-chart-wave-2" />
      <rect x="17" y="11" width="4" height="9" rx="1" className="animate-chart-wave-3" />
      <style>{`
        .animate-chart-wave-1, .animate-chart-wave-2, .animate-chart-wave-3 {
          transform-origin: bottom;
          transform-box: fill-box;
          transform: scaleY(1.1);
          opacity: 0.9;
        }

        .graphics-badge:hover .animate-chart-wave-1 { animation: chart-wave-down 0.6s ease-in-out forwards; }
        .graphics-badge:hover .animate-chart-wave-2 { animation: chart-wave-down 0.6s ease-in-out 0.1s forwards; }
        .graphics-badge:hover .animate-chart-wave-3 { animation: chart-wave-down 0.6s ease-in-out 0.2s forwards; }

        @keyframes chart-wave-down {
          0% { transform: scaleY(1.1); opacity: 0.9; }
          50% { transform: scaleY(0.6); opacity: 0.6; }
          100% { transform: scaleY(1.1); opacity: 0.9; }
        }
      `}</style>
    </svg>
  );
}
