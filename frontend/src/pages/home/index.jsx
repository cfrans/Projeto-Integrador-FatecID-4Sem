import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logoNemo from "../../assets/logo-dark.png";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const primeiroNome = user?.name?.split(" ")[0] || user?.sub || "Colaborador";

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

      {/* Hero */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={logoNemo}
          alt="Logo NEMO"
          className="h-auto w-[min(180px,40vw)] shrink-0"
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-teal-700 mb-1">
            Portal do Colaborador
          </p>
          <h1 className="text-2xl font-black text-slate-800 leading-tight">
            Bem-vindo, {primeiroNome}!
          </h1>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-[60ch]">
            Esta plataforma foi criada para te ajudar a reconhecer e evitar ataques
            de phishing. Use os recursos abaixo para treinar e acompanhar seu
            progresso em segurança digital.
          </p>
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
