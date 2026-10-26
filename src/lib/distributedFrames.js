// Sistemas distribuídos: relógios de Lamport, relógios vetoriais e snapshot de Chandy-Lamport.
// Cenários com 3 processos, gerados a partir de uma semente. Canais FIFO.
// Evento: { id, p, t (posição no tempo), type: 'local' | 'send' | 'recv' | 'marker-send' | 'marker-recv' | 'record',
//           to?, from?, msg?, amount?, label? }

import { lcg } from './optimizationFrames.js'

export const PROCS = 3
const name = p => `P${p + 1}`

// Gera uma sequência de eventos locais, envios e recebimentos (cada mensagem chega depois de enviada).
export function scenario(seed, count = 14) {
  const rnd = lcg(seed)
  const pick = n => Math.floor(rnd() * n)
  const queues = {} // "de>para" → mensagens em trânsito
  const events = []
  let msg = 0
  while (events.length < count) {
    const pending = Object.entries(queues).filter(([, q]) => q.length)
    const r = rnd()
    if (pending.length && (r < 0.4 || events.length > count - 3)) {
      const [key, q] = pending[pick(pending.length)]
      const [from, to] = key.split('>').map(Number)
      const m = q.shift()
      events.push({ id: events.length, p: to, type: 'recv', from, msg: m })
    } else if (r < 0.75) {
      const p = pick(PROCS), to = (p + 1 + pick(PROCS - 1)) % PROCS
      const m = ++msg
      ;(queues[`${p}>${to}`] ??= []).push(m)
      events.push({ id: events.length, p, type: 'send', to, msg: m })
    } else {
      events.push({ id: events.length, p: pick(PROCS), type: 'local' })
    }
  }
  // entrega o que sobrou, para não deixar mensagens no ar
  for (const [key, q] of Object.entries(queues)) {
    const [from, to] = key.split('>').map(Number)
    while (q.length) events.push({ id: events.length, p: to, type: 'recv', from, msg: q.shift() })
  }
  events.forEach((e, i) => { e.t = i })
  return events
}

// ── Relógios de Lamport ────────────────────────────────────
// Quadros: { events, upto, labels: { id: texto }, note }
export function lamportFrames(seed) {
  const events = scenario(seed)
  const C = Array(PROCS).fill(0), stamp = {}, labels = {}
  const frames = [{ events, upto: -1, labels: {}, note: 'Cada processo tem um contador C. Antes de cada evento, C aumenta 1; toda mensagem leva o valor de C de quem envia; quem recebe faz C = max(C, recebido) + 1.' }]
  for (const e of events) {
    let note
    if (e.type === 'recv') {
      const before = C[e.p]
      C[e.p] = Math.max(C[e.p], stamp[e.msg]) + 1
      note = `${name(e.p)} recebe m${e.msg} (carimbo ${stamp[e.msg]}): C = max(${before}, ${stamp[e.msg]}) + 1 = ${C[e.p]}.`
    } else {
      C[e.p]++
      if (e.type === 'send') { stamp[e.msg] = C[e.p]; note = `${name(e.p)} envia m${e.msg} para ${name(e.to)} com o carimbo ${C[e.p]}.` }
      else note = `Evento local em ${name(e.p)}: C = ${C[e.p]}.`
    }
    labels[e.id] = String(C[e.p])
    frames.push({ events, upto: e.id, labels: { ...labels }, cur: e.id, note })
  }
  frames.push({ events, upto: events.length - 1, labels, done: true, note: 'Se a aconteceu antes de b (a → b), então L(a) < L(b). A recíproca não vale: L(a) < L(b) não prova que a influenciou b — para isso servem os relógios vetoriais. Desempatando pelo número do processo, os carimbos dão uma ordem total consistente.' })
  return frames
}

// ── Relógios vetoriais ─────────────────────────────────────
const vfmt = v => `[${v.join(',')}]`
export const happenedBefore = (a, b) => a.every((x, i) => x <= b[i]) && a.some((x, i) => x < b[i])

export function vectorFrames(seed) {
  const events = scenario(seed)
  const V = Array.from({ length: PROCS }, () => Array(PROCS).fill(0)), stamp = {}, labels = {}, vecs = {}
  const frames = [{ events, upto: -1, labels: {}, note: 'Cada processo guarda um vetor com uma posição por processo. Em cada evento, incrementa a própria posição; ao receber, primeiro faz o máximo posição a posição com o vetor que veio na mensagem.' }]
  for (const e of events) {
    let note
    if (e.type === 'recv') {
      const before = vfmt(V[e.p])
      V[e.p] = V[e.p].map((x, i) => Math.max(x, stamp[e.msg][i]))
      V[e.p][e.p]++
      note = `${name(e.p)} recebe m${e.msg} com ${vfmt(stamp[e.msg])}: máximo com ${before} e incrementa a própria posição → ${vfmt(V[e.p])}.`
    } else {
      V[e.p][e.p]++
      if (e.type === 'send') { stamp[e.msg] = [...V[e.p]]; note = `${name(e.p)} envia m${e.msg} para ${name(e.to)} levando ${vfmt(V[e.p])}.` }
      else note = `Evento local em ${name(e.p)}: ${vfmt(V[e.p])}.`
    }
    vecs[e.id] = [...V[e.p]]
    labels[e.id] = vfmt(V[e.p])
    frames.push({ events, upto: e.id, labels: { ...labels }, cur: e.id, note })
  }
  // um par concorrente de processos diferentes, para ilustrar
  let pair = null
  for (const a of events) for (const b of events) if (!pair && a.p !== b.p && a.id < b.id && !happenedBefore(vecs[a.id], vecs[b.id]) && !happenedBefore(vecs[b.id], vecs[a.id])) pair = [a.id, b.id]
  frames.push({
    events, upto: events.length - 1, labels, done: true, concurrent: pair,
    note: pair
      ? `a → b exatamente quando V(a) ≤ V(b) em todas as posições (e diferente). Os eventos destacados, ${vfmt(vecs[pair[0]])} e ${vfmt(vecs[pair[1]])}, não são comparáveis: são concorrentes — nenhum pode ter influenciado o outro, algo que os relógios de Lamport não detectam.`
      : 'a → b exatamente quando V(a) ≤ V(b) em todas as posições (e diferente). Neste cenário, todos os eventos de processos diferentes estão relacionados.',
  })
  return frames
}

// ── Snapshot de Chandy-Lamport ─────────────────────────────
// Cenário bancário: cada processo começa com R$ 100 e transfere dinheiro para os outros.
export function snapshotFrames(seed) {
  const rnd = lcg(seed)
  const pick = n => Math.floor(rnd() * n)
  const bal = Array(PROCS).fill(100)
  const queues = {}
  const recorded = Array(PROCS).fill(null)
  const chans = {} // "de>para" → { recording, msgs }
  const events = []
  const frames = []
  const view = () => ({ balances: [...bal], recorded: [...recorded], chans: Object.fromEntries(Object.entries(chans).map(([k, v]) => [k, { ...v, msgs: [...v.msgs] }])) })
  const push = (e, note) => { e.id = e.t = events.length; events.push(e); frames.push({ events: [...events], upto: e.id, cur: e.id, ...view(), note }) }
  const initStep = 5
  let msg = 0, started = false
  const startRecording = p => {
    recorded[p] = bal[p]
    for (let q = 0; q < PROCS; q++) if (q !== p) {
      chans[`${q}>${p}`] ??= { recording: true, msgs: [] }
      ;(queues[`${p}>${q}`] ??= []).push({ marker: true })
    }
  }
  const complete = () => started && recorded.every(v => v !== null) && Object.values(chans).every(c => !c.recording)
  frames.push({ events: [], upto: -1, ...view(), note: 'Três agências (P1, P2 e P3) começam com R$ 100 cada e trocam transferências. Queremos fotografar o estado global — saldos e dinheiro em trânsito — sem parar o sistema.' })
  for (let step = 0; step < 80 && !complete(); step++) {
    if (step === initStep) {
      started = true
      startRecording(0)
      chans['1>0'].recording = true; chans['2>0'].recording = true
      push({ p: 0, type: 'record' }, `P1 inicia o snapshot: grava o próprio saldo (R$ ${recorded[0]}), envia um marcador por cada canal de saída e começa a gravar o que chegar pelos canais de entrada.`)
      continue
    }
    const pending = Object.entries(queues).filter(([, q]) => q.length)
    if (pending.length && (rnd() < 0.55 || step > 20)) {
      const [key, q] = pending[pick(pending.length)]
      const [from, to] = key.split('>').map(Number)
      const item = q.shift()
      const chan = chans[key]
      if (item.marker) {
        if (recorded[to] === null) {
          startRecording(to)
          chans[key].recording = false
          for (let q2 = 0; q2 < PROCS; q2++) if (q2 !== to && q2 !== from) chans[`${q2}>${to}`].recording = true
          push({ p: to, type: 'marker-recv', from }, `${name(to)} recebe o primeiro marcador (de ${name(from)}): grava o saldo (R$ ${recorded[to]}), registra o canal ${name(from)}→${name(to)} como vazio, envia marcadores adiante e começa a gravar os outros canais de entrada.`)
        } else {
          chan.recording = false
          push({ p: to, type: 'marker-recv', from }, `${name(to)} recebe o marcador de ${name(from)}: para de gravar esse canal. Em trânsito nele: ${chan.msgs.length ? chan.msgs.map(a => `R$ ${a}`).join(', ') : 'nada'}.`)
        }
      } else {
        bal[to] += item.amount
        const rec = chan?.recording && recorded[to] !== null
        if (rec) chan.msgs.push(item.amount)
        push({ p: to, type: 'recv', from, msg: item.msg, amount: item.amount }, `${name(to)} recebe R$ ${item.amount} de ${name(from)} (saldo R$ ${bal[to]}).${rec ? ` Como ${name(to)} já gravou o seu estado e ainda espera o marcador desse canal, esse dinheiro é registrado como "em trânsito".` : ''}`)
      }
    } else {
      const p = pick(PROCS), to = (p + 1 + pick(PROCS - 1)) % PROCS
      const amount = 5 + pick(26)
      if (bal[p] < amount) continue
      bal[p] -= amount
      const m = ++msg
      ;(queues[`${p}>${to}`] ??= []).push({ msg: m, amount })
      push({ p, type: 'send', to, msg: m, amount }, `${name(p)} transfere R$ ${amount} para ${name(to)} (saldo R$ ${bal[p]}).`)
    }
  }
  // marcadores enviados viram eventos "marker-send" implícitos: ligamos cada recebimento ao instante em que o remetente gravou
  const inTransit = Object.values(chans).reduce((s, c) => s + c.msgs.reduce((a, b) => a + b, 0), 0)
  const total = recorded.reduce((s, v) => s + v, 0) + inTransit
  frames.push({ events, upto: events.length - 1, ...view(), done: true, note: `Snapshot completo. Saldos gravados: ${recorded.map((v, i) => `${name(i)} R$ ${v}`).join(', ')}; em trânsito: R$ ${inTransit}. Total: R$ ${total} — exatamente os R$ 300 iniciais, embora cada processo tenha gravado em um momento diferente. É um estado global consistente.` })
  return frames
}
