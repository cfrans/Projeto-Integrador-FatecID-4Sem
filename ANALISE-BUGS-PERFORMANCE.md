# Análise de Bugs e Performance — NEMO

> Revisão estática completa do código (backend Spring Boot + frontend React) em busca de **bugs** e **oportunidades de performance**, sem alterar funcionalidade nem o visual.
>
> Data: 2026-06-02 · Branch: `caio`
>
> Cada item traz: caminho do arquivo, linha(s), severidade, categoria, descrição e proposta de correção. As correções foram escolhidas para **preservar o comportamento e a aparência atuais**.

## Índice

- [Resumo executivo / priorização](#resumo-executivo)
- [Frontend — Bugs](#frontend--bugs)
- [Frontend — Performance](#frontend--performance)
- [Backend — Bugs](#backend--bugs)
- [Backend — Performance](#backend--performance)
- [Worker C — Bugs](#worker-c--bugs)
- [Banco / Migrations / Config](#banco--migrations--config)
- [Observações verificadas (sem ação)](#observações-verificadas-sem-ação)

---

## Resumo executivo

Os itens de maior retorno, em ordem de prioridade:

| # | Item | Tipo | Arquivo |
|---|------|------|---------|
| F-1 | Imports com casing errado quebram build em Linux/CI | Bug (Alta) | `PaginationBar.jsx` |
| F-2 | Code-splitting / lazy loading ausente — bundle inicial gigante | Perf (Alta) | `routes/index.jsx`, `vite.config.js` |
| B-1 | `FetchType.EAGER` aninhado em Quiz → Perguntas → Opções | Perf (Alta) | `TreinamentoQuiz.java`, `QuizPergunta.java` |
| B-2 | Índices faltando em `data_envio` / `data_criacao` (dashboard) | Perf (Alta) | nova migration `V9` |
| F-3 | `LoadingOverlay` nunca aparece em Settings (prop errada) | Bug (Média) | `settings/index.jsx` |
| F-4 | Crash ao buscar no Monitoramento (`.toLowerCase()` em nulo) | Bug (Média) | `campaigns/index.jsx` |
| B-3 | NPE em `getIsReal()` durante disparo (Boolean nulo) | Bug (Média) | `CampanhaService.java` |
| B-4 | N+1 nas listagens + `findById` dentro de loop de disparo | Perf (Média) | `CampanhaService.java` e outros services |

---

## Frontend — Bugs

### F-1 · Imports com casing errado em `PaginationBar.jsx` — quebra build case-sensitive
- **Arquivo:** `frontend/src/components/ui/PaginationBar.jsx:1-2`
- **Severidade:** Alta · **Categoria:** Bug
- **Descrição:** Importa `"./Button"` e `"./Select"`, mas os arquivos reais são `button.jsx` e `select.jsx` (minúsculos). No Windows (FS case-insensitive) funciona; em **Linux/Docker/CI** o build falha por arquivo não encontrado. O CLAUDE.md documenta execução em Linux/Mac, então o risco é concreto.
- **Correção:**
  ```jsx
  import { Button } from "./button";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
  ```

### F-3 · `LoadingOverlay` nunca aparece em Settings (prop errada)
- **Arquivo:** `frontend/src/pages/settings/index.jsx:109`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** `LoadingOverlay` (`components/ui/LoadingOverlay.jsx:1`) usa a prop `open` (`if (!open) return null`). Em Settings passa-se `visible={loading}`, que é ignorado — o overlay nunca aparece ao salvar senha/perguntas. `campaigns/index.jsx:386` usa corretamente `open={loading}`.
- **Correção:** `<LoadingOverlay open={loading} />`

### F-4 · Crash ao pesquisar no Monitoramento (`.toLowerCase()` em campo possivelmente nulo)
- **Arquivo:** `frontend/src/pages/campaigns/index.jsx:631-638`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** O filtro de pesquisa chama `.toLowerCase()` direto em `d.nomeDestinatario`, `d.emailDestinatario` e `d.setor`. O próprio código (`:619`) já trata `d.setor` como possivelmente falsy via `.filter(Boolean)`. Se algum vier `null`/`undefined`, lança `TypeError` e quebra a tabela ao digitar.
- **Correção:**
  ```jsx
  return (
    (d.nomeDestinatario ?? "").toLowerCase().includes(q) ||
    (d.emailDestinatario ?? "").toLowerCase().includes(q) ||
    (d.setor ?? "").toLowerCase().includes(q)
  );
  ```

### F-5 · Race condition na Caixa de Entrada ao trocar de campanha
- **Arquivo:** `frontend/src/pages/caixa-entrada/index.jsx:51-65`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** `carregarInbox` roda a cada mudança de `campanhaId` sem cancelamento. Trocando rápido de campanha no `<select>`, uma resposta antiga pode chegar depois e sobrescrever os e-mails da campanha atual. O padrão de cancelamento já é usado corretamente em `graphics/index.jsx:186-208` e `admin/index.jsx:26-39` — é uma inconsistência.
- **Correção:** usar flag de cancelamento no `useEffect`:
  ```jsx
  useEffect(() => {
    if (!campanhaId) return;
    let cancelado = false;
    setCarregando(true);
    api.get(`/api/simulacao/campanhas/${campanhaId}/inbox`, { auth: false })
      .then((data) => { if (!cancelado) { setEmails(data); setSelecionadoId(data.length ? data[0].idDisparo : null); } })
      .catch(() => { if (!cancelado) setEmails([]); })
      .finally(() => { if (!cancelado) setCarregando(false); });
    return () => { cancelado = true; };
  }, [campanhaId]);
  ```

### F-6 · `Velocimetro` não cancela o `requestAnimationFrame` (loops concorrentes + setState após unmount)
- **Arquivo:** `frontend/src/components/ui/velocimetro.jsx:7-26`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** O `useEffect` inicia um loop de `requestAnimationFrame` mas **não retorna cleanup**. Se `saldo` mudar antes dos 1.2s da animação, fica mais de um loop rodando em paralelo (valores "pulando"). Se desmontar no meio, ocorre `setState` em componente desmontado.
- **Correção:**
  ```jsx
  useEffect(() => {
    let raf, start = null;
    const initial = displaySaldo, target = saldo, duration = 1200;
    const animate = (time) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplaySaldo(Math.round(initial + (target - initial) * ease));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [saldo]);
  ```

### F-7 · Interceptor de erro do Axios é frágil e não trata `401`
- **Arquivo:** `frontend/src/lib/api.js:53-58`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** A detecção de sessão expirada só dispara com `status === 500` **e** `data.message` contendo exatamente `"JWT expired"`. É frágil (depende da mensagem crua do Spring) e usa `window.location.href = "/"` (full reload, descarta tratamento do chamador). Quando o enforcement de JWT for ligado (previsto no CLAUDE.md), um `401` limpo **não** será tratado — a sessão não será limpa.
- **Correção (preserva comportamento atual, adiciona robustez):** incluir `res.status === 401` no mesmo bloco de limpeza de token/redirect.

### F-8 · `Modal` quebra com `variant` inválida
- **Arquivo:** `frontend/src/components/ui/modal.jsx:22-39, 51-52`
- **Severidade:** Baixa · **Categoria:** Bug
- **Descrição:** `const c = colors[variant]` — se `variant` não for `error|warning|success`, `c` é `undefined` e `c.img`/`c.title` lançam erro.
- **Correção:** `const c = colors[variant] ?? colors.error;`

### F-9 · Casos de borda menores
- **`frontend/src/pages/meus-graficos/index.jsx:114-119`** (Baixa) — se todos os eventos tiverem `criadoEm` nulo, `Math.min(...[])` = `Infinity` → `new Date(Infinity)` = `Invalid Date` → labels `NaN`. Tratar `datas.length === 0` caindo no caminho do bloco vazio.
- **`frontend/src/pages/quiz/index.jsx:205,282`**, **`users/index.jsx:337`** (Baixa) — `key={i}`/`key={idx}` por índice. Listas são estáticas hoje (impacto baixo); preferir `idPergunta`/`idOpcao` se existirem nos objetos.
- **`AuthContext.parseToken` (`frontend/src/contexts/AuthContext.jsx:5-17`)** (Baixa) — não valida `exp`; token expirado mantém o frontend "logado" até a 1ª chamada falhar. Relevante quando o JWT enforcement for ligado. Opcional: descartar token se `payload.exp * 1000 < Date.now()`.

---

## Frontend — Performance

### F-2 · Code-splitting / lazy loading ausente nas rotas
- **Arquivo:** `frontend/src/routes/index.jsx:1-29`
- **Severidade:** Alta · **Categoria:** Performance
- **Descrição:** As ~25 páginas são importadas estaticamente. Dependências pesadas entram no chunk inicial: `jodit-react` (editor, centenas de KB) em `pages/models`, `chart.js` + `react-chartjs-2` em `graphics`/`meus-graficos`, `canvas-confetti` em `quiz`/`conteudos`, `@formkit/auto-animate` em `users`/`campaigns`. Quem só abre o login baixa o Jodit e o Chart.js inteiros.
- **Correção:** converter páginas para `React.lazy` + `<Suspense>`:
  ```jsx
  import { lazy, Suspense } from "react";
  const ModelsPage = lazy(() => import("../pages/models"));
  const GraphicsPage = lazy(() => import("../pages/graphics"));
  // ... envolver <Routes> em <Suspense fallback={<LoadingOverlay open />}>
  ```
  Pode manter login/404/403 eager.

### F-10 · `vite.config.js` sem `build.manualChunks`
- **Arquivo:** `frontend/vite.config.js:10-18`
- **Severidade:** Alta · **Categoria:** Performance
- **Descrição:** Sem `build` configurado, vendors grandes ficam num único chunk e o hash muda a cada alteração de app, quebrando cache do browser.
- **Correção:**
  ```js
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          editor: ['jodit-react'],
        },
      },
    },
  },
  ```

### F-11 · `AuthContext` recomputa `parseToken` e recria `value` a cada render
- **Arquivo:** `frontend/src/contexts/AuthContext.jsx:17,35`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição:** `parseToken(token)` (faz `atob`+`JSON.parse`) roda em **todo** render do provider, e `value={{...}}` é objeto novo a cada render → todos os consumidores re-renderizam. O provider envolve a árvore inteira (`main.jsx`).
- **Correção:**
  ```jsx
  const user = useMemo(() => (token ? parseToken(token) : null), [token]);
  const value = useMemo(() => ({ token, user, login, logout }), [token, user, login, logout]);
  ```
  > **Pré-requisito:** garantir que `login`/`logout` estejam em `useCallback` (também elimina risco de loop em `alerta-phishing/index.jsx:15-17`, que faz `useEffect(logout, [logout])`).

### F-12 · Listas filtradas/ordenadas recomputadas a cada render — Usuários
- **Arquivo:** `frontend/src/pages/users/index.jsx:470-523`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição:** `filtered`, `sorted` (`[...filtered].sort(...)`) e a paginação rodam em todo render — inclusive ao abrir/fechar modais ou digitar num campo de formulário. Com base grande, ordena a lista inteira a cada keystroke. `models/index.jsx:63,68` já faz isso certo com `useMemo`.
- **Correção:** envolver `filtered` e `sorted` em `useMemo` (deps: `users, filterNome, filterSetor, filterRole, filterAtivo` e depois `filtered, sortCol, sortDir`).

### F-13 · Mesmo padrão em Campanhas (lista + monitoramento)
- **Arquivo:** `frontend/src/pages/campaigns/index.jsx:146-163, 619-645`
- **Severidade:** Baixa/Média · **Categoria:** Performance
- **Descrição:** `campanhasFiltradas`, `setoresUnicos` (cria `Set`+`sort`) e `disparosFiltrados` (três `.filter` encadeados) recomputam a cada render. Ao digitar na busca, o pipeline roda inteiro por tecla.
- **Correção:** `useMemo` para `disparosFiltrados`/`setoresUnicos` (deps: `disparos, filtroAtivo, setorFiltro, pesquisa`).

### F-14 · Objetos de dados/options dos gráficos recriados a cada render
- **Arquivo:** `frontend/src/pages/meus-graficos/index.jsx:284-343`, `graphics/index.jsx:218-282`
- **Severidade:** Baixa · **Categoria:** Performance
- **Descrição:** Os objetos `data`/`options` passados a `<Line>`/`<Doughnut>`/`<Bar>` são reconstruídos em cada render → Chart.js reanima. Envolver em `useMemo` evita reanimações desnecessárias (preserva o visual).

### F-15 · Regra CSS global custosa em todos os botões
- **Arquivo:** `frontend/src/styles/global.css:128-145`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição:** A regra `button, [role="button"]` adiciona `overflow:hidden` + pseudo-elemento `::after` com `radial-gradient` e `transition: background 0.05s` em **todos** os botões. O efeito spotlight só é alimentado pelo componente `Button` (que seta `--x/--y` via rAF); botões `<button>` crus pagam o custo de pintura sem usar o efeito.
- **Correção (mantém o visual onde o efeito existe):** restringir o seletor a `[data-slot="button"]`.

### F-16 · `AnimatedBackground` mantém timers de spawn rodando em segundo plano
- **Arquivo:** `frontend/src/components/effects/AnimatedBackground.jsx:163-170` (usado em `layouts/AppShellLayout.jsx:9`)
- **Severidade:** Baixa · **Categoria:** Performance
- **Descrição:** Cleanup do `useEffect` está **correto** (sem leak). Porém os dois `setInterval` (bolhas a cada 1.4s, peixes a cada 14s) criam/destroem nós DOM continuamente em todas as páginas autenticadas, mesmo com a aba em background.
- **Correção (não altera aparência):** pausar os spawns quando `document.hidden` (Page Visibility API).

### F-17 · `shadcn` em `dependencies` (deveria ser `devDependency`)
- **Arquivo:** `frontend/package.json:29`
- **Severidade:** Baixa · **Categoria:** Performance/Higiene
- **Descrição:** `shadcn` é CLI de scaffolding, não runtime. Não afeta o bundle (tree-shaking), mas polui o grafo de produção. Mover para `devDependencies`.

---

## Backend — Bugs

### B-3 · NullPointerException em `getIsReal()` durante o disparo
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:195,197`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** `alvo.getIsReal()` (`Boolean`) é desreferenciado direto. Registros com `is_real` NULL no banco causam NPE no auto-unboxing, abortando todo o disparo. `SimulacaoService.java:30` já usa `Boolean.TRUE.equals(...)` defensivamente para o mesmo campo — inconsistência.
- **Correção:**
  ```java
  boolean real = Boolean.TRUE.equals(alvo.getIsReal());
  if (real && emailEnabled) { ... } else if (real && !emailEnabled) { ... }
  ```

### B-5 · Filtro de disparos quebra com booleanos nulos
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:100-103`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** `d.getClicouLink().equals(clicouLink)` desreferencia o `Boolean` do disparo; se NULL no banco, NPE. A ordem dos operandos está invertida quanto à segurança.
- **Correção:** comparar a partir do parâmetro (nunca null no ramo):
  ```java
  .filter(d -> clicouLink == null || clicouLink.equals(d.getClicouLink()))
  .filter(d -> abriuAnexo == null || abriuAnexo.equals(d.getAbriuAnexo()))
  .filter(d -> reportouPhishing == null || reportouPhishing.equals(d.getReportouPhishing()))
  ```

### B-6 · Parsing frágil do CSV de tokens (índice fixo, sem validação)
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:181-184`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** `linha.split(",")` + acesso direto a `colunas[1]` e `colunas[4]` sem checar `colunas.length`. Linha malformada (ou nome/setor com vírgula) → `ArrayIndexOutOfBoundsException` no meio do loop, deixando disparos parcialmente criados.
- **Correção:** `if (colunas.length < 5) { log.warn(...); continue; }` antes de acessar.

### B-7 · `criar()` campanha não é transacional — estado órfão em falha
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:49-90, 140-213`
- **Severidade:** Média · **Categoria:** Bug (transação)
- **Descrição:** A campanha é salva (`:67`) antes de rodar o worker C e criar disparos. Se o worker/parse falhar, a campanha fica persistida como "Pendente" com disparos parciais, sem rollback. Como há `ProcessBuilder.waitFor()` bloqueante no meio, uma transação longa não é ideal — mas o comportamento de falha pode ser melhorado **sem mudar o de sucesso**: no catch, marcar a campanha como "Falhou" em vez de deixá-la "Pendente".

### B-8 · `EmailService` desreferencia `remetenteFalso` possivelmente nulo
- **Arquivo:** `backend/src/main/java/com/nemo/api/email/EmailService.java:60,63`
- **Severidade:** Baixa · **Categoria:** Bug
- **Descrição:** `remetenteFalso.contains("<")` sem checar null → NPE (método é `@Async`, então o e-mail silenciosamente não sai). Além disso, `indexOf(">", lastIdx)` pode retornar -1 (ex.: `"a> b <c"`) → `substring(lastIdx+1, -1)` lança `StringIndexOutOfBoundsException`.
- **Correção:** `if (remetenteFalso != null && remetenteFalso.contains("<") && remetenteFalso.contains(">"))` e validar que o `>` vem após o último `<`.

### B-9 · `GlobalExceptionHandler` vaza mensagens internas
- **Arquivo:** `backend/src/main/java/com/nemo/api/config/GlobalExceptionHandler.java:41-49`
- **Severidade:** Média · **Categoria:** Bug (robustez/segurança)
- **Descrição:** O handler de `RuntimeException`/`Exception` devolve `ex.getMessage()` cru ao cliente. Em `CampanhaService.java:85` o erro do worker é re-lançado com mensagem técnica que vai direto pro cliente (caminhos de arquivo, etc.). Também não loga a exceção genérica.
- **Correção:** logar `ex` e responder mensagem fixa ("Erro interno"), sem `ex.getMessage()`, no handler genérico.

### B-10 · IMAP marca token como válido mesmo sem disparo correspondente
- **Arquivo:** `backend/src/main/java/com/nemo/api/tracking/ImapReportListenerService.java:78-90`
- **Severidade:** Baixa · **Categoria:** Bug (diagnóstico)
- **Descrição:** `registrarReporte(token)` usa `disparo.ifPresent(...)` (`TrackingService:65`) — token inexistente não faz nada, mas `achouToken` vira `true` mesmo assim, então o aviso "Nenhum token válido" não dispara. Inconsistência de log, sem corrupção.

---

## Backend — Performance

### B-4 · N+1 nas listagens + `findById` dentro do loop de disparo
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java`
- **Severidade:** Média/Alta · **Categoria:** Performance
- **Descrições:**
  - **`processarGeracaoDeTokens` (`:191`)** — `campanhaRepository.findById(idCampanha)` roda para **cada** alvo dentro do loop (`:181-203`), além de `save` individual por disparo. **Correção:** resolver a campanha **uma vez** antes do loop e reusar; acumular disparos e considerar `saveAll`.
  - **`listar` (`:45-46, 122-137`)** — `toDTO` acessa `getModelo()` (LAZY) e `getSetores()` (ManyToMany LAZY) por campanha → N+1 e risco de `LazyInitializationException` se OSIV estiver desligado. **Correção:** `JOIN FETCH`/`@EntityGraph` + `@Transactional(readOnly = true)`.
  - **`listarDisparos` (`:96-120`)** — filtros booleanos aplicados em memória (carrega todos os disparos) e `toDisparoDTO` faz lazy-load de `usuarioDestino`/`setor` por linha. **Correção:** mover filtros para a query (`(:clicouLink IS NULL OR d.clicouLink = :clicouLink)`) + `JOIN FETCH d.usuarioDestino u JOIN FETCH u.setor`.

### B-11 · N+1 em `SimulacaoService.listarInbox`
- **Arquivo:** `backend/src/main/java/com/nemo/api/simulacao/SimulacaoService.java:27-67`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição:** Para cada disparo, `toInbox` acessa `d.getCampanha().getModelo().getTextoHtml()` e `d.getUsuarioDestino()` (lazy). Como campanha/modelo são iguais a todos os disparos da campanha, vale carregar uma vez.
- **Correção:** `JOIN FETCH d.usuarioDestino` + `JOIN FETCH d.campanha c JOIN FETCH c.modelo`, ou buscar campanha/modelo uma vez fora do stream.

### B-12 · N+1 em `listarUsuarios` / DTOs de auth e destino
- **Arquivo:** `backend/src/main/java/com/nemo/api/auth/AuthService.java:162-182`; `backend/src/main/java/com/nemo/api/usuario/UsuarioDestinoService.java` (`toDTO`)
- **Severidade:** Baixa/Média · **Categoria:** Performance
- **Descrição:** `findAll()` + acesso a `u.getTipoAcesso()` (e `setor` no destino) por usuário → uma query por usuário.
- **Correção:** `@EntityGraph(attributePaths = {"tipoAcesso"})` (e `"setor"`) nos `findAll`, ou fetch join; anotar leituras com `@Transactional(readOnly = true)`.

### B-13 · N+1 em `listarTreinamentosComStatus`
- **Arquivo:** `backend/src/main/java/com/nemo/api/treinamento/TreinamentoService.java:31-60`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição:** (a) `existsByUsuarioDestino_...AndTreinamento_...` roda uma query por treinamento. (b) `tq.getPerguntas()` e, por pergunta, `p.getOpcoes()` são lazy → N+1 aninhado.
- **Correção:** (a) buscar os IDs de treinamentos concluídos do usuário de uma vez (`Set<Integer>`) e checar em memória; (b) `JOIN FETCH`/`@EntityGraph` para perguntas e opções.

### B-1 · `FetchType.EAGER` aninhado em Quiz → Perguntas → Opções
- **Arquivos:** `backend/src/main/java/com/nemo/api/model/TreinamentoQuiz.java:21`; `backend/src/main/java/com/nemo/api/model/QuizPergunta.java:25`
- **Severidade:** Alta · **Categoria:** Performance
- **Descrição:** `@OneToMany(fetch = FetchType.EAGER)` em duas camadas aninhadas. Listar treinamentos carrega todas as perguntas e opções de cada quiz via queries separadas (N+1), mesmo quando só se precisa de título/categoria. Combinado com `InheritanceType.JOINED` do `Treinamento`, gera joins/subselects extras.
- **Correção:** mudar os dois `@OneToMany` para `FetchType.LAZY` e usar `@EntityGraph`/`JOIN FETCH` **apenas** nos métodos que precisam das perguntas/opções (ex.: abrir o quiz).

### B-14 · Falta de `@Transactional(readOnly = true)` em métodos de leitura
- **Arquivos:** `CampanhaService` (`listar:45`, `listarDisparos:96`), `ModeloService.listar:25`, `SetorService.listar:15`, `UsuarioDestinoService.listar:33`, `GraficosService.buildDashboard:34`, `TreinamentoService.listarTreinamentosComStatus:25`, `ColaboradorController.getPontuacao:26`
- **Severidade:** Baixa · **Categoria:** Performance
- **Descrição:** Métodos só de leitura sem `readOnly` impedem otimizações do Hibernate (sem dirty-checking, flush MANUAL) e deixam o lazy dependente do OSIV.
- **Correção:** anotar com `@Transactional(readOnly = true)`. Preserva comportamento.

### B-15 · Filtros de disparo feitos em memória (ver também B-4)
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:100-105`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição/Correção:** consolidado em **B-4** (mover os 3 filtros booleanos para a query).

### B-16 · `ProcessBuilder.waitFor()` sem timeout segura a thread HTTP
- **Arquivo:** `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:164-176`
- **Severidade:** Baixa · **Categoria:** Performance/Robustez
- **Descrição:** `process.waitFor()` sem timeout bloqueia a thread da requisição até o worker C terminar; se travar, fica presa indefinidamente.
- **Correção (não muda o sucesso):**
  ```java
  if (!process.waitFor(N, TimeUnit.MINUTES)) {
      process.destroyForcibly();
      throw new RuntimeException("Worker C excedeu o tempo limite");
  }
  ```

### B-17 · Query redundante no login de colaborador
- **Arquivo:** `backend/src/main/java/com/nemo/api/auth/AuthService.java:76-79`
- **Severidade:** Baixa · **Categoria:** Performance
- **Descrição:** `usuarioDestinoRepository.findByEmail(email).get()` é chamado de novo mesmo já tendo o `Optional` resolvido no início → query extra por login.
- **Correção:** reaproveitar a `Optional` já obtida.

---

## Worker C — Bugs

### C-1 · `calloc` sem verificação e vazamento em caminhos de erro
- **Arquivo:** `backend/scripts/gerador_tokens_worker.c:226-256`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** `calloc` de `args`/`handles`/`tids` (`:226,229,231`) não verifica retorno NULL (deref nulo possível). Se `CreateThread`/`pthread_create` falhar no meio do loop (`:246-254`), faz `exit(1)` sem `join`/`free` das threads já criadas. Em processo de vida curta o SO recupera, mas é defeito real.
- **Correção:** verificar retorno dos `calloc`; no erro de criação de thread, dar `join` nas já lançadas e liberar antes de sair (ou ajustar `num_threads = t` e seguir para o join).

### C-2 · CSV sem escape — vírgula em nome/setor corrompe o parsing
- **Arquivos:** `backend/scripts/gerador_tokens_worker.c:130-133, 292-297`; `backend/src/main/java/com/nemo/api/campanha/CampanhaService.java:148-156, 181-184`
- **Severidade:** Média · **Categoria:** Bug
- **Descrição:** O CSV é gerado/lido por `split(",")`/`sscanf("%63[^,]")` sem escape. Um `nomeSetor` ou nome com vírgula desalinha as colunas → token errado ou `ArrayIndexOutOfBoundsException`. Os setores-base atuais não têm vírgula, mas qualquer setor cadastrado pelo usuário pode quebrar.
- **Correção (sem mudar o formato):** validar/rejeitar vírgulas no cadastro de setor; mínimo, combinar com a validação de `colunas.length` do B-6.

> Observação: `TAM_TOKEN 64` vs `%016llX` (17 bytes) está **seguro** — sem overflow. A divisão de carga entre threads (`:223-243`) foi verificada e está **correta** (fatias disjuntas).

---

## Banco / Migrations / Config

### B-2 · Índices faltando em colunas de filtro/agregação do dashboard
- **Arquivo:** `backend/src/main/resources/db/migration/V1__create_schema.sql` (criar nova migration `V9`)
- **Severidade:** Alta · **Categoria:** Performance
- **Descrição:** As queries de dashboard (`DisparoRepository.resumoNoPeriodo`, `agregarPorSetor`, `agregarPorMes`, `campanhasRecentes`) filtram/ordenam por `disparos.data_envio` e `campanha.data_criacao`, que **não** têm índice → full table scan (já há 400 linhas no seed; cresce em produção). FKs (`id_usuario_destino`, `id_campanha`) já recebem índice automático do InnoDB.
- **Correção (nova migration `V9__add_indexes.sql`):**
  ```sql
  CREATE INDEX idx_disparos_data_envio   ON disparos (data_envio);
  CREATE INDEX idx_campanha_data_criacao ON campanha (data_criacao);
  ```

### B-18 · Pool de conexão e batch JPA não configurados
- **Arquivo:** `backend/src/main/resources/application.yaml`
- **Severidade:** Média · **Categoria:** Performance
- **Descrição:** Sem config de HikariCP nem batch do Hibernate; `show-sql: true` degrada e polui logs em produção.
- **Correção:**
  ```yaml
  spring:
    jpa:
      show-sql: false   # ou apenas no profile local
      properties:
        hibernate:
          jdbc.batch_size: 50
          order_inserts: true
          order_updates: true
    datasource:
      hikari:
        maximum-pool-size: 10
        minimum-idle: 2
        connection-timeout: 30000
  ```
  > Nota: com `GenerationType.IDENTITY`, o Hibernate não agrupa *inserts* (precisa do ID a cada um); o `batch_size` ajuda updates/outras entidades. Trocar a estratégia de ID alteraria o schema — fica como observação, não recomendação direta.

### B-19 · Índice composto opcional para idempotência de pontuação
- **Arquivos:** `backend/src/main/java/com/nemo/api/repository/PontuacaoEventoRepository.java:13-14`; `V1__create_schema.sql:109-110`
- **Severidade:** Baixa · **Categoria:** Performance
- **Descrição:** `existsByUsuarioDestino_...AndTipoEventoAndReferenciaExterna` filtra por `(id_usuario_destino, tipo_evento, referencia_externa)`; o índice atual `idx_evento_usuario_data` só cobre o prefixo do usuário. Volume por usuário é pequeno (impacto baixo).
- **Correção (opcional):** índice composto `(id_usuario_destino, tipo_evento, referencia_externa)` se a verificação crescer.

### B-20 · CORS `allowCredentials(true)` com origem curinga
- **Arquivo:** `backend/src/main/java/com/nemo/api/config/SecurityConfig.java:21-24`
- **Severidade:** Média · **Categoria:** Bug (segurança)
- **Descrição:** `setAllowCredentials(true)` + `allowedOriginPatterns("*")` reflete qualquer origem com credenciais. Funciona, mas é permissivo demais. Anotar para o hardening de produção (junto do JWT enforcement já previsto no CLAUDE.md). Não altera comportamento atual.

---

## Observações verificadas (sem ação)

Itens inspecionados e **corretos** — registrados para evitar retrabalho:

- **Routing guards** (`PrivateRoute`/`AdminRoute`/`ColaboradorRoute`), **`AppNavbar`**, **`Modal`/`ModalForm`** (cleanup de `keydown` ok), **`InfoHint`** (cleanup de `clearTimeout` ok), **`Button`** (throttle de `mousemove` por rAF com cleanup ok).
- **`conteudos/index.jsx` (YouTubePlayer)** — usa `onProgressRef` e cleanup de `interval` + `player.destroy()` corretamente. Bom exemplo.
- **`graphics/index.jsx` / `admin/index.jsx`** — cancelamento de fetch implementado corretamente (flag `cancelado`).
- **`AnimatedBackground`** — cleanup completo (rAF + intervalos + listener); sem leak. (A observação F-16 é sobre custo contínuo, não vazamento.)
- **`utils.js`, `pontuacao.js`, `Logo`, `Skeleton`, `Card`, `Input`, `LoadingOverlay`, `FilterBar`** — sem problemas.
- **Worker C** — `TAM_TOKEN` seguro; divisão de carga entre threads correta.
- **`PrintWriter`/`BufferedReader`** em `CampanhaService`/`UsuarioDestinoService` — em try-with-resources, fechados corretamente.
- **`PontuacaoService`** — já `@Transactional`; o `save(alvo)` explícito é redundante (dirty-checking), mas seguro de manter.
- **`templates/index.jsx`** — é um stub estático; confirmar se é página viva ou código morto.
