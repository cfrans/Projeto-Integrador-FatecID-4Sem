import { useState, useEffect } from "react";

export function faixaPontuacao(saldo) {
  if (saldo < 300)  return { label: "Crítico",  cor: "#EF4444", bg: "bg-red-50",    borda: "border-red-200",    texto: "text-red-700"    };
  if (saldo < 700)  return { label: "Atenção",  cor: "#F59E0B", bg: "bg-amber-50",  borda: "border-amber-200",  texto: "text-amber-700"  };
  return             { label: "OK",       cor: "#10B981", bg: "bg-emerald-50", borda: "border-emerald-200", texto: "text-emerald-700" };
}

export function Velocimetro({ saldo }) {
  const [displaySaldo, setDisplaySaldo] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 1200; // 1.2s de animação
    const initial = displaySaldo;
    const target = saldo;

    const animate = (time) => {
      if (!start) start = time;
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setDisplaySaldo(Math.round(initial + (target - initial) * ease));
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saldo]);

  const faixa = faixaPontuacao(displaySaldo);
  // Arco de 180° (semicírculo). saldo 0→1000 mapeado para ângulo 180°→0° (da esquerda p/ direita)
  const angulo = 180 - (displaySaldo / 1000) * 180;
  const cx = 110, cy = 100, r = 80;
  // Ponteiro
  const px = cx + r * 0.78 * Math.cos(Math.PI - (displaySaldo / 1000) * Math.PI);
  const py = cy - r * 0.78 * Math.sin((displaySaldo / 1000) * Math.PI);

  // Arcos coloridos exatos (1/3 da circunferência para cada cor)
  const circunf = Math.PI * r; // 251.3
  const terco = circunf / 3;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 120" className="w-full max-w-[260px]" aria-label={`Pontuação: ${displaySaldo}`}>
        {/* Fundo cinza */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#E2E8F0" strokeWidth="18" strokeLinecap="butt"
        />
        {/* Vermelho (1/3) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#EF4444" strokeWidth="18" strokeLinecap="butt"
          strokeDasharray={`${terco} ${circunf}`}
          strokeDashoffset="0"
        />
        {/* Amarelo (1/3) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#F59E0B" strokeWidth="18" strokeLinecap="butt"
          strokeDasharray={`${terco} ${circunf}`}
          strokeDashoffset={`-${terco}`}
        />
        {/* Verde (1/3) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#10B981" strokeWidth="18" strokeLinecap="butt"
          strokeDasharray={`${terco} ${circunf}`}
          strokeDashoffset={`-${terco * 2}`}
        />
        {/* Ponteiro */}
        <line
          x1={cx} y1={cy}
          x2={px}  y2={py}
          stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round"
        />
        {/* Centro */}
        <circle cx={cx} cy={cy} r="5" fill="#1E3A5F" />
        {/* Labels das faixas */}
        <text x="18"  y="118" fontSize="9" fill="#EF4444" fontWeight="600">0</text>
        <text x="110" y="20"  fontSize="9" fill="#F59E0B" fontWeight="600" textAnchor="middle">500</text>
        <text x="202" y="118" fontSize="9" fill="#10B981" fontWeight="600" textAnchor="end">1000</text>
      </svg>
      {/* Pontuação + faixa */}
      <div className="text-center -mt-4">
        <p className="text-3xl font-black text-slate-800 tabular-nums">{displaySaldo}</p>
        <span className={`inline-block mt-1 text-xs font-bold px-3 py-0.5 rounded-full ${faixa.bg} ${faixa.texto} border ${faixa.borda}`}>
          {faixa.label}
        </span>
      </div>
    </div>
  );
}
