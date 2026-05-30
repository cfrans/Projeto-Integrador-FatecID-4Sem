import AnimatedBackground from "@/components/effects/AnimatedBackground"

export default function BackgroundDemoPage() {
  return (
    <AnimatedBackground>
      {/* Container vazio para ocupar a tela inteira sem conteúdo */}
      <div className="min-h-screen w-full"></div>
    </AnimatedBackground>
  )
}
