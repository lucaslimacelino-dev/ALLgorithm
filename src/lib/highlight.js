// Realce de sintaxe minimalista (sem dependências) para os trechos de código.

const KEYWORDS = {
  python: 'def return if elif else for while in not and or is None True False import from as class pass break continue lambda yield with try except finally raise global nonlocal del assert self',
  javascript: 'function return if else for while do const let var new class extends this of in typeof instanceof null undefined true false break continue switch case default try catch finally throw async await yield import export from static',
  java: 'public private protected static void int long double float boolean char byte short class new return if else for while do break continue import package this null true false final extends implements interface try catch finally throw throws var record',
  cpp: 'int long double float bool char void auto const return if else for while do break continue struct class public private new delete using namespace true false nullptr template typename static unsigned',
}

const keywordSets = Object.fromEntries(
  Object.entries(KEYWORDS).map(([lang, words]) => [lang, new Set(words.split(' '))]),
)

const PREPROC = /#[ \t]*\w+(?:[ \t]*<[^>\n]*>)?/.source
const NEVER = /(?!)/.source
const COMMENT_C = /\/\/.*|\/\*[\s\S]*?\*\//.source
const COMMENT_PY = /#.*/.source
const STRING = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/.source
const NUMBER = /\b\d[\d_]*(?:\.\d+)?\b/.source
const IDENT = /[A-Za-z_]\w*/.source

export function tokenize(code, lang) {
  const pre = lang === 'cpp' ? PREPROC : NEVER
  const comment = lang === 'python' ? COMMENT_PY : COMMENT_C
  const re = new RegExp(`(${pre})|(${comment})|(${STRING})|(${NUMBER})|(${IDENT})`, 'g')
  const keywords = keywordSets[lang] ?? new Set()
  const tokens = []
  let last = 0
  let m

  while ((m = re.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), type: 'plain' })
    const [text, preproc, comm, str, num, ident] = m
    let type = 'plain'
    if (preproc) type = 'keyword'
    else if (comm) type = 'comment'
    else if (str) type = 'string'
    else if (num) type = 'number'
    else if (ident) {
      if (keywords.has(ident)) type = 'keyword'
      else if (/^\s*\(/.test(code.slice(re.lastIndex))) type = 'fn'
      else if (/^[A-Z]/.test(ident)) type = 'type'
    }
    tokens.push({ text, type })
    last = re.lastIndex
  }
  if (last < code.length) tokens.push({ text: code.slice(last), type: 'plain' })
  return tokens
}

// Remove a indentação comum para que o código possa ser escrito indentado nos arquivos de dados.
export function dedent(code) {
  const lines = code.replace(/^\n/, '').replace(/\s+$/, '').split('\n')
  const indent = Math.min(
    ...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length),
  )
  return lines.map(l => l.slice(indent)).join('\n')
}
