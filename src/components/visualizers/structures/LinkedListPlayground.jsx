import { Fragment, useState } from 'react'
import { OpButton, Playground, ValueInput, randomInt, tone, useAnimatedState } from './common'

const LIMIT = 8

export default function LinkedListPlayground() {
  const s = useAnimatedState([5, 10, 20], 'Cada nó guarda um valor e um ponteiro para o próximo. Só a cabeça (head) é acessada diretamente.')
  const [value, setValue] = useState('')
  const list = s.state

  const readValue = () => {
    const v = value === '' ? randomInt(1, 99) : Number(value)
    setValue('')
    return v
  }

  const tooBig = () => {
    if (list.length < LIMIT) return false
    s.play([{ state: list, hl: {}, note: 'Limite da demonstração atingido — remova alguns nós.' }])
    return true
  }

  const insertHead = () => {
    if (tooBig()) return
    const v = readValue()
    s.play([{ state: [v, ...list], hl: { 0: 'new' }, note: `Inserir ${v} no início: o novo nó aponta para a antiga cabeça e vira a nova cabeça — O(1), sem percorrer nada.` }])
  }

  // Percorre a lista do início, gerando um quadro por nó visitado.
  const walk = (stopAt, verb) => list.slice(0, stopAt).map((v, i) => ({
    state: list, hl: { [i]: 'active' }, note: `${verb}: visitando o nó ${i + 1} (${v})…`,
  }))

  const insertTail = () => {
    if (tooBig()) return
    const v = readValue()
    const next = [...list, v]
    s.play([
      ...walk(list.length, `Inserir ${v} no fim — é preciso andar até o último nó`),
      { state: next, hl: { [next.length - 1]: 'new' }, note: `O último nó passa a apontar para ${v} — O(n), por causa da caminhada (ou O(1) se a lista guardar um ponteiro para a cauda).` },
    ])
  }

  const find = remove => {
    const v = readValue()
    const idx = list.indexOf(v)
    const frames = walk(idx === -1 ? list.length : idx, `${remove ? 'Remover' : 'Buscar'} ${v}`)
    if (idx === -1) {
      frames.push({ state: list, hl: {}, note: `Chegou a null: ${v} não está na lista (${list.length} nós visitados) — O(n).` })
    } else if (remove) {
      frames.push({ state: list, hl: { [idx]: 'remove' }, note: `Encontrado. O nó anterior passa a apontar para o seguinte, "pulando" ${v}.` })
      frames.push({ state: list.filter((_, i) => i !== idx), hl: {}, note: `${v} removido. Nenhum elemento precisou ser deslocado, ao contrário de um array.` })
    } else {
      frames.push({ state: list, hl: { [idx]: 'found' }, note: `${v} encontrado no nó ${idx + 1} — O(n): não há acesso direto por índice.` })
    }
    s.play(frames)
  }

  return (
    <Playground
      note={s.note}
      controls={<>
        <ValueInput value={value} onChange={setValue} placeholder="aleat." />
        <OpButton primary onClick={insertHead} disabled={s.busy}>Inserir no início</OpButton>
        <OpButton onClick={insertTail} disabled={s.busy}>Inserir no fim</OpButton>
        <OpButton onClick={() => find(false)} disabled={s.busy}>Buscar</OpButton>
        <OpButton onClick={() => find(true)} disabled={s.busy}>Remover</OpButton>
      </>}
      legend={[['bg-amber-400', 'Percorrendo'], ['bg-emerald-500', 'Novo nó'], ['bg-rose-500', 'Removendo'], ['bg-ink', 'Encontrado']]}
    >
      <div className="flex items-center flex-wrap justify-center gap-y-6">
        <span className="text-[11px] font-mono text-faint mr-2">head →</span>
        {list.map((v, i) => (
          <Fragment key={`${i}-${v}`}>
            <div className={`flex items-stretch h-11 rounded-lg border overflow-hidden font-mono text-sm transition-colors duration-300 ${tone[s.hl[i] ?? 'idle']}`}>
              <span className="px-3.5 flex items-center">{v}</span>
              <span className="w-5 border-l border-ink/15 flex items-center justify-center opacity-60">•</span>
            </div>
            <span className="text-faint px-1.5">→</span>
          </Fragment>
        ))}
        <span className="text-xs font-mono text-faint">null</span>
      </div>
    </Playground>
  )
}
