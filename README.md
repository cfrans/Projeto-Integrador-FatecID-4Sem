<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/logo-horizontal-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="frontend/src/assets/logo-horizontal-white.svg" />
    <img alt="Nemo - Sistema de Conscientização e Simulação de Phishing" src="frontend/src/assets/logo-light.png" height="145">
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
O **Nemo** é uma plataforma de **conscientização e simulação de phishing** projetada para fortalecer a cultura de segurança digital em organizações. Ao combinar simulações de ataques realistas com mecanismos de gamificação e trilhas educativas, o sistema transforma a vulnerabilidade humana em uma linha de defesa ativa.

O sistema opera através do envio de **iscas simuladas 📧** (links, e-mails e anexos). Cada interação é monitorada via tokens opacos, garantindo a privacidade dos dados (**LGPD**) enquanto fornece métricas precisas sobre o comportamento de risco da equipe.

Complementando a simulação, o Nemo oferece **conteúdos educativos 📚** direcionados, focados em ensinar o reconhecimento de vetores de ataque e a adoção de boas práticas cibernéticas.

---

## 🎯 Objetivo
Reduzir a superfície de ataque humano nas organizações através de um ciclo contínuo de **simulação, monitoramento e educação**, utilizando dados reais para direcionar o treinamento onde ele é mais necessário.

---

## 📊 Status atual

> ⚠️ **Em desenvolvimento ativo (v0.0.1-alpha).** A infraestrutura core (API, Worker de Tokens, Gestão de Campanhas e Monitoramento) já é funcional. O foco atual está na implementação do disparo real via SMTP e na expansão do Portal do Colaborador.

### ✅ Implementado

**Core & Backend (Spring Boot 3.4)**
- 🔐 **Segurança:** Autenticação JWT, troca obrigatória de senha e criptografia BCrypt.
- 📨 **Campanhas:** CRUD completo de Modelos (WYSIWYG Jodit) e gestão de Campanhas vinculadas a setores.
- ⚡ **Performance:** Geração de tokens ultrarrápida via Worker em C (multithread, algoritmos de hash DJB2).
- 🔎 **Tracking:** Rastreamento de cliques e abertura de anexos com geração de arquivos "isca" *on-the-fly*.
- 📊 **Gestão de Dados:** Migrations via Flyway, repositórios auditáveis e lógica de pontuação idempotente.
- 📈 **Dashboard de Gráficos:** `GET /api/graficos/dashboard` integrado ao frontend — filtros por período, setor e modelo, sem dados mockados.

**Interface & Experiência (React + Tailwind)**
- 🎨 **UI Moderna:** Dashboards interativos, fundo animado com peixes (identidade visual Nemo) e design responsivo.
- 📋 **Monitoramento:** Tela de acompanhamento de campanhas com filtros avançados e métricas por setor.
- 👥 **Gestão de Alvos:** Importação massiva de usuários via CSV com relatório de processamento detalhado.
- ⚙️ **Perfil:** Troca de senha, perguntas de segurança e controle de papéis (Admin/Colaborador).
- 🔀 **Separação de perfis no frontend:** `AdminRoute` e `ColaboradorRoute` — rotas, menus e navegação completamente separados por `role` no JWT.

**Portal do Colaborador**
- 🏠 **Página inicial** (`/home`) — boas-vindas personalizado, velocímetro integrado, cards de ação (Quiz, Conteúdos, Meu Desempenho) e dica de segurança do dia.
- 🎓 **Conteúdos Educativos** (`/conteudos`) — 8 vídeos do YouTube embeddados, filtro por categoria (Phishing, Senhas, Redes Sociais, Corporativo), player integrado com thumbnail.
- 🧠 **Quiz de Phishing** (`/quiz`) — quizzes interativos de múltipla escolha. Integrado ao backend.
- 📊 **Meu Desempenho** (`/meus-graficos`) — KPIs, velocímetro dinâmico, gráficos com Chart.js. Consome `GET /api/colaborador/pontuacao` real, sem dados mockados.

**Gamificação & Rastreamento**
- 🎮 **Sistema de Pontuação:** Saldo dinâmico (0-1000) com baseline neutro (500). Penalidades automáticas por cliques (−20) e aberturas (−30).
- 📈 **Métricas de Risco (Vulnerabilidade Geral):** Calculada dividindo o total de cliques pelo total de e-mails disparados (`(cliques / disparos) * 100`). É a principal KPI de gestão exibida no dashboard administrativo e nas análises gráficas.
- 🎯 **Monitoramento de Interações:** Captura em tempo real via webhook (pixel de rastreamento falso injetado no HTML e rotas `/tracking/*`), garantindo a privacidade dos colaboradores.

### 🚧 Em construção / falta fazer

#### Backend

**Crítico (bloqueia o MVP)**
- [x] **Lógica de Último Login** — A data de acesso é registrada automaticamente no `AuthService` durante o login e exibida na tela de Configurações para auditoria (fuso horário local tratado via `LocalDateTime`).
- [ ] **Filtro JWT** — hoje os endpoints `/api/**` estão todos em `permitAll`, a "proteção" existe só no frontend. Adiado para o final, depois que o MVP estiver completo, para facilitar testes em dev.
- [ ] **Disparo SMTP real** — a campanha gera tokens mas não envia e-mails ainda. Adicionar `spring-boot-starter-mail` e service de envio.
- [x] **CRUD de `usuario_destino`** — backend (`UsuarioDestinoController` + `UsuarioDestinoService`) e frontend integrados. Suporte a criação, edição, remoção individual e em lote, paginação, ordenação por coluna, filtros por nome/e-mail e setor, e **importação em massa via CSV** (`POST /api/usuarios-destino/importar`) com detecção automática de separador, parsing quote-aware, BOM stripping e relatório por linha de erros/ignorados/criados.
- [x] **Modo de Apresentação & Simulação** — Diferenciação entre usuários "Mock" (volume) e "Reais" (testes) via coluna `is_real`. Adicionado "interruptor" `nemo.email.enabled` para simulação offline de disparos.
- [x] **Lógica de pontuação** comportamental — `PontuacaoService` aplica penalidade por clique (−20) e abertura de anexo (−30) com idempotência por disparo, clamp em 0–1000 e histórico em `pontuacao_evento`. Falta integrar com o reporte (depende do SMTP-to-Webhook) e com a conclusão de treinamentos (depende do módulo de treinamentos).

**Funcionalidade**
- [x] **IMAP Listener nativo** para captura de reportes na *abuse inbox* — substitui ferramentas externas. Lê a caixa do Gmail de 1 em 1 minuto usando `jakarta.mail` (`spring-boot-starter-mail`).
- [x] **Endpoint consolidado de gráficos** — `GET /api/graficos/dashboard?periodo=7d|30d|6m|tudo` retorna totais, agregação por setor, evolução mensal e últimas campanhas, ligado ao dashboard `/graphics`.
- [x] **Endpoint de pontuação e evolução do colaborador** — `GET /api/colaborador/pontuacao` retornando saldo atual + histórico de eventos (data, tipo de evento, delta de pontos) para alimentar os gráficos do portal.
- [x] **Módulo de treinamentos** — falta a tabela catálogo `treinamento` (id, código, título, descrição, conteúdo) com FK em `treinamento_concluido` substituindo o `codigo_curso` string. Em seguida, CRUD de quizzes (perguntas + alternativas + resposta correta) e registro de conclusão (impede ganho duplicado pelo mesmo curso).
- [x] **Recuperação de senha** — fluxo de "Esqueci minha senha" validado por Perguntas de Segurança integrado no portal e na API.

**Qualidade**
- [ ] Suíte de testes (hoje só existe `contextLoads()`).
- [x] Documentação de API via springdoc-openapi (Swagger UI).

### 🚀 Melhorias Futuras (Escalabilidade)
- **Geração Assíncrona de Tokens**: Atualmente o backend aguarda de forma síncrona o processamento do Worker em C. Para escalas maiores (>10.000 usuários), será ideal isolar a chamada ao executável em uma thread `@Async` e prover um endpoint de *polling* (`/status`) para o frontend acompanhar o progresso sem risco de timeout.

**Padronização da arquitetura em camadas** (controller → service → repository → model)
- [x] **`HealthController` fora do padrão** — movido de `com.nemo.api.controller/` para `com.nemo.api.health/`, alinhado com o padrão package-by-feature.
- [x] **`SetorController` acessa `SetorRepository` direto** — `SetorService` criado para intermediar o acesso ao repositório e encapsular o mapeamento para DTO.
- [x] **`TrackingController` com regra de domínio dentro** — `TrackingService` extraído com `registrarClique(token)` e `registrarAnexo(token)`; o controller ficou com ~10 linhas, só serialização HTTP.
- [x] **`SetorDTO` em pacote errado** — movido de `com.nemo.api.campanha` para `com.nemo.api.setor`; imports atualizados em `CampanhaDTO` e `CampanhaService`.

---

#### Frontend

**Crítico (bloqueia o MVP)**
- [x] **Gerenciamento de usuários do sistema** — promover/rebaixar entre Admin ↔ Colaborador (UI integrada na página de Usuários).
- [x] **Dashboard de gráficos integrado ao backend** — a página `/graphics` já consome `GET /api/graficos/dashboard` com filtros reais (período, setor, modelo). Sem dados mockados.
- [x] **Login de colaborador com separação de rotas** — `ColaboradorRoute` valida `role` no JWT; menus e páginas são completamente diferentes dos do Admin.

**Funcionalidade — Painel Admin**
- [ ] **Disparo SMTP real** — a campanha gera tokens mas não envia e-mails ainda. Adicionar `spring-boot-starter-mail` e service de envio (`EmailService`). **Bloqueia o MVP operacional.**

**Funcionalidade — Portal do Colaborador**
- [x] **Endpoint de pontuação do colaborador** — `GET /api/colaborador/pontuacao` retornando saldo atual + histórico de `pontuacao_evento`. Integrado em `/meus-graficos` com mapeamento dos eventos reais.
- [x] **Página de Configurações para `UsuarioDestino`** — a página `/settings` já funciona para colaborador tanto no backend quanto no frontend de forma isolada do admin.

**Treinamentos (prioridade menor — hardcoded é suficiente para apresentação)**
- [x] **Módulo de treinamentos no backend** — tabela `treinamento`, CRUD de quizzes (perguntas + alternativas + resposta correta), endpoint de conclusão com +50 pontos idempotente. Atualmente `/conteudos` e `/quiz` funcionam com dados hardcoded no frontend.

---

## 🛠 Stack tecnológica

**Front-end**
- React 19 + Vite
- Tailwind CSS 4
- React Router
- Jodit (editor WYSIWYG para os modelos)
- Chart.js + react-chartjs-2 (dashboard de gráficos)
- Heroicons
- Hugeicons (componentes internos do shadcn)

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
- *(planejado)* Disparo SMTP via Postfix (domínio próprio)
- Captura de reportes via Listener IMAP Nativo (Gmail)

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

#### 4. Documentação da API (Swagger)

Com o backend rodando, você pode acessar a documentação interativa da API (OpenAPI 3) através do Swagger UI:

🔗 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

Nesta interface, é possível visualizar todos os endpoints, esquemas de dados e realizar testes de requisições diretamente pelo navegador.

#### 5. O que o Flyway faz automaticamente

Na primeira execução, o Flyway aplica as migrations em ordem:

| Migration | O que faz |
|-----------|-----------|
| `V1__create_schema.sql` | Cria todas as tabelas do banco (inclui `ultimo_login`, `is_real` e `pontuacao_evento` já com baseline 500) |
| `V2__insert_defaults.sql` | Insere os tipos de acesso e o usuário admin padrão |
| `V3__insert_modelos_base.sql` | Insere 3 modelos de e-mail base (TI, Bradesco, RH) |
| `V4__insert_setores_base.sql` | Insere 6 setores base (Financeiro, TI, RH, Comercial, Marketing, Diretoria) |
| `V5__insert_users_base.sql` | Insere 50 usuários alvo mock (`usuario_destino`, `is_real=FALSE`, senha = matrícula) |
| `V6__add_perguntas_seguranca.sql` | Catálogo `pergunta_seguranca` (10 perguntas em 2 grupos) + colunas `id_pergunta_1/2` e `resposta_hash_1/2` em `usuario_destino` e `usuario_sistema` |
| `V7__seed_dashboard.sql` | Popula 8 campanhas, ~400 disparos, eventos de pontuação e treinamentos para alimentar o dashboard com dados realistas |

> ⚠️ **Regra importante:** migrations já aplicadas **nunca devem ser editadas**. Para qualquer alteração no banco, crie um novo arquivo `V8__descricao.sql`, `V9__descricao.sql`, e assim por diante.

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

> 💡 **Nota sobre o ambiente de Apresentação/TCC:**
> Para simplificar a infraestrutura no dia da banca, a arquitetura recomendada e homologada é uma topologia híbrida:
> 1. **O Nemo (React + Spring Boot)** roda em `localhost` na máquina do apresentador.
> 2. O **Disparo de E-mails** é feito através de uma VM externa rodando **Postfix** sob um domínio real (`acesso-seguro.top`), garantindo o spoofing realista.
> 3. Os **Links de Phishing** dentro do e-mail apontam para o próprio `localhost:8080`.
> 4. Após clicar no link (e ser penalizado), a vítima é redirecionada para uma *landing page* de alerta hospedada no domínio real (ex: `alerta.acesso-seguro.top`), que por sua vez contém um botão direcionando a vítima de volta para o portal de treinamentos no `localhost:5173`.

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
- O Spring escreve um CSV temporário com os alvos (excluindo automaticamente qualquer usuário que tenha sido promovido a **Admin**) e dispara o programa em C via `ProcessBuilder`.
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
| **Reporte do e-mail** | Vítima encaminha o e-mail para a *abuse inbox* → O **IMAP Listener** nativo do Spring Boot lê a caixa do Gmail, acha o token usando regex e chama o webhook interno de pontuação. | `disparos.reportou_phishing = TRUE` |

#### Como funciona a captura de denúncias (IMAP Listener)
Para evitar a complexidade de subir contêineres separados de *SMTP-to-Webhook*, o Spring Boot possui uma thread em background (`@Scheduled`) que se conecta via protocolo **IMAP** diretamente à caixa de entrada do Gmail designada como *Abuse Inbox* (ex: `nemo.phishing.report@gmail.com`). 
De 1 em 1 minuto, o serviço lê apenas as mensagens **Não Lidas**, utiliza expressões regulares (Regex) no corpo da mensagem para pescar a URL contendo o token de rastreamento do colaborador, registra o ganho de pontos e marca a mensagem como "Lida".

### Gamificação

O portal do Usuário Destino opera sob um sistema de pontuação comportamental com **saldo limitado** (0–1000) e **baseline neutro** (500). O objetivo é educar, não competir: quem errou pode se redimir via treinamentos, e novos colaboradores entram em pé de igualdade com veteranos.

#### Eventos e deltas

| Evento | Delta | Status | Fonte |
|--------|-------|--------|-------|
| Clicou no link malicioso | **−20** | ✅ implementado | hook em `/confirmar/{token}` |
| Abriu o anexo simulado | **−30** | ✅ implementado | hook em `/doc/{token}` |
| Reportou o e-mail à *abuse inbox* | **+30** | ✅ implementado | IMAP Listener nativo |
| Concluiu um treinamento | **+50** | 🚧 service pronto, aguarda módulo de treinamentos | quiz |
| Ignorou o e-mail | 0 | — | — |

Faixas de risco para gestão:

- **0–300** → crítico (treinamento obrigatório)
- **300–700** → atenção
- **700–1000** → ok

#### Implementação

- **Saldo atual** fica denormalizado em `usuario_destino.pontuacao` (leitura rápida).
- **Histórico completo** em `pontuacao_evento` (`id_usuario_destino`, `id_disparo` *nullable*, `id_campanha` *nullable*, `tipo_evento`, `delta`, `saldo_apos`, `referencia_externa`, `criado_em`) — alimenta o gráfico de evolução do portal e provê auditabilidade.
- **Idempotência** garantida por índice único `(id_disparo, tipo_evento)` em `pontuacao_evento`: cliques repetidos no mesmo link só contam uma vez. Para treinamentos, a checagem é feita por `(usuario_destino, codigo_curso)` — somando o controle existente da tabela `treinamento_concluido`.
- **Clamp** aplicado antes da gravação: o delta efetivo armazenado no histórico reflete o impacto real após o limite (ex: usuário com saldo 10 ao clicar registra `delta = -10` e `saldo_apos = 0`, não `delta = -20`).
- **Transacional**: `PontuacaoService.aplicarEventoDisparo()` roda sob `@Transactional`, garantindo que o evento e a atualização do saldo sejam atômicos.

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
│           └── db/migration/             # Migrations Flyway (V1..V7)
└── frontend/
    └── src/
        ├── components/                   # UI base, navbar, branding, routing guards
        ├── contexts/AuthContext.jsx      # Estado de autenticação
        ├── layouts/AppShellLayout.jsx    # Layout interno (navbar + outlet)
        ├── pages/
        │   ├── login/                    # ✅ Login
        │   ├── change-password/          # ✅ Troca obrigatória
        │   ├── campaigns/                # ✅ Criar campanha, listar, monitorar
        │   ├── models/                   # ✅ CRUD de modelos
        │   ├── graphics/                 # ✅ Dashboard de gráficos (dados mockados)
        │   ├── settings/                 # ✅ Perfil, senha e perguntas de segurança (rota compartilhada)
        │   ├── users/                    # ✅ CRUD completo + filtros + paginação + importação CSV
        │   ├── admin/                    # ✅ Dashboard administrativo (KPIs, atalhos, visão geral)
        │   └── home/                     # ✅ Portal do colaborador (Hero revamp, Velocímetro)
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
