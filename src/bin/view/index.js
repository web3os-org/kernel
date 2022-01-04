import path from 'path'
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

  let appWindow

  const data = new Blob([fs.readFileSync(filename)])
  const url = URL.createObjectURL(data)

  const wrapper = document.createElement('div')
  wrapper.style.display = 'flex'
  wrapper.style.justifyContent = 'center'
  wrapper.style.alignItems = 'center'

  const content = new Image()
  content.src = url
  content.style.maxWidth = '100%'
  content.onload = () => {
    appWindow.window.resize(content.width, content.height + 35)
  }

  wrapper.appendChild(content)

  appWindow = kernel.appWindow({
    title: `Image: ${filename}`,
    mount: wrapper,
    right: '2%',
    width: '60%',
    height: '60%'
  })

  appWindow.window.body.style.margin = '0'
  appWindow.window.body.style.overflow = 'hidden'
}