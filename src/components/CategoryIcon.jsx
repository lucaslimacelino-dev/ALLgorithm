// Pictogramas das categorias (grade 24×24). Elementos: ['p', d] caminho, ['c', cx, cy, r] círculo,
// ['r', x, y, w, h] retângulo; um "f" no fim preenche o elemento. Ao passar o mouse no cartão
// (classe "group"), os traços se redesenham — ver .icon-draw em index.css.
const icons = {
  ordenacao: [['p', 'M5 19v-4M9.7 19v-7M14.3 19V9M19 19V5']],
  busca: [['c', 10.5, 10.5, 6], ['p', 'M15 15l5 5']],
  estruturas: [['c', 12, 5, 2], ['c', 6, 18, 2], ['c', 18, 18, 2], ['p', 'M10.9 6.7L7 16.3M13.1 6.7L17 16.3']],
  strings: [['p', 'M3 18L7 6l4 12M4.4 14h5.2'], ['p', 'M14 9h7M14 13.5h6M14 18h4']],
  grafos: [['c', 5, 6, 2], ['c', 19, 6, 2], ['c', 6, 18, 2], ['c', 18, 18, 2], ['p', 'M7 6h10M5.3 8l.5 8M18.8 8l-.6 8M8 18h8M6.7 7.3l9.8 9.4']],
  matematica: [['p', 'M4 7.5h16M8.5 7.5V19M15.5 7.5V17a2 2 0 0 0 3.5 1.3']],
  numericos: [['p', 'M3 19C9 19 11 5 21 5'], ['p', 'M4 15.5L18 8'], ['c', 11.6, 11.7, 1.6, 'f']],
  compressao: [['p', 'M4 4l5 5M9 5v4H5M20 4l-5 5M15 5v4h4M4 20l5-5M9 19v-4H5M20 20l-5-5M15 19v-4h4']],
  geometria: [['p', 'M4 15L9 4l11 6-4 10H7z'], ['c', 10, 11, 1.2, 'f'], ['c', 14, 14, 1.2, 'f']],
  criptografia: [['r', 5, 11, 14, 9], ['p', 'M8 11V8a4 4 0 0 1 8 0v3'], ['c', 12, 15.5, 1.4, 'f']],
  'programacao-dinamica': [['p', 'M4 4h16v16H4zM4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16'], ['r', 14.6, 14.6, 5.4, 5.4, 'f']],
  otimizacao: [['p', 'M3 6c3 0 4 12 9 12s6-9 9-9'], ['c', 12, 15.2, 1.8, 'f']],
  sinais: [['p', 'M2 12c2-7 4-7 6 0s4 7 6 0 4-7 6 0 1.5 3 2 2']],
  distribuidos: [['p', 'M5 4v16M12 4v16M19 4v16'], ['p', 'M5 7l7 3M12 12l7 3M19 9l-14 8']],
  linguagens: [['p', 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14']],
  bits: [['r', 3, 8, 4, 8, 'f'], ['r', 8.7, 8, 4, 8], ['r', 14.3, 8, 4, 8, 'f'], ['p', 'M21 8v8']],
  quanticos: [['c', 12, 12, 8], ['p', 'M4 12c0 2.6 16 2.6 16 0'], ['p', 'M12 12l4.5-5.5'], ['c', 16.5, 6.5, 1.4, 'f']],
  algebra: [['p', 'M4 9l7 9M11 9l-7 9'], ['p', 'M14 6.5c.3-1.6 3.5-1.6 3.5.2 0 1.5-3.5 2.8-3.5 4.3h3.8']],
}

export default function CategoryIcon({ id, className = '' }) {
  const parts = icons[id] ?? [['c', 12, 12, 7]]
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`icon-draw ${className}`} aria-hidden="true">
      {parts.map(([kind, ...args], i) => {
        const fill = args.at(-1) === 'f' ? { fill: 'currentColor' } : {}
        if (kind === 'c') return <circle key={i} cx={args[0]} cy={args[1]} r={args[2]} pathLength="1" {...fill} />
        if (kind === 'r') return <rect key={i} x={args[0]} y={args[1]} width={args[2]} height={args[3]} rx="1" pathLength="1" {...fill} />
        return <path key={i} d={args[0]} pathLength="1" />
      })}
    </svg>
  )
}
