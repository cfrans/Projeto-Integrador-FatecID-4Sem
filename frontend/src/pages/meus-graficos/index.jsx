import { useState, useEffect } from "react";
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
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const TEAL = "#1D9E75";
const ORANGE = "#D85A30";
const NAVY = "#1E3A5F";
const SLATE = "#94a3b8";

// ── Dados de exemplo (substituir por chamadas reais à API) ────────────────────
const DADOS_MOCK = {
  totalSimulacoes: 8,
  clicou: 3,
  reportou: 4,
  ignorou: 1,
  quizzes: { concluidos: 3, total: 4, mediaAcertos: 72 },
  historico: [
    { mes: "Jan", simulacoes: 1, cliques: 1 },
    { mes: "Fev", simulacoes: 2, cliques: 1 },
    { mes: "Mar", simulacoes: 1, cliques: 0 },
    { mes: "Abr", simulacoes: 2, cliques: 1 },
    { mes: "Mai", simulacoes: 2, cliques: 0 },
  ],
  campanhasRecentes: [
    { data: "10/05", nome: "Alerta de Segurança", resultado: "Reportou", tag: "teal" },
    { data: "02/05", nome: "Promoção Banco", resultado: "Clicou", tag: "orange" },
    { data: "24/04", nome: "Reset de Senha TI", resultado: "Reportou", tag: "teal" },
    { data: "15/04", nome: "Entrega Correios", resultado: "Ignorou", tag: "slate" },
    { data: "03/04", nome: "Seguro Veicular", resultado: "Clicou", tag: "orange" },
  ],
};

const TAG_STYLE = {
  teal: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
  slate: "bg-slate-100 text-slate-600",
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function MeusGraficosPage() {
  const { user } = useAuth();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Tentar buscar dados reais da API; fallback para mock em dev
    async function fetchDados() {
      try {
        const res = await api.get(`/relatorio/usuario/${user?.sub || user?.id}`);
        setDados(res);
      } catch {
        // Em desenvolvimento ou se endpoint não existir ainda, usa mock
        setDados(DADOS_MOCK);
      } finally {
        setCarregando(false);
      }
    }
    fetchDados();
  }, [user]);

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

  const { totalSimulacoes, clicou, reportou, ignorou, quizzes, historico, campanhasRecentes } = dados;
  const taxaCliques = totalSimulacoes > 0 ? Math.round((clicou / totalSimulacoes) * 100) : 0;
  const taxaReportes = totalSimulacoes > 0 ? Math.round((reportou / totalSimulacoes) * 100) : 0;

  // Dados dos gráficos
  const dadosPizza = {
    labels: ["Reportou", "Clicou", "Ignorou"],
    datasets: [
      {
        data: [reportou, clicou, ignorou],
        backgroundColor: [TEAL, ORANGE, SLATE],
        borderWidth: 0,
      },
    ],
  };

  const dadosHistorico = {
    labels: historico.map((h) => h.mes),
    datasets: [
      {
        label: "Simulações recebidas",
        data: historico.map((h) => h.simulacoes),
        borderColor: NAVY,
        backgroundColor: "rgba(30,58,95,0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Cliques",
        data: historico.map((h) => h.cliques),
        borderColor: ORANGE,
        backgroundColor: "rgba(216,90,48,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const opcoesPizza = {
    plugins: {
      legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
    },
    cutout: "65%",
    responsive: true,
    maintainAspectRatio: false,
  };

  const opcoesLinha = {
    plugins: { legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center size-12 rounded-xl bg-rose-700 shrink-0 shadow-sm">
          <UserChartIcon className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Meu Desempenho</h1>
          <p className="text-sm text-slate-500">Acompanhe seus resultados nas simulações de phishing</p>
        </div>
      </div>

      {/* Cards KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Simulações recebidas"
          valor={totalSimulacoes}
          cor="border-l-slate-400"
          icone="📨"
        />
        <KpiCard
          label="Reportou suspeita"
          valor={reportou}
          sub={`${taxaReportes}% do total`}
          cor="border-l-teal-500"
          icone="🛡️"
        />
        <KpiCard
          label="Clicou no link"
          valor={clicou}
          sub={`${taxaCliques}% do total`}
          cor="border-l-orange-500"
          icone="⚠️"
        />
        <KpiCard
          label="Média nos quizzes"
          valor={`${quizzes.mediaAcertos}%`}
          sub={`${quizzes.concluidos}/${quizzes.total} concluídos`}
          cor="border-l-indigo-500"
          icone="🧠"
        />
      </div>

      {/* Banner de status */}
      <div className={`rounded-xl p-4 flex items-center gap-3 ${
        taxaCliques === 0
          ? "bg-teal-50 border border-teal-200"
          : taxaCliques <= 30
          ? "bg-yellow-50 border border-yellow-200"
          : "bg-orange-50 border border-orange-200"
      }`}>
        <span className="text-2xl">
          {taxaCliques === 0 ? "🏆" : taxaCliques <= 30 ? "📈" : "📚"}
        </span>
        <div>
          <p className={`font-bold text-sm ${
            taxaCliques === 0 ? "text-teal-800" : taxaCliques <= 30 ? "text-yellow-800" : "text-orange-800"
          }`}>
            {taxaCliques === 0
              ? "Parabéns! Você não clicou em nenhum link de phishing!"
              : taxaCliques <= 30
              ? "Bom progresso! Continue treinando para melhorar ainda mais."
              : "Atenção! Você clicou em muitos links simulados. Revise os conteúdos educativos."}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Sua taxa de cliques: <strong>{taxaCliques}%</strong> — Taxa de reporte: <strong>{taxaReportes}%</strong>
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rosca */}
        <Card className="border border-slate-200">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-700 mb-4">Respostas às simulações</p>
            <div className="h-[200px]">
              <Doughnut data={dadosPizza} options={opcoesPizza} />
            </div>
          </CardContent>
        </Card>

        {/* Linha temporal */}
        <Card className="border border-slate-200">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-700 mb-4">Evolução nos últimos meses</p>
            <div className="h-[200px]">
              <Line data={dadosHistorico} options={opcoesLinha} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress dos quizzes */}
      <Card className="border border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">Progresso nos Quizzes</p>
            <span className="text-xs text-slate-400">{quizzes.concluidos} de {quizzes.total} concluídos</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${(quizzes.concluidos / quizzes.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">Média de acertos: <strong className="text-slate-700">{quizzes.mediaAcertos}%</strong></span>
            <span className="text-xs text-indigo-600 font-semibold">
              {quizzes.concluidos < quizzes.total ? `${quizzes.total - quizzes.concluidos} quiz(zes) restante(s)` : "Todos concluídos! 🎉"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de campanhas */}
      <Card className="border border-slate-200">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Últimas simulações recebidas</p>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left pb-3 font-semibold">Data</th>
                  <th className="text-left pb-3 font-semibold">Campanha</th>
                  <th className="text-center pb-3 font-semibold">Sua resposta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campanhasRecentes.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 text-slate-400 text-xs">{c.data}</td>
                    <td className="py-3 text-slate-700 font-medium">{c.nome}</td>
                    <td className="py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_STYLE[c.tag]}`}>
                        {c.resultado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, valor, sub, cor, icone }) {
  return (
    <Card className={`border border-slate-200 border-l-4 ${cor}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span>{icone}</span>
          <p className="text-xs text-slate-500 leading-tight">{label}</p>
        </div>
        <p className="text-2xl font-black text-slate-800">{valor}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
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
