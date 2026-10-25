# ALLgorithm

**A enciclopédia visual de algoritmos.** Uma biblioteca gratuita com algoritmos organizados por categoria, do mais simples ao mais avançado.

## Deploy
Link do projeto: https://fasterithm-web.vercel.app

## O que cada algoritmo tem
- Descrição e complexidade (melhor, médio e pior caso, e espaço)
- Passo a passo de como funciona
- Implementação em Python, JavaScript, Java e C++ (a linguagem escolhida fica salva)
- Onde é usado
- Aplicações em cenários reais
- Curiosidades

## Estrutura
- `src/config/site.js` — nome e slogan do site (troque aqui para renomear)
- `src/data/index.js` — categorias, linguagens e níveis
- `src/data/algorithms/<categoria>.js` — conteúdo de cada algoritmo
- `src/pages/` — Início, Biblioteca (`/algoritmos`) e página do algoritmo (`/algoritmos/:id`)

### Adicionando um algoritmo
Inclua um objeto no arquivo da categoria com os campos `id`, `name`, `difficulty`, `summary`, `description`, `complexity`, `steps`, `usedIn`, `realWorld`, `curiosities` e `code` (`python`, `javascript`, `java`, `cpp`). O campo opcional `facts` (ex.: `{ 'Criado por': 'Tony Hoare', 'Ano': '1959' }`) aparece no quadro-resumo do artigo.

## Design
- Tema claro e escuro com cores em variáveis CSS (`src/index.css`)
- Tipografia: Geist (texto), Geist Mono (código) e Instrument Serif (detalhes editoriais)

## Tecnologias
- React + React Router
- Vite
- Tailwind CSS

## Rodando localmente
```bash
npm install
npm run dev
```
