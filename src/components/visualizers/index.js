import { hasSortingVisualizer } from '../../lib/sortingFrames'
import { arraySearches } from '../../lib/searchFrames'
import { gridSearches } from '../../lib/gridSearch'
import { stringSearches } from '../../lib/stringFrames'
import StringSearchVisualizer from './StringSearchVisualizer'
import { graphAlgorithms } from '../../lib/graphFrames'
import GraphVisualizer from './GraphVisualizer'
import ForceLayoutVisualizer from './ForceLayoutVisualizer'
import SortingVisualizer from './SortingVisualizer'
import ArraySearchVisualizer from './ArraySearchVisualizer'
import GridSearchVisualizer from './GridSearchVisualizer'
import BstVisualizer from './BstVisualizer'
import HashVisualizer from './HashVisualizer'
import StackQueuePlayground from './structures/StackQueuePlayground'
import LinkedListPlayground from './structures/LinkedListPlayground'
import HeapPlayground from './structures/HeapPlayground'
import TriePlayground from './structures/TriePlayground'
import UnionFindPlayground from './structures/UnionFindPlayground'
import AvlPlayground from './structures/AvlPlayground'

const byId = {
  'bst-search': BstVisualizer,
  'hash-search': HashVisualizer,
  'stack': StackQueuePlayground,
  'queue': StackQueuePlayground,
  'linked-list': LinkedListPlayground,
  'binary-heap': HeapPlayground,
  'trie': TriePlayground,
  'union-find': UnionFindPlayground,
  'avl-tree': AvlPlayground,
  'force-directed': ForceLayoutVisualizer,
}

// Devolve o componente de visualização do algoritmo, ou null se ele ainda não tiver um.
export function getVisualizer(id) {
  if (byId[id]) return byId[id]
  if (hasSortingVisualizer(id)) return SortingVisualizer
  if (id in arraySearches) return ArraySearchVisualizer
  if (id in gridSearches) return GridSearchVisualizer
  if (id in stringSearches) return StringSearchVisualizer
  if (id in graphAlgorithms) return GraphVisualizer
  return null
}
