import { Button } from "./Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
export function PaginationBar({ inicio, fim, total, paginaAtual, totalPaginas, pageSize, setPage, setPageSize, borderTop = false }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm ${borderTop ? "border-t border-slate-100" : "border-b border-slate-100"}`}>
      <div className="text-xs text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{total === 0 ? 0 : inicio + 1}</span>–
        <span className="font-medium text-slate-700">{Math.min(fim, total)}</span> de{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={paginaAtual === 1} className="h-8 px-3 gap-1.5 font-medium border-slate-300 hover:bg-slate-100 disabled:opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
          Anterior
        </Button>
        <span className="text-xs text-slate-600 tabular-nums">
          <span className="font-semibold text-slate-800">{paginaAtual}</span>
          {" / "}
          <span className="font-semibold text-slate-800">{totalPaginas}</span>
        </span>
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas} className="h-8 px-3 gap-1.5 font-medium border-slate-300 hover:bg-slate-100 disabled:opacity-40">
          Próxima
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </Button>
        <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue>{pageSize} por página</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="15">15 por página</SelectItem>
            <SelectItem value="30">30 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
            <SelectItem value="100">100 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}