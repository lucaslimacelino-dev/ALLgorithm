import { lazy } from 'react'
import { hasSortingVisualizer } from '../../lib/sortingFrames'
import { arraySearches } from '../../lib/searchFrames'
import { gridSearches } from '../../lib/gridSearch'
import { stringSearches } from '../../lib/stringFrames'
import { graphAlgorithms } from '../../lib/graphFrames'
import { numberAlgorithms } from '../../lib/numberFrames'
import { numericTraces } from '../../lib/numericFrames'
import { compressionTraces } from '../../lib/compressionFrames'

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
}

// Devolve o componente de visualização do algoritmo, ou null se ele ainda não tiver um.
export function getVisualizer(id) {
  if (byId[id]) return byId[id]
  if (hasSortingVisualizer(id)) return SortingVisualizer
  if (id in arraySearches) return ArraySearchVisualizer
  if (id in gridSearches) return GridSearchVisualizer
  if (id in stringSearches) return StringSearchVisualizer
  if (id in graphAlgorithms) return GraphVisualizer
  if (id in numberAlgorithms || id in numericTraces || id in compressionTraces) return NumberTraceVisualizer
  return null
}
