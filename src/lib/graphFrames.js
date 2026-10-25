// Grafos de exemplo e quadros de animação dos algoritmos de grafos.
// Quadro: { node: {id: tom}, sub: {id: texto}, edge: {chave: tom}, label: {chave: texto}, edges?, note, aux }

const g = (nodes, edges, directed) => ({
  directed,
  nodes: nodes.map(([id, x, y, caption]) => ({ id, x, y, caption })),
  edges: edges.map(([u, v, w]) => ({ u, v, w, key: `${u}-${v}` })),
})

export const graphs = {
  weighted: g(
    [['A', 60, 170], ['B', 190, 60], ['C', 190, 280], ['D', 330, 170], ['E', 470, 60], ['F', 470, 280], ['G', 580, 170]],
    [['A', 'B', 7], ['A', 'C', 3], ['B', 'C', 2], ['B', 'D', 4], ['C', 'D', 8], ['B', 'E', 9], ['D', 'E', 3], ['D', 'F', 5], ['C', 'F', 10], ['E', 'G', 2], ['F', 'G', 6], ['E', 'F', 4]],
    false,
  ),
  negative: g(
    [['S', 70, 170], ['A', 250, 60], ['B', 250, 280], ['C', 450, 60], ['D', 450, 280]],
    [['S', 'A', 6], ['S', 'B', 7], ['A', 'C', 5], ['A', 'D', -4], ['A', 'B', 8], ['B', 'C', -3], ['B', 'D', 9], ['C', 'A', -2], ['D', 'C', 7], ['D', 'S', 2]],
    true,
  ),
  small: g(
    [['1', 140, 70], ['2', 470, 70], ['3', 470, 270], ['4', 140, 270]],
    [['1', '2', 3], ['1', '4', 7], ['2', '1', 8], ['2', '3', 2], ['3', '1', 5], ['3', '4', 1], ['4', '1', 2]],
    true,
  ),
  dag: g(
    [['A', 70, 80, 'Lógica'], ['B', 70, 260, 'Cálculo I'], ['C', 230, 80, 'Prog. I'], ['D', 230, 260, 'Cálculo II'], ['E', 400, 80, 'Estr. Dados'], ['F', 400, 260, 'Estatística'], ['G', 560, 170, 'Algoritmos']],
    [['A', 'C'], ['A', 'E'], ['C', 'E'], ['B', 'D'], ['D', 'F'], ['E', 'G'], ['D', 'G']],
    true,
  ),
  flow: g(
    [['s', 60, 170], ['a', 220, 60], ['b', 220, 280], ['c', 410, 60], ['d', 410, 280], ['t', 570, 170]],
    [['s', 'a', 16], ['s', 'b', 13], ['a', 'c', 12], ['b', 'a', 4], ['b', 'd', 14], ['c', 'b', 9], ['c', 't', 20], ['d', 'c', 7], ['d', 't', 4]],
    true,
  ),
}

const INF = Infinity
const fmt = d => (d === INF ? '∞' : String(d))

function adjacency(graph) {
  const adj = new Map(graph.nodes.map(n => [n.id, []]))
  for (const e of graph.edges) {
    adj.get(e.u).push({ to: e.v, w: e.w, key: e.key })
    if (!graph.directed) adj.get(e.v).push({ to: e.u, w: e.w, key: e.key })
  }
  return adj
}

function makeRecorder() {
  const frames = []
  return { frames, push: f => frames.push({ node: {}, sub: {}, edge: {}, label: {}, ...f }) }
}

// ── Caminhos mínimos ──────────────────────────────────────────

function dijkstra() {
  const graph = graphs.weighted, adj = adjacency(graph), src = 'A'
  const dist = Object.fromEntries(graph.nodes.map(n => [n.id, INF]))
  const parent = {}
  const done = new Set()
  dist[src] = 0
  const r = makeRecorder()
  const base = () => ({
    node: Object.fromEntries([...done].map(id => [id, 'done'])),
    sub: Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, fmt(v)])),
    edge: Object.fromEntries(Object.values(parent).map(k => [k, 'path'])),
  })
  r.push({ ...base(), note: `Distância 0 para ${src} e ∞ para os demais. A cada passo, fixa o vértice mais próximo ainda não fixado.` })
  while (done.size < graph.nodes.length) {
    const u = graph.nodes.map(n => n.id).filter(id => !done.has(id)).reduce((a, b) => (dist[b] < dist[a] ? b : a))
    if (dist[u] === INF) break
    r.push({ ...base(), node: { ...base().node, [u]: 'active' }, note: `Fixa ${u} (distância ${dist[u]}): é o mais próximo entre os não fixados — sua distância não pode mais melhorar.` })
    for (const { to, w, key } of adj.get(u)) {
      if (done.has(to)) continue
      const cand = dist[u] + w
      const better = cand < dist[to]
      const before = dist[to]
      if (better) { dist[to] = cand; parent[to] = key }
      r.push({
        ...base(), node: { ...base().node, [u]: 'active', [to]: 'frontier' }, edge: { ...base().edge, [key]: better ? 'new' : 'remove' },
        note: better ? `Relaxa ${u}→${to}: ${dist[u]} + ${w} = ${cand} < ${fmt(before)} → atualiza.` : `${u}→${to}: ${dist[u]} + ${w} = ${cand} ≥ ${before} → mantém.`,
      })
    }
    done.add(u)
  }
  r.push({ ...base(), note: `Pronto: as arestas destacadas formam a árvore de caminhos mínimos a partir de ${src}. Ex.: até G, ${dist.G}.` })
  return r.frames
}

function bellmanFord() {
  const graph = graphs.negative, src = 'S'
  const dist = Object.fromEntries(graph.nodes.map(n => [n.id, INF]))
  const parent = {}
  dist[src] = 0
  const r = makeRecorder()
  const base = () => ({
    sub: Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, fmt(v)])),
    edge: Object.fromEntries(Object.values(parent).map(k => [k, 'path'])),
  })
  r.push({ ...base(), node: { [src]: 'done' }, note: `Há arestas negativas, então Dijkstra não serve. Bellman-Ford relaxa todas as arestas, repetidamente, até ${graph.nodes.length - 1} vezes.` })
  for (let round = 1; round < graph.nodes.length; round++) {
    let changed = false
    for (const { u, v, w, key } of graph.edges) {
      if (dist[u] === INF) continue
      const cand = dist[u] + w
      const better = cand < dist[v]
      const before = dist[v]
      if (better) { dist[v] = cand; parent[v] = key; changed = true }
      r.push({
        ...base(), node: { [u]: 'active', [v]: 'frontier' }, edge: { ...base().edge, [key]: better ? 'new' : 'remove' },
        note: `Rodada ${round} · ${u}→${v}: ${dist[u]} + (${w}) = ${cand} ${better ? `< ${fmt(before)} → atualiza.` : `≥ ${fmt(before)} → mantém.`}`,
      })
    }
    if (!changed) {
      r.push({ ...base(), note: `Rodada ${round} sem nenhuma melhoria: as distâncias já são as finais (parada antecipada).` })
      break
    }
  }
  r.push({ ...base(), note: 'Uma última passada não melhora nenhuma aresta, então não há ciclo negativo. Repare em D: −2, graças à aresta A→D de peso −4.' })
  return r.frames
}

function floydWarshall() {
  const graph = graphs.small
  const ids = graph.nodes.map(n => n.id)
  const n = ids.length
  const d = ids.map((a, i) => ids.map((b, j) => (i === j ? 0 : INF)))
  for (const { u, v, w } of graph.edges) d[ids.indexOf(u)][ids.indexOf(v)] = w
  const r = makeRecorder()
  const snap = (hl = {}) => ({ kind: 'matrix', ids, m: d.map(row => [...row]), ...hl })
  r.push({ aux: snap(), note: 'Matriz inicial: pesos das arestas diretas, 0 na diagonal e ∞ onde não há aresta.' })
  for (let k = 0; k < n; k++) {
    r.push({ node: { [ids[k]]: 'active' }, aux: snap({ k }), note: `Agora, permite passar pelo vértice ${ids[k]} como intermediário.` })
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j || i === k || j === k || d[i][k] === INF || d[k][j] === INF) continue
        const cand = d[i][k] + d[k][j]
        const better = cand < d[i][j]
        const before = d[i][j]
        if (better) d[i][j] = cand
        r.push({
          node: { [ids[k]]: 'active', [ids[i]]: 'frontier', [ids[j]]: 'frontier' },
          aux: snap({ k, i, j, better }),
          note: `${ids[i]}→${ids[j]} passando por ${ids[k]}: ${d[i][k]} + ${d[k][j]} = ${cand} ${better ? `< ${fmt(before)} → atualiza.` : `≥ ${before} → mantém.`}`,
        })
      }
    }
  }
  r.push({ aux: snap(), note: 'Pronto: a matriz contém a menor distância entre todos os pares de vértices.' })
  return r.frames
}

// ── Árvores geradoras mínimas ─────────────────────────────────

function unionFind(ids) {
  const p = Object.fromEntries(ids.map(i => [i, i]))
  const find = x => (p[x] === x ? x : (p[x] = find(p[x])))
  return { find, union: (a, b) => { p[find(a)] = find(b) } }
}

function kruskal() {
  const graph = graphs.weighted
  const sorted = [...graph.edges].sort((a, b) => a.w - b.w)
  const uf = unionFind(graph.nodes.map(n => n.id))
  const status = {}
  const tree = []
  let total = 0
  const r = makeRecorder()
  const aux = cur => ({ kind: 'edgeList', title: 'Arestas em ordem de peso', items: sorted.map(e => ({ key: e.key, text: `${e.u}–${e.v}  ${e.w}`, status: e.key === cur ? 'cur' : status[e.key] })) })
  const edges = () => Object.fromEntries([...tree.map(k => [k, 'path']), ...Object.entries(status).filter(([, s]) => s === 'no').map(([k]) => [k, 'muted'])])
  r.push({ aux: aux(), note: 'Ordena as arestas pelo peso e tenta adicioná-las, da mais leve para a mais pesada, sem formar ciclos.' })
  for (const e of sorted) {
    if (tree.length === graph.nodes.length - 1) break
    const ok = uf.find(e.u) !== uf.find(e.v)
    r.push({ edge: { ...edges(), [e.key]: 'active' }, node: { [e.u]: 'frontier', [e.v]: 'frontier' }, aux: aux(e.key), note: `${e.u}–${e.v} (peso ${e.w}): ${ok ? `${e.u} e ${e.v} estão em componentes diferentes → aceita.` : `${e.u} e ${e.v} já estão conectados — formaria um ciclo → rejeita.`}` })
    status[e.key] = ok ? 'ok' : 'no'
    if (ok) { uf.union(e.u, e.v); tree.push(e.key); total += e.w }
  }
  r.push({ edge: edges(), aux: aux(), note: `Árvore geradora mínima completa: ${tree.length} arestas, peso total ${total}.` })
  return r.frames
}

function prim() {
  const graph = graphs.weighted, adj = adjacency(graph)
  const inTree = new Set(['A'])
  const tree = []
  let total = 0
  const r = makeRecorder()
  const nodeTones = () => Object.fromEntries([...inTree].map(id => [id, 'done']))
  r.push({ node: nodeTones(), note: 'Começa com a árvore contendo só A. A cada passo, adiciona a aresta mais leve que sai da árvore.' })
  while (inTree.size < graph.nodes.length) {
    const crossing = []
    for (const u of inTree) for (const { to, w, key } of adj.get(u)) if (!inTree.has(to)) crossing.push({ u, to, w, key })
    const best = crossing.reduce((a, b) => (b.w < a.w ? b : a))
    const edge = Object.fromEntries([...tree.map(k => [k, 'path']), ...crossing.map(c => [c.key, 'frontier'])])
    r.push({ node: nodeTones(), edge: { ...edge, [best.key]: 'active' }, note: `Arestas que saem da árvore: ${crossing.map(c => `${c.u}–${c.to} (${c.w})`).join(', ')}. A mais leve é ${best.u}–${best.to}.` })
    inTree.add(best.to)
    tree.push(best.key)
    total += best.w
    r.push({ node: { ...nodeTones(), [best.to]: 'new' }, edge: Object.fromEntries(tree.map(k => [k, 'path'])), note: `${best.to} entra na árvore. Peso acumulado: ${total}.` })
  }
  r.push({ node: nodeTones(), edge: Object.fromEntries(tree.map(k => [k, 'path'])), note: `Árvore geradora mínima completa, peso total ${total} — o mesmo resultado do Kruskal, construído de outra forma.` })
  return r.frames
}

function boruvka() {
  const graph = graphs.weighted
  const uf = unionFind(graph.nodes.map(n => n.id))
  const tree = []
  let total = 0, round = 0
  const r = makeRecorder()
  r.push({ note: 'Cada vértice começa como um componente. Em cada rodada, todos os componentes escolhem, ao mesmo tempo, sua aresta mais leve para fora.' })
  while (tree.length < graph.nodes.length - 1) {
    round++
    const cheapest = {}
    for (const e of graph.edges) {
      const a = uf.find(e.u), b = uf.find(e.v)
      if (a === b) continue
      for (const c of [a, b]) if (!cheapest[c] || e.w < cheapest[c].w) cheapest[c] = e
    }
    const chosen = [...new Set(Object.values(cheapest))]
    const comps = Object.keys(cheapest).length
    r.push({
      edge: { ...Object.fromEntries(tree.map(k => [k, 'path'])), ...Object.fromEntries(chosen.map(e => [e.key, 'active'])) },
      note: `Rodada ${round}: ${comps} componentes. Cada um escolhe sua aresta mais leve para fora: ${chosen.map(e => `${e.u}–${e.v} (${e.w})`).join(', ')}.`,
    })
    for (const e of chosen) {
      if (uf.find(e.u) !== uf.find(e.v)) { uf.union(e.u, e.v); tree.push(e.key); total += e.w }
    }
    r.push({ edge: Object.fromEntries(tree.map(k => [k, 'path'])), note: `Fim da rodada ${round}: as arestas escolhidas são adicionadas e os componentes se fundem. Peso acumulado: ${total}.` })
  }
  r.push({ edge: Object.fromEntries(tree.map(k => [k, 'path'])), note: `Árvore completa em ${round} rodadas, peso total ${total}. O número de componentes cai pelo menos pela metade a cada rodada.` })
  return r.frames
}

// ── Ordenação topológica ──────────────────────────────────────

function topologicalSort() {
  const graph = graphs.dag, adj = adjacency(graph)
  const indeg = Object.fromEntries(graph.nodes.map(n => [n.id, 0]))
  for (const e of graph.edges) indeg[e.v]++
  const queue = graph.nodes.map(n => n.id).filter(id => indeg[id] === 0)
  const order = []
  const removed = new Set()
  const r = makeRecorder()
  const base = () => ({
    node: Object.fromEntries([...order.map(id => [id, 'done']), ...queue.map(id => [id, 'frontier'])]),
    sub: Object.fromEntries(Object.entries(indeg).filter(([id]) => !order.includes(id)).map(([id, v]) => [id, `grau ${v}`])),
    edge: Object.fromEntries([...removed].map(k => [k, 'muted'])),
    aux: { kind: 'lists', lists: [['Fila (grau de entrada 0)', [...queue]], ['Ordem final', [...order]]] },
  })
  r.push({ ...base(), note: 'Conta quantas arestas chegam a cada vértice (grau de entrada). Quem tem grau 0 não depende de ninguém e entra na fila.' })
  while (queue.length) {
    const u = queue.shift()
    order.push(u)
    r.push({ ...base(), node: { ...base().node, [u]: 'active' }, note: `Retira ${u} (${graph.nodes.find(n => n.id === u).caption}) da fila e o coloca na ordem final.` })
    for (const { to, key } of adj.get(u)) {
      indeg[to]--
      removed.add(key)
      if (indeg[to] === 0) queue.push(to)
      r.push({ ...base(), node: { ...base().node, [u]: 'active', [to]: indeg[to] === 0 ? 'new' : 'frontier' }, edge: { ...base().edge, [key]: 'remove' }, note: `Remove ${u}→${to}: grau de ${to} cai para ${indeg[to]}${indeg[to] === 0 ? ` — ${to} não tem mais pré-requisitos e entra na fila.` : '.'}` })
    }
  }
  r.push({ ...base(), note: `Ordem topológica: ${order.join(' → ')}. Toda aresta aponta de um vértice anterior para um posterior.` })
  return r.frames
}

// ── Fluxo máximo ──────────────────────────────────────────────

function maxFlow(useBfs) {
  const graph = graphs.flow
  const ids = graph.nodes.map(n => n.id)
  const cap = {}, flow = {}
  for (const e of graph.edges) { cap[e.key] = e.w; flow[e.key] = 0 }
  const residual = (u, v) => (cap[`${u}-${v}`] ?? 0) - (flow[`${u}-${v}`] ?? 0) + (flow[`${v}-${u}`] ?? 0)
  const labels = () => Object.fromEntries(graph.edges.map(e => [e.key, `${flow[e.key]}/${cap[e.key]}`]))
  const saturated = () => Object.fromEntries(graph.edges.filter(e => flow[e.key] === cap[e.key]).map(e => [e.key, 'muted']))
  const r = makeRecorder()
  let total = 0

  const findPath = () => {
    const prev = { s: null }
    if (useBfs) {
      const q = ['s']
      while (q.length && !('t' in prev)) {
        const u = q.shift()
        for (const v of ids) if (!(v in prev) && residual(u, v) > 0) { prev[v] = u; q.push(v) }
      }
    } else {
      const dfs = u => {
        if (u === 't') return true
        for (const v of ids) if (!(v in prev) && residual(u, v) > 0) { prev[v] = u; if (dfs(v)) return true }
        return false
      }
      dfs('s')
    }
    if (!('t' in prev)) return null
    const path = []
    for (let v = 't'; prev[v] !== null; v = prev[v]) path.unshift([prev[v], v])
    return path
  }

  r.push({ label: labels(), note: `Cada aresta mostra fluxo/capacidade. Enquanto existir um caminho de s até t com folga, envia mais fluxo por ele (busca ${useBfs ? 'em largura: sempre o caminho com menos arestas' : 'em profundidade'}).` })
  for (let path; (path = findPath());) {
    const bottleneck = Math.min(...path.map(([u, v]) => residual(u, v)))
    const keyOf = (u, v) => (cap[`${u}-${v}`] !== undefined && cap[`${u}-${v}`] - flow[`${u}-${v}`] > 0 ? `${u}-${v}` : `${v}-${u}`)
    const reverse = path.filter(([u, v]) => keyOf(u, v) === `${v}-${u}`)
    const pathEdges = Object.fromEntries(path.map(([u, v]) => [keyOf(u, v), keyOf(u, v) === `${u}-${v}` ? 'active' : 'remove']))
    r.push({
      label: labels(), edge: { ...saturated(), ...pathEdges }, node: Object.fromEntries(path.flat().map(id => [id, 'frontier'])),
      note: `Caminho aumentante: ${['s', ...path.map(([, v]) => v)].join(' → ')}. Gargalo (menor folga): ${bottleneck}.` + (reverse.length ? ` Usa a aresta reversa ${reverse.map(([u, v]) => `${v}→${u}`).join(', ')}: desfaz fluxo enviado antes.` : ''),
    })
    for (const [u, v] of path) {
      const fwd = `${u}-${v}`, back = `${v}-${u}`
      let push = bottleneck
      if (flow[back] > 0) { const undo = Math.min(flow[back], push); flow[back] -= undo; push -= undo }
      if (push > 0) flow[fwd] += push
    }
    total += bottleneck
    r.push({ label: labels(), edge: { ...saturated(), ...Object.fromEntries(Object.keys(pathEdges).map(k => [k, 'new'])) }, note: `Envia ${bottleneck} unidades pelo caminho. Fluxo total: ${total}.` })
  }
  // vértices alcançáveis a partir de s na rede residual = lado de s do corte mínimo
  const reach = new Set(['s'])
  for (const q = ['s']; q.length;) { const u = q.shift(); for (const v of ids) if (!reach.has(v) && residual(u, v) > 0) { reach.add(v); q.push(v) } }
  const cut = graph.edges.filter(e => reach.has(e.u) && !reach.has(e.v))
  r.push({
    label: labels(), node: Object.fromEntries(ids.map(id => [id, reach.has(id) ? 'done' : 'idle'])), edge: Object.fromEntries(cut.map(e => [e.key, 'remove'])),
    note: `Não há mais caminhos com folga: fluxo máximo = ${total}. O corte mínimo separa {${[...reach].join(', ')}} do resto, e suas arestas (em vermelho) somam ${cut.reduce((a, e) => a + e.w, 0)} — o mesmo valor.`,
  })
  return r.frames
}

// ── Algoritmo das economias (Clarke-Wright) ───────────────────

export const savingsData = {
  depot: { id: '0', x: 320, y: 175 },
  customers: [
    { id: '1', x: 110, y: 60, demand: 4 }, { id: '2', x: 230, y: 40, demand: 3 }, { id: '3', x: 420, y: 45, demand: 5 },
    { id: '4', x: 560, y: 95, demand: 4 }, { id: '5', x: 560, y: 270, demand: 3 }, { id: '6', x: 400, y: 305, demand: 6 },
    { id: '7', x: 210, y: 300, demand: 4 }, { id: '8', x: 70, y: 220, demand: 3 },
  ],
  capacity: 12,
}

function savings() {
  const { depot, customers, capacity } = savingsData
  const pts = Object.fromEntries([depot, ...customers].map(p => [p.id, p]))
  const dist = (a, b) => Math.round(Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y) / 10)
  const ids = customers.map(c => c.id)
  let routes = ids.map(id => [id])
  const demand = Object.fromEntries(customers.map(c => [c.id, c.demand]))
  const load = route => route.reduce((a, id) => a + demand[id], 0)
  const cost = rs => rs.reduce((a, rt) => a + dist('0', rt[0]) + dist(rt.at(-1), '0') + rt.slice(1).reduce((s, id, i) => s + dist(rt[i], id), 0), 0)
  const list = []
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = ids[i], b = ids[j]
    list.push({ a, b, s: dist('0', a) + dist('0', b) - dist(a, b) })
  }
  list.sort((x, y) => y.s - x.s)
  const routeEdges = rs => rs.flatMap(rt => [['0', rt[0]], ...rt.slice(1).map((id, i) => [rt[i], id]), [rt.at(-1), '0']])
  const r = makeRecorder()
  const auxOf = cur => ({ kind: 'edgeList', title: 'Economias s(i, j) = d(0,i) + d(0,j) − d(i,j)', items: list.slice(0, 12).map((x, idx) => ({ key: idx, text: `${x.a}–${x.b}  ${x.s}`, status: idx === cur ? 'cur' : x.status })) })
  const initial = cost(routes)
  r.push({ edges: routeEdges(routes), aux: auxOf(), note: `Começa com um caminhão por cliente (ida e volta ao depósito 0): custo total ${initial}. Capacidade de cada caminhão: ${capacity}.` })
  list.forEach((x, idx) => {
    const ra = routes.find(rt => rt.includes(x.a)), rb = routes.find(rt => rt.includes(x.b))
    let reason = null
    if (ra === rb) reason = 'já estão na mesma rota'
    else if (load(ra) + load(rb) > capacity) reason = `carga ${load(ra) + load(rb)} excede a capacidade`
    else if (!(ra[0] === x.a || ra.at(-1) === x.a) || !(rb[0] === x.b || rb.at(-1) === x.b)) reason = 'um deles está no meio de uma rota'
    if (reason) {
      x.status = 'no'
      if (idx < 12) r.push({ edges: routeEdges(routes), aux: auxOf(idx), highlight: [x.a, x.b], note: `Economia ${x.a}–${x.b} = ${x.s}: não pode unir — ${reason}.` })
      return
    }
    const left = ra.at(-1) === x.a ? ra : [...ra].reverse()
    const right = rb[0] === x.b ? rb : [...rb].reverse()
    routes = [...routes.filter(rt => rt !== ra && rt !== rb), [...left, ...right]]
    x.status = 'ok'
    r.push({ edges: routeEdges(routes), aux: auxOf(idx), highlight: [x.a, x.b], note: `Une as rotas por ${x.a}–${x.b}: economiza ${x.s}. Agora são ${routes.length} rotas; custo ${cost(routes)}.` })
  })
  r.push({ edges: routeEdges(routes), aux: auxOf(), note: `Resultado: ${routes.length} rotas (${routes.map(rt => `0-${rt.join('-')}-0`).join(', ')}), custo ${cost(routes)} contra ${initial} no início.` })
  return r.frames
}

export const graphAlgorithms = {
  'dijkstra': { graph: 'weighted', run: dijkstra },
  'bellman-ford': { graph: 'negative', run: bellmanFord },
  'floyd-warshall': { graph: 'small', run: floydWarshall },
  'kruskal': { graph: 'weighted', run: kruskal },
  'prim': { graph: 'weighted', run: prim },
  'boruvka': { graph: 'weighted', run: boruvka },
  'topological-sort': { graph: 'dag', run: topologicalSort },
  'ford-fulkerson': { graph: 'flow', run: () => maxFlow(false) },
  'edmonds-karp': { graph: 'flow', run: () => maxFlow(true) },
  'clarke-wright': { graph: 'savings', run: savings },
}
