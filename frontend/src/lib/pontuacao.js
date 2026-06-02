// Faixas de risco da pontuação do colaborador (0–1000), com baseline neutro em 500.
export function faixaPontuacao(saldo) {
  if (saldo < 300) return { label: "Crítico", cor: "#EF4444", bg: "bg-red-50", borda: "border-red-200", texto: "text-red-700" };
  if (saldo < 700) return { label: "Atenção", cor: "#F59E0B", bg: "bg-amber-50", borda: "border-amber-200", texto: "text-amber-700" };
  return { label: "OK", cor: "#10B981", bg: "bg-emerald-50", borda: "border-emerald-200", texto: "text-emerald-700" };
}
