import { useState } from 'react'
import { OpButton, Playground, TreeSvg, ValueInput, layoutBinary, randomInt, tone, useAnimatedState } from './common'

const LIMIT = 15

// Converte o array do heap em árvore (filhos de i: 2i+1 e 2i+2) para desenhar.
const toTree = (arr, i = 0) => (i < arr.length ? { key: i, left: toTree(arr, 2 * i + 1), right: toTree(arr, 2 * i + 2) } : null)

function insertFrames(arr, v) {
  const a = [...arr, v]
  let i = a.length - 1
  const frames = [{ state: [...a], hl: { [i]: 'new' }, note: `inserir(${v}): entra na primeira vaga livre (fim do array, posição ${i}).` }]
  while (i > 0) {
    const p = (i - 1) >> 1
    if (a[p] <= a[i]) {
      frames.push({ state: [...a], hl: { [i]: 'found', [p]: 'active' }, note: `Pai ${a[p]} ≤ ${a[i]}: a propriedade do heap está satisfeita. Fim — O(log n).` })
      return frames
    }
    frames.push({ state: [...a], hl: { [i]: 'new', [p]: 'active' }, note: `${a[i]} < pai ${a[p]} → troca: o menor sobe.` })
    ;[a[i], a[p]] = [a[p], a[i]]
    i = p
  }
  frames.push({ state: [...a], hl: { 0: 'found' }, note: `${a[0]} chegou à raiz: agora é o menor do heap.` })
  return frames
}

function extractFrames(arr) {
  if (!arr.length) return [{ state: arr, hl: {}, note: 'Heap vazio: não há mínimo para extrair.' }]
  const min = arr[0]
  const frames = [{ state: [...arr], hl: { 0: 'remove' }, note: `extrair_mínimo(): o menor (${min}) está sempre na raiz.` }]
  const a = [...arr]
  const last = a.pop()
  if (!a.length) return [...frames, { state: [], hl: {}, note: `${min} removido; o heap ficou vazio.` }]
  a[0] = last
  frames.push({ state: [...a], hl: { 0: 'active' }, note: `O último elemento (${last}) vai para a raiz, para manter a árvore completa.` })
  let i = 0
  while (true) {
    const l = 2 * i + 1, r = l + 1
    let m = i
    if (l < a.length && a[l] < a[m]) m = l
    if (r < a.length && a[r] < a[m]) m = r
    if (m === i) {
      frames.push({ state: [...a], hl: { [i]: 'found' }, note: `${a[i]} é menor ou igual aos filhos: heap restaurado. Mínimo extraído: ${min} — O(log n).` })
      return frames
    }
    frames.push({ state: [...a], hl: { [i]: 'active', [m]: 'new' }, note: `${a[i]} > filho ${a[m]} → troca com o menor filho: ${a[i]} desce.` })
    ;[a[i], a[m]] = [a[m], a[i]]
    i = m
  }
}

export default function HeapPlayground() {
  const s = useAnimatedState([3, 8, 5, 12, 10, 9], 'Heap de mínimo: cada pai é menor que os filhos, então o menor elemento fica sempre na raiz.')
  const [value, setValue] = useState('')
  const heap = s.state

  const insert = () => {
    if (heap.length >= LIMIT) return s.play([{ state: heap, hl: {}, note: 'Limite da demonstração atingido — extraia alguns elementos.' }])
    const v = value === '' ? randomInt(1, 60) : Number(value)
    setValue('')
    s.play(insertFrames(heap, v))
  }

  return (
    <Playground
      note={s.note}
      controls={<>
        <ValueInput value={value} onChange={setValue} onEnter={insert} placeholder="aleat." />
        <OpButton primary onClick={insert} disabled={s.busy}>Inserir</OpButton>
        <OpButton onClick={() => s.play(extractFrames(heap))} disabled={s.busy}>Extrair mínimo</OpButton>
        {heap.length > 0 && <span className="text-xs text-muted ml-1">mínimo: <span className="font-mono text-ink">{heap[0]}</span></span>}
      </>}
      legend={[['bg-emerald-500', 'Subindo / filho escolhido'], ['bg-amber-400', 'Comparando'], ['bg-rose-500', 'Removendo'], ['bg-ink', 'Posição final']]}
    >
      <div className="w-full flex flex-col items-center gap-5">
        <TreeSvg layout={layoutBinary(toTree(heap))} label={n => heap[n.key]} toneOf={n => s.hl[n.key] ?? 'idle'} />
        <div className="flex flex-wrap justify-center gap-1">
          {heap.map((v, i) => (
            <div key={i} className={`w-10 rounded-md border text-center py-1 font-mono transition-colors duration-300 ${tone[s.hl[i] ?? 'idle']}`}>
              <div className="text-[13px]">{v}</div>
              <div className="text-[9px] opacity-60">{i}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-faint -mt-2">O mesmo heap guardado como array: os filhos de i ficam em 2i+1 e 2i+2.</p>
      </div>
    </Playground>
  )
}
