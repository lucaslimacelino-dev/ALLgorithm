import { hasSortingVisualizer } from '../../lib/sortingFrames'
import { arraySearches } from '../../lib/searchFrames'
import { gridSearches } from '../../lib/gridSearch'
import SortingVisualizer from './SortingVisualizer'
import ArraySearchVisualizer from './ArraySearchVisualizer'
import GridSearchVisualizer from './GridSearchVisualizer'
import BstVisualizer from './BstVisualizer'
import HashVisualizer from './HashVisualizer'

const byId = {
  'bst-search': BstVisualizer,
  'hash-search': HashVisualizer,
}

// Devolve o componente de visualização do algoritmo, ou null se ele ainda não tiver um.
export function getVisualizer(id) {
  if (byId[id]) return byId[id]
  if (hasSortingVisualizer(id)) return SortingVisualizer
  if (id in arraySearches) return ArraySearchVisualizer
  if (id in gridSearches) return GridSearchVisualizer
  return null
}
