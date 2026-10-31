// Gera, depois do build, as imagens de compartilhamento (PNG 1200 × 630) e uma página HTML por
// artigo e por categoria com as tags Open Graph — redes sociais e apps de mensagem não executam
// JavaScript, então leem só o HTML servido para aquele endereço.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { Resvg } from '@resvg/resvg-js'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const fonts = ['Geist-Regular.ttf', 'Geist-SemiBold.ttf', 'GeistMono-Medium.ttf'].map(f => resolve(here, 'fonts', f))

const escape = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Endereço público do site: SITE_URL, ou o domínio de produção informado pela Vercel no build.
function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'https://fasterithm-web.vercel.app'
}

function page(template, { title, description, path, image, type = 'website', canonical = true }) {
  const url = siteUrl() + path
  const tags = [
    ['property', 'og:type', type], ['property', 'og:site_name', 'ALLgorithm'], ['property', 'og:locale', 'pt_BR'],
    ['property', 'og:title', title], ['property', 'og:description', description], ['property', 'og:url', url],
    ['property', 'og:image', siteUrl() + image], ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'],
    ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', title],
    ['name', 'twitter:description', description], ['name', 'twitter:image', siteUrl() + image],
  ].map(([attr, key, value]) => `    <meta ${attr}="${key}" content="${escape(value)}" />`).join('\n')
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`)
    .replace('</head>', `${canonical ? `    <link rel="canonical" href="${escape(url)}" />\n` : ''}${tags}\n  </head>`)
}

export async function generateShareImages(outDir) {
  const started = Date.now()
  const server = await createServer({ root, configFile: false, plugins: [react()], logLevel: 'error', appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false } })
  try {
    // React vem do node_modules (CommonJS): importado direto, é a mesma instância usada pelos componentes.
    const { renderToStaticMarkup } = await import('react-dom/server')
    const { createElement } = await import('react')
    const { ShareCard, themeVars } = await server.ssrLoadModule('/scripts/og/ShareCard.jsx')
    const { categoryList } = await server.ssrLoadModule('/src/data/categories.js')

    const domain = new URL(siteUrl()).host
    const png = async (name, props) => {
      let svg = renderToStaticMarkup(createElement(ShareCard, { domain, ...props }))
      for (const [from, to] of Object.entries(themeVars)) svg = svg.split(from).join(to)
      svg = svg.split('currentColor').join(themeVars['rgb(var(--accent))'])
      const image = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Geist' } }).render().asPng()
      await mkdir(resolve(outDir, 'og'), { recursive: true })
      await writeFile(resolve(outDir, 'og', `${name}.png`), image)
      return `/og/${name}.png`
    }
    const write = async (path, html) => {
      // /algoritmos/x → algoritmos/x.html, servido sem a extensão graças ao cleanUrls do vercel.json
      const file = resolve(outDir, `${path.replace(/^\//, '')}.html`)
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, html)
    }

    const template = await readFile(resolve(outDir, 'index.html'), 'utf8')
    const all = []
    let count = 0
    for (const cat of categoryList) {
      const items = (await server.ssrLoadModule(`/src/data/algorithms/${cat.id}.js`)).default.map(a => ({ ...a, category: cat.id }))
      all.push(...items)
      for (const a of items) {
        const badge = a.complexity?.average && a.complexity.average.length <= 22 ? a.complexity.average : null
        const image = await png(a.id, { kicker: cat.title, categoryId: cat.id, title: a.name, summary: a.summary, badge, thumb: a })
        await write(`/algoritmos/${a.id}`, page(template, { title: `${a.name} — ALLgorithm`, description: a.summary, path: `/algoritmos/${a.id}`, image, type: 'article' }))
        count++
      }
      const image = await png(`categoria-${cat.id}`, { kicker: `${items.length} artigos`, categoryId: cat.id, title: cat.title, summary: cat.description, thumb: items[Math.floor(items.length / 2)] })
      await write(`/categorias/${cat.id}`, page(template, { title: `${cat.title} — ALLgorithm`, description: cat.description, path: `/categorias/${cat.id}`, image }))
      count++
    }

    // Página inicial: a mesma tag no index.html, que também serve de base às rotas sem página própria.
    const home = await png('home', { kicker: `${all.length} algoritmos · ${categoryList.length} categorias`, title: 'A enciclopédia visual de algoritmos', summary: 'Visualizações interativas, código em 4 linguagens e aplicações reais. Gratuita e sem anúncios.', thumb: all.find(a => a.id === 'dijkstra') })
    const description = template.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
    await writeFile(resolve(outDir, 'index.html'), page(template, { title: template.match(/<title>([^<]*)<\/title>/)[1], description, path: '/', image: home, canonical: false }))
    console.log(`share images: ${count + 1} páginas e imagens em ${((Date.now() - started) / 1000).toFixed(1)} s`)
  } finally {
    await server.close()
  }
}
