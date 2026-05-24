import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";


// ── Componente principal ──────────────────────────────────────────────────────
export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [quizAtivo, setQuizAtivo] = useState(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [respostasUsuario, setRespostasUsuario] = useState([]);
  const [ganhouPontos, setGanhouPontos] = useState(false);

  const carregaQuizzes = async () => {
    try {
      setCarregando(true);
      const data = await api.get('/api/treinamentos');
      setQuizzes(data.filter(t => t.tipo === 'QUIZ'));
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregaQuizzes();
  }, []);

  const iniciarQuiz = (quiz) => {
    setQuizAtivo(quiz);
    setPerguntaAtual(0);
    setRespostaSelecionada(null);
    setMostrarExplicacao(false);
    setAcertos(0);
    setFinalizado(false);
    setRespostasUsuario([]);
    setGanhouPontos(false);
  };

  const selecionarResposta = (idx) => {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(idx);
    setMostrarExplicacao(true);
    const isCorreta = quizAtivo.perguntas[perguntaAtual].opcoes[idx].isCorreta;
    if (isCorreta) setAcertos((a) => a + 1);
    setRespostasUsuario((prev) => [...prev, idx]);
  };

  const proximaPergunta = async () => {
    if (perguntaAtual + 1 >= quizAtivo.perguntas.length) {
      setFinalizado(true);
      // Dispara conclusão
      if (!quizAtivo.concluido) {
        try {
          await api.post(`/api/treinamentos/${quizAtivo.idTreinamento}/concluir`);
          
          // Atualiza o estado local imediatamente pra evitar precisar de F5
          setQuizzes(prev => prev.map(q => 
            q.idTreinamento === quizAtivo.idTreinamento ? { ...q, concluido: true } : q
          ));
          
          setGanhouPontos(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0d9488', '#f59e0b', '#10b981', '#3b82f6']
          });
        } catch(e) {
          console.error("Erro ao concluir quiz", e);
        }
      }
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
        {carregando ? (
          <div className="text-center py-10 text-slate-500">Carregando quizzes...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.idTreinamento} className="relative overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
                <div className={`h-2 ${quiz.corTema}`} />
                <CardContent className="p-5 flex flex-col gap-3">
                  {quiz.concluido && (
                    <span className="absolute top-4 right-4 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                      Concluído ✅
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2 mr-16">
                    <h2 className="font-bold text-slate-800 text-base leading-tight">{quiz.titulo}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${nivelCor(quiz.nivel)}`}>
                      {quiz.nivel}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{quiz.descricao}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">{quiz.perguntas?.length || 0} perguntas</span>
                    <Button
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
                      onClick={() => iniciarQuiz(quiz)}
                    >
                      {quiz.concluido ? "Refazer Quiz" : "Iniciar Quiz"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Tela de resultado final ──
  if (finalizado) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 pb-10">
        <Card className="border border-slate-200 overflow-hidden">
          <div className={`h-2 ${quizAtivo.cor}`} />
          <CardContent className="p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden">
            {/* Mensagem flutuante de sucesso se acabou de ganhar os pontos */}
            {ganhouPontos && (
              <div className="w-full bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl mb-2 flex flex-col items-center animate-in slide-in-from-top-4">
                <span className="text-xl font-bold">🎉 +50 Pontos de Experiência!</span>
                <span className="text-sm">Você concluiu este quiz com sucesso.</span>
              </div>
            )}
            
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
            <div className="w-full text-left space-y-2 max-h-64 overflow-y-auto px-2">
              <p className="text-sm font-semibold text-slate-700 mb-3 sticky top-0 bg-white py-1">Revisão das respostas:</p>
              {quizAtivo.perguntas.map((p, i) => {
                const corretaIndex = p.opcoes.findIndex(o => o.isCorreta);
                const acertou = respostasUsuario[i] === corretaIndex;
                return (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg text-sm ${acertou ? "bg-teal-50" : "bg-red-50"}`}>
                    <span className="text-base mt-0.5">{acertou ? "✅" : "❌"}</span>
                    <div>
                      <p className="text-slate-700 font-medium leading-snug">{p.enunciado}</p>
                      {!acertou && (
                        <p className="text-xs text-slate-500 mt-1">
                          Correta: <span className="font-semibold">{p.opcoes[corretaIndex]?.texto}</span>
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
          className={`h-full ${quizAtivo.corTema} transition-all duration-500`}
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
              const isCorreta = opcao.isCorreta;
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
                    {opcao.texto}
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
