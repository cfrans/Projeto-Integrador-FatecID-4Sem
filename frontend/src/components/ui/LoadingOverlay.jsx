export default function LoadingOverlay({ open, message = "Carregando...", description }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
        <p className="text-sm font-medium text-slate-700">{message}</p>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </div>
  )
}