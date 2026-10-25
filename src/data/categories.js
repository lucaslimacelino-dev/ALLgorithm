// Grupos na ordem em que aparecem no site (dos mais simples aos mais avançados).
// Cada categoria corresponde ao arquivo src/data/algorithms/<id>.js.
// Este arquivo é lido também pelo plugin de build em vite.config.js — mantenha-o sem imports.
export const categoryList = [
  { id: 'ordenacao', title: 'Ordenação', icon: '⇅', description: 'Colocar dados em ordem — a base de buscas, rankings e bancos de dados.' },
  { id: 'busca', title: 'Busca', icon: '◎', description: 'Encontrar um elemento em listas, árvores, tabelas e grafos — do jeito mais rápido possível.' },
  { id: 'estruturas', title: 'Estruturas de Dados', icon: '⬡', description: 'Formas de organizar dados na memória — e o custo de cada operação sobre elas.' },
  { id: 'strings', title: 'Busca em Strings', icon: '❝', description: 'Encontrar um padrão dentro de um texto sem reler o que já foi lido.' },
  { id: 'grafos', title: 'Grafos', icon: '◈', description: 'Mapas, redes e dependências: caminhos mínimos, árvores, fluxos e rotas.' },
]

// Campos incluídos no índice carregado com o site (busca, biblioteca, página inicial).
// O restante (código, passos, aplicações…) é carregado só quando o artigo é aberto.
export const indexFields = ['id', 'name', 'difficulty', 'summary', 'description', 'usedIn', 'complexity', 'operations', 'curiosities']
