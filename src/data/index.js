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
const contentLoaders = import.meta.glob('./algorithms/*.js')
const loaderOf = category => contentLoaders[`./algorithms/${category}.js`]

export async function loadAlgorithmContent(id) {
  const meta = getAlgorithm(id)
  const module = await loaderOf(meta.category)()
  return { ...meta, ...module.default.find(a => a.id === id) }
}

// Começa a baixar o conteúdo antes do clique (ao passar o mouse em um link).
export function preloadAlgorithm(id) {
  const meta = getAlgorithm(id)
  if (meta) loaderOf(meta.category)().catch(() => {})
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
export const upcomingCategories = [
  'Sistemas Distribuídos', 'Processamento de Sinais', 'Análise Sintática', 'Algoritmos Quânticos',
]
