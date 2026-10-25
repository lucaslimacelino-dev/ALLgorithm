import { useState } from 'react'
import { OpButton, Playground, TreeSvg, ValueInput, layoutBinary, randomInt, useAnimatedState } from './common'
import { useI18n } from '../../../i18n'

// Árvore imutável: cada operação devolve novos nós, para podermos mostrar o "antes" e o "depois".
const h = n => (n ? n.h : 0)
const mk = (key, left, right) => ({ key, left, right, h: 1 + Math.max(h(left), h(right)) })
const balanceOf = n => h(n.left) - h(n.right)
const rotRight = y => mk(y.left.key, y.left.left, mk(y.key, y.left.right, y.right))
const rotLeft = x => mk(x.right.key, mk(x.key, x.left, x.right.left), x.right.right)

function bstInsert(n, k) {
  if (!n) return mk(k, null, null)
  if (k < n.key) return mk(n.key, bstInsert(n.left, k), n.right)
  if (k > n.key) return mk(n.key, n.left, bstInsert(n.right, k))
  return n
}

function avlInsert(n, k, log) {
  if (!n) return mk(k, null, null)
  if (k < n.key) n = mk(n.key, avlInsert(n.left, k, log), n.right)
  else if (k > n.key) n = mk(n.key, n.left, avlInsert(n.right, k, log))
  else return n
  const b = balanceOf(n)
  if (b > 1 && k < n.left.key) { log.push({ text: `rotação simples à direita em ${n.key}`, pivot: n.key }); return rotRight(n) }
  if (b < -1 && k > n.right.key) { log.push({ text: `rotação simples à esquerda em ${n.key}`, pivot: n.key }); return rotLeft(n) }
  if (b > 1) { log.push({ text: `rotação dupla (esquerda em ${n.left.key}, depois direita em ${n.key})`, pivot: n.key }); return rotRight(mk(n.key, rotLeft(n.left), n.right)) }
  if (b < -1) { log.push({ text: `rotação dupla (direita em ${n.right.key}, depois esquerda em ${n.key})`, pivot: n.key }); return rotLeft(mk(n.key, n.left, rotRight(n.right))) }
  return n
}

const contains = (n, k) => !!n && (n.key === k || contains(k < n.key ? n.left : n.right, k))

function insertFrames(tree, k) {
  if (contains(tree, k)) return [{ state: tree, hl: { [k]: 'found' }, note: `${k} já está na árvore.` }]
  const raw = bstInsert(tree, k)
  const log = []
  const balanced = avlInsert(tree, k, log)
  if (!log.length) {
    return [{ state: raw, hl: { [k]: 'new' }, note: `Inserir ${k}: todos os fatores de balanceamento continuam entre −1 e +1. Nenhuma rotação necessária.` }]
  }
  const { pivot, text } = log[0]
  return [
    { state: raw, hl: { [k]: 'new', [pivot]: 'remove' }, note: `Inserir ${k} como numa BST comum… o nó ${pivot} ficou desbalanceado (fator ${balanceOf(findNode(raw, pivot)) > 0 ? '+' : ''}${balanceOf(findNode(raw, pivot))}).` },
    { state: balanced, hl: { [k]: 'new', [pivot]: 'active' }, note: `Corrige com ${text}. Altura da árvore: ${h(balanced)}.` },
  ]
}

const findNode = (n, k) => (!n || n.key === k ? n : findNode(k < n.key ? n.left : n.right, k))

const fromValues = vals => vals.reduce((t, v) => avlInsert(t, v, []), null)

export default function AvlPlayground() {
  const { t } = useI18n()
  const s = useAnimatedState(fromValues([40, 20, 60, 10, 30]), 'Os números pequenos acima de cada nó são o fator de balanceamento (altura esquerda − altura direita). Na AVL, ele fica sempre entre −1 e +1.')
  const [value, setValue] = useState('')
  const tree = s.state

  const insert = () => {
    if (h(tree) >= 6) return s.play([{ state: tree, hl: {}, note: 'A árvore já está grande para a demonstração — reinicie para continuar.' }])
    const v = value === '' ? randomInt(1, 99) : Number(value)
    setValue('')
    s.play(insertFrames(tree, v))
  }

  // Insere 1, 2, 3… em ordem: o pior caso de uma BST comum, que a AVL mantém equilibrado.
  const sequence = () => {
    let t = null
    const frames = []
    for (let v = 1; v <= 7; v++) {
      const f = insertFrames(t, v)
      frames.push(...f)
      t = f.at(-1).state
    }
    frames.push({ state: t, hl: {}, note: 'Valores inseridos em ordem crescente: uma BST comum viraria uma "lista" de altura 7; a AVL ficou com altura 3.' })
    s.play(frames)
  }

  return (
    <Playground
      note={s.note}
      controls={<>
        <ValueInput value={value} onChange={setValue} onEnter={insert} placeholder={t('pg.randomPh')} />
        <OpButton primary onClick={insert} disabled={s.busy}>{t('pg.insert')}</OpButton>
        <OpButton onClick={sequence} disabled={s.busy}>{t('pg.insertSequence')}</OpButton>
        <OpButton onClick={() => s.play([{ state: null, hl: {}, note: 'Árvore vazia.' }])} disabled={s.busy}>{t('viz.clear')}</OpButton>
      </>}
      legend={[['bg-emerald-500', t('pg.inserted')], ['bg-rose-500', t('pg.unbalanced')], ['bg-amber-400', t('pg.afterRotation')]]}
    >
      <TreeSvg
        layout={layoutBinary(tree)}
        label={n => n.key}
        sublabel={n => { const b = balanceOf(n); return b > 0 ? `+${b}` : `${b}` }}
        toneOf={n => s.hl[n.key] ?? 'idle'}
        rowH={68}
      />
    </Playground>
  )
}
