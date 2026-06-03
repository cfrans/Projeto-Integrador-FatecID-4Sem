import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { api, ApiError } from "@/lib/api";

// ── Banco de conteúdos (Substituído pela API) ─────────────────────────
const CATEGORIAS = ["Todos", "Phishing", "Senhas", "Redes Sociais", "Corporativo"];

const CATEGORIA_CORES = {
  Phishing: "bg-rose-100 text-rose-700",
  Senhas: "bg-indigo-100 text-indigo-700",
  "Redes Sociais": "bg-orange-100 text-orange-700",
  Corporativo: "bg-teal-100 text-teal-700",
};

// ── Componente de Player YouTube Seguro ─────────────────────────────────────
function YouTubePlayer({ videoId, onProgress }) {
  const playerRef = useRef(null);
  const onProgressRef = useRef(onProgress);

  // Mantém a ref sempre atualizada com a última função, evitando loops de re-render
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    let interval;

    function loadVideo() {
      if (!window.YT || !window.YT.Player) return;
      
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            // Se estiver tocando (1), começa a checar o progresso
            if (e.data === 1) {
              clearInterval(interval); // Previne vazamento caso dispare o estado 'playing' multiplas vezes seguidas
              interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                  const current = playerRef.current.getCurrentTime();
                  const total = playerRef.current.getDuration();
                  if (total > 0) {
                    const percent = (current / total) * 100;
                    if (onProgressRef.current) onProgressRef.current(percent);
                  }
                }
              }, 1000);
            } else {
              clearInterval(interval);
            }
          }
        }
      });
    }

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = loadVideo;
    } else {
      loadVideo();
    }

    return () => {
      clearInterval(interval);
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [videoId]); // 👈 Removido onProgress das dependências para parar o loop eterno!

  return <div id={`youtube-player-${videoId}`} className="w-full h-full" />;
}

// ── Modal Dedicado de Vídeo ───────────────────────────────────────────────────
function VideoModal({ video, progresso, onProgress, onClose, onConcluir }) {
  if (!video) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <div>
            <h2 className="text-white font-bold text-lg">{video.titulo}</h2>
            <p className="text-slate-400 text-sm">{video.descricao}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <YouTubePlayer videoId={video.youtubeId} onProgress={onProgress} />
        </div>

        {/* Footer / Conclusão */}
        <div className="p-4 flex flex-wrap justify-between items-center gap-3 bg-slate-800">
          <div className="text-slate-300 text-sm font-medium">
            {video.concluido 
              ? '✅ Você já concluiu este treinamento.' 
              : `Progresso: ${Math.round(progresso)}% (Assista até 90% para concluir)`
            }
          </div>
          
          <div className="flex gap-3">
            {!video.concluido && progresso >= 90 && (
              <Button 
                className="bg-green-600 hover:bg-green-500 text-white font-bold animate-in zoom-in"
                onClick={() => onConcluir(video)}
              >
                Marcar como concluído (+50 pts)
              </Button>
            )}
            {video.concluido && (
              <Button disabled className="bg-slate-700 text-slate-400 border border-slate-600">
                Concluído
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ConteudosPage() {
  const [conteudos, setConteudos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [videoAtivo, setVideoAtivo] = useState(null);
  const [destaque, setDestaque] = useState(null);
  
  // Controle de conclusão e modais
  const [progresso, setProgresso] = useState(0);
  const [sucessoModal, setSucessoModal] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const carregaConteudos = async () => {
    try {
      const data = await api.get('/api/treinamentos');
      const videos = data.filter(t => t.tipo === 'VIDEO');
      setConteudos(videos);
      setDestaque(videos[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregaConteudos();
  }, []);

  const conteudosFiltrados =
    categoriaAtiva === "Todos"
      ? conteudos
      : conteudos.filter((c) => c.categoria === categoriaAtiva);

  const mostrarDestaque = categoriaAtiva === "Todos" && destaque;

  const handleProgress = (percent) => {
    setProgresso(percent);
  };

  const handleConcluir = async (video) => {
    try {
      if (!video.concluido) {
        await api.post(`/api/treinamentos/${video.idTreinamento}/concluir`);
        
        // Atualiza a listagem localmente pra garantir o badge ✅ imediato
        setConteudos(prev => prev.map(c => 
          c.idTreinamento === video.idTreinamento ? { ...c, concluido: true } : c
        ));

        // Atualiza o destaque localmente se for ele
        if (destaque?.idTreinamento === video.idTreinamento) {
          setDestaque(prev => ({ ...prev, concluido: true }));
        }

        // Se o video aberto no modal é este, atualiza ele também
        setVideoAtivo(prev => prev && prev.idTreinamento === video.idTreinamento 
          ? { ...prev, concluido: true } 
          : prev
        );

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#f59e0b', '#10b981', '#3b82f6'],
          zIndex: 9999
        });

        setSucessoModal(true);
      }
    } catch (e) {
      console.error("Erro ao concluir treinamento", e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="play-badge flex items-center justify-center size-12 rounded-xl bg-indigo-700 shrink-0 shadow-sm cursor-default">
          <PlayIcon className="play-icon size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Conteúdos Educativos</h1>
          <p className="text-sm text-slate-500">Vídeos para aprimorar seu conhecimento em segurança digital</p>
        </div>
      </div>

      {/* Vídeo em destaque */}
      {mostrarDestaque && destaque && (
        <Card className="border border-slate-200 overflow-hidden">
          <div className="relative">
            <button
              className="relative w-full aspect-video bg-slate-900 group overflow-hidden"
              onClick={() => { setVideoAtivo(destaque); setProgresso(0); }}
            >
              <img
                src={`https://img.youtube.com/vi/${destaque.youtubeId}/hqdefault.jpg`}
                alt={destaque.titulo}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 text-rose-600 translate-x-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {destaque.duracaoMinutos} min
              </span>
              {destaque.concluido && (
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  Concluído ✅
                </span>
              )}
              <span className="absolute top-3 left-3 bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                EM DESTAQUE
              </span>
            </button>
          </div>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORIA_CORES[destaque.categoria]}`}>
                  {destaque.categoria}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-2">{destaque.titulo}</h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{destaque.descricao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtro de categorias */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoriaAtiva(cat); setVideoAtivo(null); setProgresso(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              categoriaAtiva === cat
                ? "bg-teal-700 text-white border-teal-700"
                : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de vídeos */}
      {carregando ? (
        <div className="text-center py-10 text-slate-500">Carregando conteúdos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conteudosFiltrados
            .filter((c) => !(mostrarDestaque && destaque && c.idTreinamento === destaque.idTreinamento))
            .map((conteudo) => (
              <Card key={conteudo.idTreinamento} className="border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <button
                  className="relative w-full aspect-video bg-slate-900 group overflow-hidden"
                  onClick={() => { setVideoAtivo(conteudo); setProgresso(0); }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${conteudo.youtubeId}/hqdefault.jpg`}
                    alt={conteudo.titulo}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-rose-600 translate-x-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {conteudo.duracaoMinutos} min
                  </span>
                  {conteudo.concluido && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      ✅
                    </span>
                  )}
                </button>

              <CardContent className="p-4 space-y-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORIA_CORES[conteudo.categoria]}`}>
                  {conteudo.categoria}
                </span>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{conteudo.titulo}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{conteudo.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!carregando && conteudosFiltrados.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">Nenhum conteúdo nessa categoria ainda.</p>
        </div>
      )}

      <VideoModal 
        video={videoAtivo} 
        progresso={progresso} 
        onProgress={handleProgress} 
        onClose={() => setVideoAtivo(null)} 
        onConcluir={(v) => {
          handleConcluir(v);
        }}
      />

      {/* Renderizado DEPOIS do VideoModal para garantir que ele fique na frente caso os z-indexes empatem */}
      <Modal
        open={sucessoModal}
        onClose={() => setSucessoModal(false)}
        title="Parabéns!"
        description="Você concluiu este vídeo e ganhou +50 pontos de experiência no portal!"
        variant="success"
      />
    </div>
  );
}

function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
