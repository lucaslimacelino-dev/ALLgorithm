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
- `src/data/categories.js` — lista de categorias e campos que entram no índice leve
- `src/data/index.js` — índice de algoritmos, linguagens, níveis e carregamento sob demanda
- `src/data/algorithms/<categoria>.js` — conteúdo completo de cada algoritmo
- `src/components/visualizers/` — visualizações e playgrounds interativos
- `src/pages/` — Início, Biblioteca (`/algoritmos`) e página do algoritmo (`/algoritmos/:id`)

### Desempenho
O site carrega de início só um índice leve (nome, resumo, nível, complexidade…), gerado no build
pelo plugin `algorithm-index` em `vite.config.js` a partir dos próprios arquivos de dados.
O conteúdo completo de cada categoria e cada visualizador viram arquivos separados, baixados
apenas quando um artigo é aberto (e pré-carregados ao passar o mouse sobre um link).

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
