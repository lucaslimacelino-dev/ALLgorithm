import algorithmIndex from 'virtual:algorithm-index'
import { categoryList } from './categories'

// Para adicionar um algoritmo, basta incluí-lo em src/data/algorithms/<categoria>.js.
// Aqui ficam só os campos leves (gerados no build); o conteúdo completo vem de loadAlgorithmContent.
export const categories = categoryList.map(c => ({ ...c, items: (algorithmIndex[c.id] ?? []).map(a => ({ ...a, category: c.id })) }))

export const algorithms = categories.flatMap(c => c.items)

export const getAlgorithm = id => algorithms.find(a => a.id === id)

// Complexidade de destaque: caso médio dos algoritmos ou a primeira operação das estruturas de dados.
export const mainComplexity = a => a.complexity?.average ?? a.operations?.[0]?.[1]
export const getCategory = id => categories.find(c => c.id === id)

// Cada arquivo de categoria vira um pedaço (chunk) separado, baixado só quando necessário.
// O corpo dos artigos em inglês fica em algorithms/en/<categoria>.js, indexado pelo id do algoritmo.
const contentLoaders = import.meta.glob('./algorithms/*.js')
const translationLoaders = import.meta.glob('./algorithms/en/*.js')
const loaderOf = category => contentLoaders[`./algorithms/${category}.js`]
const translationOf = category => translationLoaders[`./algorithms/en/${category}.js`]?.() ?? Promise.resolve(null)

export async function loadAlgorithmContent(id) {
  const meta = getAlgorithm(id)
  const [module, translation] = await Promise.all([loaderOf(meta.category)(), translationOf(meta.category)])
  const item = module.default.find(a => a.id === id)
  const body = translation?.default[id]
  return { ...meta, ...item, ...(body ? { en: { ...item.en, ...body } } : {}) }
}

// Começa a baixar o conteúdo antes do clique (ao passar o mouse em um link).
export function preloadAlgorithm(id) {
  const meta = getAlgorithm(id)
  if (meta) Promise.all([loaderOf(meta.category)(), translationOf(meta.category)]).catch(() => {})
}

export const languages = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
]

export const difficulties = ['Iniciante', 'Intermediário', 'Avançado']

export const difficultyColor = {
  'Iniciante':     'bg-emerald-500',
  'Intermediário': 'bg-amber-500',
  'Avançado':      'bg-rose-500',
}

// Categorias planejadas, exibidas como "em preparação" na página inicial.
export const upcomingCategories = []
