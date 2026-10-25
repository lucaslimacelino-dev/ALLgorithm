import { algorithms, getCategory } from '../data'
import { localize } from '../i18n'

export const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// 0 = nome começa com o termo, 1 = nome contém, 2 = resumo/usos/categoria contêm, -1 = não combina.
// Procura no idioma atual e também no original, para "busca binária" e "binary search" acharem o mesmo artigo.
export function matchScore(algorithm, query, locale = 'pt') {
  const q = normalize(query.trim())
  if (!q) return 0
  const local = localize(algorithm, locale)
  const category = getCategory(algorithm.category)
  const names = [local.name, algorithm.name].map(normalize)
  if (names.some(n => n.startsWith(q))) return 0
  if (names.some(n => n.includes(q))) return 1
  const rest = normalize([
    local.summary, algorithm.summary, ...local.usedIn, ...algorithm.usedIn,
    category.title, localize(category, locale).title,
  ].join(' '))
  return rest.includes(q) ? 2 : -1
}

export function searchAlgorithms(query, locale) {
  if (!query.trim()) return []
  return algorithms
    .map(a => ({ a, score: matchScore(a, query, locale) }))
    .filter(r => r.score >= 0)
    .sort((x, y) => x.score - y.score)
    .map(r => r.a)
}
