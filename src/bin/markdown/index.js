import path from 'path'
import colors from 'ansi-colors'
import MarkdownIt from 'markdown-it'

export const name = 'markdown'
export const version = '0.1.0'
export const description = 'Markdown Viewer'
export const help = 'View a .md file'

export let markdown

export async function run (term, filename) {
  const { kernel } = term
  if (!filename || filename === '') throw new Error(colors.danger('Invalid filename'))
  filename = path.resolve(term.cwd, filename)
  if (!kernel.fs.existsSync(filename)) throw new Error(colors.danger('Invalid filename'))

  markdown = new MarkdownIt({ html: true, linkify: true })

  const data = kernel.fs.readFileSync(filename, 'utf-8')
  let html = markdown.render(data.replace(/<!--[\s\S]*?-->/g, ''))
  html = html.replace(/\<a/g, '<a target="blank"')

  const wrapper = document.createElement('div')
  wrapper.style.padding = '1rem'
  wrapper.innerHTML = html
  wrapper.querySelectorAll('a').forEach(a => { a.style.color = '#4287f5' })

  kernel.appWindow({
    title: filename,
    mount: wrapper,
    width: '70%',
    height: '70%'
  })
}
