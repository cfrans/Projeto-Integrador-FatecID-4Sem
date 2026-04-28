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

## 📊 Status atual

> ⚠️ **Em desenvolvimento ativo (alpha).** O esqueleto da plataforma está pronto e várias telas já operam ponta-a-ponta com o backend, mas o disparo real de e-mails e o portal do colaborador ainda não foram implementados.

### ✅ Implementado

**Backend (Spring Boot)**
- 🔐 Login com JWT e troca obrigatória de senha no primeiro acesso
- 📝 CRUD de Modelos de e-mail (com domínio alvo, remetente falso, HTML)
- 🎯 Criação de Campanhas vinculando Modelo + Setores alvo
- ⚙️ Geração de tokens únicos via Worker em C (multithread, key stretching, DJB2, detecção automática de CPUs)
- 🔎 Rastreamento de cliques (`/confirmar/{token}`) e abertura de anexo (`/doc/{token}`) com geração de arquivo HTML falso on-the-fly
- 🧱 Migrations Flyway com schema completo + seeds de tipos de acesso, modelos e setores
- 🛡️ Spring Security configurado (CORS, sessão stateless, BCrypt)

**Frontend (React + Vite)**
- 🎨 Tela de login com fundo animado e fluxo de "manter sessão"
- 🔁 Tela de troca de senha obrigatória (primeiro acesso)
- 📨 Tela de criação de Campanhas com preview do anexo simulado e seleção de departamentos via *chips*
- 📋 Tela de gestão de Modelos com editor WYSIWYG (Jodit) e validação client-side da tag `{{LINK_AQUI}}`
- 🧭 Roteamento protegido por papel (`PrivateRoute` + `AdminRoute`)
- 💅 Componentes de UI base (Button, Input, Modal, Select, Field, etc.)
- 🔌 API client centralizado (`src/lib/api.js`) — base URL via `VITE_API_URL`, JWT injetado automaticamente

**Qualidade / infraestrutura**
- 🧹 `GlobalExceptionHandler` com handlers específicos (401 só para credenciais, 404 para "não encontrado", 400 para validação, 500 para o resto)
- 📂 CSVs do worker C escritos em diretório dedicado (`backend/tmp/tokens`, configurável via `NEMO_CSV_DIR`)

### 🚧 Em construção / falta fazer

**Crítico (bloqueia o MVP)**
- [ ] **Filtro JWT no backend** — hoje os endpoints `/api/**` estão todos em `permitAll`, a "proteção" existe só no frontend. Adiado para o final, depois que o MVP estiver completo, para facilitar testes em dev.
- [ ] **Disparo SMTP real** — a campanha gera tokens mas não envia e-mails ainda. Adicionar `spring-boot-starter-mail` e service de envio.
- [ ] **CRUD de `usuario_destino`** no backend — a página de Usuários no frontend existe mas opera sobre dados mockados.
- [ ] **Página de Configurações** funcional — trocar a própria senha fora do primeiro acesso e promover/rebaixar usuários do sistema (Admin ↔ Colaborador).

**Funcionalidade**
- [ ] **Dashboard de gráficos** real (hoje a página `/graphics` é placeholder).
- [ ] **SMTP-to-Webhook** para captura de reportes na *abuse inbox* — ferramentas mapeadas: [`alash3al/smtp2http`](https://github.com/alash3al/smtp2http) ou [`rnwood/smtp4dev`](https://github.com/rnwood/smtp4dev).
- [ ] **Portal do Colaborador** logado (com gamificação e treinamentos).
- [ ] **Lógica de pontuação** comportamental (penalidade por clique, recompensa por reporte).
- [ ] **Módulo de treinamentos** (vídeos + quizzes, alimentando `treinamento_concluido`).
- [ ] **Recuperação de senha** ("Esqueci minha senha" do login não está conectado).

**Qualidade**
- [ ] Tornar a geração de tokens assíncrona (`@Async`) com endpoint de status.
- [ ] Remover endpoint de debug `/api/campanhas/teste-worker` (adiado junto do filtro JWT, é útil em dev).
- [ ] Suíte de testes (hoje só existe `contextLoads()`).
- [ ] Documentação de API via springdoc-openapi (Swagger UI).

---

## 🛠 Stack tecnológica

**Front-end**
- React 19 + Vite
- Tailwind CSS 4
- React Router
- Jodit (editor WYSIWYG para os modelos)
- Heroicons

**Back-end**
- Java 21
- Spring Boot 4 (Web, Data JPA, Security, Validation, Flyway)
- jjwt 0.12 (geração e parsing de JWT)
- Lombok

**Banco de Dados**
- MySQL 8

**Processamento Assíncrono**
- Worker em C (multithread, geração paralela de tokens com key stretching, algoritmo DJB2 modificado, estrutura de Lista Encadeada Simples com alocação dinâmica)

**Envio de E-mails**
- *(planejado)* SMTP via JavaMail
- *(planejado)* Container SMTP-to-Webhook para captura de reportes (`alash3al/smtp2http` ou `rnwood/smtp4dev`)

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Java 21+
- Maven
- MySQL rodando (local ou em rede)
- Node.js 18+
- Compilador C (gcc/MinGW) — apenas se for recompilar o worker de tokens

---

### 🗄️ Backend (Spring Boot)

#### 1. Configure o banco de dados

O Flyway cria todas as tabelas automaticamente na primeira execução — **não é necessário criar nada manualmente no MySQL**, apenas o servidor MySQL precisa estar rodando e acessível.

#### 2. Crie o arquivo `application-local.yaml`

Dentro de `backend/src/main/resources/`, crie o arquivo `application-local.yaml` com as suas credenciais locais:

```yaml
spring:
  datasource:
    username: seu-usuario-do-mysql
    password: sua-senha-do-mysql
    url: jdbc:mysql://localhost:3306/nemo?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

logging:
  level:
    org.springframework.security: TRACE

jwt:
  secret: nemo-jwt-secret-dev-apenas-local-nao-commitar
  expiration-ms: 86400000
```

> ⚠️ Este arquivo está no `.gitignore` e **nunca deve ser commitado**. Cada dev mantém o seu localmente.

#### 3. Suba o backend

```bash
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

A API ficará disponível em `http://localhost:8080`.

#### 4. O que o Flyway faz automaticamente

Na primeira execução, o Flyway aplica as migrations em ordem:

| Migration | O que faz |
|-----------|-----------|
| `V1__create_schema.sql` | Cria todas as tabelas do banco |
| `V2__insert_defaults.sql` | Insere os tipos de acesso e o usuário admin padrão |
| `V3__insert_modelos_base.sql` | Insere 3 modelos de e-mail base (TI, Bradesco, RH) |
| `V4__insert_setores_base.sql` | Insere 6 setores base (Financeiro, TI, RH, Comercial, Marketing, Diretoria) |
| `V5__insert_users_base.sql` | Insere 100 usuários alvo de teste (`usuario_destino`) |

> ⚠️ **Regra importante:** migrations já aplicadas **nunca devem ser editadas**. Para qualquer alteração no banco, crie um novo arquivo `V5__descricao.sql`, `V6__descricao.sql`, e assim por diante.

#### 5. Acesso inicial

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

## 🏗️ Arquitetura

### Visão geral

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   React + Vite  │ --HTTP->│  Spring Boot API │ --JPA-->│   MySQL 8    │
│   (porta 5173)  │         │   (porta 8080)   │         │              │
└─────────────────┘         └────────┬─────────┘         └──────────────┘
                                     │
                                     │ ProcessBuilder
                                     ▼
                            ┌──────────────────┐
                            │  Worker em C     │
                            │  (multithread)   │
                            └──────────────────┘
```

### Perfis de acesso

O sistema atende a dois públicos com fluxos completamente separados:

1. **Administradores (Equipe de Segurança)** — `usuario_sistema` com `tipo_acesso = Admin`. Acessam o painel de gestão para cadastrar usuários alvo, criar modelos de e-mail, disparar campanhas e visualizar o dashboard de resultados.
2. **Usuários Destino (Alvos/Colaboradores)** — `usuario_destino`. Não fazem login no painel administrativo. Recebem os e-mails simulados e *(planejado)* terão um portal próprio para visualizar pontuação e realizar treinamentos.

### Fluxo de criação e disparo

#### 1. Criação de Modelos (Envelopamento)
O administrador cria a "fantasia" do e-mail falso através de um editor WYSIWYG (Jodit) na tela `/models`.
- **Spoofing:** define remetente falso (ex: `ti@ti.acesso-seguro.top`) e assunto padrão.
- **Domínio Alvo:** seleciona o subdomínio para onde a vítima será levada (ex: `bradesco.acesso-seguro.top`).
- **Injeção dinâmica:** o corpo HTML deve conter a tag `{{LINK_AQUI}}` onde será inserido o link único da vítima. O frontend **bloqueia o salvamento** do modelo caso a tag esteja ausente (validação client-side, heurística de prevenção de erros).

#### 2. Criação da Campanha
Na tela `/create`, o admin une um Modelo a um conjunto de Setores alvo (selecionados via *chips* de múltipla escolha — ou nenhum, para envio global). Pode opcionalmente vincular um "documento" falso para rastrear abertura de anexo separadamente do clique no link principal.

#### 3. Geração de tokens (Worker em C)
Para rastrear cliques sem expor dados pessoais na URL (conformidade LGPD — trafegar `?email=vitima@empresa.com` em texto puro caracterizaria vazamento de PII), o sistema gera **tokens únicos opacos**:
- O Spring escreve um CSV temporário com os alvos e dispara o programa em C via `ProcessBuilder`.
- O worker usa **múltiplas threads** para processar os alvos em paralelo, aplicando key stretching sobre `matrícula + email + departamento + ID_da_Campanha + chave_secreta`.
- O algoritmo de hash utilizado é o **DJB2 modificado**. Os dados são manipulados em memória utilizando uma **Lista Encadeada Simples com alocação dinâmica**, evitando desperdício de memória em lotes de tamanho imprevisível.
- A quantidade de threads é determinada em tempo de execução consultando o sistema operacional (`GetSystemInfo` no Windows ou `sysconf(_SC_NPROCESSORS_ONLN)` no Linux). O worker subtrai de 1 a 2 threads do total detectado para não saturar o servidor durante o disparo.
- Cada token é único para **aquela combinação específica** de usuário × campanha. O token mascara a identidade do alvo e a qual campanha ele pertence.
- Os tokens voltam num CSV de saída e são gravados em `disparos`.

#### 4. Disparo *(planejado)*
O backend lerá o HTML do Modelo, substituirá `{{LINK_AQUI}}` pela URL contendo o token único, e enviará via SMTP. **Esta etapa ainda não está implementada.**

### Rastreamento

| Evento | Como funciona | Onde fica registrado |
|--------|---------------|----------------------|
| **Clique no link** | Vítima acessa `/confirmar/{token}` → 302 redirect pro domínio falso. | `disparos.clicou_link = TRUE` |
| **Abertura do anexo** | Vítima acessa `/doc/{token}` → o backend gera on-the-fly um arquivo `.html` com nome configurável pelo admin (ex: `relatorio.pdf.html`) contendo apenas um script de redirecionamento para a API. O arquivo não é um PDF/DOCX real, evitando bloqueios por antivírus e filtros de spam, mas registra a interação. | `disparos.abriu_anexo = TRUE` |
| **Reporte do e-mail** *(planejado)* | Vítima encaminha o e-mail para a *abuse inbox* → SMTP-to-Webhook extrai o token. | `disparos.reportou_phishing = TRUE` |

### Gamificação *(planejado)*

O portal do Usuário Destino funcionará sob um sistema de pontuação comportamental:

- **Penalidade:** clique em link malicioso ou abertura de anexo suspeito subtrai pontos.
- **Neutralidade:** ignorar o e-mail não altera o saldo.
- **Recompensa:** identificar e reportar o e-mail para a *abuse inbox* soma pontos.
- **Treinamentos:** módulos de vídeo e quiz somam pontos quando concluídos. A tabela `treinamento_concluido` impede ganho duplicado pelo mesmo curso.

---

## 📁 Estrutura do projeto

```
nemo/
├── backend/
│   ├── scripts/
│   │   └── gerador_tokens_worker.c       # Worker multithread em C
│   └── src/main/
│       ├── java/com/nemo/api/
│       │   ├── auth/                     # Login, JWT, troca de senha
│       │   ├── campanha/                 # CRUD de campanhas + integração com worker
│       │   ├── modelo/                   # CRUD de modelos de e-mail
│       │   ├── setor/                    # Listagem de setores
│       │   ├── tracking/                 # /confirmar e /doc (rastreamento)
│       │   ├── config/                   # SecurityConfig, GlobalExceptionHandler
│       │   ├── model/                    # Entidades JPA
│       │   └── repository/               # Spring Data repositories
│       └── resources/
│           ├── application.yaml
│           └── db/migration/             # Migrations Flyway (V1..V5)
└── frontend/
    └── src/
        ├── components/                   # UI base, navbar, branding, routing guards
        ├── contexts/AuthContext.jsx      # Estado de autenticação
        ├── layouts/AppShellLayout.jsx    # Layout interno (navbar + outlet)
        ├── pages/
        │   ├── login/                    # ✅ Login
        │   ├── change-password/          # ✅ Troca obrigatória
        │   ├── campaigns/                # ✅ Criar campanha
        │   ├── models/                   # ✅ CRUD de modelos
        │   ├── users/                    # 🚧 mock (sem backend)
        │   ├── admin/                    # 🚧 placeholder
        │   ├── home/                     # 🚧 placeholder (portal do colaborador)
        │   ├── graphics/                 # 🚧 placeholder (dashboard)
        │   └── settings/                 # 🚧 placeholder
        └── routes/index.jsx              # Definição de rotas
```

---

## 🚀 Resultados esperados

Espera-se que o sistema contribua para a **conscientização dos usuários sobre ataques de phishing**, além de permitir a aplicação de conhecimentos práticos relacionados a:

- 💻 Desenvolvimento de software full-stack
- 🗄️ Modelagem e operação de banco de dados relacional
- 🔐 Segurança da informação (autenticação, criptografia, vetores de ataque)
- ⚡ Programação concorrente (threading em C)

---

## 📜 Licença

Este projeto está sob a licença **CC BY-NC-ND 4.0** (Creative Commons — Atribuição, Não Comercial, Sem Derivações).