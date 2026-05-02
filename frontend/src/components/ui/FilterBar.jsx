import { FunnelIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

/**
 * Barra de filtro reutilizável — toggle button + painel colapsável.
 *
 * Props:
 *   label        — texto do botão (ex: "Filtrar modelos")
 *   isOpen       — estado controlado (boolean)
 *   onToggle     — callback para abrir/fechar
 *   isActive     — true se algum filtro está aplicado
 *   activeCount  — número de filtros ativos (mostra badge)
 *   onClear      — callback para limpar filtros (mostra botão "Limpar")
 *   children     — controles de filtro (inputs, selects, etc.)
 */
export function FilterBar({ label, isOpen, onToggle, isActive, activeCount = 0, onClear, rightSlot, children }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={`h-9 px-4 gap-1.5 border transition-colors ${
              isOpen || isActive
                ? "border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            {label}
            {activeCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>
          {isActive && onClear && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClear}
              className="h-9 px-3 text-slate-500 border-slate-300 hover:bg-slate-50 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        {rightSlot && <div className="flex items-center gap-3 shrink-0">{rightSlot}</div>}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-28 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="flex items-end gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
