import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import peixeSurpreso from '@/assets/peixe-icons/peixe-icon-surpreso.png'
import peixeHappy from '@/assets/peixe-icons/peixe-icon-happy.png'
import peixeDuvidoso from '@/assets/peixe-icons/peixe-icon-duvidoso.png'

export default function Modal({
  open,
  onClose,
  title,
  description,
  variant = 'error',
  // Props opcionais para modo confirmação
  confirm = false,
  confirmLabel = 'Confirmar',
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const colors = {
    error:   { img: peixeSurpreso, title: 'text-red-700' },
    warning: { img: peixeDuvidoso, title: 'text-yellow-700' },
    success: { img: peixeHappy,    title: 'text-teal-700' },
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
          <img src={c.img} alt="" className="h-18 w-auto" />
          <h2 className={`text-base font-bold ${c.title}`}>{title}</h2>
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>

        {confirm ? (
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        ) : (
          <Button className="mt-5 w-full" onClick={onClose}>Fechar</Button>
        )}
      </div>
    </div>
  )
}