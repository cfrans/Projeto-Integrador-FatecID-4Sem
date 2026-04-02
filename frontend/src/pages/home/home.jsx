<<<<<<< HEAD
import { Link } from "react-router-dom";
import "./home.css";
=======
import logoNemo from '../../assets/logo-dark.png'
>>>>>>> 1c668881867663016c4e7d649bba3dcb08a84760

function Home() {
  return (
<<<<<<< HEAD
    <div className="home">
      <h1>Home</h1>

      <div className="menu">
        <Link to="/about"><button>Sobre</button></Link>
        <Link to="/create"><button>Criar Campanha</button></Link>
        <Link to="/graphics"><button>Gráficos</button></Link>
        <Link to="/settings"><button>Configurações</button></Link>
        <Link to="/templates"><button>Templates</button></Link>
        <Link to="/users"><button>Usuários</button></Link>
      </div>
    </div>
  );
}
=======
    <main className="mx-auto grid w-[min(980px,92vw)] justify-items-center gap-4 py-8">
      <section className="grid w-full max-w-4xl justify-items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-lg shadow-slate-900/10">
        <img className="h-auto w-[min(260px,55vw)]" src={logoNemo} alt="Logo do Nemo" />
        <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-600">Portal do Colaborador</p>
        <h1>Treinamentos e Conscientizacao sobre Phishing</h1>
        <p className="max-w-[70ch] text-slate-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Donec vitae purus laoreet lacus ullamcorper egestas non consequat risus. 
          Sed a odio justo. Donec eget est eget enim commodo egestas ac nec sapien. 
          Aenean congue magna massa, a sollicitudin diam iaculis a. 
          Vivamus eleifend mi eu leo interdum, sed euismod enim fringilla. 
          In euismod pharetra ex, auctor finibus est molestie vel. 
          Mauris eu urna ac quam ultrices facilisis.
        </p>
      </section>

      <section className="grid w-full justify-items-center gap-4">
        <article className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/10">
          <h2>Funcionalidades principais</h2>
          <ul className="mt-3 grid w-full max-w-2xl list-disc gap-2 pl-5 text-slate-700">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
>>>>>>> 1c668881867663016c4e7d649bba3dcb08a84760

export default Home;