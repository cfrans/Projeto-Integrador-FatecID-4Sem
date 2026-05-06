import { useState } from "react";
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

/*AJUSTAR PRO BACK END*/
const SETORES = ["Financeiro", "TI", "RH", "Comercial", "Marketing", "Diretoria"];

/*AJUSTAR PRO BACK END*/
const cliquesSetor = {
  labels: SETORES,
  datasets: [
    { label: "Clicou", data: [14, 7, 11, 9, 8, 5], backgroundColor: ORANGE },
    { label: "Anexo", data: [8, 4, 7, 5, 6, 3], backgroundColor: TEAL },
    { label: "Reportou", data: [3, 9, 4, 2, 2, 4], backgroundColor: NAVY2 },
  ],
};
/*AJUSTAR PRO BACK END*/
const distribuicaoPizza = {
  labels: SETORES,
  datasets: [
    {
      data: [14, 7, 11, 9, 8, 5],
      backgroundColor: [ORANGE, TEAL, NAVY2, "#0F6E56", "#BA7517", "#888780"],
    },
  ],
};

const evolucaoMensal = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  datasets: [
    {
      /*AJUSTAR PRO BACK END*/
      label: "Cliques",
      data: [22, 30, 18, 35, 28, 40],
      borderColor: ORANGE,
      backgroundColor: "rgba(216,90,48,0.1)",
      fill: true,
      tension: 0.4,
    },
    {
      /*AJUSTAR PRO BACK END*/
      label: "Reportes",
      data: [5, 8, 12, 10, 15, 20],
      borderColor: TEAL,
      backgroundColor: "rgba(29,158,117,0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};
/*AJUSTAR PRO BACK END*/
const campanhasRecentes = [
  { data: "17/03", nome: "Modelo X", alvos: 100, cliques: 54, reportes: 12 },
  { data: "10/03", nome: "Alerta Banco", alvos: 60, cliques: 28, reportes: 8 },
  { data: "02/03", nome: "Reset TI", alvos: 40, cliques: 9, reportes: 16 },
];

const PERIODOS = ["7 dias", "30 dias", "6 meses", "Tudo"];

export default function Graphics() {
  const [periodo, setPeriodo] = useState("30 dias");

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
            const ativo = periodo === p;

            return (
              <Button
                key={p}
                size="sm"
                className={`h-9 px-4 ${ativo
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                onClick={() => setPeriodo(p)}
              >
                {p}
              </Button>
            );
          })}
        </div>
      </div>

    {/* Métricas - AJUSTAR PRO BACK END  */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campanhas", value: "12" },
          { label: "Usuários", value: "348" },
          { label: "Cliques", value: "38%" },
          { label: "Reportes", value: "14%" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      {/*AJUSTAR PRO BACK END  */}
      <div className="grid md:grid-cols-3 gap-4">

        {/* Barras */}
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-4">
              Interações por setor
            </p>
            <div className="h-250px">
              <Bar data={cliquesSetor} />
            </div>
          </CardContent>
        </Card>

        {/* Pizza */}
        {/*AJUSTAR PRO BACK END  */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-4">
              Distribuição
            </p>
            <div className="h-250px">
              <Pie data={distribuicaoPizza} />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Linha */}
      {/*AJUSTAR PRO BACK END  */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold mb-4">
            Evolução mensal
          </p>
          <div className="h-250px">
            <Line data={evolucaoMensal} />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      {/*AJUSTAR PRO BACK END  */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold mb-4">
            Últimas campanhas
          </p>

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
                {campanhasRecentes.map((c, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{c.data}</td>
                    <td className="p-2">{c.nome}</td>
                    <td className="p-2 text-center">{c.alvos}</td>
                    <td className="p-2 text-center text-orange-500">{c.cliques}</td>
                    <td className="p-2 text-center">
                      {Math.round((c.cliques / c.alvos) * 100)}%
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