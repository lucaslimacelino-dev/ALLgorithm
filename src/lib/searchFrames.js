// Quadros de animação das buscas em listas.
// Cada quadro: faixa ainda considerada [lo, hi], posição sondada, posição encontrada e uma explicação.

const frame = (lo, hi, probe, note, found = null) => ({ lo, hi, probe, found, note })

function linear(a, t) {
  const frames = [frame(0, a.length - 1, null, `Procurar ${t} percorrendo a lista do início ao fim.`)]
  for (let i = 0; i < a.length; i++) {
    if (a[i] === t) {
      frames.push(frame(i, a.length - 1, i, `arr[${i}] = ${t} — encontrado após ${i + 1} comparações.`, i))
      return frames
    }
    frames.push(frame(i, a.length - 1, i, `arr[${i}] = ${a[i]} ≠ ${t} → próximo elemento.`))
  }
  frames.push(frame(a.length, a.length - 1, null, `Fim da lista: ${t} não está presente (${a.length} comparações).`))
  return frames
}

// Busca binária em [lo, hi]; acrescenta quadros a "frames" e devolve a contagem de comparações.
function binaryInto(frames, a, t, lo, hi, count = 0) {
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    count++
    if (a[mid] === t) {
      frames.push(frame(lo, hi, mid, `arr[${mid}] = ${t} — encontrado após ${count} comparações.`, mid))
      return count
    }
    if (a[mid] < t) {
      frames.push(frame(lo, hi, mid, `Meio: arr[${mid}] = ${a[mid]} < ${t} → descarta a metade esquerda.`))
      lo = mid + 1
    } else {
      frames.push(frame(lo, hi, mid, `Meio: arr[${mid}] = ${a[mid]} > ${t} → descarta a metade direita.`))
      hi = mid - 1
    }
  }
  frames.push(frame(lo, hi, null, `A faixa ficou vazia: ${t} não está na lista (${count} comparações).`))
  return count
}

function binary(a, t) {
  const frames = [frame(0, a.length - 1, null, `Lista ordenada. Procurar ${t} na faixa inteira (posições 0 a ${a.length - 1}).`)]
  binaryInto(frames, a, t, 0, a.length - 1)
  return frames
}

function interpolation(a, t) {
  const frames = [frame(0, a.length - 1, null, `Estimar onde ${t} deveria estar, como quem abre um dicionário perto da letra certa.`)]
  let lo = 0, hi = a.length - 1, count = 0
  while (lo <= hi && t >= a[lo] && t <= a[hi]) {
    const pos = a[hi] === a[lo] ? lo : lo + Math.floor(((t - a[lo]) * (hi - lo)) / (a[hi] - a[lo]))
    count++
    if (a[pos] === t) {
      frames.push(frame(lo, hi, pos, `Estimativa: posição ${pos}. arr[${pos}] = ${t} — encontrado após ${count} ${count === 1 ? 'tentativa' : 'tentativas'}.`, pos))
      return frames
    }
    if (a[pos] < t) {
      frames.push(frame(lo, hi, pos, `Estimativa: posição ${pos}. arr[${pos}] = ${a[pos]} < ${t} → procura à direita.`))
      lo = pos + 1
    } else {
      frames.push(frame(lo, hi, pos, `Estimativa: posição ${pos}. arr[${pos}] = ${a[pos]} > ${t} → procura à esquerda.`))
      hi = pos - 1
    }
  }
  frames.push(frame(lo, hi, null, `${t} está fora da faixa restante: não está na lista (${count} tentativas).`))
  return frames
}

function exponential(a, t) {
  const frames = [frame(0, a.length - 1, null, `Sem saber o tamanho útil da lista, procurar um limite que passe de ${t}, dobrando a cada passo.`)]
  if (a[0] === t) {
    frames.push(frame(0, a.length - 1, 0, `arr[0] = ${t} — encontrado de primeira.`, 0))
    return frames
  }
  let bound = 1, count = 1
  while (bound < a.length && a[bound] < t) {
    count++
    frames.push(frame(0, a.length - 1, bound, `arr[${bound}] = ${a[bound]} < ${t} → dobra o limite para ${bound * 2}.`))
    bound *= 2
  }
  const lo = Math.floor(bound / 2), hi = Math.min(bound, a.length - 1)
  frames.push(frame(lo, hi, bound < a.length ? bound : null,
    bound < a.length
      ? `arr[${bound}] = ${a[bound]} ≥ ${t}: o alvo está entre as posições ${lo} e ${hi}. Agora, busca binária.`
      : `O limite passou do fim da lista: o alvo está entre as posições ${lo} e ${hi}. Agora, busca binária.`))
  binaryInto(frames, a, t, lo, hi, count)
  return frames
}

function rotatedMin(a) {
  const frames = [frame(0, a.length - 1, null, 'Lista ordenada e "girada". Procurar o menor elemento (o ponto onde a sequência recomeça).')]
  let lo = 0, hi = a.length - 1
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (a[mid] > a[hi]) {
      frames.push(frame(lo, hi, mid, `arr[${mid}] = ${a[mid]} > arr[${hi}] = ${a[hi]} → a "virada" está à direita do meio.`))
      lo = mid + 1
    } else {
      frames.push(frame(lo, hi, mid, `arr[${mid}] = ${a[mid]} ≤ arr[${hi}] = ${a[hi]} → o menor está no meio ou à esquerda.`))
      hi = mid
    }
  }
  frames.push(frame(lo, hi, lo, `Faixa com um só elemento: o menor é arr[${lo}] = ${a[lo]}.`, lo))
  return frames
}

export const arraySearches = {
  'linear-search': { run: linear, data: 'unsorted' },
  'binary-search': { run: binary, data: 'sorted' },
  'interpolation-search': { run: interpolation, data: 'uniform' },
  'exponential-search': { run: exponential, data: 'sorted' },
  'rotated-binary-search': { run: rotatedMin, data: 'rotated', noTarget: true },
}

const distinct = (n, max) => {
  const set = new Set()
  while (set.size < n) set.add(1 + Math.floor(Math.random() * max))
  return [...set]
}

export function makeData(kind, n) {
  if (kind === 'unsorted') return distinct(n, 99)
  if (kind === 'uniform') return Array.from({ length: n }, (_, i) => 3 + i * 5 + Math.floor(Math.random() * 3))
  const sorted = distinct(n, 99).sort((x, y) => x - y)
  if (kind === 'rotated') {
    const k = 1 + Math.floor(Math.random() * (n - 1))
    return [...sorted.slice(k), ...sorted.slice(0, k)]
  }
  return sorted
}
