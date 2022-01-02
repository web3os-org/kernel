/*
  @web3os-org/kernel
  src/index.js

  Author: Jay Mathis <code@mathis.network>
  Repo: https://github.com/web3os-org/kernel

  Entry-point of the web3os kernel
*/

import path from 'path'
import bytes from 'bytes'
import colors from 'ansi-colors'
import figlet from 'figlet'
import figletFont from 'figlet/importable-fonts/Graffiti'
import columnify from 'columnify'
import { AttachAddon } from 'xterm-addon-attach'
import sweetalert from 'sweetalert2'

import 'animate.css'
import './themes/default/sweetalert2.css'
import './css/index.css'

import README from '../README.md'
import AppWindow from './app-window'
import pkg from '../package.json'
import theme from './themes/default/index.js'

import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-snackbar'

const figletFontName = 'Graffiti'

// May be overridden by BUILTIN_APPS env variable using CSV
const builtinApps = [
  'account', 'confetti', 'desktop', 'edit', 'files', 'gibson', 'help', 'ipfs', 'md', 'screensaver', 'view', 'wpm', 'www'
]

// TODO: i18n this (and everything else)
const configDescriptions = {
  'autostart.sh': 'Executed at startup line by line',
  'packages': 'Master local package list for CPM'
}

export const bin = {}
export let fs
export let term
let BrowserFS
let memory
let gibsonSocket

colors.theme(theme)

const showBootIntro = () => {
  log(colors.info(`\t Made with  ${colors.red('♥')}  by Jay Mathis`))
  log(colors.heading.success.bold(`\n\n     web3os kernel v${pkg.version}     `))
  log(colors.warning('⚠            ALPHA           ⚠\n'))
  log(colors.warning('If things get wacky, just reload!'))
  log(colors.warning(`If they're still wacky, clear local storage!\n`))

  log(colors.danger(`Type ${colors.bold('help')} for help`))
  log(colors.gray(`Type ${colors.bold('md docs/README.md')} to view the README`))
  log(colors.info(`Type ${colors.bold('desktop')} to launch the desktop`))
  log(colors.primary(`Type ${colors.bold('account balance')} to view your account balance`))
  log(colors.success(`Type ${colors.bold('ls /bin')} to see all commands`))
  log(colors.magenta(`Type ${colors.bold('confetti')} to fire the confetti gun`))

  log('\nhttps://docs.web3os.sh')
  log('https://github.com/web3os-org')
  log(colors.muted('\nBooting...'))
}

export function updateLocalStorage () { localStorage.setItem('memory', JSON.stringify(memory)) }

export function loadLocalStorage () {
  try {
    const storedMemory = localStorage.getItem('memory')
    if (!storedMemory) { memory = { version: pkg.version } }
    else { memory = JSON.parse(storedMemory) }
  } catch (err) {
    console.error(err)
    memory = {}
  }
}

export function set (namespace, key, value) {
  memory[namespace] = memory[namespace] || {}
  memory[namespace][key] = value
  updateLocalStorage()
  return memory[namespace]?.[key]
}

export function get (namespace, key) {
  if (!key) return memory[namespace] || null
  return memory[namespace]?.[key] || null
}

export function dump () { return JSON.stringify(memory) }

export function restore (dump) {
  memory = JSON.parse(dump)
  updateLocalStorage()
  return memory
}

export function deleteKey (namespace, key) {
  if (!memory[namespace]?.[key]) throw new Error('Invalid namespace or key')
  delete memory[namespace][key]
  updateLocalStorage()
}

export function deleteNamespace (namespace) {
  if (!memory[namespace]) throw new Error('Invalid namespace')
  delete memory[namespace]
  updateLocalStorage()
}

export function getGibson () { return gibsonSocket }
export function setGibson (socket) { gibsonSocket = socket }

export function log (msg, options = {}) {
  msg = msg.replace(/\\n/gm, '\n')
  if (options.console) console.log(msg)
  const term = options.terminal || window.terminal
  term.writeln(msg)
}

export function appWindow (options) {
  return new AppWindow(options)
}

export async function dialog (options = {}) {
  return sweetalert.fire({
    heightAuto: false,
    denyButtonColor: 'red',
    confirmButtonColor: 'green',
    customClass: { container: 'web3os-kernel-dialog-container' },
    ...options
  })
}

export async function execute (cmd, options = {}) {
  options.doPrompt = options.doPrompt || false
  let command = bin[cmd.split(' ')[0]]
  const term = options.terminal || window.terminal

  if (!command) {
    try {
      command = await import(`./bin/${cmd.split(' ')[0]}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (!command) { term.log(colors.danger('Invalid command')); return term.prompt() }

  try {
    const args = cmd.split(' ').slice(1).join(' ')
    const result = await command.run(term, args)
    if (options.doPrompt) term.prompt()
    return result
  } catch (err) {
    console.error(command, err)
    if (err) term.log(err.message || 'An unknown error occurred')
    if (options.doPrompt) term.prompt()
    throw err
  }
}

export async function executeScript (filename, options = {}) {
  const term = options.terminal || window.terminal
  if (!filename || filename === '') return term.log(colors.danger('Invalid filename'))
  filename = path.resolve(term.cwd, filename)

  const value = kernel.fs.readFileSync(filename, 'utf8')
  const commands = value.split('\n')

  for (const cmd of commands) {
    try {
      if (cmd !== '' && cmd?.[0] !== '#' && cmd?.substr(0, 2) !== '//') await execute(cmd, { terminal: term, doPrompt: false })
    } catch (err) {
      throw err
    }
  }
}

export async function autostart () {
  try {
    if (!fs.existsSync('/config/autostart.sh')) fs.writeFileSync('/config/autostart.sh', 'account connect\n#desktop\n#md docs/README.md\n') // Setup default autostart.sh
    if (fs.existsSync('/config/autostart.sh')) await executeScript('/config/autostart.sh')
  } catch (err) {
    console.error(err)
    log(colors.danger('Failed to complete autostart script'))
  } finally {
    terminal.prompt()
  }
}

export async function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function download (term, context) {
  const filename = context
  if (!filename || filename === '') return log(colors.danger('Invalid filename'))
  filename = path.resolve(term.cwd, filename)
  const data = fs.readFileSync(filename)
  const file = new File([data], path.parse(filename).base, { type: 'application/octet-stream' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = path.parse(filename).base
  link.click()
}

export async function upload (term, context) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('multiple', true)
  input.addEventListener('change', e => {
    const { files } = e.target
    for (const file of files) {
      const reader = new FileReader()

      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        const buffer = BrowserFS.Buffer.from(reader.result)
        const filepath = path.resolve(term.cwd, file.name)
        fs.writeFileSync(filepath, buffer)
        kernel.snackbar({ labelText: `Uploaded ${filepath}` })
      }
    }
  })

  input.click()
}

export async function notify (options={}) {
  if (Notification.permission !== 'granted') throw new Error('Notification permission denied')
  return new Notification(options.title, options)
}

export async function snackbar (options={}) {
  const snack = document.createElement('mwc-snackbar')
  snack.id = options.id || 'snack-' + Math.random()
  snack.labelText = options.labelText || ''
  snack.stacked = options.stacked || false

  const closeButton = document.createElement('mwc-icon-button')
  closeButton.icon = 'close'
  closeButton.slot = 'dismiss'

  snack.appendChild(closeButton)
  document.body.appendChild(snack)
  snack.show()
}

async function setupFilesystem () {
  const browserfs = await import('browserfs')
  let filesystem = {}

  browserfs.install(filesystem)
  browserfs.configure({
    fs: 'MountableFileSystem',
    options: {
      '/': { fs: 'LocalStorage' },
      '/bin': { fs: 'InMemory' },
      '/tmp': { fs: 'InMemory' },
      '/docs': { fs: 'InMemory' }
    }
  }, err => {
    if (err) {
      console.error(err)
      log(colors.danger(`Failed to initialize filsystem: ${err.message}`))
    } else {
      BrowserFS = filesystem
      fs = filesystem.require('fs')

      // Prepare required paths
      if (!fs.existsSync('/var')) fs.mkdirSync('/var')
      if (!fs.existsSync('/var/packages')) fs.mkdirSync('/var/packages')
      if (!fs.existsSync('/config')) fs.mkdirSync('/config')
      if (!fs.existsSync('/config/packages')) fs.writeFileSync('/config/packages', '[]')

      // Populate /docs
      const docs = fs.readdirSync('/docs')
      if (docs.length === 0) fs.writeFileSync('/docs/README.md', README)

      const dragenter = e => { e.stopPropagation(); e.preventDefault() }
      const dragover = e => { e.stopPropagation(); e.preventDefault() }
      const drop = e => {
        e.stopPropagation()
        e.preventDefault()
        const dt = e.dataTransfer
        const files = dt.files

        for (const file of files) {
          const reader = new FileReader()

          reader.readAsArrayBuffer(file)
          reader.onload = () => {
            const buffer = BrowserFS.Buffer.from(reader.result)
            const filepath = path.resolve(terminal.cwd, file.name)
            fs.writeFileSync(filepath, buffer)
            kernel.snackbar({ labelText: `Uploaded ${filepath}` })
          }
        }
      }

      document.body.addEventListener('dragenter', dragenter)
      document.body.addEventListener('dragover', dragover)
      document.body.addEventListener('drop', drop)

      // Setup FS commands
      bin.cwd = { description: 'Get the current working directory', run: term => term.log(term.cwd) }
      bin.cd = { args: ['path'], description: 'Change the current working directory', run: (term, context) => {
        const newCwd = path.resolve(term.cwd, context)
        if (!fs.existsSync(newCwd)) throw new Error(`cd: ${context}: No such directory`)
        if (!fs.statSync(newCwd).isDirectory()) throw new Error(`cd: ${context}: No such directory`)
        term.cwd = newCwd
      }}

      bin.read = { args: ['path'], description: 'Read contents of file', run: (term, context) => {
        const dir = path.resolve(term.cwd, context)
        if (!fs.existsSync(dir)) throw new Error(`read: ${dir}: No such file`)
        term.log(fs.readFileSync(dir, 'utf8'))
      }}

      bin.upload = { description: 'Upload files', run: upload }
      bin.download = { args: ['filename'], description: 'Download a file', run: download }

      bin.mkdir = { args: ['path'], description: 'Create a directory', run: (term, context) => {
        if (!context || context === '') throw new Error(`mkdir: ${context}: Invalid directory name`)
        fs.mkdirSync(path.resolve(term.cwd, context))
      }}

      bin.rm = { args: ['path'], description: 'Remove a file', run: (term, context) => {
        const target = path.resolve(term.cwd, context)
        if (!context || context === '') throw new Error(`rm: ${context}: Invalid path`)
        if (!fs.existsSync(target)) throw new Error(`rm: ${context}: No such file`)
        fs.unlinkSync(target)
      }}

      bin.rmdir = { args: ['path'], description: 'Remove a directory', run: (term, context) => {
        const target = path.resolve(term.cwd, context)
        if (!context || context === '') throw new Error(`rmdir: ${context}: Invalid path`)
        if (!fs.existsSync(target)) throw new Error(`rmdir: ${context}: No such directory`)
        fs.rmdirSync(target)
      }}

      bin.mv = { args: ['from', 'to'], description: 'Move a file or directory', run: (term, context) => {
        const [fromStr, toStr] = context.split(' ')
        const from = path.resolve(term.cwd, fromStr)
        const to = path.resolve(term.cwd, toStr)
        if (!fs.existsSync(from)) throw new Error(`mv: source ${from} does not exist`)
        if (fs.existsSync(to)) throw new Error(`mv: target ${to} already exists`)
        fs.renameSync(from, to)
      }}

      bin.ls = {
        args: ['path'],
        description: 'List directory contents',
        run: (term, context) => {
          if (!context || context === '') context = term.cwd
          const entries = fs.readdirSync(path.resolve(term.cwd, context)).sort()
          let data = []

          entries.forEach(entry => {
            const filename = path.resolve(term.cwd, context, entry)
            const stat = fs.statSync(filename)

            // Show custom output for special dirs
            switch (path.resolve(context)) {
              case '/bin':
                data.push({
                  name: colors.cyanBright(entry),
                  size: colors.muted(bytes(stat.size).toLowerCase()),
                  description: colors.muted(kernel.bin[entry]?.description || '')
                })

                break
              case '/config':
                data.push({
                  name: colors.cyanBright(entry),
                  size: colors.muted(bytes(stat.size).toLowerCase()),
                  description: colors.muted(configDescriptions[entry] || '')
                })

                break
              default:
                data.push({
                  name: stat.isDirectory() ? colors.green('/' + entry) : colors.blue(entry),
                  type: colors.muted.em(stat.isDirectory() ? 'dir' : 'file'),
                  size: colors.muted(bytes(stat.size).toLowerCase())
                })
            }
          })

          term.log(columnify(data, {
            config: {
              name: { minWidth: 20 },
              type: { minWidth: 8 },
              size: { minWidth: 8 }
            }
          }))
        }
      }

      // FS command aliases
      bin.cat = { args: ['path'], description: 'Alias of read', run: bin.read.run }
      bin.rename = { args: ['from', 'to'], description: 'Alias of mv', run: bin.mv.run }
    }
  })
}

async function registerKernelBins () {
  bin.sh = { args: ['filename'], description: 'Execute a web3os script', run: (term, context) => executeScript(context, { terminal: term }) }
  bin.wait = { args: ['ms'], description: 'Wait for the specified number of milliseconds', run: (term, context) => wait(context) }
  bin.clear = { description: 'Clear the terminal', run: term => term.clear() }
  bin.reboot = { description: 'Reload the shell', run: () => location.reload() }
  bin.dump = { description: 'Dump the shell state', run: term => term.log(dump()) }
  bin.restore = { args: ['json'], description: 'Restore the shell state', run: (term, context) => restore(context) }
  bin.echo = { args: ['text'], description: 'Echo some text to the terminal', run: (term, context) => term.log(context) }
  bin.alert = { args: ['message'], description: 'Show an alert', run: (term, context) => dialog({ text: context }) }
  bin.notify = { args: ['title', 'body'], description: 'Show a notification with <title> and <body>', run: (term, context) => notify({ title: context.split(' ')[0], body: context.split(' ')[1] }) }
  bin.snackbar = { args: ['message'], description: 'Show a snackbar with <message>', run: (term, context) => snackbar({ labelText: context }) }
  bin.man = { args: ['command'], description: 'Alias of help', run: (term, context) => bin.help.run(term, context) }

  bin.set = {
    args: ['namespace', 'key', 'value'],
    description: `Set a kernel value: ${colors.info('set namespace key value')}, eg. ${colors.muted('set user name hosk')}`,
    run: (term, context = '') => {
      const parts = context.split(' ')
      const namespace = parts[0]
      const key = parts[1]
      const value = parts.slice(2, parts.length).join(' ')
      term.log(set(namespace, key, value))
    }
  }

  bin.get = {
    args: ['namespace', 'key'],
    description: `Get a kernel value: ${colors.info('get namespace key')} or ${colors.info('get namespace')}, eg. ${colors.info('get user name')} or ${colors.info('get user')}`,
    run: (term, context = '') => {
      const parts = context.split(' ')
      const namespace = parts[0]
      const key = parts[1]
      const result = get(namespace, key)
      term.log(typeof result === 'string' ? result : JSON.stringify(result))
    }
  }

  bin.deleteKernelKey = {
    args: ["namespace", "key"],
    description: 'Delete specified key, or entire namespace if no key is specified',
    run: (term, context = '') => {
      try {
        const parts = context.split(' ')
        if (parts[1]) deleteKey(parts[0], parts[1])
        else deleteNamespace(parts[0])
      } catch (err) {
        console.error(err)
        term.log(colors.danger(err.message))
      }
    }
  }

  bin.history = { description: 'Show command history', run: term => {
    term.log(JSON.stringify(term.history))
  }}

  bin.eval = {
    args: ['filename'],
    description: `Load and evaluate a Javascript file; ${colors.danger.bold('be very careful!')}`,
    run: (term, filename) => {
      if (!filename || filename === '') return term.log(colors.danger('Invalid filename'))
      filename = path.resolve(term.cwd, filename)
      const code = fs.readFileSync(filename, 'utf-8')
      eval(code)
    }
  }

  bin.height = {
    args: ['css-height'],
    description: 'Set body height',
    run: (term, context) => {
      console.log('setting height:', context)
      document.body.style.height = context
    }
  }

  bin.width = {
    args: ['css-width'],
    description: 'Set body width',
    run: (term, context) => document.body.style.width = context
  }
}

async function registerBuiltinApps () {
  const apps = process.env.BUILTIN_APPS ? process.env.BUILTIN_APPS.split(',') : builtinApps

  builtinApps.forEach(async app => {
    const appBin = await import(`./bin/${app}`)
    addBin(appBin)
  })
}

export function loadPackage (exe) {
  return new Promise((resolve, reject) => {
    const packages = JSON.parse(fs.readFileSync('/config/packages', 'utf8'))
    const pkg = packages.find(p => p.exe === exe)
    const code = fs.readFileSync(`/var/packages/${exe}`, 'utf-8')
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const script = document.createElement('script')

    script.textContent = `
      import * as app from '${url}'
      console.log({ app })
    `

    script.type = 'module'
    script.onload = () => {
      URL.revokeObjectURL(url)
      resolve()
    }

    document.body.appendChild(script)
  })
}

async function loadPackages () {
  const packages = JSON.parse(fs.readFileSync('/config/packages', 'utf8'))
  packages.forEach(async pkg => await loadPackage(pkg.exe))
}

export function addBin (app) {
  if (!app) throw new Error('Invalid app provided to kernel.addBin')
  if (bin[app.name]) throw new Error('App is already loaded')
  bin[app.name] = app
  fs.writeFileSync(path.resolve('/bin', app.name), '')
}

export async function showSplash (msg, options = {}) {
  document.querySelector('#web3os-splash')?.remove()

  // TODO: I'll move a lot of this to the css eventually..
  const icon = document.createElement('mwc-icon')
  icon.id = 'web3os-splash-icon'
  icon.style.color = options.iconColor || '#03A062'
  icon.style.fontSize = options.iconFontSize || '20rem'
  icon.style.marginTop = '2rem'
  icon.innerText = options.icon || 'hourglass_empty'
  if (!options.disableAnimation) icon.classList.add('animate__animated', 'animate__zoomIn')

  const title = document.createElement('h1')
  title.id = 'web3os-splash-title'
  title.innerHTML = options.title || 'web3os'
  title.style.color = options.titleColor || 'white'
  title.style.margin = 0
  title.style.fontSize = options.titleFontSize || 'clamp(0.5rem, 6rem, 7rem)'
  title.style.fontVariant = 'small-caps'
  title.style.textShadow = '4px 4px 4px #888'
  if (!options.disableAnimation) title.classList.add('animate__animated', 'animate__zoomIn')

  const subtitle = document.createElement('h2')
  subtitle.id = 'web3os-splash-subtitle'
  subtitle.innerHTML = options.subtitle || 'Made with <span class="heart">♥</span> by Jay Mathis'
  subtitle.style.margin = 0
  subtitle.style.color = options.subtitleColor || '#ccc'
  subtitle.style.fontStyle = options.subtitleFontStyle || 'italic'
  subtitle.querySelector('span.heart').style.color = 'red'
  subtitle.querySelector('span.heart').style.fontSize = '1.5em'
  if (!options.disableAnimation) subtitle.classList.add('animate__animated', 'animate__zoomInDown') && subtitle.style.setProperty('--animate-delay', '0.5s')

  const background = document.createElement('div')
  background.id = 'web3os-splash-background'
  background.style.backgroundColor = '#121212'
  background.style.position = 'absolute'
  background.style.top = 0
  background.style.left = 0
  background.style.width = '100vw'
  background.style.height = '100vh'
  background.style.zIndex = 100001

  if (!options.disableVideoBackground) {
    const video = document.createElement('video')
    const file = (await import('./assets/splash.mp4')).default

    video.id = 'web3os-splash-video'
    video.src = file
    video.muted = true
    video.loop = true
    video.autoplay = true
    video.style.width = '100vw'
    video.style.height = '100vh'
    video.style.objectFit = 'cover'

    background.appendChild(video)
  }

  const message = document.createElement('h3')
  message.id = 'web3os-splash-message'
  message.style.color = 'silver'
  message.style.fontSize = '2.5rem'
  message.innerText = msg || 'Please hold 😅'

  const container = document.createElement('div')
  container.id = 'web3os-splash'
  container.style.display = 'flex'
  container.style.position = 'absolute'
  container.style.top = 0
  container.style.left = 0
  container.style.margin = 0
  container.style.flexDirection = 'column'
  container.style.justifyContent = 'center'
  container.style.alignItems = 'center'
  container.style.height = '100vh'
  container.style.width = '100vw'
  container.style.zIndex = 100002
  container.style.backgroundColor = `rgba(0, 0, 0, 0.5)`

  container.appendChild(title)
  container.appendChild(subtitle)
  container.appendChild(icon)
  container.appendChild(message)

  document.body.appendChild(background)
  document.body.appendChild(container)

  // TODO: Make flexible
  if (!options.disableAnimation) {
    let index = 0
    let icons = ['hourglass_empty', 'hourglass_bottom', 'hourglass_top']

    setTimeout(() => {
      icon.classList.remove('animate__animated', 'animate__zoomIn')
      icon.classList.add('rotating')
    }, 1000)

    setInterval(() => {
      icon.innerText = icons[index]
      index++
      if (!icons[index]) index = 0
    }, 500)
  }

  return () => {
    background.classList.add('animate__animated', 'animate__fadeOut', 'animate__fast')
    container.classList.add('animate__animated', 'animate__fadeOut', 'animate__fast')

    background.addEventListener('animationend', background.remove)
    container.addEventListener('animationend', container.remove)
  }
}

export async function boot () {
  const bootArgs = new URLSearchParams(window.location.search)
  window.addEventListener('beforeunload', async () => {
    await showSplash('Rebooting...', { icon: 'autorenew', disableAnimation: true, disableVideoBackground: true })
    document.querySelector('#web3os-splash-icon').classList.add('rotating')
  })

  // TODO: Make nobootsplash settable in config as well as query string
  if (!bootArgs.has('nobootsplash')) {
    const closeSplash = await showSplash()
    await execute('confetti --startVelocity 90 --particleCount 150')

    // Automatically start the desktop on small screens
    // TODO: Fix everything on small screens
    if (window.innerWidth < 768) {
      // document.querySelector('#terminal').style.display = 'none'
      // execute('desktop')
    } else {
      document.querySelector('#terminal').style.display = 'block'
      setTimeout(terminal.fit, 50)
      setTimeout(closeSplash, 2000) // The splash is pretty and needs to be seen and validated.
      terminal.focus()
    }
  } else {
    document.querySelector('#terminal').style.display = 'block'
    setTimeout(terminal.fit, 50)
    execute('confetti --startVelocity 90 --particleCount 150')
    terminal.focus()
  }

  setInterval(() => terminal.fit(), 200)

  figlet.parseFont(figletFontName, figletFont)
  figlet.text('web3os', { font: figletFontName }, async (err, data) => {
    if (err) log(err)
    if (data && window.innerWidth >= 768) log(`\n${colors.green.bold(data)}`)
    else log(`\n${colors.green.bold('web3os')}`)

    await showBootIntro()
    await loadLocalStorage()
    await setupFilesystem()
    await registerKernelBins()
    await registerBuiltinApps()
    await loadPackages()

    // Check for notification permission and request if necessary
    if (Notification?.permission === 'default') Notification.requestPermission()
    if (Notification?.permission === 'denied') log(colors.warning('Notification permission denied'))

    // Populate /bin
    Object.keys(bin).forEach(key => {
      try {
        fs.writeFileSync(path.resolve('/bin', key), '')
      } catch (err) {
        console.error(err)
      }
    })

    await autostart()
  })
}

// Integrate basic wallet functionality within the kernel
const kernelWallet = {
  get account () {
    return bin.account?.account
  },

  get web3 () {
    return bin.account?.web3
  }
}

export const wallet = kernelWallet

// Provide crypto icons from scco's fusion library
// export function icon (options = {}) {
//   const library = options.library || 'coins'
//   const name = options.name || 'BTC_1'
//   const svg = document.createElement('svg')
//   const use = document.createElement('use')
//   svg.classList.add('web3os-icon-fusion')
//   use.setAttribute('xlink:href', `sprites/fusion-${library}.svg#${name}`)
//   svg.appendChild(use)
//   return svg
// }

