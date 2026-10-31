import AlgorithmThumb from '../../src/components/AlgorithmThumb'
import CategoryIcon from '../../src/components/CategoryIcon'

// Imagem de compartilhamento (1200 × 630) desenhada em SVG e convertida em PNG no build.
// As cores são literais (sem variáveis CSS): o renderizador não conhece o tema do site.
export const W = 1200, H = 630
const C = { paper: '#fcfcfb', subtle: '#f5f5f3', line: '#e9e9e6', ink: '#111113', muted: '#686870', faint: '#a0a0a8', accent: '#2554d6' }

// Quebra o texto em linhas de até `max` caracteres (aproximação da largura da fonte).
function wrap(text, max, lines) {
  const out = []
  let cur = ''
  for (const word of text.split(/\s+/)) {
    if ((cur + ' ' + word).trim().length > max && cur) { out.push(cur); cur = word } else cur = (cur + ' ' + word).trim()
  }
  if (cur) out.push(cur)
  if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].replace(/[\s,;:.—-]*\S*$/, '') + '…' }
  return out
}

// Escolhe o maior tamanho de título que cabe em até 2 linhas (ou 3, no menor tamanho).
function fitTitle(text, width) {
  for (const size of [72, 62, 54]) {
    const lines = wrap(text, Math.floor(width / (size * 0.56)), 3)
    if (lines.length <= 2 || size === 54) return { size, lines }
  }
}

function Brand({ x, y }) {
  return (
    <text x={x} y={y} fontFamily="Geist" fontSize="30" fill={C.ink}>
      <tspan fontWeight="600">ALL</tspan><tspan fill={C.muted}>gorithm</tspan>
    </text>
  )
}

export function ShareCard({ kicker, categoryId, title, summary, badge, thumb, domain }) {
  const left = 80, textWidth = thumb ? 560 : 1040
  const t = fitTitle(title, textWidth)
  const titleTop = 250
  const summaryLines = wrap(summary, Math.floor(textWidth / (28 * 0.5)), thumb ? 3 : 2)
  const summaryTop = titleTop + (t.lines.length - 1) * t.size * 1.08 + 62
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect width={W} height={H} fill={C.paper} />
      <rect x="0" y="0" width={W} height="10" fill={C.accent} />
      <Brand x={left} y={98} />

      {categoryId && (
        <g transform={`translate(${left}, 140)`}>
          <rect width="52" height="52" rx="14" fill={C.accent} fillOpacity="0.1" />
          <svg x="12" y="12" width="28" height="28"><CategoryIcon id={categoryId} className="" /></svg>
        </g>
      )}
      <text x={categoryId ? left + 68 : left} y={175} fontFamily="Geist" fontSize="26" fill={C.muted}>{kicker}</text>

      <text fontFamily="Geist" fontWeight="600" fontSize={t.size} fill={C.ink} letterSpacing={-t.size * 0.03}>
        {t.lines.map((line, i) => <tspan key={i} x={left} y={titleTop + i * t.size * 1.08}>{line}</tspan>)}
      </text>
      <text fontFamily="Geist" fontSize="28" fill={C.muted}>
        {summaryLines.map((line, i) => <tspan key={i} x={left} y={summaryTop + i * 40}>{line}</tspan>)}
      </text>

      <g transform={`translate(${left}, ${H - 92})`}>
        {badge && (
          <>
            <rect width={badge.length * 17 + 36} height="46" rx="23" fill={C.subtle} stroke={C.line} />
            <text x="18" y="31" fontFamily="Geist Mono" fontWeight="500" fontSize="24" fill={C.ink}>{badge}</text>
          </>
        )}
      </g>
      <text x={W - 80} y={H - 60} textAnchor="end" fontFamily="Geist" fontSize="24" fill={C.faint}>{domain}</text>

      {thumb && (
        <g>
          <rect x="690" y="150" width="430" height="300" rx="28" fill={C.subtle} stroke={C.line} />
          <svg x="715" y="185" width="380" height="230" viewBox="0 0 160 90">
            <AlgorithmThumb algorithm={thumb} />
          </svg>
        </g>
      )}
    </svg>
  )
}

// Cores do tema claro usadas pelas miniaturas e ícones (que no site vêm de variáveis CSS).
export const themeVars = {
  'rgb(var(--accent))': C.accent,
  'rgb(var(--faint))': C.faint,
  'rgb(var(--line))': C.line,
  'rgb(var(--ink))': C.ink,
  'rgb(var(--surface))': '#ffffff',
}
