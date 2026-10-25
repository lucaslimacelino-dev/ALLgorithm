import { useState } from 'react'
import { OpButton, Playground, ValueInput, randomInt, tone, useAnimatedState } from './common'
import { useI18n } from '../../../i18n'

const LIMIT = 9

export default function StackQueuePlayground({ algorithm }) {
  const { t } = useI18n()
  const isStack = algorithm.id === 'stack'
  const s = useAnimatedState([12, 7, 31], isStack
    ? 'Uma pilha: só o topo é acessível. Empilhe e desempilhe para ver o LIFO em ação.'
    : 'Uma fila: entra pelo fim, sai pela frente. Enfileire e desenfileire para ver o FIFO em ação.')
  const [value, setValue] = useState('')
  const items = s.state

  const add = () => {
    if (items.length >= LIMIT) return s.play([{ state: items, hl: {}, note: 'Limite da demonstração atingido — remova alguns itens.' }])
    const v = value === '' ? randomInt(1, 99) : Number(value)
    setValue('')
    const next = [...items, v]
    s.play([{ state: next, hl: { [next.length - 1]: 'new' }, note: isStack ? `push(${v}): ${v} entra no topo — O(1).` : `enqueue(${v}): ${v} entra no fim da fila — O(1).` }])
  }

  const remove = () => {
    if (!items.length) return s.play([{ state: items, hl: {}, note: isStack ? 'pop() em pilha vazia: erro de "stack underflow".' : 'dequeue() em fila vazia: não há o que remover.' }])
    const idx = isStack ? items.length - 1 : 0
    const v = items[idx]
    const rest = isStack ? items.slice(0, -1) : items.slice(1)
    s.play([
      { state: items, hl: { [idx]: 'remove' }, note: isStack ? `pop(): o topo (${v}) é o último que entrou — e o primeiro a sair.` : `dequeue(): a frente (${v}) é o primeiro que entrou — e o primeiro a sair.` },
      { state: rest, hl: {}, note: `${v} removido — O(1). ${rest.length} ${rest.length === 1 ? 'item restante' : 'itens restantes'}.` },
    ])
  }

  const peek = () => {
    if (!items.length) return s.play([{ state: items, hl: {}, note: 'Estrutura vazia: não há o que espiar.' }])
    const idx = isStack ? items.length - 1 : 0
    s.play([{ state: items, hl: { [idx]: 'found' }, note: `${isStack ? 'peek()' : 'front()'}: consulta ${items[idx]} sem remover — O(1).` }])
  }

  const box = (v, i) => (
    <div key={`${i}-${v}`} className={`w-16 h-11 rounded-lg border flex items-center justify-center font-mono text-sm transition-colors duration-300 ${tone[s.hl[i] ?? 'idle']}`}>{v}</div>
  )

  return (
    <Playground
      note={s.note}
      controls={<>
        <ValueInput value={value} onChange={setValue} onEnter={add} placeholder={t('pg.randomPh')} />
        <OpButton primary onClick={add} disabled={s.busy}>{isStack ? 'push' : 'enqueue'}</OpButton>
        <OpButton onClick={remove} disabled={s.busy}>{isStack ? 'pop' : 'dequeue'}</OpButton>
        <OpButton onClick={peek} disabled={s.busy}>{isStack ? 'peek' : 'front'}</OpButton>
      </>}
      legend={[['bg-emerald-500', t('pg.entering')], ['bg-rose-500', t('pg.leaving')], ['bg-ink', t('pg.queried')]]}
    >
      {isStack ? (
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-faint mb-2">{t('pg.top')}</span>
          <div className="flex flex-col-reverse gap-1.5 px-3 pb-3 pt-1 border-x-2 border-b-2 border-ink/25 rounded-b-xl min-h-[60px] min-w-[96px] items-center justify-start">
            {items.map(box)}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-faint whitespace-pre">{t('pg.front')}</span>
          <div className="flex gap-1.5 px-3 py-3 border-y-2 border-ink/25 min-w-[120px] min-h-[68px] items-center">
            {items.map(box)}
          </div>
          <span className="text-[11px] text-faint whitespace-pre">{t('pg.back')}</span>
        </div>
      )}
    </Playground>
  )
}
