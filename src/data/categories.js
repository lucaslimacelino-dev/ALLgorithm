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
]

// Campos incluídos no índice carregado com o site (busca, biblioteca, página inicial).
// O restante (código, passos, aplicações…) é carregado só quando o artigo é aberto.
// As traduções ficam no campo "en" de cada algoritmo, com os mesmos nomes de campo.
export const indexFields = ['id', 'name', 'difficulty', 'summary', 'description', 'usedIn', 'complexity', 'operations', 'curiosities']
