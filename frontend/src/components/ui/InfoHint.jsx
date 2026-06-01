import { InformationCircleIcon } from "@heroicons/react/24/outline";

/**
 * Ícone de informação com balãozinho explicativo no hover/foco.
 * Usar dentro de um <FieldLabel> para esclarecer o que vai no campo.
 *
 * <FieldLabel>Nome do Campo <InfoHint text="Explicação aqui." /></FieldLabel>
 */
export function InfoHint({ text, className = "" }) {
  return (
    <span className={`group/hint relative inline-flex items-center align-middle ${className}`}>
      <button
        type="button"
        aria-label="Mais informações sobre este campo"
        className="text-slate-400 transition-colors outline-none hover:text-teal-600 focus-visible:text-teal-600"
      >
        <InformationCircleIcon className="size-4" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-[11px] font-normal normal-case leading-relaxed tracking-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/hint:opacity-100 group-focus-within/hint:opacity-100"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </span>
    </span>
  );
}
