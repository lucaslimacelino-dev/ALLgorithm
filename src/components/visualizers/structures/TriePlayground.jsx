import { useState } from 'react'
import { OpButton, Playground, TreeSvg, ValueInput, layoutForest, useAnimatedState } from './common'

const INITIAL = ['carro', 'casa', 'casaco', 'caso', 'gato', 'galo']
const LIMIT = 12

// Monta a trie a partir das palavras; "partial" é um caminho em construção (sem marcar fim de palavra).
function buildTrie(words, partial = '') {
  const root = { id: '', ch: '•', end: false, kids: new Map() }
  const add = (w, end) => {
    let node = root
    for (const ch of w) {
      if (!node.kids.has(ch)) node.kids.set(ch, { id: node.id + ch, ch, end: false, kids: new Map() })
      node = node.kids.get(ch)
    }
    if (end) node.end = true
  }
  words.forEach(w => add(w, true))
  if (partial) add(partial, false)
  return root
}

const sortedKids = n => [...n.kids.values()].sort((a, b) => a.ch.localeCompare(b.ch))
const clean = s => s.trim().toLowerCase().replace(/[^a-zà-ú]/g, '')

export default function TriePlayground() {
  const s = useAnimatedState({ words: INITIAL, partial: '' }, 'Cada aresta é uma letra; palavras com o mesmo prefixo compartilham o caminho. Nós com anel marcam o fim de uma palavra.')
  const [text, setText] = useState('')
  const { words, partial } = s.state
  const root = buildTrie(words, partial)

  const insert = () => {
    const w = clean(text)
    setText('')
    if (!w) return
    if (words.includes(w)) return s.play([{ state: s.state, hl: {}, note: `"${w}" já está na trie.` }])
    if (words.length >= LIMIT) return s.play([{ state: s.state, hl: {}, note: 'Limite da demonstração atingido.' }])
    const before = buildTrie(words)
    const exists = p => { let n = before; for (const ch of p) { n = n.kids.get(ch); if (!n) return false } return true }
    const frames = [...w].map((_, i) => {
      const p = w.slice(0, i + 1)
      const hl = { '': 'path' }
      for (let k = 1; k <= p.length; k++) hl[p.slice(0, k)] = exists(p.slice(0, k)) ? 'path' : 'new'
      return { state: { words, partial: p }, hl, note: exists(p) ? `"${p}": o caminho já existe — reaproveitado.` : `"${p}": não existe nó para "${p.at(-1)}" — cria um novo.` }
    })
    const final = [...words, w].sort()
    frames.push({ state: { words: final, partial: '' }, hl: { [w]: 'found' }, note: `Marca o último nó como fim de palavra. "${w}" inserida em O(${w.length}) — o custo depende só do tamanho da palavra.` })
    s.play(frames)
  }

  const search = () => {
    const p = clean(text)
    if (!p) return
    const frames = []
    let node = root
    const hl = { '': 'path' }
    for (let i = 0; i < p.length; i++) {
      node = node.kids.get(p[i])
      if (!node) {
        frames.push({ state: s.state, hl: { ...hl }, note: `Não há aresta para "${p[i]}" depois de "${p.slice(0, i)}": nenhuma palavra começa com "${p}".` })
        return s.play(frames)
      }
      hl[node.id] = 'path'
      frames.push({ state: s.state, hl: { ...hl }, note: `Segue a letra "${p[i]}"…` })
    }
    const found = words.filter(w => w.startsWith(p))
    found.forEach(w => { hl[w] = 'found' })
    frames.push({ state: s.state, hl, note: `Prefixo "${p}" encontrado em O(${p.length}). Autocompletar: ${found.join(', ')}.` })
    s.play(frames)
  }

  return (
    <Playground
      note={s.note}
      controls={<>
        <ValueInput type="text" width="w-36" value={text} onChange={setText} onEnter={insert} placeholder="palavra" />
        <OpButton primary onClick={insert} disabled={s.busy}>Inserir</OpButton>
        <OpButton onClick={search} disabled={s.busy}>Buscar prefixo</OpButton>
        <OpButton onClick={() => s.play([{ state: { words: INITIAL, partial: '' }, hl: {}, note: 'Trie reiniciada.' }])} disabled={s.busy}>Reiniciar</OpButton>
      </>}
      legend={[['bg-accent/20 border border-accent/40', 'Caminho'], ['bg-emerald-500', 'Nó criado'], ['bg-ink', 'Palavra encontrada']]}
    >
      <TreeSvg
        layout={layoutForest([root], sortedKids, n => n.id)}
        label={n => n.ch}
        toneOf={n => s.hl[n.id] ?? 'idle'}
        ringOf={n => n.end}
        colW={44}
        rowH={52}
        r={14}
      />
    </Playground>
  )
}
