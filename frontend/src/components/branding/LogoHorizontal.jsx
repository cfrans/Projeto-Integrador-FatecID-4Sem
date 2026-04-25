import logoHorizontalWhite from '@/assets/logo-horizontal-white.svg'
import logoHorizontalDark from '@/assets/logo-horizontal-dark.svg'

export function LogoHorizontal({ className = "", alt = "Logo Nemo", variant = "white" }) {
    const src = variant === "dark" ? logoHorizontalDark : logoHorizontalWhite
    return <img className={className} src={src} alt={alt} />;
}