import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const VIRTUAL_ID = 'virtual:algorithm-index'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const dataDir = resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/data')

// Gera, a partir dos arquivos de dados, um índice leve com só os campos usados em listas e buscas.
// Assim o conteúdo pesado (códigos, passos…) pode ser carregado sob demanda, sem duplicar dados.
function algorithmIndex() {
  const load = async file => (await import(`${pathToFileURL(file).href}?t=${Date.now()}`))

  return {
    name: 'algorithm-index',
    resolveId: id => (id === VIRTUAL_ID ? RESOLVED_ID : null),
    async load(id) {
      if (id !== RESOLVED_ID) return null
      const categoriesFile = resolve(dataDir, 'categories.js')
      this.addWatchFile(categoriesFile)
      const { categoryList, indexFields } = await load(categoriesFile)
      const index = {}
      for (const { id: cat } of categoryList) {
        const file = resolve(dataDir, 'algorithms', `${cat}.js`)
        this.addWatchFile(file)
        const items = (await load(file)).default
        const pick = obj => Object.fromEntries(indexFields.filter(f => f in obj).map(f => [f, obj[f]]))
        index[cat] = items.map(a => ({ ...pick(a), ...(a.en ? { en: pick(a.en) } : {}) }))
      }
      return `export default ${JSON.stringify(index)}`
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(dataDir.replace(/\\/g, '/'))) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), algorithmIndex()],
})
