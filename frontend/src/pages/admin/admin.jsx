export default function AdminPortal() {
  return (
    <main style={{ padding: '2rem', maxWidth: '980px', margin: '0 auto' }}>
      <h1>Portal Administrativo</h1>
      <p>
        Area destinada a gestores e administradores para acompanhamento de
        campanhas, metricas de risco e dados de desempenho dos colaboradores.
      </p>

      <section style={{ marginTop: '1.2rem' }}>
        <h2>Funcionalidades de administracao</h2>
        <ul>
          <li>Visualizacao de usuarios que cairam nos testes simulados</li>
          <li>Acompanhamento de indicadores por setor e periodo</li>
          <li>Gestao de campanhas e trilhas de treinamento</li>
          <li>Exportacao de relatorios para auditoria interna</li>
        </ul>
      </section>
    </main>
  )
}
