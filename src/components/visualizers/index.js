import { lazy } from 'react'

// Cada visualizador é um pedaço separado do bundle, carregado só quando o artigo é aberto.
const SortingVisualizer = lazy(() => import('./SortingVisualizer'))
const ArraySearchVisualizer = lazy(() => import('./ArraySearchVisualizer'))
const GridSearchVisualizer = lazy(() => import('./GridSearchVisualizer'))
const StringSearchVisualizer = lazy(() => import('./StringSearchVisualizer'))
const GraphVisualizer = lazy(() => import('./GraphVisualizer'))
const NumberTraceVisualizer = lazy(() => import('./NumberTraceVisualizer'))
const RootFindingVisualizer = lazy(() => import('./RootFindingVisualizer'))
const CurveVisualizer = lazy(() => import('./CurveVisualizer'))
const CodeTreeVisualizer = lazy(() => import('./CodeTreeVisualizer'))
const GeometryVisualizer = lazy(() => import('./GeometryVisualizer'))
const RasterVisualizer = lazy(() => import('./RasterVisualizer'))
const ClassicCipherVisualizer = lazy(() => import('./ClassicCipherVisualizer'))
const DigestVisualizer = lazy(() => import('./DigestVisualizer'))
const DpTableVisualizer = lazy(() => import('./DpTableVisualizer'))
const BoardVisualizer = lazy(() => import('./BoardVisualizer'))

const byId = {
  'bst-search': lazy(() => import('./BstVisualizer')),
  'hash-search': lazy(() => import('./HashVisualizer')),
  'stack': lazy(() => import('./structures/StackQueuePlayground')),
  'queue': lazy(() => import('./structures/StackQueuePlayground')),
  'linked-list': lazy(() => import('./structures/LinkedListPlayground')),
  'binary-heap': lazy(() => import('./structures/HeapPlayground')),
  'trie': lazy(() => import('./structures/TriePlayground')),
  'union-find': lazy(() => import('./structures/UnionFindPlayground')),
  'avl-tree': lazy(() => import('./structures/AvlPlayground')),
  'force-directed': lazy(() => import('./ForceLayoutVisualizer')),
  'sieve-of-eratosthenes': lazy(() => import('./SieveVisualizer')),
  'newton-method': RootFindingVisualizer,
  'secant-method': RootFindingVisualizer,
  'false-position': RootFindingVisualizer,
  'gauss-jordan': lazy(() => import('./MatrixVisualizer')),
  'gram-schmidt': lazy(() => import('./GramSchmidtVisualizer')),
  'de-casteljau': CurveVisualizer,
  'de-boor': CurveVisualizer,
  'huffman-coding': CodeTreeVisualizer,
  'shannon-fano': CodeTreeVisualizer,
  'lz77': lazy(() => import('./Lz77Visualizer')),
  'arithmetic-coding': lazy(() => import('./ArithmeticVisualizer')),
  'burrows-wheeler': lazy(() => import('./BwtVisualizer')),
  'shoelace-formula': GeometryVisualizer,
  'segment-intersection': GeometryVisualizer,
  'point-in-polygon': GeometryVisualizer,
  'gift-wrapping': GeometryVisualizer,
  'graham-scan': GeometryVisualizer,
  'closest-pair': GeometryVisualizer,
  'cohen-sutherland': GeometryVisualizer,
  'painters-algorithm': GeometryVisualizer,
  'bresenham-line': RasterVisualizer,
  'midpoint-circle': RasterVisualizer,
  'flood-fill': RasterVisualizer,
  'ray-tracing': lazy(() => import('./RayTracerVisualizer')),
  'caesar-cipher': ClassicCipherVisualizer,
  'vigenere-cipher': ClassicCipherVisualizer,
  'md4': DigestVisualizer,
  'md5': DigestVisualizer,
  'sha-1': DigestVisualizer,
  'ripemd-160': DigestVisualizer,
  'aes': lazy(() => import('./AesVisualizer')),
  'diffie-hellman': lazy(() => import('./DiffieHellmanVisualizer')),
  'elliptic-curve': lazy(() => import('./EllipticCurveVisualizer')),
  'fibonacci-dp': DpTableVisualizer,
  'coin-change': DpTableVisualizer,
  'knapsack': DpTableVisualizer,
  'lcs': DpTableVisualizer,
  'edit-distance': DpTableVisualizer,
  'subset-sum': DpTableVisualizer,
  'lis': DpTableVisualizer,
  'matrix-chain': DpTableVisualizer,
  'n-queens': BoardVisualizer,
  'sudoku': BoardVisualizer,
}

// Visualizadores compartilhados por famílias de algoritmos. As listas de ids ficam aqui (e não
// importadas dos módulos de quadros) para que esses módulos não entrem no pacote principal.
const shared = [
  [SortingVisualizer, ['bogosort', 'bubble-sort', 'selection-sort', 'insertion-sort', 'gnome-sort', 'cocktail-sort', 'comb-sort', 'shell-sort', 'merge-sort', 'quick-sort', 'heap-sort', 'counting-sort', 'pigeonhole-sort', 'bucket-sort', 'radix-sort', 'pancake-sort', 'smoothsort']],
  [ArraySearchVisualizer, ['linear-search', 'binary-search', 'interpolation-search', 'exponential-search', 'rotated-binary-search']],
  [GridSearchVisualizer, ['bfs', 'dfs', 'best-first-search', 'a-star']],
  [StringSearchVisualizer, ['naive-string-search', 'kmp', 'rabin-karp', 'boyer-moore', 'horspool', 'shift-or']],
  [GraphVisualizer, ['dijkstra', 'bellman-ford', 'floyd-warshall', 'kruskal', 'prim', 'boruvka', 'topological-sort', 'ford-fulkerson', 'edmonds-karp', 'clarke-wright']],
  [NumberTraceVisualizer, ['euclid', 'trial-division', 'fast-exponentiation', 'karatsuba', 'miller-rabin', 'fermat-factorization', 'pollard-rho', 'pollard-p-1', 'quadratic-sieve', 'lenstra-ecm', 'aks', 'rounding', 'babylonian-sqrt', 'nth-root-digits', 'gauss-legendre', 'power-iteration', 'run-length-encoding', 'delta-encoding', 'incremental-encoding', 'move-to-front', 'lz78', 'lzw', 'deflate', 'one-time-pad', 'rc4', 'hmac', 'des', 'blowfish', 'idea', 'rsa', 'elgamal', 'dsa', 'ntru']],
]
for (const [component, ids] of shared) for (const id of ids) byId[id] ??= component

// Devolve o componente de visualização do algoritmo, ou null se ele ainda não tiver um.
export const getVisualizer = id => byId[id] ?? null
