import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
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

export default Home;