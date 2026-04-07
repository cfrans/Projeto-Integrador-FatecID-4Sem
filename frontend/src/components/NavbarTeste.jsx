import { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  {
    id: "criar-campanha", label: "Criar Campanha",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  },
  {
    id: "modelos", label: "Modelos",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
  },
  {
    id: "graficos", label: "Gráficos",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  },
  {
    id: "usuarios", label: "Usuários",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    id: "sobre", label: "Sobre",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  },
];

export default function Navbar({ activePage = "modelos", onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const [hoverStyle, setHoverStyle] = useState({ opacity: 0, left: 0, width: 0 });
  const navRef = useRef(null);

  useEffect(() => {
    if (hovered && navRef.current) {
      const el = navRef.current.querySelector(`[data-id="${hovered}"]`);
      if (el) {
        setHoverStyle({
          opacity: 1,
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    } else {
      setHoverStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [hovered]);

  return (
    <nav style={s.nav}>
      <button style={s.circleBtn} onClick={() => onNavigate?.("home")} title="Início">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      <div ref={navRef} style={s.pill} onMouseLeave={() => setHovered(null)}>
        <div style={{
          position: "absolute",
          top: "50%", transform: "translateY(-50%)",
          left: hoverStyle.left,
          width: hoverStyle.width,
          height: "38px",
          opacity: hoverStyle.opacity,
          backgroundColor: "rgba(26,92,68,.12)",
          borderRadius: "999px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
          zIndex: 0,
          pointerEvents: "none"
        }} />

        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              data-id={item.id}
              style={{ ...s.navItem, ...(active ? s.navActive : {}) }}
              onMouseEnter={() => setHovered(item.id)}
              onClick={() => onNavigate?.(item.id)}
            >
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", color: active ? "#fff" : "#5a9080" }}>
                {item.icon}
              </span>
              <span style={{ position: "relative", zIndex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={s.actions}>
        <button style={s.circleBtn} title="Configurações">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button style={s.circleBtn} title="Sair">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "12px", padding: "24px 36px",
    position: "relative", zIndex: 10,
  },
  circleBtn: {
    width: "42px", height: "42px", borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,.6)",
    background: "rgba(255,255,255,.90)", // Mais esbranquiçado
    color: "#1a5c44",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    boxShadow: "0 4px 14px rgba(0,0,0,.15)",
    transition: "all .2s ease", backdropFilter: "blur(12px)",
  },
  pill: {
    display: "flex", alignItems: "center",
    height: "50px",
    background: "rgba(255,255,255,.92)", // Navbar mais esbranquiçada
    border: "1.5px solid rgba(255,255,255,.8)",
    borderRadius: "999px",
    boxShadow: "0 6px 28px rgba(0,0,0,.14)",
    padding: "5px", gap: "2px",
    backdropFilter: "blur(20px)",
    position: "relative",
  },
  navItem: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "0 18px", height: "40px", borderRadius: "999px",
    border: "none", background: "transparent",
    color: "#3d6b5c", fontSize: "12.5px", fontWeight: 700,
    letterSpacing: ".02em", cursor: "pointer",
    transition: "all .2s ease", fontFamily: "inherit",
    whiteSpace: "nowrap", textTransform: "uppercase",
  },
  navActive: { 
    background: "#1a5c44", 
    color: "#fff", 
    boxShadow: "0 4px 12px rgba(26,92,68, 0.4)"
  },
  actions: { display: "flex", gap: "8px" },
};