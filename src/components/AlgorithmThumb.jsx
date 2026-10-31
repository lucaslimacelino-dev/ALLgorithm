// Miniaturas estáticas (SVG) para os cartões da Biblioteca. Cada categoria tem um estilo de desenho;
// o id do algoritmo alimenta um gerador pseudoaleatório, então cada cartão sai diferente, mas sempre igual.
const W = 160, H = 90
const ACCENT = 'rgb(var(--accent))', FAINT = 'rgb(var(--faint))', LINE = 'rgb(var(--line))', INK = 'rgb(var(--ink))'
const AMBER = '#f59e0b', ROSE = '#f43f5e'

function rng(text) {
  let s = 2166136261
  for (const ch of text) s = Math.imul(s ^ ch.charCodeAt(0), 16777619)
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 }
}
const range = n => Array.from({ length: n }, (_, i) => i)

function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = list => list.reduce((h, q) => { while (h.length > 1 && cross(h.at(-2), h.at(-1), q) <= 0) h.pop(); h.push(q); return h }, [])
  return [...half(p).slice(0, -1), ...half([...p].reverse()).slice(0, -1)]
}
const pointsAttr = pts => pts.map(p => p.join(',')).join(' ')
const GRID_SEARCH = ['bfs', 'dfs', 'best-first-search', 'a-star']
const TREES = ['binary-heap', 'trie', 'avl-tree', 'bst-search', 'union-find']

const draw = {
  ordenacao(r) {
    const n = 14, bw = (W - 20) / n, vals = range(n).map(() => 12 + r() * 64)
    const k = 3 + Math.floor(r() * 8), sorted = [...vals.slice(0, k)].sort((a, b) => a - b), hl = k + Math.floor(r() * (n - k - 1))
    return [...sorted, ...vals.slice(k)].map((v, i) => (
      <rect key={i} x={10 + i * bw + 1.5} y={H - 8 - v} width={bw - 3} height={v} rx="2" fill={i < k ? ACCENT : i === hl || i === hl + 1 ? AMBER : FAINT} fillOpacity={i < k || i === hl || i === hl + 1 ? 1 : 0.35} />
    ))
  },
  busca(r, id) {
    if (GRID_SEARCH.includes(id)) return draw.maze(r)
    if (TREES.includes(id)) return draw.tree(r)
    const n = 11, cw = (W - 20) / n, target = Math.floor(r() * n), lo = Math.max(0, target - 2 - Math.floor(r() * 3)), hi = Math.min(n - 1, target + 1 + Math.floor(r() * 3))
    return [
      <rect key="range" x={10 + lo * cw - 2} y={30} width={(hi - lo + 1) * cw + 4} height={32} rx="7" fill={ACCENT} fillOpacity="0.1" />,
      ...range(n).map(i => <rect key={i} x={10 + i * cw + 2} y={36} width={cw - 4} height={20} rx="4" fill={i === target ? AMBER : i >= lo && i <= hi ? ACCENT : FAINT} fillOpacity={i === target ? 1 : i >= lo && i <= hi ? 0.7 : 0.3} />),
      <path key="arrow" d={`M${10 + (target + 0.5) * cw} 22v8`} stroke={AMBER} strokeWidth="2" strokeLinecap="round" />,
    ]
  },
  maze(r) {
    const cols = 16, rows = 8, s = 9, ox = (W - cols * s) / 2, oy = (H - rows * s) / 2, mid = Math.floor(rows / 2)
    let y = mid
    const path = new Set(range(cols).map(x => { if (x > 1 && x < cols - 2 && r() < 0.35) y = Math.max(0, Math.min(rows - 1, y + (r() < 0.5 ? -1 : 1))); return `${x},${y}` }))
    return range(cols * rows).map(i => {
      const x = i % cols, yy = Math.floor(i / cols), on = path.has(`${x},${yy}`), wall = !on && r() < 0.28
      return <rect key={i} x={ox + x * s + 1} y={oy + yy * s + 1} width={s - 2} height={s - 2} rx="1.5" fill={on ? ACCENT : wall ? INK : FAINT} fillOpacity={on ? 1 : wall ? 0.7 : 0.18} />
    })
  },
  tree(r) {
    const levels = [[80], [45, 115], [25, 65, 95, 135]], ys = [18, 45, 72]
    const hl = Math.floor(r() * 4)
    const out = []
    levels.forEach((xs, d) => xs.forEach((x, i) => { if (d) out.push(<line key={`e${d}${i}`} x1={levels[d - 1][Math.floor(i / 2)]} y1={ys[d - 1]} x2={x} y2={ys[d]} stroke={FAINT} strokeOpacity="0.6" strokeWidth="1.5" />) }))
    levels.forEach((xs, d) => xs.forEach((x, i) => out.push(<circle key={`n${d}${i}`} cx={x} cy={ys[d]} r="8" fill={d === 2 && i === hl ? AMBER : d < 2 || i === hl ? ACCENT : 'rgb(var(--surface))'} stroke={ACCENT} strokeWidth="1.5" />)))
    return out
  },
  estruturas(r, id) {
    if (TREES.includes(id)) return draw.tree(r)
    const n = 4, bw = 26, gap = (W - 20 - n * bw) / (n - 1), hl = Math.floor(r() * n)
    return range(n).flatMap(i => {
      const x = 10 + i * (bw + gap)
      return [
        <rect key={`b${i}`} x={x} y={33} width={bw} height={24} rx="5" fill={i === hl ? AMBER : ACCENT} fillOpacity={i === hl ? 1 : 0.85} />,
        i < n - 1 && <path key={`a${i}`} d={`M${x + bw + 3} 45h${gap - 8}m-4 -4l4 4-4 4`} stroke={FAINT} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
      ]
    })
  },
  strings(r) {
    const letters = 'ABRACADABRA', n = letters.length, cw = (W - 20) / n, at = 1 + Math.floor(r() * (n - 4)), m = 3
    return range(n).flatMap(i => [
      <rect key={`t${i}`} x={10 + i * cw + 1} y={22} width={cw - 2} height={18} rx="3" fill={i >= at && i < at + m ? ACCENT : FAINT} fillOpacity={i >= at && i < at + m ? 0.9 : 0.2} />,
      <text key={`c${i}`} x={10 + (i + 0.5) * cw} y={35} textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill={i >= at && i < at + m ? 'white' : INK}>{letters[i]}</text>,
    ]).concat(range(m).flatMap(j => [
      <rect key={`p${j}`} x={10 + (at + j) * cw + 1} y={52} width={cw - 2} height={18} rx="3" fill={AMBER} />,
      <text key={`q${j}`} x={10 + (at + j + 0.5) * cw} y={65} textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill="white">{letters[at + j]}</text>,
    ]))
  },
  grafos(r) {
    const pts = range(8).map(i => [16 + (i % 4) * 42 + (r() - 0.5) * 18, (i < 4 ? 24 : 66) + (r() - 0.5) * 16])
    const edges = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7], [0, 5], [2, 7]].filter((_, i) => i < 10 || r() < 0.6)
    const tree = new Set(['0-4', '4-5', '5-6', '1-5', '2-6', '6-7', '3-7'].filter(() => r() < 0.8))
    return [
      ...edges.map(([a, b]) => <line key={`${a}-${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={tree.has(`${a}-${b}`) ? ACCENT : FAINT} strokeOpacity={tree.has(`${a}-${b}`) ? 1 : 0.45} strokeWidth={tree.has(`${a}-${b}`) ? 2.4 : 1.2} />),
      ...pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4.5} fill={i === 0 ? AMBER : ACCENT} />),
    ]
  },
  matematica(r) {
    const cols = 15, rows = 6, s = 9.5, ox = (W - cols * s) / 2, oy = (H - rows * s) / 2
    const prime = k => { if (k < 2) return false; for (let d = 2; d * d <= k; d++) if (k % d === 0) return false; return true }
    const shift = Math.floor(r() * 40)
    return range(cols * rows).map(i => {
      const k = i + 2 + shift, p = prime(k)
      return <rect key={i} x={ox + (i % cols) * s + 1} y={oy + Math.floor(i / cols) * s + 1} width={s - 2} height={s - 2} rx="1.5" fill={p ? ACCENT : FAINT} fillOpacity={p ? 1 : 0.2} />
    })
  },
  numericos(r) {
    const a = 0.6 + r() * 0.8, b = r() * 6, f = x => 45 + 26 * Math.sin(x / 22 * a + b) * Math.cos(x / 40)
    const x0 = 50 + r() * 60, d = (f(x0 + 0.5) - f(x0 - 0.5))
    const curve = range(71).map(i => [10 + i * 2, f(10 + i * 2)])
    return [
      <line key="axis" x1="10" x2="150" y1="80" y2="80" stroke={LINE} />,
      <polyline key="c" points={pointsAttr(curve)} fill="none" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />,
      <line key="t" x1={x0 - 40} y1={f(x0) - 40 * d} x2={x0 + 40} y2={f(x0) + 40 * d} stroke={AMBER} strokeWidth="1.6" />,
      <circle key="p" cx={x0} cy={f(x0)} r="4" fill={AMBER} />,
    ]
  },
  compressao(r) {
    let x = 10
    const runs = []
    while (x < 140) { const w = 8 + Math.floor(r() * 26); runs.push([x, Math.min(w, 150 - x), Math.floor(r() * 3)]); x += w }
    const colors = [ACCENT, AMBER, ROSE]
    let cx = 10
    return [
      ...runs.map(([rx, w, c], i) => <rect key={`r${i}`} x={rx + 0.5} y={20} width={w - 1} height={18} rx="3" fill={colors[c]} fillOpacity="0.85" />),
      <path key="arrow" d="M80 44v10m-4-4l4 4 4-4" stroke={FAINT} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
      ...runs.map(([, , c], i) => { const w = 9; const out = <rect key={`s${i}`} x={cx} y={60} width={w - 1.5} height={14} rx="2.5" fill={colors[c]} />; cx += w; return out }),
    ]
  },
  geometria(r) {
    const pts = range(14).map(() => [16 + r() * 128, 12 + r() * 66])
    const h = hull(pts), onHull = new Set(h.map(p => p.join()))
    return [
      <polygon key="h" points={pointsAttr(h)} fill={ACCENT} fillOpacity="0.1" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" />,
      ...pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={onHull.has(p.join()) ? 3.6 : 2.6} fill={onHull.has(p.join()) ? ACCENT : INK} fillOpacity={onHull.has(p.join()) ? 1 : 0.4} />),
    ]
  },
  criptografia(r) {
    const s = 15, ox = 22, oy = (H - 4 * s) / 2
    const state = range(16).map(() => r())
    return [
      ...state.map((v, i) => <rect key={`a${i}`} x={ox + (i % 4) * s + 1} y={oy + Math.floor(i / 4) * s + 1} width={s - 2} height={s - 2} rx="2.5" fill={ACCENT} fillOpacity={0.15 + v * 0.75} />),
      <path key="arrow" d="M92 45h12m-4-4l4 4-4 4" stroke={FAINT} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
      ...state.map((_, i) => <rect key={`b${i}`} x={ox + 92 + (i % 4) * 8 + 0.5} y={oy + 8 + Math.floor(i / 4) * 8 + 0.5} width="7" height="7" rx="1.5" fill={r() < 0.5 ? AMBER : ROSE} fillOpacity={0.4 + r() * 0.6} />),
    ]
  },
  'programacao-dinamica'(r) {
    const cols = 10, rows = 6, s = 11, ox = (W - cols * s) / 2, oy = (H - rows * s) / 2
    let x = 0, y = 0
    const path = new Set(['0,0'])
    while (x < cols - 1 || y < rows - 1) { if (y >= rows - 1 || (x < cols - 1 && r() < 0.62)) x++; else y++; path.add(`${x},${y}`) }
    return range(cols * rows).map(i => {
      const cx = i % cols, cy = Math.floor(i / cols), on = path.has(`${cx},${cy}`)
      return <rect key={i} x={ox + cx * s + 1} y={oy + cy * s + 1} width={s - 2} height={s - 2} rx="2" fill={on ? AMBER : ACCENT} fillOpacity={on ? 1 : 0.1 + ((cx + cy) / (cols + rows)) * 0.55} />
    })
  },
  otimizacao(r) {
    const cx = 60 + r() * 40, cy = 40 + r() * 10
    const rings = range(5).map(k => <ellipse key={k} cx={cx} cy={cy} rx={14 + k * 15} ry={8 + k * 8} fill="none" stroke={ACCENT} strokeOpacity={0.15 + (4 - k) * 0.12} strokeWidth="1.3" />)
    let px = r() < 0.5 ? 14 : 146, py = 12 + r() * 66
    const path = [[px, py]]
    for (let i = 0; i < 6; i++) { px += (cx - px) * 0.45 + (r() - 0.5) * 10; py += (cy - py) * 0.45 + (r() - 0.5) * 8; path.push([px, py]) }
    return [...rings, <polyline key="p" points={pointsAttr(path)} fill="none" stroke={AMBER} strokeWidth="2" strokeLinejoin="round" />, ...path.map((p, i) => <circle key={`d${i}`} cx={p[0]} cy={p[1]} r={i === path.length - 1 ? 4 : 2.4} fill={AMBER} />)]
  },
  sinais(r) {
    const f1 = 1 + Math.floor(r() * 3), f2 = 4 + Math.floor(r() * 5), ph = r() * 6
    const wave = range(141).map(i => [10 + i, 30 + 13 * Math.sin((i / 140) * Math.PI * 2 * f1 + ph) + 6 * Math.sin((i / 140) * Math.PI * 2 * f2)])
    return [
      <polyline key="w" points={pointsAttr(wave)} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" />,
      ...range(16).map(k => { const h = k === f1 ? 22 : k === f2 ? 12 : 2 + r() * 3; return <rect key={k} x={14 + k * 8.4} y={82 - h} width="5" height={h} rx="1.5" fill={k === f1 || k === f2 ? AMBER : FAINT} fillOpacity={k === f1 || k === f2 ? 1 : 0.4} /> }),
    ]
  },
  distribuidos(r) {
    const ys = [20, 45, 70], msgs = range(4).map(i => { const a = Math.floor(r() * 3); let b = Math.floor(r() * 3); if (b === a) b = (a + 1) % 3; const x = 22 + i * 30 + r() * 10; return [x, ys[a], x + 18 + r() * 10, ys[b]] })
    return [
      ...ys.map(y => <line key={y} x1="12" x2="148" y1={y} y2={y} stroke={FAINT} strokeOpacity="0.6" strokeWidth="1.5" />),
      ...msgs.flatMap(([x1, y1, x2, y2], i) => [
        <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeWidth="1.6" />,
        <circle key={`s${i}`} cx={x1} cy={y1} r="3.5" fill={ACCENT} />,
        <circle key={`r${i}`} cx={x2} cy={y2} r="3.5" fill={AMBER} />,
      ]),
    ]
  },
  linguagens(r) {
    return draw.tree(r).concat(<text key="t" x="80" y="88" textAnchor="middle" fontSize="8" fontFamily="Geist Mono, monospace" fill={FAINT}>{'2 * (3 + 4)'}</text>)
  },
  bits(r) {
    const bits = range(8).map(() => r() < 0.5), s = 15, ox = (W - 9 * s - 6) / 2
    const parity = bits.filter(Boolean).length % 2
    return [
      ...bits.map((b, i) => <rect key={i} x={ox + i * s + 1} y={36} width={s - 2} height={18} rx="3" fill={b ? ACCENT : 'rgb(var(--surface))'} stroke={ACCENT} strokeWidth="1.3" />),
      ...bits.map((b, i) => <text key={`t${i}`} x={ox + (i + 0.5) * s} y={49} textAnchor="middle" fontSize="9" fontFamily="Geist Mono, monospace" fill={b ? 'white' : ACCENT}>{b ? 1 : 0}</text>),
      <rect key="p" x={ox + 8 * s + 7} y={36} width={s - 2} height={18} rx="3" fill={AMBER} />,
      <text key="pt" x={ox + 8.5 * s + 6} y={49} textAnchor="middle" fontSize="9" fontFamily="Geist Mono, monospace" fill="white">{parity}</text>,
    ]
  },
  quanticos(r) {
    const n = 16, bw = (W - 20) / n, m = Math.floor(r() * n)
    return [
      <line key="mid" x1="10" x2="150" y1="62" y2="62" stroke={LINE} />,
      ...range(n).map(i => { const h = i === m ? 48 : 6 + r() * 4; return <rect key={i} x={10 + i * bw + 1.5} y={62 - h} width={bw - 3} height={h} rx="2" fill={i === m ? AMBER : ACCENT} fillOpacity={i === m ? 1 : 0.6} /> }),
    ]
  },
  algebra(r) {
    // Escada de monômios (como os termos líderes de uma base de Gröbner)
    const s = 10, cols = 12, rows = 6, ox = (W - cols * s) / 2, oy = (H - rows * s) / 2
    const stairs = range(cols).map(x => Math.max(0, rows - 1 - Math.floor(x * (0.3 + r() * 0.2))))
    return range(cols * rows).map(i => {
      const x = i % cols, y = Math.floor(i / cols), inside = rows - 1 - y < stairs[x]
      return <circle key={i} cx={ox + (x + 0.5) * s} cy={oy + (y + 0.5) * s} r="3" fill={inside ? ACCENT : FAINT} fillOpacity={inside ? 0.9 : 0.25} />
    })
  },
}

export default function AlgorithmThumb({ algorithm, className = '' }) {
  const r = rng(algorithm.id)
  const parts = (draw[algorithm.category] ?? draw.grafos)(r, algorithm.id)
  return <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">{parts}</svg>
}
