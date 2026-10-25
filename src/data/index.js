import ordenacao from './algorithms/ordenacao'

// Grupos na ordem em que aparecem no site (dos mais simples aos mais avançados).
// Para adicionar um algoritmo, basta incluí-lo no arquivo da categoria correspondente.
export const categories = [
  { id: 'ordenacao', title: 'Ordenação', icon: '⇅', description: 'Colocar dados em ordem — a base de buscas, rankings e bancos de dados.', items: ordenacao },
]

export const algorithms = categories.flatMap(c => c.items.map(a => ({ ...a, category: c.id })))

export const getAlgorithm = id => algorithms.find(a => a.id === id)
export const getCategory = id => categories.find(c => c.id === id)

export const languages = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
]

export const difficulties = ['Iniciante', 'Intermediário', 'Avançado']

export const difficultyColor = {
  'Iniciante':     'text-brand-400 bg-brand-500/10 border-brand-500/20',
  'Intermediário': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Avançado':      'text-rose-400 bg-rose-500/10 border-rose-500/20',
}
