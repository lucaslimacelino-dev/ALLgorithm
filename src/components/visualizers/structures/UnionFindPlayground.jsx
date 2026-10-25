import { useState } from 'react'
import { OpButton, Playground, TreeSvg, ValueInput, layoutForest, useAnimatedState } from './common'

const N = 10
const initial = () => ({ parent: Array.from({ length: N }, (_, i) => i), rank: Array(N).fill(0) })

// Segue os pais até a raiz, gerando quadros; no fim aplica a compressão de caminho.
function findFrames(state, x, label) {
  const path = [x]
  while (state.parent[path.at(-1)] !== path.at(-1)) path.push(state.parent[path.at(-1)])
  const root = path.at(-1)
  const frames = path.map((_, i) => ({
    state,
    hl: Object.fromEntries(path.slice(0, i + 1).map((p, k) => [p, k === i ? 'active' : 'path'])),
    note: i === path.length - 1 ? `${label}: ${root} aponta para si mesmo — é a raiz (representante do grupo).` : `${label}: ${path[i]} aponta para ${path[i + 1]}…`,
  }))
  let next = state
  if (path.length > 2) {
    const parent = [...state.parent]
    path.forEach(p => { parent[p] = root })
    next = { ...state, parent }
    frames.push({ state: next, hl: Object.fromEntries(path.map(p => [p, p === root ? 'found' : 'path'])), note: `Compressão de caminho: ${path.slice(0, -1).join(', ')} passam a apontar direto para ${root}. As próximas buscas serão quase instantâneas.` })
  }
  return { root, state: next, frames }
}

export default function UnionFindPlayground() {
  const s = useAnimatedState(initial(), 'Cada elemento começa no próprio grupo. Una pares e veja os grupos virarem árvores, cada uma com um representante (a raiz).')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const { parent, rank } = s.state

  const valid = v => v !== '' && Number(v) >= 0 && Number(v) < N

  const union = () => {
    if (!valid(a) || !valid(b)) return s.play([{ state: s.state, hl: {}, note: `Escolha dois elementos entre 0 e ${N - 1}.` }])
    const fa = findFrames(s.state, Number(a), `find(${a})`)
    const fb = findFrames(fa.state, Number(b), `find(${b})`)
    const frames = [...fa.frames, ...fb.frames]
    let st = fb.state
    if (fa.root === fb.root) {
      frames.push({ state: st, hl: { [fa.root]: 'found' }, note: `${a} e ${b} já têm a mesma raiz (${fa.root}): já estão no mesmo grupo.` })
    } else {
      let [hi, lo] = [fa.root, fb.root]
      if (st.rank[hi] < st.rank[lo]) [hi, lo] = [lo, hi]
      const p = [...st.parent], r = [...st.rank]
      p[lo] = hi
      if (r[hi] === r[lo]) r[hi]++
      st = { parent: p, rank: r }
      const tie = fb.state.rank[hi] === fb.state.rank[lo]
      frames.push({
        state: st, hl: { [lo]: 'new', [hi]: 'found' },
        note: tie
          ? `union(${a}, ${b}): as raízes ${lo} e ${hi} têm o mesmo posto; ${lo} passa a apontar para ${hi}, e o posto de ${hi} sobe para ${r[hi]}.`
          : `union(${a}, ${b}): a raiz ${lo} (posto ${r[lo]}) passa a apontar para ${hi} (posto ${r[hi]}) — a árvore mais baixa fica embaixo, mantendo tudo raso.`,
      })
    }
    s.play(frames)
  }

  const find = () => {
    if (!valid(a)) return s.play([{ state: s.state, hl: {}, note: `Escolha um elemento entre 0 e ${N - 1}.` }])
    s.play(findFrames(s.state, Number(a), `find(${a})`).frames)
  }

  const roots = parent.map((p, i) => i).filter(i => parent[i] === i)
  const children = i => parent.map((p, j) => j).filter(j => j !== i && parent[j] === i)

  return (
    <Playground
      note={s.note}
      controls={<>
        <ValueInput value={a} onChange={setA} placeholder="a" width="w-16" />
        <ValueInput value={b} onChange={setB} onEnter={union} placeholder="b" width="w-16" />
        <OpButton primary onClick={union} disabled={s.busy}>union(a, b)</OpButton>
        <OpButton onClick={find} disabled={s.busy}>find(a)</OpButton>
        <OpButton onClick={() => s.play([{ state: initial(), hl: {}, note: 'Todos os elementos voltaram a grupos separados.' }])} disabled={s.busy}>Reiniciar</OpButton>
        <span className="text-xs text-muted ml-1">{roots.length} {roots.length === 1 ? 'grupo' : 'grupos'}</span>
      </>}
      legend={[['bg-amber-400', 'Nó atual'], ['bg-accent/20 border border-accent/40', 'Caminho até a raiz'], ['bg-emerald-500', 'Raiz ligada'], ['bg-ink', 'Raiz']]}
    >
      <TreeSvg
        layout={layoutForest(roots, children, i => i)}
        label={i => i}
        sublabel={i => (parent[i] === i ? `posto ${rank[i]}` : '')}
        toneOf={i => s.hl[i] ?? 'idle'}
        colW={52}
        rowH={70}
      />
    </Playground>
  )
}
