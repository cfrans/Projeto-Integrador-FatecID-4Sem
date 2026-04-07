// src/components/AnimatedBackground.jsx
// Coloque este componente como wrapper dentro do <main> do Login.jsx
// Ele cuida do parallax dos orbs, bolhas e peixinhos

import { useEffect, useRef, useCallback } from 'react'

/* ─── Shapes SVG dos peixinhos ─── */
// Desenhados nativamente em cada direção — zero CSS de espelhamento
const FISH_SHAPES = {
  // cauda à esquerda, olho à direita → nada pra direita →
  ltr: [
    `<svg width="54" height="30" viewBox="0 0 54 30" fill="none">
      <path d="M14 15C14 7 2 1 2 1C7 8 7 22 2 29C2 29 14 23 14 15Z" fill="rgba(13,148,136,0.38)"/>
      <ellipse cx="30" cy="15" rx="18" ry="10" fill="rgba(13,148,136,0.32)"/>
      <circle cx="43" cy="11" r="3.2" fill="rgba(13,148,136,0.55)"/>
      <circle cx="44" cy="10" r="1.2" fill="rgba(255,255,255,0.55)"/>
    </svg>`,
    `<svg width="66" height="36" viewBox="0 0 66 36" fill="none">
      <path d="M18 18C18 8 2 1 2 1C9 10 9 26 2 35C2 35 18 28 18 18Z" fill="rgba(30,64,175,0.32)"/>
      <ellipse cx="38" cy="18" rx="22" ry="13" fill="rgba(30,64,175,0.28)"/>
      <circle cx="54" cy="13" r="4" fill="rgba(30,64,175,0.5)"/>
      <circle cx="55.5" cy="11.5" r="1.5" fill="rgba(255,255,255,0.5)"/>
    </svg>`,
  ],
  // cauda à direita, olho à esquerda → nada pra esquerda ←
  rtl: [
    `<svg width="54" height="30" viewBox="0 0 54 30" fill="none">
      <path d="M40 15C40 7 52 1 52 1C47 8 47 22 52 29C52 29 40 23 40 15Z" fill="rgba(13,148,136,0.38)"/>
      <ellipse cx="24" cy="15" rx="18" ry="10" fill="rgba(13,148,136,0.32)"/>
      <circle cx="11" cy="11" r="3.2" fill="rgba(13,148,136,0.55)"/>
      <circle cx="10" cy="10" r="1.2" fill="rgba(255,255,255,0.55)"/>
    </svg>`,
    `<svg width="66" height="36" viewBox="0 0 66 36" fill="none">
      <path d="M48 18C48 8 64 1 64 1C57 10 57 26 64 35C64 35 48 28 48 18Z" fill="rgba(30,64,175,0.32)"/>
      <ellipse cx="28" cy="18" rx="22" ry="13" fill="rgba(30,64,175,0.28)"/>
      <circle cx="12" cy="13" r="4" fill="rgba(30,64,175,0.5)"/>
      <circle cx="10.5" cy="11.5" r="1.5" fill="rgba(255,255,255,0.5)"/>
    </svg>`,
  ],
}

function lerp(a, b, t) { return a + (b - a) * t }

export default function AnimatedBackground({ children }) {
  const sceneRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const currentRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef(null)

  /* ─── Parallax dos orbs ─── */
  const animateOrbs = useCallback(() => {
    const m = mouseRef.current
    const c = currentRef.current
    c.x = lerp(c.x, m.x, 0.04)
    c.y = lerp(c.y, m.y, 0.04)
    const dx = (c.x - 0.5) * 60
    const dy = (c.y - 0.5) * 40
    if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${dx * 0.8}px, ${dy * 0.8}px)`
    if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${-dx * 0.6}px, ${-dy * 0.6}px)`
    if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${dx * 1.2}px, ${dy * 1.0}px)`
    rafRef.current = requestAnimationFrame(animateOrbs)
  }, [])

  /* ─── Spawn bolha ─── */
  const spawnBubble = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return
    const b = document.createElement('div')
    const sz = 4 + Math.random() * 10
    const dur = 6 + Math.random() * 8
    b.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:${sz}px;height:${sz}px;
      left:${Math.random() * 100}%;bottom:-20px;
      background:rgba(13,148,136,0.10);
      border:1px solid rgba(13,148,136,0.18);
      animation:bgBubbleRise ${dur}s linear forwards;
      z-index:1;
    `
    scene.appendChild(b)
    setTimeout(() => b.remove(), (dur + 1) * 1000)
  }, [])

  /* ─── Spawn peixe ─── */
  const spawnFish = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return
    const rtl = Math.random() > 0.5
    const el = document.createElement('div')
    const scale = 0.6 + Math.random() * 0.8
    const top = 5 + Math.random() * 88
    const dur = 18 + Math.random() * 22
    const delay = Math.random() * 3
    const shapes = rtl ? FISH_SHAPES.rtl : FISH_SHAPES.ltr
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    el.innerHTML = shape
    // LTR: entra pela esquerda, vai pra direita — sem scaleX no container
    // RTL: entra pela direita, vai pra esquerda — scaleX já está no SVG
    el.style.cssText = `
      position:absolute;pointer-events:none;opacity:0;
      top:${top}%;
      ${rtl ? 'right:-120px' : 'left:-120px'};
      transform:scale(${scale});
      transform-origin:center center;
      animation:${rtl ? 'bgFishRtl' : 'bgFishLtr'} ${dur}s ${delay}s linear forwards;
      z-index:2;
    `
    scene.appendChild(el)
    setTimeout(() => el.remove(), (dur + delay + 1) * 1000)
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    /* mouse */
    const onMove = (e) => {
      const r = scene.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      }
    }
    window.addEventListener('mousemove', onMove)

    /* start orb animation */
    rafRef.current = requestAnimationFrame(animateOrbs)

    /* bolhas */
    for (let i = 0; i < 4; i++) setTimeout(spawnBubble, i * 400)
    const bubbleInterval = setInterval(spawnBubble, 1400)

    /* peixinhos */
    spawnFish()
    setTimeout(spawnFish, 7000)
    const fishInterval = setInterval(() => spawnFish(), 14000)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      clearInterval(bubbleInterval)
      clearInterval(fishInterval)
    }
  }, [animateOrbs, spawnBubble, spawnFish])

  return (
    <div
      ref={sceneRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(145deg,#051524 0%,#0b2538 55%,#0f172a 100%)',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      {/* Injetar keyframes uma vez */}
      <style>{`
        @keyframes bgBubbleRise {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-105vh) scale(0.5); opacity: 0; }
        }
        @keyframes bgFishLtr {
          0%   { opacity: 0; translate: 0px 0px; }
          5%   { opacity: 0.5; }
          95%  { opacity: 0.5; }
          100% { opacity: 0; translate: calc(100vw + 140px) 0px; }
        }
        @keyframes bgFishRtl {
          0%   { opacity: 0; translate: 0px 0px; }
          5%   { opacity: 0.45; }
          95%  { opacity: 0.45; }
          100% { opacity: 0; translate: calc(-100vw - 140px) 0px; }
        }
      `}</style>

      {/* Orbs de gradiente */}
      <div ref={orb1Ref} style={orbStyle('55%', '55%', '-10%', '-5%', 'rgba(13,148,136,0.22)')} />
      <div ref={orb2Ref} style={orbStyle('50%', '50%', null, null, 'rgba(30,64,175,0.25)', true)} />
      <div ref={orb3Ref} style={orbStyle('30%', '30%', '40%', '40%', 'rgba(13,148,136,0.08)')} />

      {/* Conteúdo (o card) */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'grid', placeItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function orbStyle(w, h, top, left, color, isBottom = false) {
  return {
    position: 'absolute',
    width: w, height: h,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    pointerEvents: 'none',
    transition: 'transform 0.08s ease-out',
    ...(top ? { top } : {}),
    ...(left ? { left } : {}),
    ...(isBottom ? { bottom: '-10%', right: '-5%' } : {}),
  }
}