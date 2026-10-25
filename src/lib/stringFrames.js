// Quadros de animação dos algoritmos de busca em strings.
// Cada quadro: alinhamento do padrão (shift), comparação atual, ocorrências achadas,
// janela destacada, explicação e dados auxiliares (tabelas, hashes, bits).

const show = c => (c === ' ' ? '␣' : c)

function recorder(n, m, aux) {
  const frames = []
  const found = []
  let comparisons = 0
  return {
    frames,
    found,
    push(f) { frames.push({ shift: 0, cmp: null, window: null, aux, ...f, found: [...found], comparisons }) },
    compare(t, p, ok, extra) { comparisons++; this.push({ cmp: { t, p, ok }, ...extra }) },
    done() {
      this.push({
        shift: Math.max(0, n - m), aux: frames.at(-1)?.aux ?? aux, note: found.length
          ? `Fim: ${found.length} ${found.length === 1 ? 'ocorrência' : 'ocorrências'} (posição ${found.join(', ')}) com ${comparisons} comparações de caracteres.`
          : `Fim: nenhuma ocorrência, ${comparisons} comparações de caracteres.`,
      })
      return frames
    },
  }
}

function naive(t, p) {
  const n = t.length, m = p.length
  const r = recorder(n, m, null)
  r.push({ note: 'Força bruta: testa cada alinhamento, comparando da esquerda para a direita.' })
  for (let s = 0; s <= n - m; s++) {
    for (let j = 0; j < m; j++) {
      const ok = t[s + j] === p[j]
      r.compare(s + j, j, ok, {
        shift: s,
        note: ok ? `texto[${s + j}] = '${show(p[j])}' ✓` : `texto[${s + j}] = '${show(t[s + j])}' ≠ '${show(p[j])}' → desloca o padrão 1 posição.`,
      })
      if (!ok) break
      if (j === m - 1) { r.found.push(s); r.push({ shift: s, note: `Ocorrência na posição ${s}! Desloca 1 posição e continua.` }) }
    }
  }
  return r.done()
}

export function lpsTable(p) {
  const lps = new Array(p.length).fill(0)
  for (let i = 1, k = 0; i < p.length; i++) {
    while (k > 0 && p[i] !== p[k]) k = lps[k - 1]
    if (p[i] === p[k]) k++
    lps[i] = k
  }
  return lps
}

function kmp(t, p) {
  const n = t.length, m = p.length
  const lps = lpsTable(p)
  const r = recorder(n, m, { kind: 'lps', values: lps })
  r.push({ note: `Tabela LPS calculada: [${lps.join(', ')}]. O índice do texto nunca vai voltar.` })
  let j = 0
  for (let i = 0; i < n; i++) {
    while (true) {
      const ok = t[i] === p[j]
      if (ok) {
        r.compare(i, j, true, { shift: i - j, note: `texto[${i}] = '${show(t[i])}' = padrão[${j}] ✓` })
        j++
        if (j === m) {
          r.found.push(i - m + 1)
          const next = lps[m - 1]
          r.push({ shift: i - m + 1, note: `Ocorrência na posição ${i - m + 1}! Continua com j = lps[${m - 1}] = ${next}, aproveitando o sufixo que já casou.` })
          j = next
        }
        break
      }
      if (j > 0) {
        const next = lps[j - 1]
        r.compare(i, j, false, { shift: i - j, note: `'${show(t[i])}' ≠ '${show(p[j])}': j = lps[${j - 1}] = ${next}. O padrão salta ${j - next} ${j - next === 1 ? 'posição' : 'posições'}, e o texto não retrocede.` })
        j = next
      } else {
        r.compare(i, 0, false, { shift: i, note: `'${show(t[i])}' ≠ '${show(p[0])}' com j = 0: avança no texto.` })
        break
      }
    }
  }
  return r.done()
}

function rabinKarp(t, p) {
  const n = t.length, m = p.length
  const B = 256, Q = 101 // módulo pequeno de propósito: colisões falsas aparecem de vez em quando
  let h = 1
  for (let k = 0; k < m - 1; k++) h = (h * B) % Q
  let hp = 0, ht = 0
  for (let k = 0; k < m; k++) {
    hp = (hp * B + p.charCodeAt(k)) % Q
    ht = (ht * B + t.charCodeAt(k)) % Q
  }
  const r = recorder(n, m, null)
  r.push({ note: `hash(padrão) = ${hp} (base ${B}, módulo ${Q}). Agora, o hash de cada janela do texto.`, aux: { kind: 'hash', pattern: hp, window: ht } })
  for (let s = 0; s <= n - m; s++) {
    const aux = { kind: 'hash', pattern: hp, window: ht }
    if (ht !== hp) {
      r.push({ shift: s, window: [s, s + m - 1], aux, note: `Janela ${s}: hash ${ht} ≠ ${hp} → descarta sem comparar nenhuma letra.` })
    } else {
      r.push({ shift: s, window: [s, s + m - 1], aux, note: `Janela ${s}: hash ${ht} = ${hp} → confere letra a letra.` })
      let j = 0
      while (j < m) {
        const ok = t[s + j] === p[j]
        r.compare(s + j, j, ok, { shift: s, window: [s, s + m - 1], aux, note: ok ? `'${show(p[j])}' ✓` : `'${show(t[s + j])}' ≠ '${show(p[j])}': colisão falsa — hashes iguais, textos diferentes.` })
        if (!ok) break
        j++
      }
      if (j === m) { r.found.push(s); r.push({ shift: s, window: [s, s + m - 1], aux, note: `Ocorrência confirmada na posição ${s}!` }) }
    }
    if (s < n - m) ht = (((ht - t.charCodeAt(s) * h) % Q + Q) * B + t.charCodeAt(s + m)) % Q
  }
  return r.done()
}

export function horspoolTable(p) {
  const m = p.length
  const table = new Map()
  for (let j = 0; j < m - 1; j++) table.set(p[j], m - 1 - j)
  return table
}

function horspool(t, p) {
  const n = t.length, m = p.length
  const table = horspoolTable(p)
  const entries = [...table.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([c, v]) => [show(c), v])
  const r = recorder(n, m, { kind: 'table', title: 'Salto pelo último caractere', entries: [...entries, ['outros', m]] })
  r.push({ note: 'Compara da direita para a esquerda; o salto depende só do caractere sob a última posição do padrão.' })
  let s = 0
  while (s <= n - m) {
    let j = m - 1
    while (j >= 0) {
      const ok = t[s + j] === p[j]
      const c = t[s + m - 1], d = table.get(c) ?? m
      if (!ok) {
        r.compare(s + j, j, false, { shift: s, note: `'${show(t[s + j])}' ≠ '${show(p[j])}'. Último caractere da janela: '${show(c)}' → salta ${d}.` })
        break
      }
      r.compare(s + j, j, true, { shift: s, note: `'${show(p[j])}' ✓ (da direita para a esquerda)` })
      j--
    }
    const d = table.get(t[s + m - 1]) ?? m
    if (j < 0) { r.found.push(s); r.push({ shift: s, note: `Ocorrência na posição ${s}! Último caractere '${show(t[s + m - 1])}' → salta ${d}.` }) }
    s += d
  }
  return r.done()
}

// Regra do bom sufixo (versão forte): salto[j] para um erro na posição j − 1.
export function goodSuffixTable(p) {
  const m = p.length
  const shift = new Array(m + 1).fill(0), border = new Array(m + 1).fill(0)
  let i = m, j = m + 1
  border[i] = j
  while (i > 0) {
    while (j <= m && p[i - 1] !== p[j - 1]) {
      if (shift[j] === 0) shift[j] = j - i
      j = border[j]
    }
    i--; j--
    border[i] = j
  }
  j = border[0]
  for (i = 0; i <= m; i++) {
    if (shift[i] === 0) shift[i] = j
    if (i === j) j = border[j]
  }
  return shift
}

function boyerMoore(t, p) {
  const n = t.length, m = p.length
  const last = new Map()
  for (let k = 0; k < m; k++) last.set(p[k], k)
  const gs = goodSuffixTable(p)
  const entries = [...last.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([c, v]) => [show(c), v])
  const r = recorder(n, m, { kind: 'table', title: 'Última posição no padrão', entries: [...entries, ['outros', -1]] })
  r.push({ note: 'Compara da direita para a esquerda e, em cada erro, usa o maior salto entre "mau caractere" e "bom sufixo".' })
  let s = 0
  while (s <= n - m) {
    let j = m - 1
    while (j >= 0) {
      const ok = t[s + j] === p[j]
      if (!ok) {
        const c = t[s + j]
        const bc = j - (last.get(c) ?? -1)
        const good = gs[j + 1]
        r.compare(s + j, j, false, { shift: s, note: `'${show(c)}' ≠ '${show(p[j])}'. Mau caractere: salta ${bc}. Bom sufixo: salta ${good}. Usa ${Math.max(bc, good)}.` })
        s += Math.max(bc, good)
        break
      }
      r.compare(s + j, j, true, { shift: s, note: `'${show(p[j])}' ✓ (da direita para a esquerda)` })
      j--
    }
    if (j < 0) {
      r.found.push(s)
      r.push({ shift: s, note: `Ocorrência na posição ${s}! Salta ${gs[0]} pela regra do bom sufixo.` })
      s += gs[0]
    }
  }
  return r.done()
}

function shiftOr(t, p) {
  const n = t.length, m = p.length
  const all = (1 << m) - 1
  const mask = new Map()
  for (let j = 0; j < m; j++) mask.set(p[j], (mask.get(p[j]) ?? all) & ~(1 << j))
  const bits = d => Array.from({ length: m }, (_, j) => ((d >> j) & 1 ? '1' : '0'))
  const entries = [...mask.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([c, v]) => [show(c), bits(v).join('')])
  const masks = [...entries, ['outros', '1'.repeat(m)]]
  const r = recorder(n, m, null)
  let D = all
  r.push({ aux: { kind: 'bits', bits: bits(D), masks }, note: 'Estado inicial: todos os bits em 1 — nenhum prefixo do padrão está casando.' })
  for (let i = 0; i < n; i++) {
    D = ((D << 1) | (mask.get(t[i]) ?? all)) & all
    const b = bits(D)
    const matching = b.map((x, j) => (x === '0' ? j + 1 : null)).filter(Boolean)
    const hit = !(D & (1 << (m - 1)))
    if (hit) r.found.push(i - m + 1)
    r.push({
      shift: Math.max(0, i - m + 1),
      cursor: i,
      aux: { kind: 'bits', bits: b, masks },
      note: `Lê '${show(t[i])}': D = (D << 1) | máscara['${show(t[i])}'] = ${b.join('')}. ` + (hit
        ? `O bit ${m - 1} zerou: ocorrência na posição ${i - m + 1}!`
        : matching.length ? `Prefixos de tamanho ${matching.join(', ')} casam terminando aqui.` : 'Nenhum prefixo casando.'),
    })
  }
  return r.done()
}

export const stringSearches = {
  'naive-string-search': { run: naive, preset: ['AABAACAADAABAABA', 'AABA'] },
  'kmp': { run: kmp, preset: ['ABABDABACDABABCABAB', 'ABABCABAB'] },
  'rabin-karp': { run: rabinKarp, preset: ['ALGORITMOS E RITMOS', 'RITMO'] },
  'boyer-moore': { run: boyerMoore, preset: ['HERE IS A SIMPLE EXAMPLE', 'EXAMPLE'] },
  'horspool': { run: horspool, preset: ['HERE IS A SIMPLE EXAMPLE', 'EXAMPLE'] },
  'shift-or': { run: shiftOr, preset: ['AABAACAADAABAABA', 'AABA'] },
}
