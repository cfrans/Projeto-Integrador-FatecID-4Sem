<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/logo-horizontal-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="frontend/src/assets/logo-horizontal-white.svg" />
    <img alt="Nemo - Sistema de Conscientização e Simulação de Phishing" src="frontend/src/assets/logo-light.png" height="145">
  </picture>
  <br><br>

  ![Status](https://img.shields.io/badge/Status-Estável-brightgreen?logo=rocket&logoColor=white)
  ![Versão](https://img.shields.io/badge/Versão-v1.0.0--rc.1-blue?logo=git&logoColor=white)
  ![Licença](https://img.shields.io/badge/Licença-CC%20BY--NC--ND%204.0-blue?logo=creativecommons&logoColor=white)

  ![JavaScript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
  ![Java Spring Boot](https://img.shields.io/badge/Java-Spring%20Boot-green)
  ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
  ![MySQL](https://img.shields.io/badge/MySQL-005C84?logo=mysql&logoColor=white)
</div>

<br>

## 📑 Índice

- [📖 O que é o Nemo?](#-o-que-é-o-nemo)
- [⚙️ Como Funciona (Regras de Negócio)](#-como-funciona-regras-de-negócio)
  - [Perfis de Acesso](#1-perfis-de-acesso)
  - [O Ciclo de Simulação](#2-o-ciclo-de-simulação)
  - [Rastreamento (Tracking)](#3-rastreamento-tracking)
  - [Gamificação e Pontuação](#4-gamificação-e-pontuação)
- [🏗️ Arquitetura e Stack Tecnológica](#-arquitetura-e-stack-tecnológica)
- [🚀 Como rodar o projeto localmente](#-como-rodar-o-projeto-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Configurando o Backend](#1-backend-spring-boot)
  - [Configurando o Frontend](#2-frontend-react--vite)
  - [Modo Offline (Plano B para apresentações)](#3-modo-offline-plano-b)
- [📧 Captura de Denúncias via Gmail (Opcional)](#-captura-de-denúncias-via-gmail-opcional)
- [📜 Licença](#-licença)

---

## 📖 O que é o Nemo?

O **Nemo** é uma plataforma corporativa completa de **conscientização e simulação de phishing**. O objetivo principal do sistema é reduzir a superfície de ataque humano nas organizações, transformando o elo mais fraco (o colaborador) em uma linha de defesa ativa.

O sistema faz isso combinando **simulações de ataques realistas** (disparo de e-mails falsos criados pela própria equipe de TI da empresa) com um portal educativo gamificado. Cada interação do colaborador com as ameaças é monitorada com segurança e precisão, fornecendo métricas de risco gerenciais enquanto protege a privacidade (LGPD).

---

## ⚙️ Como Funciona (Regras de Negócio)

### 1. Perfis de Acesso

O sistema atende a dois públicos com fluxos completamente separados:

- **Administradores (Equipe de TI/Segurança):** Acessam o painel de gestão central. Eles têm permissão para cadastrar/importar colaboradores, criar modelos de e-mail falsos, disparar campanhas de simulação em massa e visualizar gráficos consolidados de vulnerabilidade da empresa por setor.
- **Usuários Destino (Colaboradores):** Não têm acesso administrativo. São o alvo das campanhas. Possuem um Portal do Colaborador próprio onde podem acompanhar sua "Pontuação de Segurança", assistir a vídeos educativos e responder a quizzes sobre cibersegurança.

### 2. O Ciclo de Simulação

O fluxo operacional de um ataque simulado ocorre em quatro etapas:

1. **Envelopamento:** O Administrador cria um **Modelo** de e-mail com editor visual (WYSIWYG), definindo remetente falso (Spoofing) e os links/anexos "maliciosos".
2. **Definição de Alvos:** O Administrador cria uma **Campanha**, selecionando o modelo criado e os setores da empresa que serão atacados.
3. **Geração de Tokens:** Para rastrear as interações sem expor dados pessoais na URL (o que feriria a LGPD), o sistema aciona um **Worker em linguagem C**. Esse *worker* gera um token criptográfico único para cada usuário e para cada disparo daquela campanha. É esse token exclusivo que é injetado nos links de *phishing*, nos PDFs falsos e rastreado na *abuse inbox* caso o usuário reporte o e-mail, permitindo identificar exatamente quem interagiu com a ameaça. A geração é feita em altíssima velocidade utilizando *multithreading* e o algoritmo de hash DJB2.
4. **Disparo Real:** O Spring Boot envia os e-mails de forma assíncrona utilizando o protocolo SMTP.

### 3. Rastreamento (Tracking)

As iscas geram métricas sem expor a rede da empresa. Quando o colaborador interage com a ameaça simulada:

- **Clique no link:** A vítima é rastreada silenciosamente no banco de dados através do token e imediatamente redirecionada para uma página educativa avisando que ela "caiu num phishing simulado".
- **Abertura do anexo:** O Nemo gera arquivos HTML "disfarçados" de PDF/Word sob demanda. Ao serem abertos, eles registram a falha de segurança através do token sem a necessidade de baixar malwares reais na máquina da vítima.
- **Reporte:** Se a vítima identificar o phishing sem clicar, e encaminhar o e-mail para a equipe de segurança (Abuse Inbox), o sistema rastreia o token embutido na denúncia e computa a ação positiva.

### 4. Gamificação e Pontuação

O Nemo opera sob um sistema de pontuação comportamental **(Saldo de 0 a 1000, com baseline em 500 pontos)**. O objetivo é educar e não punir:

- Clicar em link suspeito: **-20 pts**
- Abrir anexo suspeito: **-30 pts**
- Denunciar/Reportar o phishing à TI: **+30 pts**
- Concluir vídeos ou quizzes na plataforma: **+50 pts**

Com base na pontuação, o colaborador é classificado em **Faixas de Risco**:
- **0 a 299 pts:** Risco Crítico (treinamentos obrigatórios)
- **300 a 699 pts:** Atenção
- **700 a 1000 pts:** Seguro / OK

---

## 🏗️ Arquitetura e Stack Tecnológica

O sistema foi desenhado com arquitetura de microserviços e componentes desacoplados:

- **Front-end:** React 19, Vite, Tailwind CSS 4, React Router, Chart.js.
- **Back-end:** Java 21, Spring Boot 4 (Data JPA, Security, Mail), Flyway, JWT.
- **Worker (Processamento de Tokens):** Linguagem C (Pthreads, Algoritmo DJB2 modificado, Listas Encadeadas Dinâmicas).
- **Banco de Dados:** MySQL 8.
- **Integrações:** SMTP via Postfix (domínio próprio) e varredura de reportes via IMAP Listener nativo do Java Mail.

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Java 21+
- Node.js 18+
- MySQL 8 rodando (localmente na porta 3306)
- *Opcional:* Compilador C (gcc) apenas se desejar recompilar o código do Worker. Os executáveis embutidos para Windows (`.exe`), macOS e Linux já acompanham o projeto.

### 1. Backend (Spring Boot)

O banco de dados é criado automaticamente via Flyway. **Não é necessário criar as tabelas manualmente.** 

1. Crie o arquivo `application-local.yaml` dentro de `backend/src/main/resources/`:

```yaml
spring:
  datasource:
    username: seu-usuario-do-mysql
    password: sua-senha-do-mysql
    url: jdbc:mysql://localhost:3306/nemo?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

jwt:
  secret: chave-secreta-ambiente-local-para-assinatura-jwt
  expiration-ms: 86400000

nemo:
  email:
    enabled: true             # Se não houver servidor SMTP local, use "false" (modo simulação)
  tracking:
    base-url: http://localhost:8080
  imap:
    enabled: false
```

2. Na pasta raiz do `backend/`, inicie o servidor com o Maven Wrapper:

```bash
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

3. Acesse a documentação interativa da API (Swagger) em: `http://localhost:8080/swagger-ui.html`.

#### Estrutura de Migrations (Flyway)

Na primeira execução, o Flyway cria as tabelas e popula o banco com dados essenciais de teste na seguinte ordem:
- `V1` a `V4`: Criação do *schema*, tabelas base, tipos de acesso, 3 modelos de e-mail e 6 setores da empresa.
- `V5` e `V6`: Inserção de 50 colaboradores fictícios e catálogo de perguntas de segurança.
- `V7`: Popula o banco com 8 campanhas falsas já disparadas, para preencher os gráficos do *Dashboard* com dados gerenciais.
- `V8`: Cria o módulo de treinamentos (vídeos e quizzes) para o Portal do Colaborador.

> ⚠️ **Nota:** Migrations já aplicadas nunca devem ser editadas. Novas alterações estruturais no banco devem ser feitas através de novos arquivos (ex: `V9__descricao.sql`).

#### Monitoramento de Logs Separados

O Spring Boot foi configurado para direcionar as saídas para arquivos de *log* isolados, localizados na pasta `logs/` (criada na raiz durante a execução):
- **`nemo-mail.log`**: Registra **apenas** os disparos reais de SMTP e a varredura IMAP. Ideal para deixar rodando em um monitor à parte e auditar o volume de envios.
- **`nemo-system.log`**: Registra as regras de negócio (criação de campanhas, pontuações, usuários).
- **`nemo-debug.log`**: Arquivo mais verboso, contém as queries do Hibernate e filtros do Spring Security.

### 2. Frontend (React + Vite)

Na pasta raiz do `frontend/`, instale as dependências e inicie o ambiente de desenvolvimento:

```bash
npm install
npm run dev
```

Acesse em: `http://localhost:5173`. 
> 🔐 **Acesso inicial Administrativo:** Ao rodar pela primeira vez, acesse a gestão do sistema com **E-mail:** `admin@nemo.com` e **Senha:** `admin`. O sistema exigirá a troca imediata desta senha.

> 👥 **Acesso inicial do Colaborador (Alvo):** Os 50 usuários fictícios gerados no banco podem acessar o Portal do Colaborador. O login de todos eles utiliza **E-mail da empresa** e a **senha inicial é a própria Matrícula** (ex: matrícula `21000` = senha `21000`). No primeiro acesso, eles também serão obrigados a definir uma senha forte e cadastrar perguntas de segurança.

### 3. Modo Offline (Plano B)

Em ambientes acadêmicos ou restritos sem acesso à Internet/servidores SMTP, o Nemo possui um **Modo Offline**.

1. No seu `application-local.yaml`, certifique-se de que `nemo.email.enabled: false`. O sistema simulará o envio, salvando os registros apenas no banco.
2. Acesse a rota secreta `http://localhost:5173/caixa-entrada`. Ela atua como um Webmail falso, permitindo clicar nos e-mails de campanhas em andamento e testar a captura de vulnerabilidades sem precisar acessar uma caixa de e-mail real.

---

## 📧 Captura de Denúncias via Gmail (Opcional)

Para o recurso automático de ganho de pontos ao denunciar um e-mail de phishing:

1. Ative o **IMAP** nas configurações de uma conta do Gmail que servirá como sua "Abuse Inbox" (ex: `abuse.suaempresa@gmail.com`).
2. Vá nas opções de segurança da Conta do Google e gere uma **Senha de Aplicativo (16 dígitos)**.
3. Adicione ao final do seu `application-local.yaml`:

```yaml
nemo:
  imap:
    enabled: true
    username: abuse.suaempresa@gmail.com
    password: sua-senha-de-16-digitos-sem-espacos
```
O sistema varrerá a caixa postal a cada 1 minuto processando denúncias automaticamente.

---

## 📜 Licença

Este projeto está sob a licença **CC BY-NC-ND 4.0** (Creative Commons — Atribuição, Não Comercial, Sem Derivações). Seu uso educacional é estimulado, sendo vedada a comercialização ou derivação de código sem consentimento.
