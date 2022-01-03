import arg from 'arg'
import path from 'path'
import colors from 'ansi-colors'
import { ctxmenu } from 'ctxmenu'

import './index.css'
import defaultWallpaperURL from './default_wallpaper.png'
import { default as defaultAppIcon } from '../../assets/default-app-icon.svg'
import { create as createTerminal } from '../../terminal'

export const name = 'desktop'
export const version = '1.0.0'
export const description = 'Web3OS Desktop'
export const help = `
  Usage:
    desktop <options>       Start the Crypotoba.sh Desktop

  Options:
    --wallpaper, -w         Specify the path to the wallpaper to use at startup
`

const spec = {
  '--version': Boolean,
  '-v': '--version',
  '--wallpaper': String,
  '-w': '--wallpaper'
}

let kernel
let desktop
let terminal
let launcher
// let defaultWallpaperURL = 'https://placeimg.com/800/800/tech'

export async function launchTerminal (options = {}) {
  let win

  let customCommands = options.customCommands || []
  customCommands.push({ name: 'exit', run: () => win.window.close() })

  const newTerm = createTerminal({
    fontFamily: options.fontFamily || `'Fira Mono', monospace`,
    fontSize: options.fontSize || 18,
    fontWeight: options.fontWeight || 900,
    theme: options.theme || { background: '#131820' },
    customCommands
  })

  const container = document.createElement('div')
  container.style.width = '100%'
  container.style.height = '100%'
  newTerm.open(container)

  win = kernel.appWindow({
    title: options.windowTitle || options.command || 'web3os.sh',
    mount: container,
    width: options.windowWidth || '75%',
    height: options.windowHeight || '70%'
  })

  win.term = newTerm
  kernel.bin.account.setPrompt(newTerm)
  newTerm.prompt()
  newTerm.focus()

  if (options.command) kernel.execute(options.command, { terminal: newTerm })

  // There's gotta be a better way, but for now we'll just setInterval
  // Running .fit in win.onresize doesn't work
  setInterval(newTerm.fit, 100)
}

export async function start (args) {
  terminal.log('Starting web3os.sh Desktop..')

  desktop = document.createElement('div')
  desktop.id = 'web3os-desktop'

  const wallpaper = document.createElement('img')
  wallpaper.id = 'web3os-desktop-wallpaper'
  wallpaper.src = args['--wallpaper'] || defaultWallpaperURL
  wallpaper.style.opacity = 0

  if (wallpaper.complete) {
    wallpaper.style.opacity = 1
  } else {
    wallpaper.addEventListener('load', () => { wallpaper.style.opacity = 1 })
  }

  const fileLayer = document.createElement('div')
  fileLayer.id = 'web3os-desktop-file-layer'

  const files = kernel.fs.readdirSync('/desktop')

  files.forEach(filename => {
    const file = {
      name: filename,
      location: path.resolve('/desktop', filename),
      type: kernel.fs.statSync(path.resolve('/desktop', filename)).isDirectory() ? 'dir' : 'file'
    }
  
    const entry = document.createElement('div')
    const icon = document.createElement('mwc-icon')
    const title = document.createElement('h1')
    
    let fileIcon
    switch (file.type) {
      case 'dir':
        fileIcon = 'folder'
        break
      default:
        fileIcon = 'text_snippet'
    }

    entry.classList.add('web3os-desktop-entry')

    icon.textContent = fileIcon
    title.textContent = file.name
    entry.dataset.file = JSON.stringify(file)
    icon.dataset.file = entry.dataset.file
    title.dataset.file = entry.dataset.file

    entry.appendChild(icon)
    entry.appendChild(title)
    fileLayer.appendChild(entry)
    
    entry.draggable = true
    entry.addEventListener('dragend', e => {
      // console.log('dragend', e)
      e.target.style.position = 'absolute'
      e.target.style.left = e.x + 'px'
      e.target.style.top = e.y + 'px'
    })

    const entryContextMenu = [
      {
        text: 'Edit',
        action: () => kernel.execute(`edit ${file.location}`)
      }
    ]

    entry.addEventListener('contextmenu', e => {
      e.preventDefault()
      e.stopPropagation()
      ctxmenu.show(entryContextMenu, e.target)
    })

    entry.addEventListener('click', e => {
      const { file } = e.target.dataset
      const data = JSON.parse(file)
      const stat = kernel.fs.statSync(data.location)
      const fileParts = path.parse(data.name)
      const extension = fileParts.ext

      if (stat.isDirectory()) {
        return kernel.execute(`files ${data.location}`)
      }

      switch (extension) {
        case '.sh':
          return kernel.executeScript(data.location)
        case '.js':
          return kernel.execute(`eval ${data.location}`)
        case '.txt':
          return kernel.execute(`edit ${data.location}`)
        case '.md':
          return kernel.execute(`markdown ${data.location}`)
        default:
          kernel.execute(`alert I'm not sure how to handle this file!`)
      }
    })
  })

  desktop.appendChild(wallpaper)
  desktop.appendChild(fileLayer)

  const menuButton = document.createElement('mwc-icon')
  menuButton.id = 'web3os-desktop-menu-button'
  menuButton.ariaLabel = 'Open the Launcher'
  menuButton.textContent = 'widgets'
  menuButton.classList.add('animate__animated', 'animate__bounce', 'animate__slow')
  menuButton.classList.add('hint--left', 'hint--success')
  
  menuButton.addEventListener('animationend', () => menuButton.classList.remove('animate__animated', 'animate__bounce', 'animate__slow'))
  menuButton.addEventListener('click', toggleLauncher)
  menuButton.addEventListener('contextmenu', e => {
    e.preventDefault()
    e.stopPropagation()
  })
  menuButton.addEventListener('touchstart', () => {
    console.log('touchstart!')
  })
  menuButton.addEventListener('pointerdown', () => {
    console.log('pointerdown!')
  })
  menuButton.addEventListener('pointerup', () => {
    console.log('pointerup!')
  })

  const shellButton = document.createElement('mwc-icon')
  shellButton.id = 'web3os-desktop-shell-button'
  shellButton.ariaLabel = 'Open a terminal'
  shellButton.textContent = 'terminal'
  shellButton.classList.add('hint--left', 'hint--info')
  shellButton.addEventListener('click', launchTerminal)

  const exitButton = document.createElement('mwc-icon')
  exitButton.id = 'web3os-desktop-exit-button'
  exitButton.ariaLabel = 'Exit the desktop'
  exitButton.textContent = 'logout'
  exitButton.classList.add('hint--left', 'hint--info')
  exitButton.addEventListener('click', exitDesktop)

  const showButtons = () => {
    [shellButton, exitButton].forEach(btn => { btn.style.opacity = 1 })
  }

  const hideButtons = () => {
    [shellButton, exitButton].forEach(btn => { btn.style.opacity = 0 })
  }

  [menuButton, shellButton, exitButton].forEach(btn => {
    btn.addEventListener('pointerenter', showButtons)
    btn.addEventListener('pointerleave', hideButtons)
  })

  const metaListener = e => {
    if (e.code === 'KeyQ' && e.ctrlKey && e.shiftKey) exitDesktop()
    if (e.key === 'Meta' && e.ctrlKey) toggleLauncher()
    if (e.key === 'Tab' && e.shiftKey) toggleRunner()
  }

  window.addEventListener('keydown', metaListener)

  desktop.append(menuButton)
  desktop.append(shellButton)
  desktop.append(exitButton)
  
  document.querySelector('#terminal').style.display = 'none'
  document.body.appendChild(desktop)

  const desktopContextMenu = [
    {
      text: 'New File',
      action: () => {}
    }
  ]

  desktop.addEventListener('contextmenu', e => {
    e.preventDefault()
    e.stopPropagation()
    // console.log(e)
    ctxmenu.show(desktopContextMenu, e)
  })
}

export async function toggleRunner () {
  if (document.querySelector('#web3os-desktop-runner')) return document.querySelector('#web3os-desktop-runner').remove()

  const dialog = document.createElement('div')
  dialog.id = 'web3os-desktop-runner'
  dialog.hideActions = true

  const input = document.createElement('input')
  input.id = 'web3os-desktop-runner-input'
  input.placeholder = 'Run a command...'
  
  input.addEventListener('keydown', async e => {
    if (e.key !== 'Enter') return
    // launchTerminal({ command: input.value })
    kernel.execute(input.value)
    dialog.remove()
  })

  dialog.append(input)
  dialog.open = true

  document.body.appendChild(dialog)
  // TODO: Figure out how to get the damn input focused properly - everything I tried didn't work
}

export async function toggleLauncher () {
  if (launcher) {
    launcher.window.close()
    launcher = null
    return
  }

  // TODO: Load this from somewhere configurable
  const launcherApps = [
    { name: 'Files', icon: kernel.bin.files?.icon, description: kernel.bin.files?.description, run: () => kernel.execute('files /desktop')},
    { name: 'Screensaver', icon: kernel.bin.screensaver?.icon, description: kernel.bin.screensaver?.description, run: () => kernel.execute('screensaver') },
    { name: 'Browser', icon: kernel.bin.www?.icon, description: kernel.bin.www?.description, run: () => kernel.execute('www about:blank')},
    { name: 'Instacalc', icon: kernel.bin.www?.icon, description: kernel.bin.www?.description, run: () => kernel.execute('www https://instacalc.com') },
    { name: 'Thesaurus', icon: kernel.bin.www?.icon, description: kernel.bin.www?.description, run: () => kernel.execute('www https://thesaurus.com') },
    { name: 'Dictionary', icon: kernel.bin.www?.icon, description: kernel.bin.www?.description, run: () => kernel.execute('www https://dictionary.com') },
    { name: 'Scrolller', icon: kernel.bin.www?.icon, description: kernel.bin.www?.description, run: () => kernel.execute('www https://scrolller.com') }
  ]

  const template = document.createElement('div')
  template.id = 'web3os-desktop-launcher'
  
  for (const app of launcherApps) {
    const { name, description, icon, run } = app

    const entry = document.createElement('div')
    entry.classList.add('web3os-desktop-launcher-entry')

    const img = document.createElement('img')
    img.src = icon ? icon : defaultAppIcon

    const title = document.createElement('h1')
    title.textContent = name

    entry.title = description
    entry.dataset.command = name
    entry.append(img)
    entry.append(title)
    template.appendChild(entry)

    entry.addEventListener('click', async e => {
      const { command } = entry.dataset
      try {
        run()
      } catch (err) {
        kernel.log(err.message)
        kernel.dialog({ icon: 'error', title: 'Error', text: colors.unstyle(err.message) })
      } finally {
        launcher.window.close()
      }
    })
  }

  launcher = kernel.appWindow({
    title: 'web3os.sh Launcher',
    mount: template,
    onclose: () => {
      launcher = null
    }
  })

  launcher.window.maximize()
}

export async function exitDesktop () {
  desktop.remove()
  document.querySelector('#terminal').style.display = 'block'
  window.terminal.focus()
  window.terminal.fit()
}

export async function run (term, context) {
  if (document.querySelector('#web3os-desktop')) throw new Error('Desktop is already running')
  terminal = term
  kernel = term.kernel

  const args = arg(spec, { argv: context.split(' ') })
  const cmd = args._?.[0]

  if (args['--version']) return terminal.log(version)
  if (!kernel.fs.existsSync('/desktop')) kernel.fs.mkdirSync('/desktop')
  if (!kernel.fs.existsSync('/desktop/Documents')) kernel.fs.mkdirSync('/desktop/Documents')

  switch (cmd) {
    case 'start':
    default:
      return await start(args)
  }
}
