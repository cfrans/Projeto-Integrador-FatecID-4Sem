export default function AdminPortal() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Portal Administrativo</h1>
      <p className="mt-3 text-slate-700">
        Area destinada a gestores e administradores para acompanhamento de
        campanhas, metricas de risco e dados de desempenho dos colaboradores.
      </p>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Funcionalidades de administracao</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          <li>Visualizacao de usuarios que cairam nos testes simulados</li>
          <li>Acompanhamento de indicadores por setor e periodo</li>
          <li>Gestao de campanhas e trilhas de treinamento</li>
          <li>Exportacao de relatorios para auditoria interna</li>
        </ul>
      </section>
    </main>
  )
}
