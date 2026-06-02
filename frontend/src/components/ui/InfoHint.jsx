import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

/**
 * Ícone de informação com balãozinho explicativo no hover/foco.
 * Usar dentro de um <FieldLabel> para esclarecer o que vai no campo.
 *
 * <FieldLabel>Nome do Campo <InfoHint text="Explicação aqui." /></FieldLabel>
 *
 * O balão é renderizado via portal no <body> com position: fixed, para
 * escapar de containers com overflow e de iframes (preview de e-mail, editor).
 * Aparece e some com um fade suave (opacity) — desmonta só após o fade-out.
 */
const FADE_MS = 300;

export function InfoHint({ text, className = "" }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const open = () => {
    clearTimeout(hideTimer.current);
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setCoords({ top: r.top, left: r.left + r.width / 2 });
    }
    setMounted(true);
    // dois frames para o browser pintar o opacity-0 antes do fade-in
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const close = () => {
    setVisible(false);
    hideTimer.current = setTimeout(() => setMounted(false), FADE_MS);
  };

  return (
    <span className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        ref={ref}
        type="button"
        aria-label="Mais informações sobre este campo"
        className="text-slate-400 transition-colors outline-none hover:text-teal-600 focus-visible:text-teal-600"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
      >
        <InformationCircleIcon className="size-4" />
      </button>
      {mounted &&
        createPortal(
          <span
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: "translate(-50%, calc(-100% - 8px))",
            }}
            className={`pointer-events-none z-[9999] w-60 rounded-lg bg-slate-800 px-3 py-2 text-[11px] font-normal normal-case leading-relaxed tracking-normal text-white shadow-lg transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
          >
            {text}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
          </span>,
          document.body
        )}
    </span>
  );
}
