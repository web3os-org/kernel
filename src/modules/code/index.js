import * as monaco from 'monaco-editor'

export const name = 'code'
export const description = 'Monaco-powered Code Editor'
export const help = `
  Usage:
    code <filename>        Open <filename> in code editor
`

export async function run (terminal, filename) {
  const { kernel, log } = terminal

  filename = (!filename || filename === '') ? `/tmp/code.${Math.random().toString(36).substr(2)}` : filename
  filename = kernel.utils.path.resolve(terminal.cwd, filename)

  const fileParts =kernel.utils.path.parse(filename)
  const extension = fileParts.ext

  let language

  switch (extension) {
    case '.js':
      language = 'javascript'
      break
    case '.json':
      language = 'json'
      break
    case '.yml':
      language = 'yaml'
      break
    default:
      language = 'plaintext'
  }

  const content = document.createElement('div')

  if (!kernel.fs.existsSync(filename)) kernel.fs.writeFileSync(filename, '')
  const value = kernel.fs.readFileSync(filename, 'utf8')

  console.log({ value })

  monaco.editor.create(content, {
    value,
    language,
    theme: 'vs-dark'
  })

  const win = kernel.appWindow({
    title: `Code: ${filename}`,
    mount: content
  })
}