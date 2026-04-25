import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Modal({ open, onClose, title, description, variant = 'error' }) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const colors = {
    error: {
      icon: '✕',
      iconBg: 'bg-red-100 text-red-600',
      title: 'text-red-700',
    },
    warning: {
      icon: '!',
      iconBg: 'bg-yellow-100 text-yellow-600',
      title: 'text-yellow-700',
    },
    success: {
      icon: '✓',
      iconBg: 'bg-teal-100 text-teal-600',
      title: 'text-teal-700',
    },
  }

  const c = colors[variant]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${c.iconBg}`}>
            {c.icon}
          </span>
          <h2 className={`text-base font-bold ${c.title}`}>{title}</h2>
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
        <Button className="mt-5 w-full" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}