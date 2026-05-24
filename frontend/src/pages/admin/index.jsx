import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  MegaphoneIcon,
  UsersIcon,
  CursorArrowRippleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  DocumentPlusIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    async function fetchDados() {
      try {
        const res = await api.get("/api/graficos/dashboard?periodo=30d");
        if (!cancelado) setDados(res);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    fetchDados();
    return () => { cancelado = true; };
  }, []);

  const primeiroNome = user?.nome?.split(" ")[0] || "Administrador";

  const totais = dados?.totais ?? { campanhas: 0, usuarios: 0, percentualCliques: 0, percentualReportes: 0 };
  const campanhas = dados?.campanhasRecentes?.slice(0, 3) ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-2 py-6">
      
      {/* Hero Admin Revamp */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
        {/* Fundo decorativo (indigo escuro) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 opacity-90" />
        
        {/* Decoração lateral direita (Escudo) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-full hidden sm:flex items-center justify-end pr-8 pointer-events-none text-indigo-400 opacity-15">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-48">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 0-7.877 3.08.75.75 0 0 0-.222.515c0 4.148 2.062 8.784 5.92 11.666 1.488 1.11 3.23 2 5.095 2.665.41.147.85-.18.85-.623V2.171a.75.75 0 0 0-.222-.516z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12.984 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 1 7.877 3.08.75.75 0 0 1 .222.515c0 4.148-2.062 8.784-5.92 11.666-1.488 1.11-3.23 2-5.095 2.665-.41.147-.85-.18-.85-.623V2.171c0-.286.114-.56.317-.762z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="relative p-6 sm:p-8 flex flex-col items-start gap-3 w-full sm:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-300 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Painel Administrativo
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight flex flex-wrap gap-2">
            Bem-vindo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">{primeiroNome}</span>!
          </h1>
          <p className="mt-2 text-indigo-100/80 text-sm sm:text-base leading-relaxed max-w-2xl">
            Tenha uma visão geral das últimas campanhas de phishing simulado, das métricas de engajamento da equipe e acesse atalhos rápidos para gerenciar o sistema.
          </p>
        </div>
      </section>

      {/* Big Numbers (KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campanhas (30d)", value: String(totais.campanhas),        icon: MegaphoneIcon,          accent: "bg-indigo-600",  iconBg: "bg-indigo-50",  iconColor: "text-indigo-600"  },
          { label: "Base de Alvos",   value: String(totais.usuarios),         icon: UsersIcon,              accent: "bg-sky-600",     iconBg: "bg-sky-50",     iconColor: "text-sky-600"     },
          { label: "Taxa de Clique",  value: `${totais.percentualCliques}%`,  icon: CursorArrowRippleIcon,  accent: "bg-orange-500",  iconBg: "bg-orange-50",  iconColor: "text-orange-500"  },
          { label: "Taxa de Reporte", value: `${totais.percentualReportes}%`, icon: ShieldCheckIcon,        accent: "bg-emerald-600", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
        ].map((m) => (
          <Card key={m.label} className="relative overflow-hidden border-slate-200 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className={`absolute top-0 left-0 h-full w-1 ${m.accent}`} />
            <CardContent className="p-4 pl-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{m.label}</p>
                  {carregando ? (
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

      {/* Grid Inferior (Widgets) */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Widget Últimos Envios (2 colunas) */}
        <Card className="md:col-span-2 flex flex-col border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Últimos Envios</h2>
              <p className="text-xs text-slate-500 mt-0.5">Campanhas disparadas nos últimos 30 dias</p>
            </div>
            <button 
              onClick={() => navigate('/create')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors group"
            >
              Ver todas <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="flex-1 p-0">
            {carregando ? (
              <div className="p-5 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : campanhas.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <MegaphoneIcon className="size-10 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Nenhuma campanha recente</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {campanhas.map((c) => {
                  const pct = c.alvos > 0 ? Math.round((c.cliques / c.alvos) * 100) : 0;
                  return (
                    <div 
                      key={c.id} 
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer group/row"
                      onClick={() => navigate('/create', { state: { view: 'monitoring', campanhaId: c.id } })}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{c.nome}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatarData(c.data)} • {c.alvos} {c.alvos === 1 ? 'alvo' : 'alvos'}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-4 sm:gap-6">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Cliques</p>
                          <p className="text-sm font-black text-orange-600 tabular-nums">{c.cliques}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Taxa</p>
                          <p className="text-sm font-black text-slate-700 tabular-nums">{pct}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-50 rounded-b-xl border-t border-slate-100">
             <button onClick={() => navigate('/create')} className="w-full py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-700 rounded-lg shadow-sm hover:bg-slate-100 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2">
               <DocumentPlusIcon className="size-4" /> Nova Campanha
             </button>
          </div>
        </Card>

        {/* Widgets Laterais (Gráficos e Usuários) */}
        <div className="flex flex-col gap-6">
          
          {/* Widget Gráficos (Dashboard Miniatura) */}
          <Card className="border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 size-24 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
            <ChartBarIcon className="absolute right-3 top-3 size-12 text-indigo-100 group-hover:rotate-12 transition-transform duration-500" />
            <div className="p-5 relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 mb-1">Análise de Risco</h2>
                <p className="text-xs text-slate-600 mb-5 max-w-[200px]">
                  Acesse o dashboard detalhado para cruzar dados por setor, modelo e evolução temporal.
                </p>
                
                {/* Mini gráfico visual (barra de progresso da taxa de clique) */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Vulnerabilidade Geral</span>
                    <span className="text-orange-600 tabular-nums">{totais.percentualCliques}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(totais.percentualCliques, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/graphics')}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Abrir Dashboard
              </button>
            </div>
          </Card>

          {/* Widget Usuários */}
          <Card className="border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
             <div className="absolute -right-6 -top-6 size-24 bg-sky-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
             <UsersIcon className="absolute right-3 top-3 size-12 text-sky-100 group-hover:-rotate-12 transition-transform duration-500" />
             <div className="p-5 relative z-10 flex-1 flex flex-col justify-between">
               <div>
                 <h2 className="text-base font-bold text-slate-800 mb-1">Gestão de Alvos</h2>
                 <p className="text-xs text-slate-600 mb-6 max-w-[200px]">
                   Mantenha sua base de {carregando ? '...' : totais.usuarios} usuários atualizada. Faça importação em massa via CSV e ajuste setores.
                 </p>
               </div>
               
               <button 
                 onClick={() => navigate('/users')}
                 className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 hover:text-sky-700 transition-colors flex items-center justify-center gap-2"
               >
                 Gerenciar Usuários
               </button>
             </div>
          </Card>

        </div>
      </div>

    </main>
  );
}

function formatarData(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}
