import path from 'path'
import MarkdownIt from 'markdown-it'

export const name = 'md'
export const version = '0.1.0'
export const description = 'Markdown Viewer'

export let markdown

export async function run (term, filename) {
  const { kernel } = term
  if (!filename || filename === '') throw new Error(colors.danger('Invalid filename') + '\n' + help)
  filename = path.resolve(term.cwd, filename)
  if (!kernel.fs.existsSync(filename)) throw new Error(colors.danger('Invalid filename') + '\n' + help)

  markdown = new MarkdownIt()

  const data = kernel.fs.readFileSync(filename, 'utf-8')
  let html = markdown.render(data.replace(/<!--[\s\S]*?-->/g, ''))
  html = html.replace(/\<a/g, '<a target="blank"')

  const wrapper = document.createElement('div')
  wrapper.style.padding = '1rem'
  wrapper.innerHTML = html

  kernel.appWindow({
    title: filename,
    mount: wrapper
  })
}
