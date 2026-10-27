// Temas dentro de cada categoria: agrupam os algoritmos pela ideia que eles usam ou pelo problema
// que resolvem (em vez de por nível de dificuldade). A ordem dos ids é a ordem de exibição.
export const topics = {
  ordenacao: [
    { title: 'Trocas e inserções', en: 'Swaps and insertions', ids: ['bubble-sort', 'selection-sort', 'insertion-sort', 'gnome-sort', 'cocktail-sort', 'comb-sort', 'shell-sort'] },
    { title: 'Dividir para conquistar', en: 'Divide and conquer', ids: ['merge-sort', 'quick-sort'] },
    { title: 'Com heaps', en: 'Heap-based', ids: ['heap-sort', 'smoothsort'] },
    { title: 'Sem comparações', en: 'Without comparisons', ids: ['counting-sort', 'pigeonhole-sort', 'bucket-sort', 'radix-sort'] },
    { title: 'Curiosidades', en: 'Curiosities', ids: ['bogosort', 'pancake-sort'] },
  ],
  busca: [
    { title: 'Em listas', en: 'In lists', ids: ['linear-search', 'binary-search', 'interpolation-search', 'exponential-search', 'rotated-binary-search'] },
    { title: 'Em estruturas de dados', en: 'In data structures', ids: ['hash-search', 'bst-search'] },
    { title: 'Em grafos e mapas', en: 'In graphs and maps', ids: ['bfs', 'dfs', 'best-first-search', 'a-star'] },
  ],
  estruturas: [
    { title: 'Lineares', en: 'Linear', ids: ['stack', 'queue', 'linked-list'] },
    { title: 'Árvores', en: 'Trees', ids: ['binary-heap', 'trie', 'avl-tree'] },
    { title: 'Conjuntos', en: 'Sets', ids: ['union-find'] },
  ],
  strings: [
    { title: 'Força bruta e hashing', en: 'Brute force and hashing', ids: ['naive-string-search', 'rabin-karp'] },
    { title: 'Saltos com tabelas', en: 'Skipping with tables', ids: ['kmp', 'boyer-moore', 'horspool'] },
    { title: 'Paralelismo de bits', en: 'Bit parallelism', ids: ['shift-or'] },
  ],
  grafos: [
    { title: 'Caminhos mínimos', en: 'Shortest paths', ids: ['dijkstra', 'bellman-ford', 'floyd-warshall'] },
    { title: 'Árvores geradoras mínimas', en: 'Minimum spanning trees', ids: ['prim', 'kruskal', 'boruvka'] },
    { title: 'Fluxo máximo', en: 'Maximum flow', ids: ['ford-fulkerson', 'edmonds-karp'] },
    { title: 'Ordem, rotas e desenho', en: 'Ordering, routing and drawing', ids: ['topological-sort', 'clarke-wright', 'force-directed'] },
  ],
  matematica: [
    { title: 'Aritmética', en: 'Arithmetic', ids: ['euclid', 'fast-exponentiation', 'karatsuba'] },
    { title: 'Números primos', en: 'Prime numbers', ids: ['sieve-of-eratosthenes', 'miller-rabin', 'aks'] },
    { title: 'Fatoração', en: 'Factorization', ids: ['trial-division', 'fermat-factorization', 'pollard-rho', 'pollard-p-1', 'quadratic-sieve', 'lenstra-ecm', 'number-field-sieve'] },
  ],
  numericos: [
    { title: 'Calculando números', en: 'Computing numbers', ids: ['rounding', 'babylonian-sqrt', 'nth-root-digits', 'gauss-legendre'] },
    { title: 'Raízes de funções', en: 'Roots of functions', ids: ['newton-method', 'secant-method', 'false-position'] },
    { title: 'Álgebra linear', en: 'Linear algebra', ids: ['gauss-jordan', 'gram-schmidt', 'power-iteration'] },
    { title: 'Curvas', en: 'Curves', ids: ['de-casteljau', 'de-boor'] },
  ],
  compressao: [
    { title: 'Transformações', en: 'Transforms', ids: ['run-length-encoding', 'delta-encoding', 'incremental-encoding', 'move-to-front', 'burrows-wheeler'] },
    { title: 'Códigos de entropia', en: 'Entropy coding', ids: ['huffman-coding', 'shannon-fano', 'arithmetic-coding'] },
    { title: 'Dicionário (família LZ)', en: 'Dictionary (LZ family)', ids: ['lz77', 'lz78', 'lzw', 'deflate'] },
  ],
  geometria: [
    { title: 'Pontos e polígonos', en: 'Points and polygons', ids: ['shoelace-formula', 'segment-intersection', 'point-in-polygon', 'closest-pair'] },
    { title: 'Envoltório convexo', en: 'Convex hull', ids: ['gift-wrapping', 'graham-scan'] },
    { title: 'Pixels na tela', en: 'Pixels on screen', ids: ['bresenham-line', 'midpoint-circle', 'flood-fill'] },
    { title: 'Renderização', en: 'Rendering', ids: ['cohen-sutherland', 'painters-algorithm', 'ray-tracing'] },
  ],
  criptografia: [
    { title: 'Cifras clássicas', en: 'Classical ciphers', ids: ['caesar-cipher', 'vigenere-cipher', 'one-time-pad'] },
    { title: 'Cifras simétricas', en: 'Symmetric ciphers', ids: ['rc4', 'des', 'aes', 'blowfish', 'idea'] },
    { title: 'Hashes e autenticação', en: 'Hashes and authentication', ids: ['md4', 'md5', 'sha-1', 'ripemd-160', 'hmac'] },
    { title: 'Chave pública', en: 'Public key', ids: ['rsa', 'diffie-hellman', 'elgamal', 'dsa', 'elliptic-curve', 'ntru'] },
  ],
  'programacao-dinamica': [
    { title: 'Sequências e textos', en: 'Sequences and text', ids: ['fibonacci-dp', 'lcs', 'edit-distance', 'lis'] },
    { title: 'Escolhas e somas', en: 'Choices and sums', ids: ['coin-change', 'knapsack', 'subset-sum', 'matrix-chain'] },
    { title: 'Backtracking', en: 'Backtracking', ids: ['n-queens', 'sudoku'] },
  ],
  otimizacao: [
    { title: 'Busca local', en: 'Local search', ids: ['gradient-descent', 'hill-climbing', 'simulated-annealing'] },
    { title: 'Inspirados na natureza', en: 'Nature-inspired', ids: ['genetic-algorithm', 'ant-colony'] },
    { title: 'Programação linear', en: 'Linear programming', ids: ['simplex'] },
  ],
  sinais: [
    { title: 'Filtros e transformadas', en: 'Filters and transforms', ids: ['moving-average', 'dft', 'fft'] },
    { title: 'Cálculo em hardware', en: 'Hardware arithmetic', ids: ['cordic'] },
    { title: 'Engenharia e medicina', en: 'Engineering and medicine', ids: ['rainflow', 'osem'] },
  ],
  distribuidos: [
    { title: 'Ordem dos eventos', en: 'Ordering events', ids: ['lamport-clocks', 'vector-clocks'] },
    { title: 'Estado global', en: 'Global state', ids: ['chandy-lamport'] },
  ],
  linguagens: [
    { title: 'Análise sintática', en: 'Parsing', ids: ['recursive-descent', 'cyk', 'earley'] },
    { title: 'Limites da computação', en: 'Limits of computation', ids: ['halting-problem'] },
  ],
  bits: [
    { title: 'Detecção e correção de erros', en: 'Error detection and correction', ids: ['parity-bit', 'crc', 'hamming-code'] },
    { title: 'Truques e conversões', en: 'Tricks and conversions', ids: ['xor-swap', 'chs-conversion'] },
  ],
  quanticos: [
    { title: 'Consultas a oráculos', en: 'Oracle queries', ids: ['deutsch-jozsa', 'grover'] },
    { title: 'Fatoração', en: 'Factorization', ids: ['shor'] },
  ],
  algebra: [
    { title: 'Polinômios', en: 'Polynomials', ids: ['multivariate-division', 'buchberger'] },
    { title: 'Reescrita de palavras', en: 'Word rewriting', ids: ['knuth-bendix'] },
  ],
}
