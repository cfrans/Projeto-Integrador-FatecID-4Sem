<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="frontend/src/assets/logo-light.png" />
    <img alt="Nemo - Sistema de Conscientização e Simulação de Phishing" src="frontend/src/assets/logo-light.png" height="375">
  </picture>
  <br><br>

  ![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?logo=rocket&logoColor=white)
  ![Versão](https://img.shields.io/badge/Versão-v0.0.1--alpha-blue?logo=git&logoColor=white)
  ![Licença](https://img.shields.io/badge/Licença-CC%20BY--NC--ND%204.0-blue?logo=creativecommons&logoColor=white)

  ![JavaScript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
  ![Java Spring Boot](https://img.shields.io/badge/Java-Spring%20Boot-green)
  ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
  ![MySQL](https://img.shields.io/badge/MySQL-005C84?logo=mysql&logoColor=white)
</div>

## 📖 Descrição
Este projeto consiste no desenvolvimento de um sistema de **simulação de ataques de phishing**, com o objetivo de avaliar o comportamento de usuários diante de e-mails suspeitos e promover a **conscientização sobre segurança da informação** por meio de conteúdos educativos.

O sistema enviará **e-mails simulados 📧** contendo links ou anexos configuráveis para usuários previamente cadastrados. A partir das interações realizadas (cliques em links ou abertura de anexos), serão coletados dados que permitirão analisar a **vulnerabilidade dos usuários** a esse tipo de ataque.

Além disso, o sistema disponibilizará **conteúdos educativos 📚** voltados ao ensino da importância de evitar **riscos cibernéticos 💻⚠️**.

---

## 🎯 Objetivo
Desenvolver um sistema capaz de **enviar campanhas simuladas de phishing** e **registrar o comportamento dos usuários** diante dessas mensagens.

---

## ⚙️ Funcionalidades
- 👤 Cadastro de destinatários (nome e e-mail)  
- 🎣 Criação de campanhas de phishing simulado  
- ✏️ Personalização de assunto, mensagem e anexos  
- 📤 Envio automático de e-mails  
- 🔎 Registro de cliques em links e abertura de anexos  
- 📊 Visualização de dados para análise de comportamento dos usuários  

---

## 🛠 Tecnologias (previstas)

**Front-end 🎨**
- HTML  
- CSS  
- JavaScript  
- React  
- Vite  

**Back-end ⚡**
- Java Spring Boot  
- React  
- Vite  

**Banco de Dados 🗄️**
- MySQL  

**Envio de E-mails 📧**
- SMTP  

---

## 🚀 Resultados Esperados
Espera-se que o sistema contribua para a **conscientização dos usuários sobre ataques de phishing**, além de permitir a aplicação de conhecimentos práticos relacionados a:

- 💻 Desenvolvimento de software  
- 🗄️ Banco de dados  
- 🔐 Segurança da informação


---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Java 21+
- Maven
- MySQL rodando (local ou em rede)
- Node.js 18+

---

### 🗄️ Backend (Spring Boot)

#### 1. Configure o banco de dados

O Flyway cria todas as tabelas automaticamente na primeira execução — **não é necessário criar nada manualmente no MySQL**, apenas o servidor MySQL precisa estar rodando e acessível.

#### 2. Crie o arquivo `application-local.yaml`

Dentro de `backend/src/main/resources/`, crie o arquivo `application-local.yaml` com as suas credenciais locais:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/nemo?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: root
    password: sua_senha_aqui

jwt:
  secret: nemo-jwt-secret-dev-apenas-local-nao-commitar
  expiration-ms: 86400000

logging:
  level:
    org.springframework.security: INFO
```

> ⚠️ Este arquivo está no `.gitignore` e **nunca deve ser commitado**. Cada dev mantém o seu localmente.

#### 3. Suba o backend

```bash
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

A API ficará disponível em `http://localhost:8080`.

#### 4. O que o Flyway faz automaticamente

Na primeira execução, o Flyway aplica as migrations em ordem:

| Migration | O que faz |
|-----------|-----------|
| `V1__create_schema.sql` | Cria todas as tabelas do banco |
| `V2__insert_defaults.sql` | Insere os tipos de acesso e o usuário admin padrão |

> ⚠️ **Regra importante:** migrations já aplicadas **nunca devem ser editadas**. Para qualquer alteração no banco, crie um novo arquivo `V3__descricao.sql`, `V4__descricao.sql`, e assim por diante.

#### 5. Compilação do Motor Criptográfico
O coração do disparo das campanhas conta com um "operário" (Worker) escrito em linguagem C. Ele é acionado pelo Java e utiliza múltiplas *threads* da CPU para gerar os hashes criptográficos dos tokens em milissegundos. 

Como o executável gerado depende do seu sistema operacional, ele não é versionado no GitHub. **Antes de subir o back-end, você precisa compilar este arquivo manualmente.**

**Passo a passo para compilação:**
1. Abra o seu terminal e navegue até a pasta de scripts do backend:
   ```bash
   cd backend/scripts/

    Utilize o compilador GCC para gerar o executável correspondente ao seu Sistema Operacional:

🪟 Para Windows (usando MinGW):

gcc -Wall -O2 -o gerador_tokens_worker.exe gerador_tokens_worker.c

🐧/🍏 Para Linux ou Mac:

gcc -Wall -O2 -o gerador_tokens_worker gerador_tokens_worker.c -lpthread

#### 6. Acesso inicial

Após subir o sistema pela primeira vez, use as credenciais padrão para entrar:

| Campo | Valor |
|-------|-------|
| E-mail | `admin@nemo.com` |
| Senha | `admin` |

> 🔐 **No primeiro acesso, o sistema irá obrigatoriamente solicitar a troca de senha.** Defina uma senha segura antes de continuar. Essa é uma medida de segurança para garantir que a senha padrão nunca permaneça ativa em uso real.

---

### 🎨 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

---

## Esta seção abaixo descreve a arquitetura lógica, as regras de negócio e o funcionamento geral da plataforma.

---

## 🏗️ 1. Arquitetura e Stack Tecnológica
A plataforma foi desenhada como um sistema web full-stack, dividindo responsabilidades entre diferentes tecnologias para garantir performance, segurança e fins acadêmicos:
*   **Front-end:** React com Vite, HTML, CSS e JS, oferecendo interfaces responsivas.
*   **Back-end:** Node.js como API principal do sistema.
*   **Banco de Dados:** MySQL.
*   **Processamento Assíncrono:** Programa em linguagem C focado em multithreading para geração de hashes criptográficos.
*   **Infraestrutura de E-mail:** Integração SMTP para envio e um serviço "SMTP to Webhook" para o recebimento e captura de reportes.

---

## 👥 2. Perfis de Acesso
O sistema atende a dois públicos distintos com fluxos de uso completamente separados:
1.  **Administradores (Equipe de Segurança):** Possuem acesso ao painel de gestão para cadastrar usuários, criar modelos de e-mail maliciosos falsos, disparar campanhas e visualizar o dashboard de resultados.
2.  **Usuários Destino (Alvos/Colaboradores):** Não possuem acesso às ferramentas de disparo. Eles recebem os e-mails e, além disso, possuem um portal logado para visualizar sua pontuação de gamificação e realizar treinamentos de conscientização.

---

## ⚙️ 3. Fluxo de Criação e Disparo (Regras de Negócio)

### 3.1. Criação de Modelos (Envelopamento)
O administrador cria a "fantasia" do e-mail falso através de um editor WYSIWYG no front-end.
*   **Spoofing:** É definido um remetente falso (ex: *ti@ms.acesso-seguro.top*) e um assunto padrão.
*   **Domínio Alvo:** O admin seleciona o subdomínio malicioso para o qual a vítima será levada (ex: *bradesco.acesso-seguro.top*).
*   **Injeção Dinâmica:** O corpo do e-mail é montado em HTML. Onde houver um link ou botão malicioso, o administrador utiliza a tag curinga `{{LINK_AQUI}}`.

### 3.2. Criação da Campanha
A campanha une o Modelo criado aos **Setores** (ex: TI, RH, Financeiro) que serão os alvos do teste. 

### 3.3. O Motor Criptográfico (Script em C)
Para rastrear os cliques sem expor os dados dos usuários na URL, o sistema gera **Tokens Únicos**.
*   O back-end aciona o programa em **C**, que utiliza múltiplas **Threads** para processar os alvos em paralelo.
*   Cada thread gera um token aplicando um algoritmo de embaralhamento de bits milhares de vezes (técnica de *Key Stretching*) sobre uma string combinando: `matrícula + email + departamento + ID_da_Campanha + ChaveSecreta`.
*   Isso garante que o token seja exclusivo para **aquela interação específica** (Usuário X recebendo Campanha Y).
*   Esses tokens são armazenados na tabela intermediária `disparos` no banco de dados.

### 3.4. Disparo
O Node.js lê o HTML do Modelo, substitui a tag `{{LINK_AQUI}}` pela URL contendo o Token Único recém-gerado, e envia os e-mails aos alvos via servidor SMTP.

---

## 🎯 4. Rastreamento e Captura de Interações
O coração do sistema é medir a vulnerabilidade humana. As interações são capturadas de duas formas:

*   **Rastreamento de Cliques (Vulnerabilidade):** Se o alvo clicar no link, ele é direcionado à URL controlada pelo back-end. A API lê o token presente na URL, identifica na tabela `disparos` quem foi a vítima e a campanha, e registra `clicou_link = TRUE`.
*   **Rastreamento de Reportes (Conscientização):** Se o usuário perceber o ataque e encaminhar o e-mail para a caixa de denúncias (*Abuse Inbox*), um container "SMTP to Webhook" recebe a mensagem, extrai o token e envia um aviso via HTTP para a API Node.js, marcando `reportou_phishing = TRUE`.

---

## 🏆 5. Gamificação e Treinamentos Educativos
O portal do "Usuário Destino" funciona sob um sistema de pontuação comportamental:

*   **Penalidade (Perda de Pontos):** Ocorre caso o usuário clique em links maliciosos ou abra anexos suspeitos das campanhas.
*   **Neutralidade:** Ocorre caso o usuário simplesmente ignore o e-mail, não alterando seu saldo de pontos.
*   **Recompensa (Ganho de Pontos):** Concedida quando o usuário identifica e reporta corretamente o e-mail para a caixa de *Abuse*.
*   **Consumo de Treinamentos:** O portal logado oferece vídeos e quizzes (inseridos no código React como MVP). Ao concluir um módulo, a API registra a ação na tabela `treinamento_concluido` e soma pontos ao perfil do usuário. A tabela impede que os pontos sejam ganhos em duplicidade pelo mesmo curso.
