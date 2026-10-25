// Gera os "quadros" de animação de cada algoritmo de ordenação.
// Cada quadro guarda o estado do array, os índices ativos e os já ordenados.

function record(input, run) {
  const a = [...input]
  const sorted = new Set()
  const frames = [{ arr: [...a], active: [], kind: null, sorted: [] }]
  const push = (active, kind) => frames.push({ arr: [...a], active, kind, sorted: [...sorted] })

  const api = {
    compare: (i, j) => push([i, j], 'compare'),
    swap: (i, j) => { [a[i], a[j]] = [a[j], a[i]]; push([i, j], 'swap') },
    set: (i, v) => { a[i] = v; push([i], 'swap') },
    done: (...idx) => idx.forEach(i => sorted.add(i)),
  }

  run(a, api)
  frames.push({ arr: [...a], active: [], kind: null, sorted: a.map((_, i) => i) })
  return frames
}

const generators = {
  'bubble-sort': (a, { compare, swap, done }) => {
    const n = a.length
    for (let i = 0; i < n - 1; i++) {
      let swapped = false
      for (let j = 0; j < n - 1 - i; j++) {
        compare(j, j + 1)
        if (a[j] > a[j + 1]) { swap(j, j + 1); swapped = true }
      }
      done(n - 1 - i)
      if (!swapped) break
    }
  },

  'selection-sort': (a, { compare, swap, done }) => {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i
      for (let j = i + 1; j < a.length; j++) {
        compare(min, j)
        if (a[j] < a[min]) min = j
      }
      if (min !== i) swap(i, min)
      done(i)
    }
  },

  'insertion-sort': (a, { compare, swap }) => {
    for (let i = 1; i < a.length; i++) {
      let j = i
      while (j > 0) {
        compare(j - 1, j)
        if (a[j - 1] <= a[j]) break
        swap(j - 1, j)
        j--
      }
    }
  },

  'merge-sort': (a, { compare, set }) => {
    const sort = (l, r) => {
      if (r - l < 1) return
      const m = Math.floor((l + r) / 2)
      sort(l, m)
      sort(m + 1, r)
      const left = a.slice(l, m + 1)
      const right = a.slice(m + 1, r + 1)
      let i = 0, j = 0, k = l
      while (i < left.length && j < right.length) {
        compare(l + i, m + 1 + j)
        set(k++, left[i] <= right[j] ? left[i++] : right[j++])
      }
      while (i < left.length) set(k++, left[i++])
      while (j < right.length) set(k++, right[j++])
    }
    sort(0, a.length - 1)
  },

  'quick-sort': (a, { compare, swap, done }) => {
    const sort = (lo, hi) => {
      if (lo > hi) return
      if (lo === hi) { done(lo); return }
      let i = lo
      for (let j = lo; j < hi; j++) {
        compare(j, hi)
        if (a[j] < a[hi]) { swap(i, j); i++ }
      }
      swap(i, hi)
      done(i)
      sort(lo, i - 1)
      sort(i + 1, hi)
    }
    sort(0, a.length - 1)
  },

  'heap-sort': (a, { compare, swap, done }) => {
    const sift = (n, i) => {
      while (true) {
        let big = i
        const l = 2 * i + 1, r = 2 * i + 2
        if (l < n) { compare(l, big); if (a[l] > a[big]) big = l }
        if (r < n) { compare(r, big); if (a[r] > a[big]) big = r }
        if (big === i) return
        swap(i, big)
        i = big
      }
    }
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) sift(a.length, i)
    for (let end = a.length - 1; end > 0; end--) {
      swap(0, end)
      done(end)
      sift(end, 0)
    }
  },

  'counting-sort': (a, { compare, set, done }) => {
    const count = new Array(Math.max(...a) + 1).fill(0)
    a.forEach((v, i) => { compare(i, i); count[v]++ })
    let k = 0
    count.forEach((qty, v) => {
      for (let q = 0; q < qty; q++) { set(k, v); done(k); k++ }
    })
  },
}

export const hasSortingVisualizer = id => id in generators

export function buildFrames(id, input) {
  return record(input, generators[id])
}
