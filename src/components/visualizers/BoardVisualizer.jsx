import { useMemo, useState } from 'react'
import { SUDOKU_EXAMPLE, queensFrames, sudokuFrames } from '../../lib/dpFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const KIND_COLOR = { place: 'bg-emerald-400/40', forced: 'bg-emerald-400/25', conflict: 'bg-rose-500/40', back: 'bg-amber-400/50' }

// Backtracking em tabuleiros: N-rainhas e Sudoku.
export default function BoardVisualizer({ algorithm }) {
  const { t } = useI18n()
  const isSudoku = algorithm.id === 'sudoku'
  const example = isSudoku ? { grade: SUDOKU_EXAMPLE } : { n: '6' }
  const [input, setInput] = useState(example)
  const build = v => (isSudoku ? sudokuFrames(v.grade) : queensFrames(Number(v.n)))
  const frames = useMemo(() => build(input), [input]) // eslint-disable-line react-hooks/exhaustive-deps
  const player = usePlayer(frames.length, { speedScale: isSudoku ? 0.6 : 0.5 })
  const f = frames[player.step]
  const N = f.n
  const size = isSudoku ? 'w-8 h-8 sm:w-9 sm:h-9 text-sm' : N > 8 ? 'w-8 h-8 text-lg' : 'w-10 h-10 sm:w-11 sm:h-11 text-xl'

  const cellAt = (r, c) => (isSudoku ? f.cells[r * 9 + c] : f.cells[r][c])
  const isCur = (r, c) => (isSudoku ? f.cur === r * 9 + c : f.cur && f.cur[0] === r && f.cur[1] === c)
  const bg = (r, c) => {
    if (isCur(r, c)) return KIND_COLOR[f.kind] ?? 'bg-amber-400/40'
    if (!isSudoku && f.conflict && f.conflict[0] === r && f.conflict[1] === c) return 'bg-rose-500/25'
    if (isSudoku) return 'bg-surface'
    return (r + c) % 2 ? 'bg-subtle' : 'bg-surface'
  }
  const border = (r, c) => (isSudoku ? `${c % 3 === 2 && c < 8 ? 'border-r-2 border-r-ink/40' : ''} ${r % 3 === 2 && r < 8 ? 'border-b-2 border-b-ink/40' : ''}` : '')

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={isSudoku ? [{ name: 'grade', label: t('viz.sudokuInput'), max: 100 }] : [{ name: 'n', label: 'N (4–10)', max: 2, width: 'w-28' }]}
          values={input}
          example={example}
          valid={v => build(v).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="flex justify-center overflow-x-auto">
          <div className="inline-grid border border-line rounded-lg overflow-hidden" style={{ gridTemplateColumns: `repeat(${N}, auto)` }}>
            {Array.from({ length: N * N }, (_, i) => {
              const r = Math.floor(i / N), c = i % N, v = cellAt(r, c)
              const given = isSudoku && f.fixed[i]
              return (
                <span key={i} className={`${size} grid place-items-center border border-line/60 transition-colors duration-200 ${bg(r, c)} ${border(r, c)} ${given ? 'font-semibold text-ink' : isSudoku ? 'text-accent font-medium' : 'text-ink'}`}>
                  {v === 'Q' ? '♛' : v ?? ''}
                </span>
              )
            })}
          </div>
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-emerald-400/60', t('viz.placed')], ['bg-rose-500/50', t('viz.conflict')], ['bg-amber-400/60', t('viz.backtrack')]]}
        status={t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
