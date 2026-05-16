import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Banco de quizzes ──────────────────────────────────────────────────────────
const QUIZZES = [
  {
    id: 1,
    titulo: "Identificando E-mails Falsos",
    descricao: "Aprenda a reconhecer sinais de phishing em e-mails do dia a dia.",
    nivel: "Iniciante",
    totalPerguntas: 5,
    cor: "bg-teal-700",
    perguntas: [
      {
        enunciado: "Você recebe um e-mail do 'banco@seguro-atualizacao.com' pedindo para confirmar seus dados bancários com urgência. O que você faz?",
        opcoes: [
          "Clica no link e preenche os dados rapidamente",
          "Ignora e exclui o e-mail",
          "Liga para o banco usando o número oficial no site deles",
          "Responde o e-mail pedindo mais informações",
        ],
        correta: 2,
        explicacao: "Sempre contate o banco pelo número oficial do site ou cartão. Domínios suspeitos como 'seguro-atualizacao.com' são sinais claros de phishing.",
      },
      {
        enunciado: "Qual destes elementos É um sinal de phishing em um e-mail?",
        opcoes: [
          "O remetente usa o domínio oficial da empresa (@empresa.com.br)",
          "O e-mail tem seu nome completo correto na saudação",
          "O link ao passar o mouse mostra um domínio diferente do exibido",
          "O e-mail foi enviado em horário comercial",
        ],
        correta: 2,
        explicacao: "Links que mostram destinos diferentes do texto exibido são um dos maiores indicadores de phishing. Sempre passe o mouse sobre links antes de clicar.",
      },
      {
        enunciado: "Você recebe um e-mail da 'TI' pedindo sua senha para 'manutenção do sistema'. O que isso indica?",
        opcoes: [
          "É uma solicitação legítima de TI",
          "É definitivamente phishing — equipes de TI nunca pedem senhas",
          "Depende se você conhece o remetente",
          "Apenas se o e-mail tiver erros de português",
        ],
        correta: 1,
        explicacao: "Nenhuma equipe de TI legítima pede senhas por e-mail. Esse é um dos métodos mais comuns de engenharia social.",
      },
      {
        enunciado: "Qual prática é CORRETA ao receber um e-mail suspeito no trabalho?",
        opcoes: [
          "Encaminhar para colegas para ver o que eles acham",
          "Clicar nos links para confirmar se são perigosos",
          "Reportar para o time de segurança da empresa",
          "Deletar sem reportar para não criar problemas",
        ],
        correta: 2,
        explicacao: "Reportar e-mails suspeitos é fundamental! Mesmo que seja um falso positivo, a equipe de segurança prefere analisar do que perder uma ameaça real.",
      },
      {
        enunciado: "Um e-mail diz: 'URGENTE: Sua conta será bloqueada em 24h. Clique aqui.' Isso é um exemplo de:",
        opcoes: [
          "Comunicação legítima de serviço ao cliente",
          "Tática de urgência usada em phishing para forçar ação impulsiva",
          "Notificação de segurança padrão",
          "Um bug no sistema de e-mails",
        ],
        correta: 1,
        explicacao: "Criar senso de urgência é uma das táticas mais comuns de phishing. Atacantes querem que você aja antes de pensar com calma.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Phishing por SMS e WhatsApp",
    descricao: "Saiba como ataques de smishing funcionam em dispositivos móveis.",
    nivel: "Intermediário",
    totalPerguntas: 5,
    cor: "bg-indigo-700",
    perguntas: [
      {
        enunciado: "Você recebe um SMS: 'Seu pacote não pôde ser entregue. Pague R$3,99 de taxa: [link curto]'. O que fazer?",
        opcoes: [
          "Pagar a taxa pequena — não vale o risco de perder o pacote",
          "Clicar no link para ver mais detalhes",
          "Contatar a transportadora pelo site/app oficial para verificar",
          "Responder o SMS pedindo mais informações",
        ],
        correta: 2,
        explicacao: "Nunca acesse links em SMS não solicitados. Acesse o site oficial da transportadora digitando o endereço manualmente no navegador.",
      },
      {
        enunciado: "Um amigo te envia um link no WhatsApp dizendo 'Olha esse sorteio incrível'. O que é recomendado?",
        opcoes: [
          "Abrir porque veio de um amigo confiável",
          "Verificar com o amigo por ligação se ele realmente enviou antes de abrir",
          "Compartilhar com outros amigos para mais pessoas participarem",
          "Abrir em modo de navegação anônima — é mais seguro",
        ],
        correta: 1,
        explicacao: "Contas de WhatsApp podem ser comprometidas. Confirme pelo telefone se seu amigo realmente enviou aquela mensagem antes de clicar em qualquer link.",
      },
      {
        enunciado: "O que é 'smishing'?",
        opcoes: [
          "Um tipo de malware que infecta smartphones",
          "Phishing realizado por meio de mensagens SMS ou apps de mensagem",
          "Um antivírus para dispositivos móveis",
          "Um protocolo de segurança para SMS",
        ],
        correta: 1,
        explicacao: "Smishing = SMS + phishing. É a prática de usar mensagens de texto para enganar vítimas a revelar dados ou clicar em links maliciosos.",
      },
      {
        enunciado: "Qual dessas mensagens é MAIS provavelmente legítima?",
        opcoes: [
          "'Você ganhou R$5.000! Clique em [link] para resgatar agora!'",
          "'Código de verificação: 847293. Não compartilhe com ninguém.' (você pediu um código)",
          "'Urgente: atualize seu cadastro bancário em [link curto]'",
          "'Parabéns! Você foi selecionado. Responda AGORA.'",
        ],
        correta: 1,
        explicacao: "Códigos de verificação enviados após você os solicitar são legítimos. As outras opções usam táticas clássicas de phishing: prêmios falsos, urgência e links suspeitos.",
      },
      {
        enunciado: "Você recebe uma ligação de alguém dizendo ser do suporte do banco pedindo para confirmar dados. Isso é chamado de:",
        opcoes: [
          "Smishing",
          "Pharming",
          "Vishing (voice phishing)",
          "Spear phishing",
        ],
        correta: 2,
        explicacao: "Vishing é phishing por voz/ligação. Bancos reais nunca ligam pedindo sua senha ou código completo. Em caso de dúvida, desligue e ligue para o número oficial.",
      },
    ],
  },
  {
    id: 3,
    titulo: "Senhas e Autenticação Segura",
    descricao: "Boas práticas para proteger suas credenciais contra ataques.",
    nivel: "Iniciante",
    totalPerguntas: 5,
    cor: "bg-orange-600",
    perguntas: [
      {
        enunciado: "Qual das senhas abaixo é MAIS segura?",
        opcoes: [
          "senha123",
          "João1990",
          "C@v@lo#Azul!99",
          "abcdefgh",
        ],
        correta: 2,
        explicacao: "Senhas seguras combinam letras maiúsculas, minúsculas, números e símbolos, sem palavras comuns ou dados pessoais. 'C@v@lo#Azul!99' segue essas boas práticas.",
      },
      {
        enunciado: "O que é autenticação de dois fatores (2FA)?",
        opcoes: [
          "Usar duas senhas diferentes no mesmo sistema",
          "Uma camada extra de segurança que exige um segundo método além da senha",
          "Fazer login em dois dispositivos ao mesmo tempo",
          "Um sistema que exige trocar a senha a cada 2 dias",
        ],
        correta: 1,
        explicacao: "2FA adiciona uma camada extra: mesmo que sua senha seja roubada, o atacante ainda precisa do segundo fator (código SMS, app autenticador, etc).",
      },
      {
        enunciado: "Você deve usar a mesma senha em vários sites porque:",
        opcoes: [
          "Facilita lembrar — e é aceitável se for uma senha forte",
          "Nunca! Se um site vazar, todas as suas contas ficam comprometidas",
          "Apenas se os sites forem de empresas conhecidas",
          "Sim, desde que você troque a senha todo mês",
        ],
        correta: 1,
        explicacao: "Reutilização de senhas é um dos maiores riscos. Use um gerenciador de senhas para ter senhas únicas e fortes em cada serviço.",
      },
      {
        enunciado: "Um colega te pede sua senha porque esqueceu a dele e precisa terminar um trabalho urgente. O que você faz?",
        opcoes: [
          "Compartilha — é um colega de confiança",
          "Compartilha apenas por mensagem privada",
          "Recusa e orienta o colega a contatar o suporte de TI",
          "Compartilha mas pede para ele mudar depois",
        ],
        correta: 2,
        explicacao: "Nunca compartilhe suas credenciais, mesmo com pessoas de confiança. Além do risco de segurança, você pode ser responsabilizado por ações feitas com seu login.",
      },
      {
        enunciado: "Com que frequência você deve trocar suas senhas?",
        opcoes: [
          "Todo dia",
          "Só quando houver suspeita de vazamento ou comprometimento",
          "Todo mês, obrigatoriamente",
          "Nunca — mudar enfraquece a segurança",
        ],
        correta: 1,
        explicacao: "As recomendações atuais de segurança (NIST) indicam trocar senhas quando há suspeita de comprometimento, não em intervalos fixos. Senhas fortes e únicas são mais importantes.",
      },
    ],
  },
  {
    id: 4,
    titulo: "Phishing Avançado e Engenharia Social",
    descricao: "Reconheça técnicas sofisticadas usadas por atacantes experientes.",
    nivel: "Avançado",
    totalPerguntas: 5,
    cor: "bg-rose-700",
    perguntas: [
      {
        enunciado: "O que é 'Spear Phishing'?",
        opcoes: [
          "Phishing em massa enviado para milhões de pessoas",
          "Phishing altamente direcionado a uma pessoa ou organização específica com informações personalizadas",
          "Um ataque que usa arpões físicos para roubo de equipamentos",
          "Phishing realizado por SMS",
        ],
        correta: 1,
        explicacao: "Spear phishing é mais perigoso que phishing comum pois usa dados reais sobre a vítima (nome, cargo, empresa, projetos) tornando o ataque muito mais convincente.",
      },
      {
        enunciado: "Um e-mail parece vir do seu CEO pedindo transferência urgente de dinheiro. Isso é chamado de:",
        opcoes: [
          "Phishing de CEO / BEC (Business Email Compromise)",
          "Spam corporativo",
          "Vishing executivo",
          "Pharming",
        ],
        correta: 0,
        explicacao: "BEC é um tipo de fraude sofisticado onde atacantes se passam por executivos. Qualquer solicitação financeira urgente por e-mail deve ser verificada pessoalmente ou por canal alternativo.",
      },
      {
        enunciado: "O que é 'pharming'?",
        opcoes: [
          "Envio de e-mails em massa para fazendas",
          "Redirecionamento de usuários de sites legítimos para sites falsos sem que eles percebam",
          "Um tipo de malware que ataca servidores",
          "Phishing usando redes sociais",
        ],
        correta: 1,
        explicacao: "No pharming, mesmo digitando o endereço correto do site, você pode ser redirecionado para um site falso por manipulação do DNS. Verifique sempre o cadeado HTTPS.",
      },
      {
        enunciado: "Um técnico de TI aparece na sua mesa dizendo que precisa instalar uma atualização urgente no seu computador sem agendamento prévio. Você deveria:",
        opcoes: [
          "Deixar — é TI, é confiável",
          "Pedir identificação e confirmar com o supervisor ou help desk antes de conceder acesso",
          "Deixar mas ficar olhando o que ele faz",
          "Ir buscar um café e deixar ele trabalhar",
        ],
        correta: 1,
        explicacao: "Ataques de engenharia social presencial (tailgating/pretexting) são reais. Sempre verifique identidade e autorização antes de conceder acesso físico ou lógico.",
      },
      {
        enunciado: "Você encontra um pendrive USB no estacionamento da empresa. O que você faz?",
        opcoes: [
          "Conecta no computador para descobrir de quem é",
          "Entrega para o achados e perdidos após conectar para ver o conteúdo",
          "Entrega ao time de segurança de TI SEM conectar em nenhum dispositivo",
          "Leva para casa — é um achado",
        ],
        correta: 2,
        explicacao: "Pendrives abandonados são uma técnica comum de ataque (baiting). Podem conter malware que infecta automaticamente ao ser conectado. Nunca conecte dispositivos desconhecidos.",
      },
    ],
  },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function QuizPage() {
  const [quizAtivo, setQuizAtivo] = useState(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [respostasUsuario, setRespostasUsuario] = useState([]);

  const iniciarQuiz = (quiz) => {
    setQuizAtivo(quiz);
    setPerguntaAtual(0);
    setRespostaSelecionada(null);
    setMostrarExplicacao(false);
    setAcertos(0);
    setFinalizado(false);
    setRespostasUsuario([]);
  };

  const selecionarResposta = (idx) => {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(idx);
    setMostrarExplicacao(true);
    const correta = quizAtivo.perguntas[perguntaAtual].correta;
    if (idx === correta) setAcertos((a) => a + 1);
    setRespostasUsuario((prev) => [...prev, idx]);
  };

  const proximaPergunta = () => {
    if (perguntaAtual + 1 >= quizAtivo.perguntas.length) {
      setFinalizado(true);
    } else {
      setPerguntaAtual((p) => p + 1);
      setRespostaSelecionada(null);
      setMostrarExplicacao(false);
    }
  };

  const voltarLista = () => {
    setQuizAtivo(null);
    setFinalizado(false);
  };

  const nivelCor = (nivel) => {
    if (nivel === "Iniciante") return "bg-teal-100 text-teal-800";
    if (nivel === "Intermediário") return "bg-indigo-100 text-indigo-800";
    return "bg-rose-100 text-rose-800";
  };

  const nota = quizAtivo ? Math.round((acertos / quizAtivo.perguntas.length) * 100) : 0;

  // ── Tela de lista de quizzes ──
  if (!quizAtivo) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-12 rounded-xl bg-teal-700 shrink-0 shadow-sm">
            <QuizIcon className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quiz de Phishing</h1>
            <p className="text-sm text-slate-500">Teste seus conhecimentos sobre segurança digital</p>
          </div>
        </div>

        {/* Grid de quizzes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUIZZES.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
              <div className={`h-2 ${quiz.cor}`} />
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-slate-800 text-base leading-tight">{quiz.titulo}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${nivelCor(quiz.nivel)}`}>
                    {quiz.nivel}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{quiz.descricao}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400">{quiz.totalPerguntas} perguntas</span>
                  <Button
                    size="sm"
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
                    onClick={() => iniciarQuiz(quiz)}
                  >
                    Iniciar Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ── Tela de resultado final ──
  if (finalizado) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 pb-10">
        <Card className="border border-slate-200 overflow-hidden">
          <div className={`h-2 ${quizAtivo.cor}`} />
          <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
            {/* Emoji de resultado */}
            <div className="text-6xl">
              {nota >= 80 ? "🎉" : nota >= 60 ? "👍" : "📚"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {nota >= 80 ? "Excelente!" : nota >= 60 ? "Bom trabalho!" : "Continue praticando!"}
              </h2>
              <p className="text-slate-500 text-sm">{quizAtivo.titulo}</p>
            </div>

            {/* Placar */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-black text-teal-700">{nota}%</p>
                <p className="text-xs text-slate-400 mt-1">Aproveitamento</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-slate-700">{acertos}/{quizAtivo.perguntas.length}</p>
                <p className="text-xs text-slate-400 mt-1">Acertos</p>
              </div>
            </div>

            {/* Revisão rápida */}
            <div className="w-full text-left space-y-2">
              <p className="text-sm font-semibold text-slate-700 mb-3">Revisão das respostas:</p>
              {quizAtivo.perguntas.map((p, i) => {
                const acertou = respostasUsuario[i] === p.correta;
                return (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg text-sm ${acertou ? "bg-teal-50" : "bg-red-50"}`}>
                    <span className="text-base mt-0.5">{acertou ? "✅" : "❌"}</span>
                    <div>
                      <p className="text-slate-700 font-medium leading-snug">{p.enunciado}</p>
                      {!acertou && (
                        <p className="text-xs text-slate-500 mt-1">
                          Correta: <span className="font-semibold">{p.opcoes[p.correta]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700"
                onClick={voltarLista}
              >
                Ver todos os quizzes
              </Button>
              <Button
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold"
                onClick={() => iniciarQuiz(quizAtivo)}
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Tela de pergunta ──
  const pergunta = quizAtivo.perguntas[perguntaAtual];
  const progresso = ((perguntaAtual) / quizAtivo.perguntas.length) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pb-10">
      {/* Header do quiz */}
      <div className="flex items-center justify-between">
        <button
          onClick={voltarLista}
          className="text-sm text-slate-500 hover:text-teal-700 transition-colors flex items-center gap-1"
        >
          ← Voltar
        </button>
        <span className="text-sm font-semibold text-slate-600">
          {perguntaAtual + 1} / {quizAtivo.perguntas.length}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${quizAtivo.cor} transition-all duration-500`}
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* Card da pergunta */}
      <Card className="border border-slate-200">
        <CardContent className="p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{quizAtivo.titulo}</p>
            <h2 className="text-base font-bold text-slate-800 leading-snug">{pergunta.enunciado}</h2>
          </div>

          {/* Opções */}
          <div className="space-y-2">
            {pergunta.opcoes.map((opcao, idx) => {
              const isCorreta = idx === pergunta.correta;
              const isSelecionada = idx === respostaSelecionada;
              let classe = "w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-200 ";

              if (respostaSelecionada === null) {
                classe += "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50 cursor-pointer";
              } else if (isCorreta) {
                classe += "border-teal-500 bg-teal-50 text-teal-800";
              } else if (isSelecionada) {
                classe += "border-red-400 bg-red-50 text-red-800";
              } else {
                classe += "border-slate-200 bg-slate-50 text-slate-400";
              }

              return (
                <button key={idx} className={classe} onClick={() => selecionarResposta(idx)}>
                  <span className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">
                      {respostaSelecionada !== null ? (
                        isCorreta ? "✅" : isSelecionada ? "❌" : "○"
                      ) : (
                        <span className="inline-flex size-5 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      )}
                    </span>
                    {opcao}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explicação */}
          {mostrarExplicacao && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-800 mb-1">💡 Explicação</p>
              {pergunta.explicacao}
            </div>
          )}

          {/* Botão próxima */}
          {respostaSelecionada !== null && (
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold"
              onClick={proximaPergunta}
            >
              {perguntaAtual + 1 >= quizAtivo.perguntas.length ? "Ver resultado" : "Próxima pergunta →"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuizIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={3} />
    </svg>
  );
}
