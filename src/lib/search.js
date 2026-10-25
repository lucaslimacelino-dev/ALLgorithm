import { algorithms, getCategory } from '../data'

export const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// 0 = nome começa com o termo, 1 = nome contém, 2 = resumo/usos/categoria contêm, -1 = não combina.
export function matchScore(algorithm, query) {
  const q = normalize(query.trim())
  if (!q) return 0
  const name = normalize(algorithm.name)
  if (name.startsWith(q)) return 0
  if (name.includes(q)) return 1
  const rest = normalize(`${algorithm.summary} ${algorithm.usedIn.join(' ')} ${getCategory(algorithm.category).title}`)
  return rest.includes(q) ? 2 : -1
}

export function searchAlgorithms(query) {
  if (!query.trim()) return []
  return algorithms
    .map(a => ({ a, score: matchScore(a, query) }))
    .filter(r => r.score >= 0)
    .sort((x, y) => x.score - y.score)
    .map(r => r.a)
}
