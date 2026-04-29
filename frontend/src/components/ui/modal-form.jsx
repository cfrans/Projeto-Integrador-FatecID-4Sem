import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

export default function ModalForm({
  open = false,
  onOpenChange,
  title,
  children,
}) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {title && (
          <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
        )}

        {children}
      </div>
    </div>
  )
}
