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
import { Bar, Pie, Line } from "react-chartjs-2";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

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
const NAVY2 = "#1E3A5F";
const PIE_COLORS = [ORANGE, TEAL, NAVY2, "#0F6E56", "#BA7517", "#888780"];

const PERIODOS = [
  { label: "7 dias",  value: "7d"  },
  { label: "30 dias", value: "30d" },
  { label: "6 meses", value: "6m"  },
  { label: "Tudo",    value: "tudo" },
];

export default function Graphics() {
  const [periodo, setPeriodo] = useState("30d");
  const [dados, setDados]     = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    async function fetchDados() {
      setCarregando(true);
      setErro("");
      try {
        const res = await api.get(`/api/graficos/dashboard?periodo=${periodo}`);
        if (!cancelado) setDados(res);
      } catch (e) {
        if (!cancelado) setErro(e instanceof ApiError ? e.message : "Erro ao carregar gráficos");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    fetchDados();
    return () => { cancelado = true; };
  }, [periodo]);

  const setores       = dados?.porSetor          ?? [];
  const totais        = dados?.totais            ?? { campanhas: 0, usuarios: 0, percentualCliques: 0, percentualReportes: 0 };
  const evolucao      = dados?.evolucao          ?? [];
  const campanhas     = dados?.campanhasRecentes ?? [];

  const cliquesSetor = {
    labels: setores.map((s) => s.setor),
    datasets: [
      { label: "Clicou",   data: setores.map((s) => s.cliques),  backgroundColor: ORANGE },
      { label: "Anexo",    data: setores.map((s) => s.anexos),   backgroundColor: TEAL   },
      { label: "Reportou", data: setores.map((s) => s.reportes), backgroundColor: NAVY2  },
    ],
  };

  const distribuicaoPizza = {
    labels: setores.map((s) => s.setor),
    datasets: [
      {
        data: setores.map((s) => s.cliques),
        backgroundColor: PIE_COLORS,
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
        backgroundColor: "rgba(216,90,48,0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Reportes",
        data: evolucao.map((e) => e.reportes),
        borderColor: TEAL,
        backgroundColor: "rgba(29,158,117,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-2 flex-wrap">
          {PERIODOS.map((p) => {
            const ativo = periodo === p.value;
            return (
              <Button
                key={p.value}
                size="sm"
                className={`h-9 px-4 ${ativo
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                onClick={() => setPeriodo(p.value)}
              >
                {p.label}
              </Button>
            );
          })}
        </div>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campanhas", value: String(totais.campanhas) },
          { label: "Usuários",  value: String(totais.usuarios)  },
          { label: "Cliques",   value: `${totais.percentualCliques}%`  },
          { label: "Reportes",  value: `${totais.percentualReportes}%` },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold">{carregando ? "…" : m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-4">Interações por setor</p>
            <div className="h-250px">
              <Bar data={cliquesSetor} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-4">Distribuição de cliques</p>
            <div className="h-250px">
              <Pie data={distribuicaoPizza} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold mb-4">Evolução mensal</p>
          <div className="h-250px">
            <Line data={evolucaoMensal} />
          </div>
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
                {campanhas.length === 0 && !carregando && (
                  <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Sem campanhas no período</td></tr>
                )}
                {campanhas.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{formatarData(c.data)}</td>
                    <td className="p-2">{c.nome}</td>
                    <td className="p-2 text-center">{c.alvos}</td>
                    <td className="p-2 text-center text-orange-500">{c.cliques}</td>
                    <td className="p-2 text-center">
                      {c.alvos > 0 ? Math.round((c.cliques / c.alvos) * 100) : 0}%
                    </td>
                    <td className="p-2 text-center text-green-500">{c.reportes}</td>
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
