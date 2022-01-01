import path from 'path-browserify'
import colors from 'ansi-colors'

export const name = 'view'
export const args = ['filename']
export const description = 'Image Viewer'
export const help = `
  Usage:
    view <filename>
`

export async function run (terminal, filename) {
  const { kernel, log } = terminal
  let { fs } = kernel

  if (!filename || filename === '') return log(colors.danger('Invalid filename') + '\n' + help)
  filename = path.resolve(terminal.cwd, filename)
  const fileParts = path.parse(filename)
  const extension = fileParts.ext

  const data = new Blob([fs.readFileSync(filename)])
  const url = URL.createObjectURL(data)

  const content = document.createElement('img')
  content.style.width = '100%'
  content.style.height = '100%'
  content.src = url

  const appWindow = kernel.appWindow({
    title: `Image: ${filename}`,
    mount: content,
    right: '2%',
    width: '60%',
    height: '60%'
  })

  appWindow.window.body.style.margin = '0'
  appWindow.window.body.style.overflow = 'hidden'
}