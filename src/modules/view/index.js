import path from 'path'
import { lookup } from 'mime-types'
import colors from 'ansi-colors'

export const name = 'view'
export const args = ['filename']
export const description = 'File viewer for images, videos, audio, and PDF documents'
export const help = `
  Usage:
    view <filename>
`

export function createImage (mime, url, appWindow) {
  const content = new Image()
  content.src = url
  content.style.objectFit = 'contain'
  content.style.width = '100%'
  content.style.height = '100%'
  content.onload = () => {
    // appWindow.window.resize(content.width, content.height + 35)
  }

  return content
}

export function createVideo (mime, url) {
  const content = document.createElement('video')
  content.loop = true
  content.autoplay = true
  content.controls = true
  content.src = url
  content.style.width = '100%'
  content.style.height = '100%'

  return content
}

export function createObject (mime, url) {
  const content = document.createElement('object')
  content.data = url
  content.type = mime
  content.style.height = '100%'
  content.style.width = '100%'

  return content
}

export function createAudio (mime, url, appWindow) {
  const content  = document.createElement('audio')
  content.autoplay = true
  content.controls = true
  content.src = url
  content.style.width = '100%'
  content.addEventListener('loadeddata', () => {
    appWindow.window.resize(content.offsetWidth, content.offsetHeight + 35)
  })

  return content
}

export async function run (terminal, filename) {
  const { kernel, log } = terminal
  let { fs } = kernel

  if (!filename || filename === '') return log(colors.danger('Invalid filename') + '\n' + help)
  filename =kernel.utils.path.resolve(terminal.cwd, filename)

  let type
  let content
  const pathInfo =kernel.utils.path.parse(filename)
  const mime = lookup(pathInfo.ext)
  if (!mime) throw new Error('Unknown file type')

  const data = new Blob([fs.readFileSync(filename)], { type: mime })
  const url = URL.createObjectURL(data)

  const wrapper = document.createElement('div')
  wrapper.style.height = '100%'

  const appWindow = kernel.appWindow({
    title: `${filename}`,
    mount: wrapper,
    width: '60%',
    height: '60%'
  })

  appWindow.window.body.style.margin = '0'
  appWindow.window.body.style.overflow = 'hidden'

  switch (mime) {
    case 'application/pdf':
      content = createObject(mime, url, appWindow)
      break
    default:
      if (mime?.match(/^image/)) content = createImage(mime, url, appWindow)
      if (mime?.match(/^video/)) content = createVideo(mime, url, appWindow)
      if (mime?.match(/^audio/)) content = createAudio(mime, url, appWindow)
  }

  if (!content) throw new Error('Unknown file type')
  wrapper.append(content)
}