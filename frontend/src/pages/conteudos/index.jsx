import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// ── Banco de conteúdos educativos ─────────────────────────────────────────────
const CATEGORIAS = ["Todos", "Phishing", "Senhas", "Redes Sociais", "Corporativo"];

const CONTEUDOS = [
  {
    id: 1,
    titulo: "O que é Phishing? Como se proteger",
    descricao: "Entenda como funcionam os ataques de phishing e quais são as principais táticas usadas pelos criminosos para enganar vítimas.",
    youtubeId: "XBkzBrXlle0",
    categoria: "Phishing",
    duracao: "8:24",
    destaque: true,
  },
  {
    id: 2,
    titulo: "Engenharia Social: A arte de enganar",
    descricao: "Descubra como atacantes exploram a psicologia humana para obter informações confidenciais sem precisar hackear sistemas.",
    youtubeId: "lc7scxvKQOo",
    categoria: "Phishing",
    duracao: "12:10",
    destaque: false,
  },
  {
    id: 3,
    titulo: "Como criar senhas seguras e gerenciá-las",
    descricao: "Aprenda as melhores práticas para criar senhas fortes, únicas e como usar gerenciadores de senhas no dia a dia.",
    youtubeId: "aEmXQXFBFAk",
    categoria: "Senhas",
    duracao: "6:45",
    destaque: false,
  },
  {
    id: 4,
    titulo: "Autenticação de dois fatores (2FA) explicada",
    descricao: "Entenda o que é 2FA, por que é importante e como ativar nos principais serviços que você usa.",
    youtubeId: "ZXFYT-BG2So",
    categoria: "Senhas",
    duracao: "5:30",
    destaque: false,
  },
  {
    id: 5,
    titulo: "Privacidade nas redes sociais",
    descricao: "Saiba quais informações você expõe sem perceber nas redes sociais e como configurar sua privacidade adequadamente.",
    youtubeId: "ArEQjCiHgEk",
    categoria: "Redes Sociais",
    duracao: "9:15",
    destaque: false,
  },
  {
    id: 6,
    titulo: "Segurança no e-mail corporativo",
    descricao: "Boas práticas para o uso seguro do e-mail no ambiente de trabalho, identificando ameaças e protegendo dados da empresa.",
    youtubeId: "Y7zNlEMDmI4",
    categoria: "Corporativo",
    duracao: "11:02",
    destaque: false,
  },
  {
    id: 7,
    titulo: "Como identificar sites falsos",
    descricao: "Técnicas práticas para verificar se um site é legítimo ou uma cópia fraudulenta antes de inserir qualquer dado.",
    youtubeId: "jW_GFpYMdO4",
    categoria: "Phishing",
    duracao: "7:18",
    destaque: false,
  },
  {
    id: 8,
    titulo: "Trabalho remoto seguro: proteja sua empresa",
    descricao: "Orientações essenciais para manter a segurança da informação enquanto trabalha de casa ou em locais públicos.",
    youtubeId: "snRocIB5LH4",
    categoria: "Corporativo",
    duracao: "14:30",
    destaque: false,
  },
];

const CATEGORIA_CORES = {
  Phishing: "bg-rose-100 text-rose-700",
  Senhas: "bg-indigo-100 text-indigo-700",
  "Redes Sociais": "bg-orange-100 text-orange-700",
  Corporativo: "bg-teal-100 text-teal-700",
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function ConteudosPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [videoAtivo, setVideoAtivo] = useState(null);

  const conteudosFiltrados =
    categoriaAtiva === "Todos"
      ? CONTEUDOS
      : CONTEUDOS.filter((c) => c.categoria === categoriaAtiva);

  const destaque = CONTEUDOS.find((c) => c.destaque);
  const mostrarDestaque = categoriaAtiva === "Todos";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center size-12 rounded-xl bg-indigo-700 shrink-0 shadow-sm">
          <PlayIcon className="size-6 text-white" />
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
            {videoAtivo?.id === destaque.id ? (
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${destaque.youtubeId}?autoplay=1`}
                  title={destaque.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <button
                className="relative w-full aspect-video bg-slate-900 group overflow-hidden"
                onClick={() => setVideoAtivo(destaque)}
              >
                <img
                  src={`https://img.youtube.com/vi/${destaque.youtubeId}/maxresdefault.jpg`}
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
                  {destaque.duracao}
                </span>
                <span className="absolute top-3 left-3 bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                  EM DESTAQUE
                </span>
              </button>
            )}
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
            onClick={() => { setCategoriaAtiva(cat); setVideoAtivo(null); }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {conteudosFiltrados
          .filter((c) => !(mostrarDestaque && c.destaque))
          .map((conteudo) => (
            <Card key={conteudo.id} className="border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              {videoAtivo?.id === conteudo.id ? (
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${conteudo.youtubeId}?autoplay=1`}
                    title={conteudo.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <button
                  className="relative w-full aspect-video bg-slate-900 group overflow-hidden"
                  onClick={() => setVideoAtivo(conteudo)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${conteudo.youtubeId}/mqdefault.jpg`}
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
                    {conteudo.duracao}
                  </span>
                </button>
              )}

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

      {conteudosFiltrados.filter((c) => !(mostrarDestaque && c.destaque)).length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">Nenhum conteúdo nessa categoria ainda.</p>
        </div>
      )}
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
