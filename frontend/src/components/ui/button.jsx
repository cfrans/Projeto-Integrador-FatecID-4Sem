import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

// Estrutura base: layout e formato do botao.
const baseLayoutClasses =
  "group/button inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold select-none"

// Estados globais de interacao e acessibilidade.
const baseStateClasses =
  "transition-all outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-offset-1"

// Comportamento padrao para icones dentro do botao.
const iconChildClasses = "[&_svg]:pointer-events-none [&_svg]:shrink-0"

// Classes base aplicadas em qualquer variante.
const baseButtonClasses = cn(baseLayoutClasses, baseStateClasses, iconChildClasses)

const buttonVariants = cva(
  baseButtonClasses,
  {
    variants: {
      // Variantes de estilo para contexto de uso (button principal, button secundario etc)
      variant: {
        primary:
          "bg-teal-700 text-slate-50 shadow-lg shadow-teal-800/35 hover:bg-teal-800 focus-visible:ring-teal-400/40",
        secondary:
          "bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300/60",
        ghost:
          "text-slate-700 hover:bg-slate-100",
        destructive:
          "bg-red-600 text-slate-50 hover:bg-red-700 focus-visible:ring-red-400/40",
        link: "text-teal-700 underline-offset-4 hover:underline",
      },
      // Variantes de tamanho para reduzir repeticao de padding e tamanho de fonte.
      size: {
        default:
          "h-auto px-4 py-3 text-base",
        xs: "h-auto px-2 py-1 text-xs",
        sm: "h-auto px-3 py-2 text-sm",
        lg: "h-auto px-5 py-3 text-lg",
        icon: "size-10 p-0",
        "icon-xs": "size-7 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-11 p-0",
      },
    },
    // Fallback global: quando nada e informado, usa variante principal.
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
