// Álgebra simbólica: polinômios em x, y, z com coeficientes racionais exatos (ordem lex, x > y > z),
// divisão multivariada, bases de Gröbner (Buchberger) e completação de Knuth-Bendix.

const fail = () => { throw new Error('entrada inválida') }
export const VARS = ['x', 'y', 'z']

// ── Racionais (BigInt) ─────────────────────────────────────
const bgcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
const Q = (n, d = 1n) => { if (d < 0n) { n = -n; d = -d } const g = bgcd(n, d) || 1n; return [n / g, d / g] }
const qadd = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1])
const qmul = (a, b) => Q(a[0] * b[0], a[1] * b[1])
const qdiv = (a, b) => Q(a[0] * b[1], a[1] * b[0])
const qneg = a => [-a[0], a[1]]

// ── Monômios e polinômios ──────────────────────────────────
// Polinômio: lista de termos [coef, [ex, ey, ez]] ordenada do maior para o menor monômio (lex).
const lex = (a, b) => { for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0 }
const key = m => m.join(',')
const divides = (a, b) => a.every((e, i) => e <= b[i])
const mdiv = (a, b) => a.map((e, i) => e - b[i])
const mmul = (a, b) => a.map((e, i) => e + b[i])
const lcm = (a, b) => a.map((e, i) => Math.max(e, b[i]))

function normalize(terms) {
  const acc = new Map()
  for (const [c, m] of terms) {
    const k = key(m), prev = acc.get(k)
    acc.set(k, prev ? [qadd(prev[0], c), m] : [c, m])
  }
  return [...acc.values()].filter(([c]) => c[0] !== 0n).sort((a, b) => lex(b[1], a[1]))
}
const add = (p, q) => normalize([...p, ...q])
const sub = (p, q) => add(p, q.map(([c, m]) => [qneg(c), m]))
const mulTerm = (p, c, m) => p.map(([d, n]) => [qmul(c, d), mmul(m, n)])
const monic = p => (p.length ? mulTerm(p, qdiv([1n, 1n], p[0][0]), [0, 0, 0]) : p)

export function parsePoly(text) {
  const s = String(text).replace(/\s+/g, '').replace(/−/g, '-')
  if (!s || s.length > 80) fail()
  const parts = s.match(/[+-]?[^+-]+/g)
  if (!parts || parts.join('') !== s) fail()
  const terms = []
  for (const part of parts) {
    const m = part.match(/^([+-]?)(\d+(?:\/\d+)?)?\*?((?:[xyz](?:\^\d+)?\*?)*)$/)
    if (!m || (!m[2] && !m[3])) fail()
    let c = m[2] ? (m[2].includes('/') ? Q(BigInt(m[2].split('/')[0]), BigInt(m[2].split('/')[1])) : [BigInt(m[2]), 1n]) : [1n, 1n]
    if (c[1] === 0n) fail()
    if (m[1] === '-') c = qneg(c)
    const e = [0, 0, 0]
    for (const [, v, p] of m[3].matchAll(/([xyz])(?:\^(\d+))?/g)) e[VARS.indexOf(v)] += p ? Number(p) : 1
    if (e.some(x => x > 12)) fail()
    terms.push([c, e])
  }
  return normalize(terms)
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const fmtMono = m => m.map((e, i) => (e ? VARS[i] + (e > 1 ? [...String(e)].map(d => SUP[d]).join('') : '') : '')).join('')
const fmtQ = ([n, d]) => (d === 1n ? String(n) : `${n}/${d}`)
export function fmt(p) {
  if (!p.length) return '0'
  return p.map(([c, m], i) => {
    const neg = c[0] < 0n, abs = [neg ? -c[0] : c[0], c[1]], mono = fmtMono(m)
    const body = mono ? (abs[0] === 1n && abs[1] === 1n ? mono : fmtQ(abs) + mono) : fmtQ(abs)
    return (i ? (neg ? ' − ' : ' + ') : neg ? '−' : '') + body
  }).join('')
}
const fmtTerm = (c, m) => fmt([[c, m]])

// ── Divisão multivariada ───────────────────────────────────
export function divide(f, gs) {
  let p = f, r = []
  const q = gs.map(() => [])
  const log = []
  while (p.length) {
    const [c, m] = p[0]
    const i = gs.findIndex(g => divides(g[0][1], m))
    if (i >= 0) {
      const tc = qdiv(c, gs[i][0][0]), tm = mdiv(m, gs[i][0][1])
      q[i] = add(q[i], [[tc, tm]])
      p = sub(p, mulTerm(gs[i], tc, tm))
      log.push({ lt: [c, m], i, t: [tc, tm], p, r })
    } else {
      r = add(r, [[c, m]])
      p = p.slice(1)
      log.push({ lt: [c, m], i: -1, p, r })
    }
  }
  return { q, r, log }
}

const parseList = text => {
  const items = String(text).split(/[,;]/).map(s => s.trim()).filter(Boolean)
  if (!items.length || items.length > 6) fail()
  return items.map(parsePoly)
}

function divisionTrace({ f, divisores }) {
  const fp = parsePoly(f), gs = parseList(divisores)
  if (!fp.length || gs.some(g => !g.length)) fail()
  const { q, r, log } = divide(fp, gs)
  if (log.length > 60) fail()
  const steps = [{ note: `Dividir f = ${fmt(fp)} por ${gs.map((g, i) => `g${i + 1} = ${fmt(g)}`).join(', ')}, na ordem lexicográfica (x > y > z). A cada passo olha-se o termo líder (o maior) do que sobrou.` }]
  for (const s of log) {
    const lt = fmtTerm(...s.lt)
    steps.push(s.i >= 0
      ? { row: [lt, `g${s.i + 1}`, fmtTerm(...s.t), fmt(s.p), fmt(s.r)], note: `O termo líder ${lt} é divisível pelo termo líder de g${s.i + 1} (${fmtTerm(...gs[s.i][0])}). Acrescenta ${fmtTerm(...s.t)} ao quociente q${s.i + 1} e subtrai ${fmtTerm(...s.t)} · g${s.i + 1}.` }
      : { row: [lt, '—', '—', fmt(s.p), fmt(s.r)], note: `Nenhum termo líder dos divisores divide ${lt}: ele vai para o resto (diferente da divisão com uma variável, o algoritmo continua com os termos seguintes).` })
  }
  steps.push({ note: `f = ${q.map((qi, i) => `(${fmt(qi)})·g${i + 1}`).join(' + ')} + (${fmt(r)}). Nenhum termo do resto é divisível pelos termos líderes. Atenção: o resto depende da ordem dos divisores — é isso que as bases de Gröbner resolvem.`, result: `r = ${fmt(r)}` })
  return { columns: ['termo líder', 'divisor', 'termo do quociente', 'restante', 'resto'], steps }
}

// ── Buchberger ─────────────────────────────────────────────
export function sPoly(f, g) {
  const L = lcm(f[0][1], g[0][1])
  return sub(mulTerm(f, qdiv([1n, 1n], f[0][0]), mdiv(L, f[0][1])), mulTerm(g, qdiv([1n, 1n], g[0][0]), mdiv(L, g[0][1])))
}
export const reduce = (f, G) => divide(f, G).r

// Base de Gröbner reduzida (cada polinômio mônico, nenhum termo divisível por líderes dos outros).
export function reducedBasis(G) {
  let B = G.map(monic)
  B = B.filter((g, i) => !B.some((h, j) => j !== i && divides(h[0][1], g[0][1]) && (key(h[0][1]) !== key(g[0][1]) || j < i)))
  return B.map((g, i) => monic(reduce(g, B.filter((_, j) => j !== i)))).sort((a, b) => lex(b[0][1], a[0][1]))
}

export function buchberger(F, limit = 80) {
  const G = F.filter(f => f.length).map(monic)
  const pairs = []
  for (let j = 1; j < G.length; j++) for (let i = 0; i < j; i++) pairs.push([i, j])
  const log = []
  while (pairs.length) {
    const [i, j] = pairs.shift()
    const a = G[i][0][1], b = G[j][0][1]
    if (a.every((e, k) => !e || !b[k])) { log.push({ i, j, skip: true }); continue }
    const s = sPoly(G[i], G[j]), r = reduce(s, G)
    if (r.length) {
      G.push(monic(r))
      for (let k = 0; k < G.length - 1; k++) pairs.push([k, G.length - 1])
    }
    log.push({ i, j, s, r, added: r.length ? G.length : 0 })
    if (log.length > limit || G.length > 16) fail()
  }
  return { G, log, reduced: reducedBasis(G) }
}

function buchbergerTrace({ 'polinômios': polinomios }) {
  const F = parseList(polinomios)
  if (F.some(f => !f.length)) fail()
  const { G, log, reduced } = buchberger(F)
  const steps = [{ note: `Ideal gerado por ${F.map(fmt).join(', ')}. Ordem lex (x > y > z). Os geradores entram na base (divididos pelo coeficiente líder): ${F.map((_, i) => `g${i + 1}`).join(', ')}. Para cada par, calcula-se o S-polinômio, que cancela os termos líderes, e o reduz pela base.` }]
  for (const s of log) {
    const par = `g${s.i + 1}, g${s.j + 1}`
    if (s.skip) steps.push({ row: [par, '—', '—', 'pulado'], note: `Os termos líderes de g${s.i + 1} e g${s.j + 1} não têm variáveis em comum: pelo critério de Buchberger, o S-polinômio certamente se reduz a 0 — nem precisa calcular.` })
    else if (s.added) steps.push({ row: [par, fmt(s.s), fmt(s.r), `novo g${s.added}`], note: `S(g${s.i + 1}, g${s.j + 1}) = ${fmt(s.s)} não se reduz a zero: sobra ${fmt(s.r)}. Esse polinômio pertence ao ideal mas "escapava" da base — entra como g${s.added}, e novos pares são formados com ele.` })
    else steps.push({ row: [par, fmt(s.s), '0', '—'], note: `S(g${s.i + 1}, g${s.j + 1}) = ${fmt(s.s)} se reduz a 0 pela base: este par já está resolvido.` })
  }
  steps.push({ note: `Todos os pares se reduzem a zero: {${G.map(fmt).join(', ')}} é uma base de Gröbner. Removendo o redundante e reduzindo cada elemento pelos outros, obtém-se a base reduzida (única para o ideal e a ordem): {${reduced.map(fmt).join(', ')}}.${reduced.length > 1 && reduced.some(g => g.every(([, m]) => m[0] === 0)) ? ' Note como a ordem lex elimina variáveis: há elementos sem x, prontos para resolver o sistema de baixo para cima.' : ''}`, result: `{${reduced.map(fmt).join(', ')}}` })
  return { columns: ['par', 'S-polinômio', 'resto', 'ação'], steps }
}

// ── Knuth-Bendix (reescrita de palavras) ───────────────────
// Ordem shortlex: palavras menores primeiro; empate pela ordem alfabética.
export const shortlex = (u, v) => (u.length !== v.length ? u.length - v.length : u < v ? -1 : u > v ? 1 : 0)
const word = w => w || 'ε'

export function rewrite(w, rules) {
  for (let guard = 0; guard < 10000; guard++) {
    const rule = rules.find(([l]) => w.includes(l))
    if (!rule) return w
    w = w.replace(rule[0], rule[1])
  }
  fail()
}

export function parseRules(text) {
  const eqs = String(text).split(/[,;]/).map(s => s.trim()).filter(Boolean).map(e => {
    const m = e.replace(/\s+/g, '').replace(/ε/g, '').match(/^([a-z]*)=([a-z]*)$/)
    if (!m || m[1] === m[2] || m[1].length + m[2].length > 12) fail()
    return [m[1], m[2]]
  })
  if (!eqs.length || eqs.length > 6) fail()
  return eqs
}

function overlaps([l1, r1], [l2, r2]) {
  const out = []
  for (let k = 1; k < Math.min(l1.length, l2.length); k++) {
    if (l1.endsWith(l2.slice(0, k))) out.push([r1 + l2.slice(k), l1.slice(0, l1.length - k) + r2, l1 + l2.slice(k)])
  }
  return out
}

export function knuthBendix(eqs, limit = 120) {
  let R = []
  const E = eqs.map(([s, t]) => [s, t, 'axioma'])
  const log = []
  while (E.length) {
    if (log.length > limit || R.length > 20) return { R, log, complete: false }
    const [s0, t0, from] = E.shift()
    const s = rewrite(s0, R), t = rewrite(t0, R)
    if (s === t) { log.push({ eq: [s0, t0], from, nf: s, kind: 'join' }); continue }
    const rule = shortlex(s, t) > 0 ? [s, t] : [t, s]
    const removed = []
    R = R.filter(old => {
      if (old[0].includes(rule[0])) { removed.push(old); E.push([old[0], old[1], `regra ${word(old[0])} → ${word(old[1])} removida`]); return false }
      return true
    })
    R = R.map(([l, r]) => [l, rewrite(r, [...R, rule])])
    R.push(rule)
    const crit = []
    for (const other of R) {
      for (const [a, b, w] of overlaps(rule, other)) crit.push([a, b, `sobreposição ${w}`])
      if (other !== rule) for (const [a, b, w] of overlaps(other, rule)) crit.push([a, b, `sobreposição ${w}`])
    }
    E.push(...crit)
    log.push({ eq: [s0, t0], from, rule, removed, crit: crit.length, kind: 'rule' })
  }
  return { R, log, complete: true }
}

// Palavras irredutíveis (elementos do monoide), se forem finitas e poucas.
export function irreducible(R, alphabet, maxLen = 12) {
  const out = ['']
  let layer = ['']
  for (let len = 1; len <= maxLen && layer.length; len++) {
    layer = layer.flatMap(w => alphabet.map(c => w + c)).filter(w => !R.some(([l]) => w.includes(l)))
    out.push(...layer)
    if (out.length > 60) return null
  }
  return layer.length ? null : out
}

function knuthBendixTrace({ 'relações': relacoes }) {
  const eqs = parseRules(relacoes)
  const alphabet = [...new Set(eqs.flatMap(([a, b]) => [...a, ...b]))].sort()
  const { R, log, complete } = knuthBendix(eqs)
  const steps = [{ note: `Relações ${eqs.map(([a, b]) => `${word(a)} = ${word(b)}`).join(', ')} sobre as letras ${alphabet.join(', ')} (ε é a palavra vazia). Cada igualdade vira uma regra que troca a palavra maior pela menor (ordem shortlex). Depois, as sobreposições entre regras ("pares críticos") são testadas.` }]
  for (const s of log) {
    const eq = `${word(s.eq[0])} = ${word(s.eq[1])}`
    if (s.kind === 'join') steps.push({ row: [eq, s.from, `${word(s.nf)} = ${word(s.nf)}`, '—'], note: `As duas formas de ${eq} se reduzem a ${word(s.nf)}: o par é confluente, nada a fazer.` })
    else steps.push({ row: [eq, s.from, `${word(s.rule[0])} ≠ ${word(s.rule[1])}`, `${word(s.rule[0])} → ${word(s.rule[1])}`], note: `${s.from === 'axioma' ? 'Relação dada' : `Par crítico (${s.from})`}: as formas normais diferem, então nasce a regra ${word(s.rule[0])} → ${word(s.rule[1])}.${s.removed.length ? ` Regras cujo lado esquerdo contém ${word(s.rule[0])} saem e voltam como equações: ${s.removed.map(([l, r]) => `${word(l)} → ${word(r)}`).join(', ')}.` : ''} ${s.crit} par${s.crit === 1 ? '' : 'es'} crítico${s.crit === 1 ? '' : 's'} novo${s.crit === 1 ? '' : 's'}.` })
  }
  const elems = complete && irreducible(R, alphabet)
  steps.push({
    note: complete
      ? `Completo: todos os pares críticos são confluentes. O sistema {${R.map(([l, r]) => `${word(l)} → ${word(r)}`).join(', ')}} dá a cada palavra uma única forma normal — o "problema da palavra" ficou decidível. ${elems ? `Há ${elems.length} palavras irredutíveis (${elems.map(word).join(', ')}): a estrutura tem ${elems.length} elementos.` : 'Há infinitas palavras irredutíveis.'}`
      : 'Limite de passos atingido sem completar. Knuth-Bendix pode não terminar: há presentações cujo sistema completo é infinito (e o problema da palavra em grupos é, em geral, indecidível).',
    result: complete ? `${R.length} regras${elems ? ` · ${elems.length} elementos` : ''}` : 'incompleto',
  })
  return { columns: ['equação', 'origem', 'formas normais', 'regra'], steps }
}

export const algebraTraces = {
  'multivariate-division': { run: divisionTrace, inputs: [['f', 'x^2y + xy^2 + y^2', 1, 80, 'text'], ['divisores', 'xy - 1, y^2 - 1', 1, 80, 'text']] },
  'buchberger': { run: buchbergerTrace, inputs: [['polinômios', 'x^2 + y^2 - 1, x - y', 1, 80, 'text']] },
  'knuth-bendix': { run: knuthBendixTrace, inputs: [['relações', 'aa=, bbb=, abab=', 1, 60, 'text']] },
}
