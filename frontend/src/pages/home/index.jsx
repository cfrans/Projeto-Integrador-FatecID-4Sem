import logoNemo from '../../assets/logo-dark.png';

function HomePage() {
  const features = [
    "Criação de campanhas",
    "Visualização de gráficos",
    "Gerenciamento de usuários",
    "Configurações do sistema",
    "Templates reutilizáveis"
  ];

  return (
    <main className="mx-auto grid w-[min(980px,92vw)] justify-items-center gap-4 py-8">

      {/* Header */}
      <section className="grid w-full max-w-4xl justify-items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-lg shadow-slate-900/10">
        <img className="h-auto w-[min(260px,55vw)]" src={logoNemo} alt="Logo do Nemo" />
        <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-600">
          Portal do Colaborador
        </p>
        <h1>Treinamentos e Conscientização sobre Phishing</h1>
        <p className="max-w-[70ch] text-slate-600">
          Plataforma dedicada à educação e segurança digital, ajudando colaboradores
          a identificar e evitar ataques de phishing no dia a dia.
        </p>
      </section>


      {/* Funcionalidades */}
      <section className="grid w-full justify-items-center gap-4">
        <article className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/10">
          <h2>Funcionalidades principais</h2>
          <ul className="mt-3 grid w-full max-w-2xl list-disc gap-2 pl-5 text-slate-700">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </section>

    </main>
  );
}

export default HomePage;