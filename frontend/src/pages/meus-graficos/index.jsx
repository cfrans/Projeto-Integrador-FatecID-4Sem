import { useState, useEffect, useRef, useMemo } from "react";
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
import { Doughnut, Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/ui/FilterBar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Velocimetro, faixaPontuacao } from "@/components/ui/velocimetro";


import { api } from "@/lib/api";

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

// ── Paleta idêntica à página de gráficos do admin ──────────────────────────────
const TEAL   = "#1D9E75";
const ORANGE = "#D85A30";
const NAVY2  = "#1E3A5F";

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
    line:  { borderWidth: 2 },
  },
};



// ── Meses ──────────────────────────────────────────────────────────────────────
const MESES_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

// ── Mapeia resposta da API ─────────────────────────────────────────────────────
function mapearDadosApi(res, maxDateOverride = null) {
  const historico = res.historico ?? [];

  const clicou   = historico.filter((e) => e.tipoEvento === "CLIQUE_LINK").length;
  const abriu    = historico.filter((e) => e.tipoEvento === "ABRIU_ANEXO").length;
  const reportou = historico.filter((e) => e.tipoEvento === "REPORTE_PHISHING").length;
  const disparosUnicos = clicou + abriu + reportou;

  // Agrupa eventos para o gráfico de linha (Simulações)
  // Baseado nas datas do histórico filtrado para mostrar os meses corretos
  let mesesAgrupados = [];
  if (historico.length === 0) {
    const agora = maxDateOverride ? new Date(maxDateOverride + "T23:59:59") : new Date();
    mesesAgrupados = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(agora.getFullYear(), agora.getMonth() - (5 - i), 1);
      return { mes: MESES_PT[d.getMonth()], ano: d.getFullYear(), simulacoes: 0, cliques: 0 };
    });
  } else {
    const datas = historico.map(e => e.criadoEm ? new Date(e.criadoEm) : null).filter(Boolean);
    const minDate = new Date(Math.min(...datas));
    const maxDate = new Date(Math.max(...datas));
    
    const mMin = minDate.getFullYear() * 12 + minDate.getMonth();
    const mMax = maxDate.getFullYear() * 12 + maxDate.getMonth();
    
    // Garante pelo menos 6 meses no gráfico se o intervalo for muito curto
    let startM = mMin;
    if (mMax - mMin < 5) {
      startM = mMax - 5;
    }
    
    for (let m = startM; m <= mMax; m++) {
      const ano = Math.floor(m / 12);
      const mesIdx = m % 12;
      mesesAgrupados.push({ mes: MESES_PT[mesIdx], ano: ano, simulacoes: 0, cliques: 0 });
    }
  }

  historico.forEach((e) => {
    if (!e.criadoEm || e.tipoEvento === "TREINAMENTO") return;
    const d = new Date(e.criadoEm);
    const idx = mesesAgrupados.findIndex(
      (m) => m.ano === d.getFullYear() && m.mes === MESES_PT[d.getMonth()]
    );
    if (idx !== -1) {
      mesesAgrupados[idx].simulacoes++;
      if (e.tipoEvento === "CLIQUE_LINK") mesesAgrupados[idx].cliques++;
    }
  });

  // Histórico de evolução do saldo (pontos do mais antigo ao mais recente)
  const evolucaoSaldo = historico
    .filter((e) => e.saldoApos != null)
    .slice()
    .reverse()
    .map((e) => {
      const d = e.criadoEm ? new Date(e.criadoEm) : null;
      const label = d
        ? `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`
        : "—";
      return { label, saldo: e.saldoApos };
    });

  return {
    totalSimulacoes: disparosUnicos,
    clicou,
    abriu,
    reportou,
    ignorou: 0,
    ultimos6: mesesAgrupados,
    evolucaoSaldo,
    saldoAtual: res.saldoAtual ?? 500,
    historicoRaw: historico,
  };
}

// ── Filtra dados por intervalo de datas ───────────────────────────────────────
function filtrarPorData(dados, dataInicio, dataFim) {
  if (!dados) return dados;
  if (!dataInicio && !dataFim) return dados;

  const inicio = dataInicio ? new Date(dataInicio) : null;
  const fim    = dataFim   ? new Date(dataFim + "T23:59:59") : null;

  const historicFiltrado = dados.historicoRaw.filter((e) => {
    if (!e.criadoEm) return true;
    const d = new Date(e.criadoEm);
    if (inicio && d < inicio) return false;
    if (fim    && d > fim)    return false;
    return true;
  });

  return mapearDadosApi({ saldoAtual: dados.saldoAtual, historico: historicFiltrado }, dataFim || null);
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function MeusGraficosPage() {
  const [dadosBase, setDadosBase] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Filtros de data
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim,    setDataFim]    = useState("");
  const [preset,     setPreset]     = useState("custom");
  const [filterOpen, setFilterOpen] = useState(false);

  function aplicarPreset(p) {
    setPreset(p);
    const hoje = new Date();
    const formata = (d) => d.toISOString().split("T")[0];

    if (p === "custom") return;
    if (p === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setDataInicio(formata(d));
      setDataFim(formata(hoje));
    } else if (p === "3m") {
      const d = new Date();
      d.setMonth(d.getMonth() - 3);
      setDataInicio(formata(d));
      setDataFim(formata(hoje));
    } else if (p === "6m") {
      const d = new Date();
      d.setMonth(d.getMonth() - 6);
      setDataInicio(formata(d));
      setDataFim(formata(hoje));
    } else if (p === "ano") {
      const d = new Date(hoje.getFullYear(), 0, 1);
      setDataInicio(formata(d));
      setDataFim(formata(hoje));
    }
  }

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await api.get("/api/colaborador/pontuacao");
        setDadosBase(mapearDadosApi(res));
      } catch {
        setDadosBase(mapearDadosApi({ saldoAtual: 500, historico: [] }));
      } finally {
        setCarregando(false);
      }
    }
    fetchDados();
  }, []);

  const dados = useMemo(
    () => filtrarPorData(dadosBase, dataInicio, dataFim),
    [dadosBase, dataInicio, dataFim]
  );

  const filtrosAtivos = [!!dataInicio, !!dataFim].filter(Boolean).length;

  function limparFiltros() {
    setDataInicio("");
    setDataFim("");
    setPreset("custom");
  }

  // Atualiza as datas customizadas se o usuário digitar manualmente, mudando o preset para custom
  function updateDataInicio(v) { setDataInicio(v); setPreset("custom"); }
  function updateDataFim(v) { setDataFim(v); setPreset("custom"); }

  const getBtnClass = (p) => preset === p 
    ? "h-9 bg-teal-50 text-teal-700 border-teal-500 hover:bg-teal-100 hover:text-teal-800 font-medium transition-colors" 
    : "h-9 text-slate-600 border-slate-300 hover:bg-slate-100 transition-colors";

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="size-10 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!dados) return null;

  const { totalSimulacoes, clicou, abriu, reportou, saldoAtual, ultimos6, evolucaoSaldo } = dados;
  const taxaCliques  = totalSimulacoes > 0 ? Math.round((clicou  / totalSimulacoes) * 100) : 0;
  const taxaReportes = totalSimulacoes > 0 ? Math.round((reportou / totalSimulacoes) * 100) : 0;
  const faixa = faixaPontuacao(saldoAtual);

  // ── Dados dos gráficos ──────────────────────────────────────────────────────
  const dadosPizza = {
    labels: ["Reportou", "Clicou", "Abriu anexo"],
    datasets: [{
      data: [reportou, clicou, abriu],
      backgroundColor: [TEAL, ORANGE, NAVY2],
      borderColor: "#FFFFFF",
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const dadosSimulacoes = {
    labels: ultimos6.map((h) => h.mes),
    datasets: [
      {
        label: "Simulações recebidas",
        data: ultimos6.map((h) => h.simulacoes),
        borderColor: NAVY2,
        backgroundColor: "rgba(30,58,95,0.12)",
        fill: true,
        tension: 0.4,
        pointBorderColor: NAVY2,
      },
      {
        label: "Cliques",
        data: ultimos6.map((h) => h.cliques),
        borderColor: ORANGE,
        backgroundColor: "rgba(216,90,48,0.12)",
        fill: true,
        tension: 0.4,
        pointBorderColor: ORANGE,
      },
    ],
  };

  const dadosEvolucao = {
    labels: evolucaoSaldo.map((e) => e.label),
    datasets: [{
      label: "Pontuação",
      data: evolucaoSaldo.map((e) => e.saldo),
      borderColor: TEAL,
      backgroundColor: "rgba(29,158,117,0.12)",
      fill: true,
      tension: 0.4,
      pointBorderColor: TEAL,
    }],
  };

  const evolucaoOptions = {
    ...LINE_OPTIONS,
    scales: {
      ...LINE_OPTIONS.scales,
      y: {
        ...LINE_OPTIONS.scales.y,
        min: 0,
        max: 1000,
        ticks: { color: "#64748B", font: { size: 11 }, stepSize: 200 },
      },
    },
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center size-12 rounded-xl bg-rose-700 shrink-0 shadow-sm">
          <UserChartIcon className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meu Desempenho</h1>
          <p className="mt-1 text-sm text-slate-600">Acompanhe seus resultados nas simulações de phishing</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-6">
        <FilterBar
          label="Filtrar por período"
          isOpen={filterOpen}
          onToggle={() => setFilterOpen((v) => !v)}
          isActive={filtrosAtivos > 0}
          activeCount={filtrosAtivos}
          onClear={limparFiltros}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Field className="w-full sm:w-auto shrink-0 pr-4 sm:border-r border-slate-200">
              <FieldLabel className="text-xs text-slate-500">Filtros rápidos</FieldLabel>
              <div className="flex gap-2 mt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => aplicarPreset("30d")} className={getBtnClass("30d")}>30 dias</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => aplicarPreset("3m")}  className={getBtnClass("3m")}>3 meses</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => aplicarPreset("6m")}  className={getBtnClass("6m")}>6 meses</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => aplicarPreset("ano")} className={getBtnClass("ano")}>Este ano</Button>
              </div>
            </Field>
            
            <div className="flex gap-4">
              <Field className="w-auto shrink-0">
                <FieldLabel className="text-xs text-slate-500">Data início (Customizado)</FieldLabel>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => updateDataInicio(e.target.value)}
                  className="h-9 w-40"
                />
              </Field>
              <Field className="w-auto shrink-0">
                <FieldLabel className="text-xs text-slate-500">Data fim (Customizado)</FieldLabel>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => updateDataFim(e.target.value)}
                  className="h-9 w-40"
                />
              </Field>
            </div>
          </div>
        </FilterBar>
      </div>

      {/* Velocímetro + KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Velocímetro */}
        <Card>
          <CardContent className="p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-slate-800 mb-3 self-start">Índice de segurança</p>
            <Velocimetro saldo={saldoAtual} />
            <p className={`mt-3 text-xs text-center px-4 font-medium ${faixa.texto}`}>
              {saldoAtual < 300
                ? "Atenção: você está na faixa crítica. Revise os conteúdos educativos."
                : saldoAtual < 700
                ? "Continue melhorando! Você está na faixa de atenção."
                : "Parabéns! Você está na faixa segura. Continue assim!"}
            </p>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Simulações recebidas", valor: totalSimulacoes, accent: "bg-slate-600",   iconBg: "bg-slate-100",  iconColor: "text-slate-600",  icone: "📨" },
            { label: "Reportou suspeita",    valor: `${taxaReportes}%`, accent: "bg-teal-600",  iconBg: "bg-teal-100",   iconColor: "text-teal-600",   icone: "🛡️" },
            { label: "Clicou no link",       valor: `${taxaCliques}%`,  accent: "bg-orange-500", iconBg: "bg-orange-100", iconColor: "text-orange-600", icone: "⚠️" },
            { label: "Abriu anexo",          valor: abriu,              accent: "bg-indigo-600", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", icone: "📎" },
          ].map((k) => (
            <Card key={k.label} className="relative overflow-hidden h-full flex flex-col">
              <div className={`absolute top-0 left-0 h-full w-1 ${k.accent}`} />
              <CardContent className="p-5 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-1">{k.label}</p>
                  <div className={`shrink-0 flex items-center justify-center size-9 rounded-lg ${k.iconBg} ${k.iconColor}`}>
                    <span className="text-lg">{k.icone}</span>
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-black text-slate-800 tabular-nums leading-none tracking-tight">{k.valor}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gráfico: evolução da pontuação */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-slate-800 mb-4">Evolução da pontuação</p>
          {evolucaoSaldo.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Sem eventos de pontuação no período</p>
          ) : (
            <div className="h-[220px]">
              <Line data={dadosEvolucao} options={evolucaoOptions} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos: rosca + linha de simulações */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-800 mb-4">Respostas às simulações</p>
            <div className="relative h-[240px]">
              {totalSimulacoes === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  Sem dados no período
                </div>
              ) : (
                <>
                  <Doughnut data={dadosPizza} options={DOUGHNUT_OPTIONS} />
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-10">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Simulações</p>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalSimulacoes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-800 mb-4">Simulações</p>
            <div className="h-[240px]">
              <Line data={dadosSimulacoes} options={LINE_OPTIONS} />
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function UserChartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <polyline points="22 12 18 16 16 14" />
    </svg>
  );
}
