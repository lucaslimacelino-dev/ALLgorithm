import { useI18n } from '../i18n'

// Classes de crescimento desenhadas no gráfico: f(n) para n ≥ 1.
const log2 = x => Math.log2(x + 1)
const factorial = n => Math.sqrt(2 * Math.PI * n) * (n / Math.E) ** n
const curves = {
  const: () => 1,
  loglog: n => log2(log2(n)),
  log: n => log2(n),
  sqrt: n => Math.sqrt(n),
  n: n => n,
  nloglogn: n => n * log2(log2(n)),
  nlogn: n => n * log2(n),
  n2: n => n * n,
  n2logn: n => n * n * log2(n),
  n3: n => n ** 3,
  exp: n => 2 ** n,
  fact: n => factorial(n),
}
// Curvas de referência, sempre ao fundo.
const reference = ['const', 'log', 'n', 'nlogn', 'n2', 'exp']
const labels = { const: '1', loglog: 'log log n', log: 'log n', sqrt: '√n', n: 'n', nloglogn: 'n log log n', nlogn: 'n log n', n2: 'n²', n2logn: 'n² log n', n3: 'n³', exp: '2ⁿ', fact: 'n!' }

// Converte uma complexidade escrita (ex.: "O((V + E) log V)", "≈ O(n^1,3)") em uma classe de
// crescimento. Devolve null quando o texto não é uma das formas reconhecidas — aí o gráfico some.
export function growthClass(text) {
  // Textos que misturam medidas diferentes (consultas × simulação, operações × custo de cada uma) ficam de fora.
  if (!text || /simula|cada uma/i.test(text)) return null
  if (/^exponen/i.test(text.trim())) return { key: 'exp' }
  const match = text.match(/[OΘ]\(((?:[^()]|\([^()]*\))*)\)/)
  if (!match) return null
  const e = match[1].replace(/[\s·×]/g, '')
  const v = '[a-zA-Z]'
  if (e.includes('!')) return { key: 'fact' }
  if (e.includes('ⁿ')) return { key: 'exp' }
  if (e === '1') return { key: 'const' }
  if (new RegExp(`^log${v}$`).test(e)) return { key: 'log' }
  if (new RegExp(`^loglog${v}$`).test(e)) return { key: 'loglog' }
  if (new RegExp(`^√${v}$`).test(e)) return { key: 'sqrt' }
  if (new RegExp(`^${v}(\\+${v})*$`).test(e)) return { key: 'n' }
  if (new RegExp(`^\\(?${v}(\\+${v})*\\)?log${v}$`).test(e)) return { key: 'nlogn' }
  if (new RegExp(`^${v}loglog${v}$`).test(e)) return { key: 'nloglogn' }
  if (new RegExp(`^${v}²log${v}$`).test(e)) return { key: 'n2logn' }
  if (new RegExp(`^${v}²$`).test(e) || /^[nmVE][nmVE]$/.test(e)) return { key: 'n2' }
  if (new RegExp(`^${v}³$`).test(e)) return { key: 'n3' }
  const power = e.match(new RegExp(`^${v}\\^(\\d+(?:[.,]\\d+)?)$`))
  if (power) { const p = Number(power[1].replace(',', '.')); return { key: `pow${p}`, fn: n => n ** p, label: `n^${p}` } }
  return null
}

const W = 260, H = 140, PAD = { l: 8, r: 8, t: 16, b: 18 }, X_MAX = 20, Y_MAX = 100
const sx = n => PAD.l + (n / X_MAX) * (W - PAD.l - PAD.r)
const sy = y => H - PAD.b - (Math.min(y, Y_MAX * 1.05) / Y_MAX) * (H - PAD.t - PAD.b)
function path(fn) {
  const pts = []
  for (let i = 0; i <= 90; i++) {
    const n = 0.5 + (i / 90) * (X_MAX - 0.5), y = fn(n)
    pts.push(`${pts.length ? 'L' : 'M'}${sx(n).toFixed(1)},${sy(y).toFixed(1)}`)
    if (y > Y_MAX) break
  }
  return pts.join('')
}

// Posição do rótulo de uma curva: na borda direita, se ela termina dentro do gráfico,
// ou no topo, onde ela sai.
function anchor(fn) {
  if (fn(X_MAX) <= Y_MAX) return { side: 'right', x: W - PAD.r - 2, y: sy(fn(X_MAX)) - 3 }
  let lo = 0.5, hi = X_MAX
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (fn(mid) > Y_MAX) hi = mid; else lo = mid }
  return { side: 'top', x: sx(lo), y: PAD.t - 5 }
}
// Afasta rótulos vizinhos: no topo, na horizontal; na borda direita, na vertical.
function spread(items) {
  const top = items.filter(i => i.side === 'top').sort((a, b) => a.x - b.x)
  for (let i = 1; i < top.length; i++) top[i].x = Math.max(top[i].x, top[i - 1].x + 30)
  const right = items.filter(i => i.side === 'right').sort((a, b) => b.y - a.y)
  for (let i = 1; i < right.length; i++) right[i].y = Math.min(right[i].y, right[i - 1].y - 9)
  return items
}

// Minigráfico do quadro lateral: a curva do caso médio (e a do pior caso, se for diferente)
// contra as classes de crescimento mais comuns.
export default function ComplexityChart({ complexity }) {
  const { t } = useI18n()
  const average = growthClass(complexity?.average)
  if (!average) return null
  const worstRaw = growthClass(complexity.worst)
  const worst = worstRaw && worstRaw.key !== average.key ? worstRaw : null
  const fnOf = c => c.fn ?? curves[c.key]

  return (
    <figure className="mt-4 rounded-xl bg-subtle px-3 pt-3 pb-2.5">
      <figcaption className="text-[11.5px] text-muted">{t('article.growth')}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label={`${t('article.average')}: ${complexity.average}`}>
        <defs>
          <clipPath id="growth-area"><rect x={PAD.l} y={PAD.t - 2} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b + 2} /></clipPath>
        </defs>
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="rgb(var(--line))" />
        <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="rgb(var(--line))" />
        <g clipPath="url(#growth-area)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {reference.filter(k => k !== average.key && k !== worst?.key).map(k => (
            <path key={k} d={path(curves[k])} stroke="rgb(var(--faint))" strokeOpacity="0.45" strokeWidth="1" />
          ))}
          {worst && <path d={path(fnOf(worst))} stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="4 3" />}
          <path d={path(fnOf(average))} stroke="rgb(var(--accent))" strokeWidth="2.6" />
        </g>
        {spread([
          ...reference.filter(k => k !== average.key && k !== worst?.key).map(k => ({ key: k, text: labels[k], color: 'rgb(var(--faint))', ...anchor(curves[k]) })),
          ...(worst ? [{ key: 'worst', text: worst.label ?? labels[worst.key], color: '#f43f5e', bold: true, ...anchor(fnOf(worst)) }] : []),
          { key: 'average', text: average.label ?? labels[average.key], color: 'rgb(var(--accent))', bold: true, ...anchor(fnOf(average)) },
        ]).map(l => (
          <text key={l.key} x={Math.min(l.x, W - PAD.r - 2)} y={l.y} textAnchor={l.side === 'right' || l.x > W - 30 ? 'end' : 'middle'} fontSize="8.5" fontWeight={l.bold ? 700 : 400} fontFamily="Geist Mono, monospace" fill={l.color}>{l.text}</text>
        ))}
        <text x={W - PAD.r} y={H - 4} textAnchor="end" fontSize="9" fill="rgb(var(--muted))">{t('article.growthX')}</text>
      </svg>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-[3px] rounded-full bg-accent" />{t('article.average')}</span>
        {worst && <span className="inline-flex items-center gap-1.5"><span className="w-3 border-t-2 border-dashed border-rose-500" />{t('article.worst')}</span>}
      </div>
    </figure>
  )
}
