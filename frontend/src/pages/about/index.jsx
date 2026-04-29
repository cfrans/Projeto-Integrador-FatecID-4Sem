const SERVICES = [
  {
    title: "Criação de Campanhas",
    description:
      "Desenvolva simulações realistas e personalizadas utilizando uma biblioteca de modelos atualizados. Defina setores específicos da organização, escolha o tipo de isca (e-mail, link ou anexo) e configure o cronograma de envio de forma rápida e intuitiva para testar a resiliência da sua equipe em diferentes cenários.",
  },
  {
    title: "Análise de Interações",
    description:
      "Monitore o engajamento dos colaboradores com as campanhas disparadas. Obtenha métricas detalhadas sobre cliques em links suspeitos, abertura de e-mails e fornecimento de dados sensíveis. Esses indicadores são fundamentais para entender o comportamento de risco e medir a vulnerabilidade técnica e humana.",
  },
  {
    title: "Conscientização",
    description:
      "Transforme falhas em oportunidades de aprendizado. Após a simulação, disponibilize trilhas educativas e pílulas de conhecimento que reforçam as boas práticas de segurança digital. O foco é capacitar o usuário para identificar tentativas reais de phishing, fortalecendo a cultura de proteção de dados na empresa.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8">
      {/* Cabeçalho principal */}
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex-1">
          
          
          <h1 className="text-2xl font-bold text-slate-900">Sobre o Projeto</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Plataforma de simulação de phishing para análise e reforço da segurança digital.
          </p>
        </div>
        <div className="opacity-60 hover:opacity-100 transition-opacity">
          <FishIcon />
        </div>
      </header>

      {/* Cards de serviços */}
      <section className="grid gap-8 md:grid-cols-3">
        {SERVICES.map((item) => (
          <article
            key={item.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-3">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 flex-grow text-justify">
              {item.description}
            </p>
            <div className="mt-6 pt-3 text-xs text-slate-400 border-t border-slate-100">
              🔒 Módulo de Segurança Ativo
            </div>
          </article>
        ))}
      </section>

      {/* Seção extra para preencher espaço e dar mais contexto */}
      <section className="mt-12 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 p-8 border border-slate-200">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
              <div className="scale-75 origin-left">
                <FishIcon />
              </div>
              Tecnologia de captura
            </h2>
            <ul className="mt-4 space-y-2 text-slate-600 text-justify list-inside">
              <li className="text-justify">✓ Métricas de captura para identificar padrões de phishing</li>
              <li className="text-justify">✓ Ações de prevenção e controle de phishing</li>
              <li className="text-justify">✓ Monitoramento e análise de desempenho</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
              <div className="scale-75 origin-left">
                <FishIcon />
              </div>
              Mecanismo de Captura
            </h2>
            <p className="mt-4 text-slate-600 text-justify">
              O sistema registra automaticamente cliques em links suspeitos e abertura de anexos configuráveis. Esses dados são armazenados e permitem analisar a vulnerabilidade individual e coletiva dos usuários diante de simulações realistas de phishing.
            </p>
          </div>
        </div>
      </section>

      {/* Rodapé informativo */}
      <footer className="text-center text-sm text-slate-400 pt-6 border-t border-slate-200 text-justify">
        Simulação controlada de phishing para análise e conscientização — Versão 1.0
      </footer>
    </div>
  );
}

function FishIcon() {
  return (
    <svg width="60" height="50" viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <ellipse cx="55" cy="50" rx="32" ry="22" fill="#c4d8d2" />
      <path d="M87 50C100 36 108 26 104 14C96 30 90 38 87 50Z" fill="#b2cbc4" />
      <path d="M87 50C100 64 108 74 104 86C96 70 90 62 87 50Z" fill="#b2cbc4" />
      <ellipse cx="43" cy="44" rx="5" ry="5" fill="#7eaaa0" />
      <circle cx="44" cy="43" r="2" fill="white" opacity="0.5" />
    </svg>
  );
}