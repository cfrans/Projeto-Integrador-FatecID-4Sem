import { useNavigate } from 'react-router-dom'
import styles from './login.module.css'


export default function Login() {
  const navigate = useNavigate()

  //essa funçao sera removida qunado tivermos a autenticaçao real, 
  // mas por enquanto serve para simular o fluxo de acesso
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const role = formData.get('role')

    if (role === 'admin') {
      navigate('/admin')
      return
    }

    navigate('/home')
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <aside className={styles.infoPanel}>
          <div className={styles.brand}>
            <p className={styles.badge}>Nemo Security Platform</p>
            <h1>Conscientizacao e Treinamento em Seguranca</h1>
            <p>
              Este acesso é destinado ao portal de treinamento, 
              onde os colaboradores podem desenvolver suas habilidades 
              por meio de trilhas de aprendizado.
            </p>

            <div className={styles.flowBlock} aria-label="Fluxo de uso do portal">
              <h3>Como funciona </h3>
              <ol className={styles.flowList}>
                <li>
                  <span className={styles.stepNumber}>1</span>
                  <span>Entrar com credenciais corporativas</span>
                </li>
                <li className={styles.flowArrow} aria-hidden="true">↓</li>
                <li>
                  <span className={styles.stepNumber}>2</span>
                  <span>Realizar treinamentos e simulacoes</span>
                </li>
                <li className={styles.flowArrow} aria-hidden="true">↓</li>
                <li>
                  <span className={styles.stepNumber}>3</span>
                  <span>Acompanhar evolucao e indicadores</span>
                </li>
              </ol>
            </div>
          </div>

        </aside>

        <section className={styles.loginPanel}>
          <header className={styles.panelHeader}>
            <h2>Acesso ao portal corporativo</h2>
            <p>Use suas credenciais para autenticacao e entre no ambiente correto do seu perfil.</p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">E-mail corporativo</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="exemplo@nemo.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                minLength={6}
                required
              />
            </div>

            {/** essa seleçao é apenas para simular o fluxo de acesso,
            sera removida quando tivermos a autenticaçao real */}
            
            <div className={styles.field}>
              <label htmlFor="role">Tipo de acesso (sera removido futuramente) </label>
              <select id="role" name="role" defaultValue="user" required>
                <option value="user">Usuario comum (treinamentos)</option>
                <option value="admin">Administrador (dados e campanhas)</option>
              </select>
            </div>

            <div className={styles.row}>
              <label className={styles.keep} htmlFor="keepConnected">
                <input id="keepConnected" type="checkbox" name="keepConnected" />
                Lembrar de mim
              </label>
              <a className={styles.forgot} href="#" aria-label="Recuperar senha">
                Esqueci minha senha (fazer ainda)
              </a>
            </div>

            <div className={styles.actions}>
              <button className={styles.primary} type="submit">
                Entrar no portal
              </button>
              <button className={styles.secondary} type="button">
                Solicitar suporte de acesso
              </button>
            </div>
          </form>

        </section>
      </section>
    </main>
  )
}