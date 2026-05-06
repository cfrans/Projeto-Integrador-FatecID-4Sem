const SECTIONS = [
  {
    title: "Simulação Realista",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: "Dispare campanhas de phishing controladas utilizando modelos altamente personalizáveis. Teste a resiliência da sua equipe com cenários de e-mail, links suspeitos e anexos simulados.",
  },
  {
    title: "Métricas de Vulnerabilidade",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: "Acompanhe em tempo real quem clicou nos links, quem abriu anexos e quem reportou a ameaça. Identifique setores críticos e padrões de comportamento de risco.",
  },
  {
    title: "Cultura de Prevenção",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    description: "Transforme falhas em aprendizado imediato. O sistema oferece feedbacks educativos e trilhas de conhecimento para capacitar os colaboradores contra ataques reais.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 pb-10">
      {/* Cabeçalho principal */}
      <header className="flex items-center gap-3 mb-6">
        <div className="about-badge flex items-center justify-center size-12 rounded-xl bg-cyan-700 shrink-0 cursor-default shadow-sm overflow-hidden">
          <FishIcon className="about-icon size-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sobre o Projeto</h1>
          <p className="mt-1 text-sm text-slate-600">
            Plataforma de simulação de phishing para análise e reforço da segurança digital.
          </p>
        </div>
      </header>

      {/* Cards de serviços principais */}
      <section className="grid gap-6 md:grid-cols-3">
        {SECTIONS.map((item) => (
          <article
            key={item.title}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-slate-50 text-cyan-600 transition-colors group-hover:bg-cyan-50">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 flex-grow text-justify">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      {/* Seção de Gamificação e Tracking */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-cyan-400">
              <span className="flex size-8 items-center justify-center rounded-full bg-cyan-900/50 text-sm">🎮</span>
              Gamificação Comportamental
            </h2>
            <p className="text-slate-300 leading-relaxed text-justify">
              O Nemo utiliza um sistema de pontuação dinâmica (0 a 1000 pontos) para engajar os colaboradores. 
              Ao reportar ameaças ou concluir treinamentos, o usuário ganha pontos e melhora sua reputação digital. 
              Interações de risco, como cliques em links suspeitos, geram alertas e convites para reforço educativo.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="flex-1 rounded-xl bg-slate-800/50 p-4 border border-slate-700">
                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Início Neutro</div>
                <div className="text-xl font-bold text-white">500 pts</div>
              </div>
              <div className="flex-1 rounded-xl bg-slate-800/50 p-4 border border-slate-700">
                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Meta Segura</div>
                <div className="text-xl font-bold text-cyan-400">700+ pts</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/30 p-8 md:p-12 space-y-6 border-l border-slate-700/50">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-cyan-400">
              <span className="flex size-8 items-center justify-center rounded-full bg-cyan-900/50 text-sm">🛡️</span>
              Tecnologia de Rastreamento
            </h2>
            <p className="text-slate-300 leading-relaxed text-justify">
              Nossa engine utiliza tokens únicos e opacos para monitorar interações sem expor dados sensíveis (PII), 
              garantindo conformidade com a LGPD. O rastreamento inclui:
            </p>
            <ul className="space-y-3">
              {[
                "Acesso a links maliciosos simulados",
                "Abertura de documentos e anexos falsos",
                "Reporte proativo de phishing (Abuse Inbox)",
                "Conclusão de quizzes e pílulas de conhecimento"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="text-cyan-500 text-lg">✓</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Rodapé informativo */}
      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 pt-8 border-t border-slate-200">
        <div>Nemo Phishing Awareness — Versão 1.0</div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">🔒 SSL Ativo</span>
          <span className="flex items-center gap-1">🛡️ LGPD Compliant</span>
          <span className="flex items-center gap-1">🚀 v0.0.1-alpha</span>
        </div>
      </footer>
    </div>
  );
}

function FishIcon({ className }) {
  return (
    <svg 
      viewBox="0 0 54 30" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 15C14 7 2 1 2 1C7 8 7 22 2 29C2 29 14 23 14 15Z" fill="currentColor" fillOpacity="0.4" />
      <ellipse cx="30" cy="15" rx="18" ry="10" fill="currentColor" fillOpacity="0.8" />
      <circle cx="43" cy="11" r="3.2" fill="currentColor" />
      <circle cx="44" cy="10" r="1.2" fill="white" fillOpacity="0.6" />
    </svg>
  );
}