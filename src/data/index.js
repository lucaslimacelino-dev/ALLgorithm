import ordenacao from './algorithms/ordenacao'
import busca from './algorithms/busca'

// Grupos na ordem em que aparecem no site (dos mais simples aos mais avançados).
// Para adicionar um algoritmo, basta incluí-lo no arquivo da categoria correspondente.
export const categories = [
  { id: 'ordenacao', title: 'Ordenação', icon: '⇅', description: 'Colocar dados em ordem — a base de buscas, rankings e bancos de dados.', items: ordenacao },
  { id: 'busca', title: 'Busca', icon: '◎', description: 'Encontrar um elemento em listas, árvores, tabelas e grafos — do jeito mais rápido possível.', items: busca },
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
  'Iniciante':     'bg-emerald-500',
  'Intermediário': 'bg-amber-500',
  'Avançado':      'bg-rose-500',
}

// Categorias planejadas, exibidas como "em preparação" na página inicial.
export const upcomingCategories = [
  'Estruturas de Dados', 'Busca em Strings', 'Grafos', 'Teoria dos Números',
  'Métodos Numéricos', 'Compressão', 'Geometria Computacional', 'Computação Gráfica',
  'Criptografia', 'Programação Dinâmica', 'Otimização', 'Backtracking', 'Algoritmos Evolutivos',
  'Sistemas Distribuídos', 'Processamento de Sinais', 'Análise Sintática', 'Algoritmos Quânticos',
]
