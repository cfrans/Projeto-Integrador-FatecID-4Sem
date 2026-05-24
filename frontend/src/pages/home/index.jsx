import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Velocimetro } from "@/components/ui/velocimetro";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pontos, setPontos] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get("/api/colaborador/pontuacao");
        setPontos(res.saldoAtual ?? 500);
      } catch {
        setPontos(500);
      }
    }
    carregar();
  }, []);

  const primeiroNome = user?.nome?.split(" ")[0] || "Colaborador";

  const acoes = [
    {
      path: "/quiz",
      cor: "bg-teal-700",
      corHover: "hover:bg-teal-800",
      corBorda: "border-teal-200",
      corFundo: "bg-teal-50",
      icone: <QuizIcon className="size-6 text-white" />,
      titulo: "Quiz de Phishing",
      descricao: "Teste seus conhecimentos respondendo quizzes sobre ataques e boas práticas de segurança digital.",
    },
    {
      path: "/conteudos",
      cor: "bg-indigo-700",
      corHover: "hover:bg-indigo-800",
      corBorda: "border-indigo-200",
      corFundo: "bg-indigo-50",
      icone: <PlayIcon className="size-6 text-white" />,
      titulo: "Conteúdos Educativos",
      descricao: "Assista a vídeos e materiais sobre como identificar e evitar tentativas de phishing.",
    },
    {
      path: "/meus-graficos",
      cor: "bg-rose-700",
      corHover: "hover:bg-rose-800",
      corBorda: "border-rose-200",
      corFundo: "bg-rose-50",
      icone: <ChartIcon className="size-6 text-white" />,
      titulo: "Meu Desempenho",
      descricao: "Acompanhe seus resultados nas simulações de phishing e veja sua evolução ao longo do tempo.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-2 py-6">

      {/* Hero Revamp */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Fundo decorativo sutil */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none" />
        
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Portal do Colaborador
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              Bem-vindo de volta,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">
                {primeiroNome}
              </span>!
            </h1>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              O NEMO ajuda você a reconhecer e evitar ataques cibernéticos. 
              Fique de olho na sua pontuação, reporte e-mails suspeitos e complete treinamentos para manter a segurança da nossa rede em dia.
            </p>
            <button
              onClick={() => navigate("/meus-graficos")}
              className="mt-6 px-5 py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Ver relatório completo
            </button>
          </div>

          <div className="shrink-0 w-full md:w-auto flex justify-center">
            {pontos === null ? (
              <div className="w-[260px] h-[160px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 animate-pulse">
                <span className="text-sm font-medium text-slate-400">Carregando métricas...</span>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col items-center w-[260px]">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Seu índice atual</p>
                <div className="-mx-4 w-[240px]">
                  <Velocimetro saldo={pontos} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cards de ação */}
      <section>
        <h2 className="text-base font-bold text-slate-700 mb-3">O que você pode fazer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {acoes.map((acao) => (
            <button
              key={acao.path}
              onClick={() => navigate(acao.path)}
              className={`text-left rounded-xl border ${acao.corBorda} ${acao.corFundo} p-5 hover:shadow-md transition-all group`}
            >
              <div className={`size-11 rounded-xl ${acao.cor} ${acao.corHover} flex items-center justify-center mb-4 shadow-sm transition-colors`}>
                {acao.icone}
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-teal-700 transition-colors">
                {acao.titulo}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {acao.descricao}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Dica do dia */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex gap-4 items-start">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="font-bold text-amber-800 text-sm mb-1">Dica de segurança</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            Antes de clicar em qualquer link recebido por e-mail ou mensagem, passe
            o cursor sobre ele e verifique o endereço de destino. Domínios suspeitos
            ou encurtadores de URL são um sinal de alerta — quando em dúvida, não
            clique e reporte ao time de segurança.
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-3">Sobre a plataforma</h2>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          O NEMO (Phishing Simulations &amp; Training) é uma plataforma de conscientização
          sobre segurança da informação. Os administradores enviam simulações de phishing
          controladas para avaliar o nível de atenção dos colaboradores.
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          {[
            "Você pode receber e-mails de teste simulando ataques reais",
            "Reportar e-mails suspeitos é sempre a ação correta",
            "Seus resultados são usados apenas para fins educativos",
            "Complete os quizzes para reforçar seu aprendizado",
            "Acompanhe sua evolução na página de desempenho",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-teal-600 mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}

function QuizIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={3} />
    </svg>
  );
}

function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ChartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="10" y="8" width="4" height="12" rx="1" />
      <rect x="17" y="11" width="4" height="9" rx="1" />
    </svg>
  );
}
