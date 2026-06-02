import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { api, ApiError } from '@/lib/api'
import { LogoHorizontal } from '@/components/branding/LogoHorizontal'

// Partículas bioluminescentes (posições fixas p/ não depender de random)
const PARTICLES = [
  { top: '12%', left: '18%', s: 6, d: 0, dur: 11, c: '#2dd4bf' },
  { top: '26%', left: '72%', s: 4, d: 2.5, dur: 14, c: '#22d3ee' },
  { top: '64%', left: '30%', s: 8, d: 1.2, dur: 13, c: '#2dd4bf' },
  { top: '78%', left: '60%', s: 5, d: 3.4, dur: 16, c: '#5eead4' },
  { top: '40%', left: '85%', s: 3, d: 0.8, dur: 10, c: '#22d3ee' },
  { top: '52%', left: '8%', s: 5, d: 2, dur: 15, c: '#2dd4bf' },
  { top: '88%', left: '42%', s: 4, d: 4, dur: 12, c: '#5eead4' },
  { top: '18%', left: '50%', s: 3, d: 1.6, dur: 9, c: '#22d3ee' },
]

export default function LoginBetaPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setErro(null)
    setLoading(true)
    let data
    try {
      data = await api.post('/api/auth/login', {
        email: formData.get('email'),
        senha: formData.get('password'),
      }, { auth: false })
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Credenciais inválidas.')
      setLoading(false)
      return
    }
    const lembrar = formData.get('keepConnected') === 'on'
    login(data.token, lembrar)
    if (data.primeiroAcesso) { navigate('/trocar-senha'); return }
    navigate(data.role === 'Admin' ? '/admin' : '/home')
  }

  return (
    <div className="lb-root">
      <style>{CSS}</style>

      {/* Partículas ambiente */}
      <div className="lb-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span key={i} style={{
            top: p.top, left: p.left, width: p.s, height: p.s,
            background: p.c, boxShadow: `0 0 ${p.s * 3}px ${p.c}`,
            animationDelay: `${p.d}s`, animationDuration: `${p.dur}s`,
          }} />
        ))}
      </div>

      {/* ───────────── Painel esquerdo: logo + sonar ───────────── */}
      <section className="lb-brand">
        <div className="lb-logo lb-reveal" style={{ animationDelay: '.05s' }}>
          <LogoHorizontal style={{ height: '96px', width: 'auto' }} variant="dark" />
        </div>

        <div className="lb-sonarwrap lb-reveal" style={{ animationDelay: '.15s' }}>
          <div className="lb-sonar">
            <div className="lb-ring" />
            <div className="lb-ring" style={{ animationDelay: '1.3s' }} />
            <div className="lb-ring" style={{ animationDelay: '2.6s' }} />
            <div className="lb-grid" />
            <div className="lb-sweep" />
            <div className="lb-core">
              {/* anzol */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="3.4" r="1.9" />
                <path d="M12 5.3v.2a8.5 8.5 0 0 0 3.5 6.7 5.73 5.73 0 1 1-9.2 4.5" />
                <polyline points="9.1 16.8 6.3 13.9 6.3 16.8" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Painel direito: formulário ───────────── */}
      <section className="lb-panel">
        <div className="lb-card lb-reveal" style={{ animationDelay: '.2s' }}>
          <div className="lb-mini">
            <LogoHorizontal style={{ height: '48px', width: 'auto' }} variant="dark" />
          </div>

          <h2 className="lb-title">Bem-vindo de volta</h2>
          <p className="lb-sub">Entre com suas credenciais corporativas para mergulhar no portal.</p>

          {erro && (
            <div className="lb-alert" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lb-alert-ico">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3h.008M11.25 4.5l-7.5 13a1.5 1.5 0 0 0 1.3 2.25h13.9a1.5 1.5 0 0 0 1.3-2.25l-7.5-13a1.5 1.5 0 0 0-2.6 0Z" />
              </svg>
              {erro}
            </div>
          )}

          <form className="lb-form" onSubmit={handleSubmit}>
            <label className="lb-field">
              <span className="lb-label">E-mail corporativo</span>
              <input name="email" type="email" required autoComplete="email" placeholder="exemplo@nemo.com" />
            </label>

            <label className="lb-field">
              <span className="lb-label">Senha</span>
              <div className="lb-pass">
                <input name="password" type={showPass ? 'text' : 'password'} required autoComplete="current-password" placeholder="••••••••" />
                <button type="button" className="lb-eye" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPass ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.22A10.5 10.5 0 0 0 1.93 12c1.29 4.06 5.06 7 9.57 7 1.5 0 2.93-.32 4.22-.9M6.23 6.23A10.45 10.45 0 0 1 12 5c4.51 0 8.28 2.94 9.57 7a10.5 10.5 0 0 1-4.13 5.41M6.23 6.23 3 3m3.23 3.23 11.54 11.54M17.44 17.44 21 21m-9-5a3 3 0 0 1-2.12-5.12" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.04 12.32a1 1 0 0 1 0-.64C3.42 7.51 7.36 4.5 12 4.5s8.57 3.01 9.96 7.18a1 1 0 0 1 0 .64C20.58 16.49 16.64 19.5 12 19.5s-8.57-3.01-9.96-7.18Z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </label>

            <div className="lb-row">
              <label className="lb-check">
                <input type="checkbox" name="keepConnected" />
                <span className="lb-box" />
                Manter conectado
              </label>
              <a className="lb-link" href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password') }}>
                Esqueci minha senha
              </a>
            </div>

            <button className="lb-submit" type="submit" disabled={loading}>
              <span>{loading ? 'Autenticando…' : 'Entrar no portal'}</span>
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h15m0 0-6-6m6 6-6 6" /></svg>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

const CSS = `
.lb-root{
  --abyss-0:#02101a; --abyss-1:#05151f;
  --teal:#14b8a6; --teal-2:#2dd4bf; --cyan:#22d3ee; --amber:#f59e0b;
  --ink:#eaf7f4; --muted:#7fa3ac; --line:rgba(125,205,205,.16);
  position:fixed; inset:0; display:flex; align-items:center; justify-content:center; gap:56px; padding:32px;
  color:var(--ink); overflow:hidden;
  background:
    radial-gradient(1200px 800px at 18% -10%, rgba(20,184,166,.18), transparent 60%),
    radial-gradient(900px 700px at 110% 120%, rgba(34,211,238,.12), transparent 55%),
    linear-gradient(160deg, var(--abyss-1) 0%, var(--abyss-0) 55%, #010a12 100%);
}
.lb-root *{box-sizing:border-box}
.lb-dim{color:var(--muted)}

/* Partículas */
.lb-particles{position:absolute; inset:0; pointer-events:none; z-index:1}
.lb-particles span{position:absolute; border-radius:50%; opacity:.7; animation:lbFloat linear infinite}
@keyframes lbFloat{
  0%{transform:translateY(0) translateX(0); opacity:.15}
  50%{opacity:.8}
  100%{transform:translateY(-40px) translateX(14px); opacity:0}
}

/* Reveal no load */
.lb-reveal{opacity:0; animation:lbRise .8s cubic-bezier(.2,.75,.2,1) forwards}
@keyframes lbRise{from{opacity:0; transform:translateY(16px)} to{opacity:1; transform:none}}

/* ───── Painel esquerdo: logo + sonar ───── */
.lb-brand{position:relative; z-index:2; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:36px}
.lb-logo{flex:none}

/* Sonar */
.lb-sonarwrap{display:flex; flex-direction:column; align-items:center}
.lb-sonar{position:relative; width:min(360px,34vw); aspect-ratio:1}
.lb-ring{position:absolute; inset:0; border:1px solid rgba(45,212,191,.35); border-radius:50%;
  animation:lbPing 3.9s ease-out infinite}
@keyframes lbPing{0%{transform:scale(.35); opacity:.0} 18%{opacity:.7} 100%{transform:scale(1); opacity:0}}
.lb-grid{position:absolute; inset:12%; border-radius:50%;
  background:
    radial-gradient(circle, transparent 0 32%, rgba(125,205,205,.10) 32% 33%, transparent 33%),
    radial-gradient(circle, transparent 0 64%, rgba(125,205,205,.10) 64% 65%, transparent 65%);
  border:1px solid rgba(125,205,205,.14)}
.lb-grid::before, .lb-grid::after{content:''; position:absolute; background:rgba(125,205,205,.12)}
.lb-grid::before{left:50%; top:0; width:1px; height:100%}
.lb-grid::after{top:50%; left:0; height:1px; width:100%}
.lb-sweep{position:absolute; inset:12%; border-radius:50%;
  background:conic-gradient(from 0deg, rgba(45,212,191,.55), rgba(45,212,191,0) 70%);
  animation:lbSweep 3.6s linear infinite; filter:blur(.3px)}
@keyframes lbSweep{to{transform:rotate(360deg)}}
.lb-core{position:absolute; inset:0; display:grid; place-items:center; color:var(--teal-2)}
.lb-core svg{width:66px; height:66px; filter:drop-shadow(0 0 16px rgba(45,212,191,.7));
  animation:lbBreathe 3s ease-in-out infinite}
@keyframes lbBreathe{0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}}

/* ───── Painel direito ───── */
.lb-panel{position:relative; z-index:2; display:flex; flex:none}
.lb-card{width:min(420px,100%);
  background:linear-gradient(180deg, rgba(12,38,48,.72), rgba(6,22,30,.72));
  border:1px solid var(--line); border-radius:22px; padding:38px 34px;
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:0 30px 70px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.05);
  position:relative; overflow:hidden}
.lb-card::before{content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
  background:linear-gradient(90deg,transparent,var(--teal-2),var(--amber),var(--teal-2),transparent)}
.lb-mini{display:none; margin-bottom:22px}
.lb-title{font-size:26px; font-weight:700; letter-spacing:-.01em; margin:0 0 8px; color:var(--ink)}
.lb-sub{color:var(--muted); font-size:14px; line-height:1.55; margin:0 0 24px}

.lb-alert{display:flex; align-items:center; gap:10px; margin-bottom:18px; padding:11px 14px;
  border-radius:12px; font-size:13.5px; color:#fecaca;
  background:rgba(239,68,68,.10); border:1px solid rgba(239,68,68,.30)}
.lb-alert-ico{width:18px; height:18px; flex-shrink:0; color:#f87171}

.lb-form{display:flex; flex-direction:column; gap:16px}
.lb-field{display:flex; flex-direction:column; gap:7px}
.lb-label{color:var(--muted); font-size:12.5px; font-weight:500}
.lb-field input{width:100%; height:48px; padding:0 15px; color:var(--ink); font-size:15px; font-family:inherit;
  background:rgba(2,16,24,.6); border:1px solid var(--line); border-radius:12px; outline:none;
  transition:border-color .2s, box-shadow .2s, background .2s}
.lb-field input::placeholder{color:#46636b}
.lb-field input:focus{border-color:var(--teal-2); background:rgba(2,16,24,.85);
  box-shadow:0 0 0 4px rgba(45,212,191,.13), 0 0 22px rgba(45,212,191,.14)}
.lb-pass{position:relative}
.lb-pass input{padding-right:46px}
.lb-eye{position:absolute; right:6px; top:50%; transform:translateY(-50%); width:36px; height:36px;
  display:grid; place-items:center; background:none; border:none; color:var(--muted); cursor:pointer; border-radius:9px}
.lb-eye:hover{color:var(--teal-2)}
.lb-eye svg{width:19px; height:19px}

.lb-row{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:2px; font-size:13.5px}
.lb-check{display:inline-flex; align-items:center; gap:9px; color:#b9d4d2; cursor:pointer; user-select:none}
.lb-check input{position:absolute; opacity:0; width:0; height:0}
.lb-box{width:18px; height:18px; border-radius:6px; border:1px solid var(--line); background:rgba(2,16,24,.6);
  display:inline-block; position:relative; transition:all .18s}
.lb-check input:checked + .lb-box{background:var(--teal); border-color:var(--teal)}
.lb-check input:checked + .lb-box::after{content:''; position:absolute; left:5px; top:2px; width:5px; height:9px;
  border:solid #03161a; border-width:0 2px 2px 0; transform:rotate(45deg)}
.lb-check input:focus-visible + .lb-box{box-shadow:0 0 0 3px rgba(45,212,191,.3)}

.lb-link{color:var(--teal-2); text-decoration:none; font-weight:500; transition:color .15s; white-space:nowrap}
.lb-link:hover{color:#5eead4; text-decoration:underline}

.lb-submit{position:relative; overflow:hidden; margin-top:8px; height:50px; border:none; border-radius:13px;
  cursor:pointer; font-family:inherit; font-weight:600; font-size:15px; color:#03161a;
  display:flex; align-items:center; justify-content:center; gap:9px;
  background:linear-gradient(135deg,#2dd4bf,#14b8a6);
  box-shadow:0 12px 30px rgba(20,184,166,.35); transition:transform .15s, box-shadow .2s, filter .2s}
.lb-submit svg{width:19px; height:19px; transition:transform .2s}
.lb-submit:hover:not(:disabled){filter:brightness(1.06); box-shadow:0 16px 38px rgba(20,184,166,.5)}
.lb-submit:hover:not(:disabled) svg{transform:translateX(4px)}
.lb-submit:active:not(:disabled){transform:translateY(1px)}
.lb-submit:disabled{opacity:.7; cursor:wait}
.lb-submit::after{content:''; position:absolute; top:0; left:-130%; width:60%; height:100%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent); transform:skewX(-18deg);
  animation:lbSheen 3.4s ease-in-out infinite}
@keyframes lbSheen{0%,60%{left:-130%} 100%{left:140%}}

/* ───── Responsivo ───── */
@media (max-width:900px){
  .lb-root{padding:20px}
  .lb-brand{display:none}
  .lb-mini{display:block}
}
`
