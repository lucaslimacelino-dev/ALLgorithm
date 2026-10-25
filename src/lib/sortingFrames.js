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

// Escreve de volta no array, em ordem, os valores de uma lista auxiliar.
const writeBack = (values, set, from = 0) => values.forEach((v, k) => set(from + k, v))

const generators = {
  'bogosort': (a, { compare, swap }) => {
    const isSorted = () => {
      for (let i = 0; i < a.length - 1; i++) {
        compare(i, i + 1)
        if (a[i] > a[i + 1]) return false
      }
      return true
    }
    for (let tries = 0; tries < 5000 && !isSorted(); tries++) {
      for (let i = a.length - 1; i > 0; i--) swap(i, Math.floor(Math.random() * (i + 1)))
    }
  },

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

  'cocktail-sort': (a, { compare, swap, done }) => {
    let start = 0, end = a.length - 1, swapped = true
    while (swapped) {
      swapped = false
      for (let i = start; i < end; i++) {
        compare(i, i + 1)
        if (a[i] > a[i + 1]) { swap(i, i + 1); swapped = true }
      }
      done(end--)
      if (!swapped) break
      swapped = false
      for (let i = end - 1; i >= start; i--) {
        compare(i, i + 1)
        if (a[i] > a[i + 1]) { swap(i, i + 1); swapped = true }
      }
      done(start++)
    }
  },

  'comb-sort': (a, { compare, swap }) => {
    let gap = a.length, sorted = false
    while (!sorted) {
      gap = Math.floor(gap / 1.3)
      if (gap <= 1) { gap = 1; sorted = true }
      for (let i = 0; i + gap < a.length; i++) {
        compare(i, i + gap)
        if (a[i] > a[i + gap]) { swap(i, i + gap); sorted = false }
      }
    }
  },

  'gnome-sort': (a, { compare, swap }) => {
    let i = 0
    while (i < a.length) {
      if (i > 0) compare(i - 1, i)
      if (i === 0 || a[i - 1] <= a[i]) i++
      else { swap(i, i - 1); i-- }
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

  'shell-sort': (a, { compare, swap }) => {
    for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < a.length; i++) {
        for (let j = i; j >= gap; j -= gap) {
          compare(j - gap, j)
          if (a[j - gap] <= a[j]) break
          swap(j - gap, j)
        }
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

  'smoothsort': (a, { compare, swap, done }) => {
    const L = [1, 1]
    while (L[L.length - 1] < a.length) L.push(L[L.length - 1] + L[L.length - 2] + 1)
    const sift = (root, k) => {
      while (k >= 2) {
        const right = root - 1, left = root - 1 - L[k - 2]
        compare(left, right)
        const [child, kChild] = a[left] >= a[right] ? [left, k - 1] : [right, k - 2]
        compare(root, child)
        if (a[root] >= a[child]) break
        swap(root, child)
        root = child
        k = kChild
      }
    }
    const rectify = (root, orders, t) => {
      while (t > 0) {
        const k = orders[t], prev = root - L[k]
        compare(prev, root)
        if (a[prev] <= a[root]) break
        if (k >= 2 && (a[prev] <= a[root - 1] || a[prev] <= a[root - 1 - L[k - 2]])) break
        swap(prev, root)
        root = prev
        t--
      }
      sift(root, orders[t])
    }
    const orders = []
    for (let i = 0; i < a.length; i++) {
      const m = orders.length
      if (m >= 2 && orders[m - 2] === orders[m - 1] + 1) { orders.pop(); orders[m - 2]++ }
      else if (m > 0 && orders[m - 1] === 1) orders.push(0)
      else orders.push(1)
      rectify(i, orders, orders.length - 1)
    }
    for (let i = a.length - 1; i > 0; i--) {
      done(i)
      const k = orders.pop()
      if (k >= 2) {
        orders.push(k - 1)
        rectify(i - 1 - L[k - 2], orders, orders.length - 1)
        orders.push(k - 2)
        rectify(i - 1, orders, orders.length - 1)
      }
    }
  },

  'pancake-sort': (a, { compare, swap, done }) => {
    const flip = k => { for (let i = 0, j = k; i < j; i++, j--) swap(i, j) }
    for (let size = a.length; size > 1; size--) {
      let max = 0
      for (let i = 1; i < size; i++) { compare(max, i); if (a[i] > a[max]) max = i }
      if (max !== size - 1) { flip(max); flip(size - 1) }
      done(size - 1)
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

  'pigeonhole-sort': (a, { compare, set, done }) => {
    const min = Math.min(...a)
    const holes = Array.from({ length: Math.max(...a) - min + 1 }, () => [])
    a.forEach((v, i) => { compare(i, i); holes[v - min].push(v) })
    let k = 0
    holes.forEach(h => h.forEach(v => { set(k, v); done(k); k++ }))
  },

  'bucket-sort': (a, { compare, set }) => {
    const max = Math.max(...a) + 1
    const buckets = Array.from({ length: 5 }, () => [])
    a.forEach((v, i) => { compare(i, i); buckets[Math.floor((v * buckets.length) / max)].push(v) })
    // Escreve os baldes em sequência e ordena cada trecho com insertion sort.
    let start = 0
    buckets.forEach(b => {
      writeBack(b, set, start)
      for (let i = start + 1; i < start + b.length; i++) {
        for (let j = i; j > start; j--) {
          compare(j - 1, j)
          if (a[j - 1] <= a[j]) break
          const tmp = a[j]; set(j, a[j - 1]); set(j - 1, tmp)
        }
      }
      start += b.length
    })
  },

  'radix-sort': (a, { compare, set }) => {
    for (let exp = 1; Math.floor(Math.max(...a) / exp) > 0; exp *= 10) {
      const digits = Array.from({ length: 10 }, () => [])
      a.forEach((v, i) => { compare(i, i); digits[Math.floor(v / exp) % 10].push(v) })
      writeBack(digits.flat(), set)
    }
  },
}

// Bogosort só termina em tempo razoável com pouquíssimos elementos.
const sizes = { 'bogosort': 5 }

export const hasSortingVisualizer = id => id in generators
export const visualizerSize = id => sizes[id] ?? 24

export function buildFrames(id, input) {
  return record(input, generators[id])
}
