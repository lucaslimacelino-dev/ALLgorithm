// Cenas animadas da página inicial (vitrine do topo e galeria), desenhadas em <canvas>.
// Cada cena: init(w, h, rnd) → estado; tick(estado) → true quando termina; draw(ctx, estado, w, h, C).
// Opcionais: speed (ticks por quadro), every (quadros por tick), hold (quadros parados no fim),
// incremental (não limpa o canvas entre quadros). O id é o do artigo correspondente.

export const AMBER = [245, 158, 11], ROSE = [244, 63, 94]
export const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
// Paredes/obstáculos: escuras no tema claro, cinza discreto no escuro (onde a tinta é quase branca).
const wallColor = C => (C.surface[0] < 128 ? rgba(C.faint, 0.45) : rgba(C.ink, 0.8))

export function rng(seed) {
  let s = seed >>> 0 || 1
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 }
}

const TAU = Math.PI * 2
const MONO = 'Geist Mono, ui-monospace, monospace'

function dot(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill()
}
function polyline(ctx, pts, stroke, width = 1, close = false) {
  if (pts.length < 2) return
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (close) ctx.closePath()
  ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke()
}
function box(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill() } else ctx.fillRect(x, y, w, h)
}
// Grade centralizada com células quadradas de lado ≈ size.
function grid(w, h, size) {
  const s = Math.max(4, Math.floor(size)), cols = Math.floor(w / s), rows = Math.floor(h / s)
  return { s, cols, rows, ox: (w - cols * s) / 2, oy: (h - rows * s) / 2 }
}
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// ── A* num labirinto ───────────────────────────────────────
const aStar = {
  id: 'a-star', every: 2, hold: 110,
  caption: { pt: 'O A* procura o caminho mais curto no labirinto, guiado pela distância até o destino.', en: 'A* searches the maze for the shortest path, guided by the distance to the goal.' },
  init(w, h, rnd) {
    const g = grid(w, h, Math.min(w / 30, h / 13))
    const n = g.cols * g.rows, mid = Math.floor(g.rows / 2)
    const start = mid * g.cols + 1, goal = mid * g.cols + g.cols - 2
    let wall
    for (let tries = 0; ; tries++) {
      wall = new Uint8Array(n).map(() => (rnd() < 0.3 ? 1 : 0))
      wall[start] = wall[goal] = 0
      if (tries > 40) { wall.fill(0); break }
      const seen = new Uint8Array(n), queue = [start]
      seen[start] = 1
      while (queue.length) {
        const c = queue.pop(), x = c % g.cols, y = (c - x) / g.cols
        for (const [dx, dy] of N4) {
          const nx = x + dx, ny = y + dy, k = ny * g.cols + nx
          if (nx >= 0 && ny >= 0 && nx < g.cols && ny < g.rows && !wall[k] && !seen[k]) { seen[k] = 1; queue.push(k) }
        }
      }
      if (seen[goal]) break
    }
    const cost = new Float64Array(n).fill(Infinity)
    cost[start] = 0
    const inOpen = new Uint8Array(n)
    inOpen[start] = 1
    return { ...g, wall, start, goal, cost, from: new Int32Array(n).fill(-1), closed: new Uint8Array(n), inOpen, open: [start], path: null, shown: 0 }
  },
  tick(st) {
    if (st.path) return ++st.shown >= st.path.length
    if (!st.open.length) return true
    const { cols } = st, gx = st.goal % cols, gy = (st.goal - gx) / cols
    const heur = c => { const x = c % cols; return Math.abs(x - gx) + Math.abs((c - x) / cols - gy) }
    let bi = 0
    for (let k = 1; k < st.open.length; k++) {
      const a = st.open[k], b = st.open[bi], fa = st.cost[a] + heur(a), fb = st.cost[b] + heur(b)
      if (fa < fb || (fa === fb && heur(a) < heur(b))) bi = k
    }
    const cur = st.open[bi]
    st.open.splice(bi, 1); st.inOpen[cur] = 0; st.closed[cur] = 1
    if (cur === st.goal) {
      const path = []
      for (let c = cur; c !== -1; c = st.from[c]) path.push(c)
      st.path = path.reverse()
      return false
    }
    const x = cur % cols, y = (cur - x) / cols
    for (const [dx, dy] of N4) {
      const nx = x + dx, ny = y + dy, k = ny * cols + nx
      if (nx < 0 || ny < 0 || nx >= cols || ny >= st.rows || st.wall[k] || st.closed[k]) continue
      if (st.cost[cur] + 1 < st.cost[k]) {
        st.cost[k] = st.cost[cur] + 1; st.from[k] = cur
        if (!st.inOpen[k]) { st.inOpen[k] = 1; st.open.push(k) }
      }
    }
    return false
  },
  draw(ctx, st, w, h, C) {
    const { s, cols, ox, oy } = st, pad = Math.max(1, s * 0.08)
    const onPath = new Uint8Array(st.wall.length)
    if (st.path) for (let k = 0; k < st.shown; k++) onPath[st.path[k]] = 1
    for (let i = 0; i < st.wall.length; i++) {
      const x = i % cols, y = (i - x) / cols
      const fill = st.wall[i] ? wallColor(C) : onPath[i] ? rgba(C.accent) : st.inOpen[i] ? rgba(AMBER, 0.6) : st.closed[i] ? rgba(C.accent, 0.17) : rgba(C.line, 0.55)
      box(ctx, ox + x * s + pad, oy + y * s + pad, s - 2 * pad, s - 2 * pad, s * 0.18, fill)
    }
    const center = c => { const x = c % cols; return [ox + (x + 0.5) * s, oy + ((c - x) / cols + 0.5) * s] }
    dot(ctx, ...center(st.start), s * 0.3, rgba(C.surface))
    dot(ctx, ...center(st.goal), s * 0.32, rgba(AMBER))
  },
}

// ── Curva de Bézier (De Casteljau) ─────────────────────────
function casteljau(pts, t) {
  const out = [pts]
  while (out.at(-1).length > 1) {
    const prev = out.at(-1)
    out.push(prev.slice(1).map((p, i) => [prev[i][0] + (p[0] - prev[i][0]) * t, prev[i][1] + (p[1] - prev[i][1]) * t]))
  }
  return out
}
const bezier = {
  id: 'de-casteljau', hold: 110,
  caption: { pt: 'De Casteljau desenha uma curva de Bézier interpolando os pontos de controle, nível por nível.', en: 'De Casteljau draws a Bézier curve by interpolating the control points, level by level.' },
  init(w, h, rnd) {
    const n = 5
    const pts = Array.from({ length: n }, (_, i) => [w * (0.08 + (0.84 * i) / (n - 1)) + (rnd() - 0.5) * w * 0.1, h * (0.12 + 0.76 * rnd())])
    return { pts, t: 0, trace: [pts[0]] }
  },
  tick(st) {
    st.t = Math.min(1, st.t + 0.005)
    st.trace.push(casteljau(st.pts, st.t).at(-1)[0])
    return st.t >= 1
  },
  draw(ctx, st, w, h, C) {
    const levels = casteljau(st.pts, st.t), colors = [C.faint, C.accent, AMBER, ROSE]
    levels.slice(0, -1).forEach((lv, k) => {
      const c = colors[k % colors.length]
      polyline(ctx, lv, rgba(c, k ? 0.6 : 0.9), k ? 1.3 : 1.5)
      for (const p of lv) dot(ctx, p[0], p[1], k ? 2.6 : 4.5, rgba(c, k ? 0.9 : 1))
    })
    polyline(ctx, st.trace, rgba(C.accent), 3.2)
    const p = levels.at(-1)[0]
    dot(ctx, p[0], p[1], 6, rgba(AMBER))
  },
}

// ── Série de Fourier (epiciclos) ───────────────────────────
const SHAPES = [
  u => [16 * Math.sin(u) ** 3, -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u))],
  u => [Math.sin(u) + 2 * Math.sin(2 * u), Math.cos(u) - 2 * Math.cos(2 * u)],
  u => { const r = 1 + 0.38 * Math.cos(5 * u); return [r * Math.sin(u), -r * Math.cos(u)] },
  u => { const d = 1 + Math.sin(u) ** 2; return [Math.cos(u) / d, (Math.sin(u) * Math.cos(u)) / d] },
]
const fourier = {
  id: 'dft', hold: 110,
  caption: { pt: 'A transformada de Fourier decompõe o desenho em círculos girando — somados, eles o redesenham.', en: 'The Fourier transform breaks the drawing into spinning circles — added up, they redraw it.' },
  init(w, h, rnd) {
    const shape = SHAPES[Math.floor(rnd() * SHAPES.length)], N = 240, K = 24
    let pts = Array.from({ length: N }, (_, k) => shape((TAU * k) / N))
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys)
    const scale = Math.min((w * 0.62) / bw, (h * 0.8) / bh)
    const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2
    pts = pts.map(([x, y]) => [(x - mx) * scale, (y - my) * scale])
    const terms = []
    for (let f = -K; f <= K; f++) {
      let re = 0, im = 0
      pts.forEach(([x, y], k) => { const a = (-TAU * f * k) / N; re += x * Math.cos(a) - y * Math.sin(a); im += x * Math.sin(a) + y * Math.cos(a) })
      terms.push({ f, r: Math.hypot(re, im) / N, phase: Math.atan2(im, re) })
    }
    terms.sort((a, b) => b.r - a.r)
    return { terms, cx: w / 2, cy: h / 2, tau: 0, trace: [] }
  },
  chain(st) {
    let x = st.cx, y = st.cy
    const out = [[x, y, 0]]
    for (const { f, r, phase } of st.terms) {
      const a = TAU * f * st.tau + phase
      x += r * Math.cos(a); y += r * Math.sin(a)
      out.push([x, y, r])
    }
    return out
  },
  tick(st) {
    st.tau = Math.min(1, st.tau + 1 / 420)
    st.trace.push(this.chain(st).at(-1))
    return st.tau >= 1
  },
  draw(ctx, st, w, h, C) {
    const ch = this.chain(st)
    ctx.lineWidth = 1
    for (let i = 1; i < ch.length; i++) {
      if (ch[i][2] < 0.6) continue
      ctx.beginPath(); ctx.arc(ch[i - 1][0], ch[i - 1][1], ch[i][2], 0, TAU); ctx.strokeStyle = rgba(C.muted, 0.18); ctx.stroke()
    }
    polyline(ctx, ch, rgba(C.muted, 0.55), 1)
    polyline(ctx, st.trace, rgba(C.accent), 3)
    const p = ch.at(-1)
    dot(ctx, p[0], p[1], 5, rgba(AMBER))
  },
}

// ── Grover ─────────────────────────────────────────────────
const grover = {
  id: 'grover', hold: 120,
  caption: { pt: 'Grover inverte a fase do item certo e reflete tudo em torno da média: a resposta cresce a cada volta.', en: 'Grover flips the phase of the right item and reflects everything about the mean: the answer grows each round.' },
  init(w, h, rnd) {
    const N = 32, m = Math.floor(rnd() * N), k = Math.floor((Math.PI / 4) * Math.sqrt(N))
    let a = Array(N).fill(1 / Math.sqrt(N))
    const states = [a]
    for (let it = 0; it < k; it++) {
      a = a.map((v, x) => (x === m ? -v : v)); states.push(a)
      const mean = a.reduce((s, v) => s + v, 0) / N
      a = a.map(v => 2 * mean - v); states.push(a)
    }
    return { N, m, states, i: 0, f: 0, wait: 0, max: Math.max(...states.flat().map(Math.abs)) }
  },
  tick(st) {
    if (st.wait < 28) { st.wait++; return false }
    st.f += 1 / 36
    if (st.f >= 1) { st.f = 0; st.wait = 0; st.i++ }
    return st.i >= st.states.length - 1
  },
  draw(ctx, st, w, h, C) {
    const A = st.states[st.i], B = st.states[Math.min(st.i + 1, st.states.length - 1)]
    const e = st.f < 0.5 ? 2 * st.f * st.f : 1 - (-2 * st.f + 2) ** 2 / 2
    const amps = A.map((v, x) => v + (B[x] - v) * e)
    const pad = 12, mid = h * 0.54, scale = (h * 0.42) / st.max, bw = (w - 2 * pad) / st.N
    ctx.fillStyle = rgba(C.line); ctx.fillRect(pad, mid, w - 2 * pad, 1)
    amps.forEach((v, x) => {
      const hh = Math.max(1, Math.abs(v) * scale)
      box(ctx, pad + x * bw + bw * 0.15, v >= 0 ? mid - hh : mid, bw * 0.7, hh, 2, x === st.m ? rgba(AMBER) : v < 0 ? rgba(ROSE) : rgba(C.accent, 0.85))
    })
    const mean = amps.reduce((s, v) => s + v, 0) / st.N
    ctx.setLineDash([5, 4]); polyline(ctx, [[pad, mid - mean * scale], [w - pad, mid - mean * scale]], rgba(C.ink, 0.5), 1); ctx.setLineDash([])
    ctx.font = `12px ${MONO}`; ctx.fillStyle = rgba(C.muted)
    ctx.fillText(`P(|${st.m.toString(2).padStart(5, '0')}⟩) = ${(amps[st.m] ** 2 * 100).toFixed(1)}%`, pad, 18)
  },
}

// ── Merge sort ─────────────────────────────────────────────
const mergeSort = {
  id: 'merge-sort', hold: 90,
  caption: { pt: 'O merge sort ordena intercalando metades já ordenadas: blocos de 1, 2, 4, 8… até o vetor inteiro.', en: 'Merge sort works by merging already sorted halves: blocks of 1, 2, 4, 8… up to the whole array.' },
  init(w, h, rnd) {
    const n = Math.max(24, Math.min(56, Math.floor(w / 10)))
    const arr = Array.from({ length: n }, () => 6 + Math.floor(rnd() * 94))
    const a = [...arr], writes = []
    for (let width = 1; width < n; width *= 2) {
      for (let lo = 0; lo < n; lo += 2 * width) {
        const mid = Math.min(lo + width, n), hi = Math.min(lo + 2 * width, n), tmp = []
        let i = lo, j = mid
        while (i < mid || j < hi) tmp.push(j >= hi || (i < mid && a[i] <= a[j]) ? a[i++] : a[j++])
        tmp.forEach((v, k) => { a[lo + k] = v; writes.push([lo + k, v, lo, hi]) })
      }
    }
    return { arr, writes, p: 0, active: -1, range: null, sweep: 0 }
  },
  tick(st) {
    if (st.p < st.writes.length) {
      const [k, v, lo, hi] = st.writes[st.p++]
      st.arr[k] = v; st.active = k; st.range = [lo, hi]
      return false
    }
    st.active = -1; st.range = null
    return ++st.sweep >= st.arr.length
  },
  draw(ctx, st, w, h, C) {
    const n = st.arr.length, pad = 10, bw = (w - 2 * pad) / n
    if (st.range) box(ctx, pad + st.range[0] * bw, 4, (st.range[1] - st.range[0]) * bw, h - 8, 6, rgba(C.accent, 0.06))
    st.arr.forEach((v, i) => {
      const hh = (v / 100) * (h - 20)
      const fill = i === st.active ? rgba(AMBER) : i < st.sweep ? rgba(C.accent) : rgba(C.accent, 0.22 + 0.55 * (v / 100))
      box(ctx, pad + i * bw + bw * 0.12, h - 6 - hh, bw * 0.76, hh, Math.min(3, bw * 0.2), fill)
    })
  },
}

// ── Crivo de Eratóstenes ───────────────────────────────────
const sieve = {
  id: 'sieve-of-eratosthenes', speed: 2, hold: 120,
  caption: { pt: 'Cada primo risca seus múltiplos; o que sobra são os primos.', en: 'Each prime crosses out its multiples; what remains are the primes.' },
  init(w, h) {
    const g = grid(w, h, Math.max(18, w / 15)), N = g.cols * g.rows + 1
    return { ...g, N, comp: new Uint8Array(N + 1), hit: new Float32Array(N + 1).fill(-99), p: 2, m: 4, t: 0, final: false }
  },
  tick(st) {
    st.t++
    if (st.m <= st.N) { st.comp[st.m] = 1; st.hit[st.m] = st.t; st.m += st.p; return false }
    do st.p++; while (st.comp[st.p])
    if (st.p * st.p > st.N) { st.final = true; return true }
    st.m = st.p * st.p
    return false
  },
  draw(ctx, st, w, h, C) {
    const { s, cols, ox, oy } = st, pad = 1.5
    ctx.font = `${Math.round(s * 0.42)}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    for (let k = 2; k <= st.N; k++) {
      const i = k - 2, x = i % cols, y = (i - x) / cols, px = ox + x * s, py = oy + y * s
      const age = st.t - st.hit[k]
      const prime = !st.comp[k] && (k < st.p || st.final)
      const fill = k === st.p && !st.final ? rgba(AMBER) : st.comp[k] ? (age < 14 ? rgba(ROSE, 0.7 * (1 - age / 14) + 0.15) : rgba(C.line, 0.7)) : prime ? rgba(C.accent) : rgba(C.ink, 0.06)
      box(ctx, px + pad, py + pad, s - 2 * pad, s - 2 * pad, 4, fill)
      ctx.fillStyle = prime || (k === st.p && !st.final) ? 'rgba(255,255,255,0.95)' : rgba(C.muted, st.comp[k] ? 0.45 : 0.9)
      ctx.fillText(String(k), px + s / 2, py + s / 2 + 0.5)
    }
  },
}

// ── Envoltório convexo (embrulho de presente / Jarvis) ─────
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
const giftWrapping = {
  id: 'gift-wrapping', hold: 110,
  caption: { pt: 'O embrulho de presente gira em torno dos pontos como um barbante até fechar o envoltório convexo.', en: 'Gift wrapping swings around the points like a string until the convex hull closes.' },
  init(w, h, rnd) {
    const pts = Array.from({ length: 26 }, () => [w * (0.08 + 0.84 * rnd()), h * (0.12 + 0.76 * rnd())])
    const start = pts.reduce((b, p, i) => (p[0] < pts[b][0] ? i : b), 0)
    return { pts, hull: [start], cur: start, best: start === 0 ? 1 : 0, j: 0, closed: false }
  },
  tick(st) {
    const { pts } = st
    if (st.j < pts.length) {
      const j = st.j++
      if (j === st.cur) return false
      const c = cross(pts[st.cur], pts[st.best], pts[j])
      const far = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
      if (c < 0 || (c === 0 && far(pts[j], pts[st.cur]) > far(pts[st.best], pts[st.cur]))) st.best = j
      return false
    }
    if (st.best === st.hull[0]) { st.closed = true; return true }
    st.hull.push(st.best); st.cur = st.best; st.best = st.hull[0]; st.j = 0
    return false
  },
  draw(ctx, st, w, h, C) {
    const P = st.hull.map(i => st.pts[i]), onHull = new Set(st.hull)
    if (st.closed) {
      ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath()
      ctx.fillStyle = rgba(C.accent, 0.08); ctx.fill()
    }
    polyline(ctx, P, rgba(C.accent), 2.5, st.closed)
    if (!st.closed) {
      const cur = st.pts[st.cur]
      if (st.j < st.pts.length) polyline(ctx, [cur, st.pts[st.j]], rgba(C.muted, 0.5), 1)
      polyline(ctx, [cur, st.pts[st.best]], rgba(AMBER), 2)
    }
    st.pts.forEach(([x, y], i) => dot(ctx, x, y, onHull.has(i) ? 4.5 : 3.2, onHull.has(i) ? rgba(C.accent) : rgba(C.ink, 0.45)))
    if (!st.closed) dot(ctx, ...st.pts[st.cur], 5.5, rgba(AMBER))
  },
}

// ── Preenchimento (flood fill) em cavernas ─────────────────
const floodFill = {
  id: 'flood-fill', every: 2, hold: 110,
  caption: { pt: 'O flood fill espalha a cor célula a célula, como tinta, até encontrar as paredes.', en: 'Flood fill spreads color cell by cell, like paint, until it hits the walls.' },
  init(w, h, rnd) {
    const g = grid(w, h, Math.max(8, w / 42)), n = g.cols * g.rows
    let wall = new Uint8Array(n).map(() => (rnd() < 0.43 ? 1 : 0))
    for (let pass = 0; pass < 4; pass++) {
      const next = new Uint8Array(n)
      for (let i = 0; i < n; i++) {
        const x = i % g.cols, y = (i - x) / g.cols
        let c = 0
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const nx = x + dx, ny = y + dy
          c += nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows ? 1 : wall[ny * g.cols + nx]
        }
        next[i] = c >= 5 || (c >= 4 && wall[i]) ? 1 : 0
      }
      wall = next
    }
    const cx = g.cols / 2, cy = g.rows / 2
    let start = -1, bestD = Infinity
    for (let i = 0; i < n; i++) {
      if (wall[i]) continue
      const x = i % g.cols, d = (x - cx) ** 2 + ((i - x) / g.cols - cy) ** 2
      if (d < bestD) { bestD = d; start = i }
    }
    if (start < 0) { wall.fill(0); start = Math.floor(cy) * g.cols + Math.floor(cx) }
    const dist = new Int16Array(n).fill(-1)
    dist[start] = 0
    return { ...g, wall, dist, frontier: [start], level: 0 }
  },
  tick(st) {
    const next = []
    for (const c of st.frontier) {
      const x = c % st.cols, y = (c - x) / st.cols
      for (const [dx, dy] of N4) {
        const nx = x + dx, ny = y + dy, k = ny * st.cols + nx
        if (nx >= 0 && ny >= 0 && nx < st.cols && ny < st.rows && !st.wall[k] && st.dist[k] < 0) { st.dist[k] = st.level + 1; next.push(k) }
      }
    }
    st.level++; st.frontier = next
    return !next.length
  },
  draw(ctx, st, w, h, C) {
    const { s, cols, ox, oy } = st
    for (let i = 0; i < st.wall.length; i++) {
      const x = i % cols, y = (i - x) / cols, d = st.dist[i]
      const fill = st.wall[i] ? wallColor(C) : d < 0 ? rgba(C.line, 0.5) : d === st.level ? rgba(AMBER) : rgba(C.accent, 0.3 + 0.5 * (0.5 + 0.5 * Math.cos(d / 2.6)))
      ctx.fillStyle = fill
      ctx.fillRect(ox + x * s + 0.5, oy + y * s + 0.5, s - 1, s - 1)
    }
  },
}

// ── Coral de Collatz ───────────────────────────────────────
const collatz = {
  id: 'halting-problem', speed: 4, hold: 140, incremental: true,
  caption: { pt: 'Cada número segue a regra 3n + 1 até chegar a 1; virando o caminho a cada passo, surge um coral.', en: 'Each number follows the 3n + 1 rule down to 1; turning at every step, a coral appears.' },
  init(w, h, rnd) {
    const M = 600, turnEven = 0.14 + rnd() * 0.03, turnOdd = -0.29
    const raw = []
    for (let n = 2; n <= M; n++) {
      const seq = [n]
      for (let v = n; v !== 1 && seq.length < 400;) { v = v % 2 ? 3 * v + 1 : v / 2; seq.push(v) }
      seq.reverse()
      let x = 0, y = 0, ang = -Math.PI / 2
      const pts = [[0, 0]]
      for (let i = 1; i < seq.length; i++) {
        ang += seq[i] % 2 ? turnOdd : turnEven
        x += Math.cos(ang); y += Math.sin(ang)
        pts.push([x, y])
      }
      raw.push(pts)
    }
    // Gira o desenho para que o eixo principal (PCA) fique na horizontal e ocupe o cartão.
    let all = raw.flat()
    const mx = all.reduce((s, p) => s + p[0], 0) / all.length, my = all.reduce((s, p) => s + p[1], 0) / all.length
    let sxx = 0, syy = 0, sxy = 0
    for (const [x, y] of all) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my) }
    const th = -0.5 * Math.atan2(2 * sxy, sxx - syy), cos = Math.cos(th), sin = Math.sin(th)
    for (const path of raw) for (const p of path) { const [x, y] = p; p[0] = x * cos - y * sin; p[1] = x * sin + y * cos }
    all = raw.flat()
    const xs = all.map(p => p[0]), ys = all.map(p => p[1])
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys)
    const sc = Math.min((w * 0.9) / (maxX - minX), (h * 0.9) / (maxY - minY))
    const offX = (w - (maxX - minX) * sc) / 2 - minX * sc, offY = (h - (maxY - minY) * sc) / 2 - minY * sc
    const paths = raw.map(p => p.map(([x, y]) => [x * sc + offX, y * sc + offY]))
    paths.sort(() => rnd() - 0.5)
    return { paths, k: 0, drawn: 0 }
  },
  tick(st) { st.k = Math.min(st.paths.length, st.k + 1); return st.k >= st.paths.length },
  draw(ctx, st, w, h, C) {
    if (!st.drawn) ctx.clearRect(0, 0, w, h)
    for (; st.drawn < st.k; st.drawn++) {
      const f = st.drawn / st.paths.length
      const col = C.accent.map((c, i) => Math.round(c + (ROSE[i] - c) * f * 0.7))
      polyline(ctx, st.paths[st.drawn], rgba(col, 0.3), 1.1)
    }
  },
}

// ── Dijkstra ───────────────────────────────────────────────
const dijkstra = {
  id: 'dijkstra', every: 7, hold: 110,
  caption: { pt: 'Dijkstra fixa sempre o vértice mais próximo ainda pendente, e a árvore de menores caminhos cresce.', en: 'Dijkstra always settles the closest pending vertex, and the shortest-path tree grows.' },
  init(w, h, rnd) {
    const pts = [], minD = Math.min(w, h) * 0.13
    for (let tries = 0; pts.length < 30 && tries < 3000; tries++) {
      const p = [w * (0.06 + 0.88 * rnd()), h * (0.1 + 0.8 * rnd())]
      if (pts.every(q => Math.hypot(p[0] - q[0], p[1] - q[1]) > minD)) pts.push(p)
    }
    const n = pts.length, adj = pts.map(() => new Map())
    pts.forEach((p, i) => {
      pts.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3)
        .forEach(([j, d]) => { adj[i].set(j, d); adj[j].set(i, d) })
    })
    const src = pts.reduce((b, p, i) => (p[0] < pts[b][0] ? i : b), 0)
    const dist = new Float64Array(n).fill(Infinity)
    dist[src] = 0
    return { pts, adj, src, dist, parent: new Int32Array(n).fill(-1), settled: new Uint8Array(n), last: -1 }
  },
  tick(st) {
    let u = -1
    st.dist.forEach((d, i) => { if (!st.settled[i] && d < Infinity && (u < 0 || d < st.dist[u])) u = i })
    if (u < 0) return true
    st.settled[u] = 1; st.last = u
    for (const [v, d] of st.adj[u]) if (st.dist[u] + d < st.dist[v]) { st.dist[v] = st.dist[u] + d; st.parent[v] = u }
    return false
  },
  draw(ctx, st, w, h, C) {
    const { pts } = st
    st.adj.forEach((m, i) => { for (const j of m.keys()) if (i < j) polyline(ctx, [pts[i], pts[j]], rgba(C.muted, 0.22), 1) })
    st.parent.forEach((p, v) => { if (p >= 0) polyline(ctx, [pts[p], pts[v]], st.settled[v] ? rgba(C.accent) : rgba(AMBER, 0.7), st.settled[v] ? 2.6 : 1.5) })
    pts.forEach(([x, y], i) => {
      if (st.settled[i]) dot(ctx, x, y, i === st.last ? 7 : 5, i === st.last ? rgba(AMBER) : rgba(C.accent))
      else if (st.dist[i] < Infinity) { dot(ctx, x, y, 5.5, rgba(AMBER)); dot(ctx, x, y, 3.5, rgba(C.surface)) }
      else dot(ctx, x, y, 3.5, rgba(C.ink, 0.35))
    })
    dot(ctx, ...pts[st.src], 3, rgba(C.surface))
  },
}

// ── Bresenham + círculo do ponto médio ─────────────────────
function bresenham(x0, y0, x1, y1) {
  const out = [], dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  for (;;) {
    out.push([x0, y0])
    if (x0 === x1 && y0 === y1) return out
    const e2 = 2 * err
    if (e2 >= dy) { err += dy; x0 += sx }
    if (e2 <= dx) { err += dx; y0 += sy }
  }
}
const raster = {
  id: 'bresenham-line', speed: 3, hold: 120,
  caption: { pt: 'Bresenham acende os pixels de cada reta só com somas inteiras; o ponto médio fecha o círculo.', en: 'Bresenham lights the pixels of each line using only integer additions; the midpoint algorithm closes the circle.' },
  init(w, h, rnd) {
    const g = grid(w, h, Math.max(6, w / 62)), cx = Math.floor(g.cols / 2), cy = Math.floor(g.rows / 2)
    const R = Math.min(cx, cy) - 2, rays = 20, rot = rnd() * TAU, pixels = []
    for (let i = 0; i < rays; i++) {
      const a = rot + (TAU * i) / rays
      for (const [x, y] of bresenham(cx, cy, Math.round(cx + R * Math.cos(a)), Math.round(cy + R * Math.sin(a)))) pixels.push([x, y, i % 2])
    }
    const ring = []
    for (let x = 0, y = R + 1, d = 1 - (R + 1); x <= y; x++) {
      for (const [a, b] of [[x, y], [y, x], [-x, y], [-y, x], [x, -y], [y, -x], [-x, -y], [-y, -x]]) ring.push([cx + a, cy + b, 2])
      if (d < 0) d += 2 * x + 3; else { d += 2 * (x - y) + 5; y-- }
    }
    ring.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx))
    return { ...g, pixels: [...pixels, ...ring], k: 0 }
  },
  tick(st) { st.k = Math.min(st.pixels.length, st.k + 1); return st.k >= st.pixels.length },
  draw(ctx, st, w, h, C) {
    const { s, cols, rows, ox, oy } = st
    ctx.fillStyle = rgba(C.line, 0.55)
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) ctx.fillRect(ox + x * s + s * 0.4, oy + y * s + s * 0.4, s * 0.2, s * 0.2)
    const colors = [rgba(C.accent), rgba(C.accent, 0.55), rgba(ROSE)]
    for (let i = 0; i < st.k; i++) {
      const [x, y, c] = st.pixels[i]
      ctx.fillStyle = i === st.k - 1 ? rgba(AMBER) : colors[c]
      ctx.fillRect(ox + x * s + 0.5, oy + y * s + 0.5, s - 1, s - 1)
    }
  },
}

export const heroScenes = [aStar, bezier, fourier, grover, mergeSort]
export const galleryScenes = [sieve, giftWrapping, floodFill, collatz, dijkstra, raster]
