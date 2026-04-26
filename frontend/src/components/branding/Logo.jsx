import logoDark from '@/assets/logo-dark.svg'

export function Logo({ className = "", alt = "Logo Nemo" }) {
    return <img className={className} src={logoDark} alt={alt} />;
}