import ordenacao from './algorithms/ordenacao'
import busca from './algorithms/busca'
import estruturas from './algorithms/estruturas'
import strings from './algorithms/strings'
import grafos from './algorithms/grafos'

// Grupos na ordem em que aparecem no site (dos mais simples aos mais avançados).
// Para adicionar um algoritmo, basta incluí-lo no arquivo da categoria correspondente.
export const categories = [
  { id: 'ordenacao', title: 'Ordenação', icon: '⇅', description: 'Colocar dados em ordem — a base de buscas, rankings e bancos de dados.', items: ordenacao },
  { id: 'busca', title: 'Busca', icon: '◎', description: 'Encontrar um elemento em listas, árvores, tabelas e grafos — do jeito mais rápido possível.', items: busca },
  { id: 'estruturas', title: 'Estruturas de Dados', icon: '⬡', description: 'Formas de organizar dados na memória — e o custo de cada operação sobre elas.', items: estruturas },
  { id: 'strings', title: 'Busca em Strings', icon: '❝', description: 'Encontrar um padrão dentro de um texto sem reler o que já foi lido.', items: strings },
  { id: 'grafos', title: 'Grafos', icon: '◈', description: 'Mapas, redes e dependências: caminhos mínimos, árvores, fluxos e rotas.', items: grafos },
]

export const algorithms = categories.flatMap(c => c.items.map(a => ({ ...a, category: c.id })))

export const getAlgorithm = id => algorithms.find(a => a.id === id)

// Complexidade de destaque: caso médio dos algoritmos ou a primeira operação das estruturas de dados.
export const mainComplexity = a => a.complexity?.average ?? a.operations?.[0]?.[1]
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
  'Teoria dos Números',
  'Métodos Numéricos', 'Compressão', 'Geometria Computacional', 'Computação Gráfica',
  'Criptografia', 'Programação Dinâmica', 'Otimização', 'Backtracking', 'Algoritmos Evolutivos',
  'Sistemas Distribuídos', 'Processamento de Sinais', 'Análise Sintática', 'Algoritmos Quânticos',
]
