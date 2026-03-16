import styles from './home.module.css'
import logoNemo from '../../assets/logo-dark.png'

// copiei do README para mostrar a estrutura
const features = [
  'Cadastro de destinatarios',
  'Criacao de campanhas simuladas',
  'Personalizacao de assunto e mensagem',
  'Envio automatico de e-mails',
  'Registro de cliques e aberturas',
  'Visualizacao de dados para analise',
]

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.card}`}>
        <img className={styles.logo} src={logoNemo} alt="Logo do Nemo" />
        <p className={styles.tag}>Nemo</p>
        <h1>Sistema de Simulacao e Conscientizacao sobre Phishing</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Donec vitae purus laoreet lacus ullamcorper egestas non consequat risus. 
          Sed a odio justo. Donec eget est eget enim commodo egestas ac nec sapien. 
          Aenean congue magna massa, a sollicitudin diam iaculis a. 
          Vivamus eleifend mi eu leo interdum, sed euismod enim fringilla. 
          In euismod pharetra ex, auctor finibus est molestie vel. 
          Mauris eu urna ac quam ultrices facilisis.
        </p>
      </section>

      <section className={styles.grid2}>
        <article className={styles.card}>
          <h2>Funcionalidades principais</h2>
          <ul className={styles.featureList}>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>

      </section>
    </main>
  )
}