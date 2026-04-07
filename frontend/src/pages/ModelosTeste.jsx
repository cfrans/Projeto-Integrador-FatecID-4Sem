import { useState } from "react";
import NavbarTeste from "../components/NavbarTeste";

const MODELOS = [
  { id: 1, nome: "Alerta de Senha Expirada" },
  { id: 2, nome: "Verificação de Conta Bancária" },
  { id: 3, nome: "Atualização de Cadastro RH" },
];

const SETORES = [
  { id: 1, nome: "Financeiro" },
  { id: 2, nome: "TI" },
  { id: 3, nome: "RH" },
  { id: 4, nome: "Comercial" },
];

export default function ModelosPage() {
  const [modeloSel, setModeloSel] = useState("");
  const [setorSel, setSetorSel] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [texto, setTexto] = useState("");

  const limpar = () => { setModeloSel(""); setSetorSel(""); setNomeModelo(""); setTexto(""); };

  return (
    <div style={s.root}>
      {/* Container Verde: Mais estreito (900px) e com brilho lateral */}
      <div style={s.bg} />

      <NavbarTeste activePage="modelos" />

      <main style={s.main}>
        <h1 style={s.title}>Criação e Edição de Modelos</h1>

        <div style={s.card}>
          <div style={s.row}>
            <Fg label="Modelo">
              <Sel value={modeloSel} onChange={e => setModeloSel(e.target.value)}>
                <option value="">Nenhum modelo selecionado</option>
                {MODELOS.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </Sel>
            </Fg>
            <Fg label="Setor Destino">
              <Sel value={setorSel} onChange={e => setSetorSel(e.target.value)}>
                <option value="">Nenhum setor selecionado</option>
                {SETORES.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </Sel>
            </Fg>
            <Fg label="Usuário / Última Modificação" small>
              <input style={{ ...s.inp, ...s.ro }} readOnly placeholder="—" />
            </Fg>
            <Fg label="Data Última Modificação" small>
              <input style={{ ...s.inp, ...s.ro }} readOnly placeholder="—" />
            </Fg>
          </div>

          <Fg label="Nome do Modelo" full>
            <input style={s.inp} value={nomeModelo} onChange={e => setNomeModelo(e.target.value)}
              placeholder="Ex: Alerta de Segurança — Senha Expirada" />
          </Fg>

          <Fg label="Texto" full>
            <div style={{ position: "relative" }}>
              <textarea style={s.ta} value={texto} onChange={e => setTexto(e.target.value)} />
              {!texto && (
                <div style={s.taOverlay}>
                  <FishSVG />
                  <span style={s.taHint}>Digite aqui seu texto modelo</span>
                </div>
              )}
            </div>
          </Fg>

          <div style={s.footer}>
            <Btn variant="danger" onClick={limpar}>
              <Icon d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /> Excluir
            </Btn>
            <Btn variant="secondary" onClick={limpar}>
              <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /> Limpar
            </Btn>
            <Btn variant="primary">
              <Icon d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" /> Salvar
            </Btn>
          </div>
        </div>
      </main>

      <style>{css}</style>
    </div>
  );
}

function Fg({ label, children, small, full }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "6px",
      flex: full ? "1 1 100%" : small ? "0 0 auto" : 1,
      minWidth: small ? "168px" : full ? "100%" : "160px",
    }}>
      <label style={s.lbl}>{label}</label>
      {children}
    </div>
  );
}

function Sel({ value, onChange, children }) {
  return (
    <div style={{ position: "relative" }}>
      <select style={s.sel} value={value} onChange={onChange}>{children}</select>
      <svg style={s.chev} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function Btn({ variant, onClick, children }) {
  const variantStyle = { primary: s.btnPrimary, secondary: s.btnSec, danger: s.btnDanger }[variant];
  return (
    <button style={{ ...s.btn, ...variantStyle }} onClick={onClick}>
      {children}
    </button>
  );
}

function Icon({ d }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function FishSVG() {
  return (
    <svg width="68" height="54" viewBox="0 0 120 90" fill="none">
      <ellipse cx="55" cy="50" rx="32" ry="22" fill="#c4d8d2" />
      <path d="M87 50C100 36 108 26 104 14 96 30 90 38 87 50Z" fill="#b2cbc4" />
      <path d="M87 50C100 64 108 74 104 86 96 70 90 62 87 50Z" fill="#b2cbc4" />
      <ellipse cx="43" cy="44" rx="5" ry="5" fill="#7eaaa0" />
      <circle cx="44" cy="43" r="2" fill="white" opacity=".5" />
      <path d="M35 42Q30 38 28 44Q30 50 35 48" fill="#b2cbc4" />
    </svg>
  );
}

const s = {
root: {
    minHeight: "100vh",
    width: "100%", // <-- Aqui! Trocamos 100vw por 100%
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    position: "relative",
    background: "#0a2234", 
    // Pode remover o overflow-x daqui, já colocamos no index.css
  },
  bg: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "900px", // Ficou mais estreito conforme pedido
    height: "280px",
    background: "linear-gradient(to bottom, #134434 0%, #1a5c44 100%)",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
    boxShadow: "0 20px 60px rgba(26,92,68, 0.5)", // Glow mais intenso
    zIndex: 0,
  },
  main: {
    position: "relative", zIndex: 1,
    maxWidth: "900px", margin: "0 auto",
    padding: "0 32px 60px",
  },
  title: {
    fontSize: "18px", fontWeight: 700,
    color: "#fff",
    margin: "0 0 20px",
    letterSpacing: "-.02em",
    textAlign: "center",
  },
  card: {
    background: "rgba(255,255,255,.98)", // Card quase totalmente sólido
    borderRadius: "20px",
    boxShadow: "0 10px 50px rgba(0,0,0,.15), 0 0 70px rgba(26,92,68,.15)",
    padding: "32px",
    display: "flex", flexDirection: "column", gap: "24px",
    border: "1px solid rgba(255,255,255,.9)",
  },
  row: { display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" },
  lbl: {
    fontSize: "11px", fontWeight: 700,
    color: "#6b9080", letterSpacing: ".08em",
    textTransform: "uppercase",
  },
  sel: {
    width: "100%", appearance: "none",
    background: "#f8fbfa",
    border: "1.5px solid #dcece7",
    borderRadius: "10px",
    color: "#1e4a3a", fontSize: "13px", fontWeight: 600,
    padding: "11px 32px 11px 14px",
    outline: "none", fontFamily: "inherit",
    transition: "all .2s ease",
    cursor: "pointer",
  },
  chev: {
    position: "absolute", right: "12px", top: "50%",
    transform: "translateY(-50%)",
    width: "14px", height: "14px",
    color: "#7aaa96", pointerEvents: "none",
  },
  inp: {
    width: "100%",
    background: "#f8fbfa",
    border: "1.5px solid #dcece7",
    borderRadius: "10px",
    color: "#1e4a3a", fontSize: "13px", fontWeight: 600,
    padding: "11px 14px",
    outline: "none", fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "all .2s ease",
  },
  ro: { color: "#a5c2b8", background: "#fafcfb", cursor: "default" },
  ta: {
    width: "100%", minHeight: "200px",
    background: "#f8fbfa",
    border: "1.5px solid #dcece7",
    borderRadius: "12px",
    color: "#1e4a3a", fontSize: "13.5px",
    padding: "16px",
    outline: "none", fontFamily: "inherit",
    resize: "vertical", lineHeight: 1.8,
    boxSizing: "border-box",
    transition: "all .2s ease",
  },
  taOverlay: {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: "12px", pointerEvents: "none",
  },
  taHint: { fontSize: "13.5px", color: "#a5c2b8", fontStyle: "italic", fontWeight: 500 },
  footer: {
    display: "flex", justifyContent: "flex-end", alignItems: "center",
    gap: "10px", paddingTop: "12px",
    borderTop: "1px solid #f0f5f2",
  },
  btn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 22px", borderRadius: "10px",
    fontSize: "13px", fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
    transition: "all .2s ease", letterSpacing: ".01em",
  },
  btnPrimary: {
    border: "none", 
    background: "#1a5c44", 
    color: "#fff",
    boxShadow: "0 6px 20px rgba(26,92,68, 0.45)",
  },
  btnSec: {
    border: "1.5px solid #dcece7", background: "#f8fbfa", color: "#3d6b5c",
  },
  btnDanger: {
    border: "1.5px solid #fad0ce", background: "#fff9f9", color: "#c04a44",
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #0a2234; overflow-x: hidden; }
  select:focus, input:focus, textarea:focus {
    border-color: #1a5c44 !important;
    box-shadow: 0 0 0 4px rgba(26,92,68,.1) !important;
    background: #fff !important;
  }
  select:hover:not(:focus),
  input:hover:not(:focus):not([readonly]),
  textarea:hover:not(:focus) { border-color: #b8d6cd !important; }
  select option { background: #fff; color: #1e4a3a; }
  button:active { transform: scale(.96); }
  button:hover { filter: brightness(.95); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #c8ded6; border-radius: 10px; }
`;