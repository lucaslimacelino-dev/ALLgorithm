// Grupos na ordem em que aparecem no site (dos mais simples aos mais avançados).
// Cada categoria corresponde ao arquivo src/data/algorithms/<id>.js.
// Este arquivo é lido também pelo plugin de build em vite.config.js — mantenha-o sem imports.
export const categoryList = [
  {
    id: 'ordenacao', icon: '⇅', title: 'Ordenação', description: 'Colocar dados em ordem — a base de buscas, rankings e bancos de dados.',
    en: { title: 'Sorting', description: 'Putting data in order — the foundation of searching, rankings and databases.' },
  },
  {
    id: 'busca', icon: '◎', title: 'Busca', description: 'Encontrar um elemento em listas, árvores, tabelas e grafos — do jeito mais rápido possível.',
    en: { title: 'Searching', description: 'Finding an element in lists, trees, tables and graphs — as fast as possible.' },
  },
  {
    id: 'estruturas', icon: '⬡', title: 'Estruturas de Dados', description: 'Formas de organizar dados na memória — e o custo de cada operação sobre elas.',
    en: { title: 'Data Structures', description: 'Ways of organizing data in memory — and the cost of each operation on them.' },
  },
  {
    id: 'strings', icon: '❝', title: 'Busca em Strings', description: 'Encontrar um padrão dentro de um texto sem reler o que já foi lido.',
    en: { title: 'String Searching', description: 'Finding a pattern inside a text without rereading what was already read.' },
  },
  {
    id: 'grafos', icon: '◈', title: 'Grafos', description: 'Mapas, redes e dependências: caminhos mínimos, árvores, fluxos e rotas.',
    en: { title: 'Graphs', description: 'Maps, networks and dependencies: shortest paths, trees, flows and routes.' },
  },
  {
    id: 'matematica', icon: '∑', title: 'Teoria dos Números', description: 'Primos, divisores e fatoração: a matemática que sustenta a criptografia moderna.',
    en: { title: 'Number Theory', description: 'Primes, divisors and factorization: the mathematics behind modern cryptography.' },
  },
  {
    id: 'numericos', icon: '√', title: 'Métodos Numéricos', description: 'Raízes, sistemas lineares, curvas e autovalores: o cálculo que roda por trás da ciência e da engenharia.',
    en: { title: 'Numerical Methods', description: 'Roots, linear systems, curves and eigenvalues: the computation behind science and engineering.' },
  },
  {
    id: 'compressao', icon: '⇲', title: 'Compressão', description: 'Do RLE ao DEFLATE: como ZIP, PNG, GIF e bzip2 fazem os dados ocuparem menos espaço.',
    en: { title: 'Compression', description: 'From RLE to DEFLATE: how ZIP, PNG, GIF and bzip2 make data take up less space.' },
  },
  {
    id: 'geometria', icon: '△', title: 'Geometria e Computação Gráfica', description: 'Envoltórios, interseções e polígonos; linhas, círculos, recorte e traçado de raios: da geometria à imagem na tela.',
    en: { title: 'Geometry & Computer Graphics', description: 'Hulls, intersections and polygons; lines, circles, clipping and ray tracing: from geometry to the image on screen.' },
  },
  {
    id: 'criptografia', icon: '⚿', title: 'Criptografia', description: 'Cifras clássicas, cifras de bloco e de fluxo, funções de hash e autenticação: como proteger e verificar dados.',
    en: { title: 'Cryptography', description: 'Classical ciphers, block and stream ciphers, hash functions and authentication: how data is protected and verified.' },
  },
  {
    id: 'programacao-dinamica', icon: '▦', title: 'Programação Dinâmica e Backtracking', description: 'Tabelas que guardam subproblemas e buscas que voltam atrás: mochila, LCS, distância de edição, N-rainhas e Sudoku.',
    en: { title: 'Dynamic Programming & Backtracking', description: 'Tables that store subproblems and searches that backtrack: knapsack, LCS, edit distance, N-queens and Sudoku.' },
  },
  {
    id: 'otimizacao', icon: '⛰', title: 'Otimização e Algoritmos Evolutivos', description: 'Do gradiente ao Simplex, passando por têmpera simulada, algoritmos genéticos e colônias de formigas.',
    en: { title: 'Optimization & Evolutionary Algorithms', description: 'From gradient descent to Simplex, through simulated annealing, genetic algorithms and ant colonies.' },
  },
]

// Campos incluídos no índice carregado com o site (busca, biblioteca, página inicial).
// O restante (código, passos, aplicações…) é carregado só quando o artigo é aberto.
// As traduções ficam no campo "en" de cada algoritmo, com os mesmos nomes de campo.
// Textos longos (descrição, curiosidades) ficam de fora: a página inicial os carrega sob demanda.
export const indexFields = ['id', 'name', 'difficulty', 'summary', 'usedIn', 'complexity', 'operations']
