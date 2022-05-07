/*
  @web3os-org/kernel
  src/index.js

  Author: Jay Mathis <code@mathis.network>
  Repo: https://github.com/web3os-org/kernel
  License: MIT

  Entry-point of the web3os kernel
*/

/* global fetch, File, FileReader, localStorage, location, Notification */

import bytes from 'bytes'
import colors from 'ansi-colors'
import columnify from 'columnify'
import figlet from 'figlet'
import figletFont from 'figlet/importable-fonts/Graffiti'
import pathUtil from 'path'
import sweetalert from 'sweetalert2'
import topbar from 'topbar'

import { unzip } from 'unzipit'

import 'animate.css'
import './css/index.css'
import './themes/default/index.css'
import './themes/default/sweetalert2.css'

import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-snackbar'

import README from '../README.md'
import AppWindow from './app-window'
import pkg from '../package.json'
import theme from './themes/default/index.js'

const figletFontName = 'Graffiti'

window.topbar = topbar
topbar.show()

// TODO: Make this configurable
export const builtinModules = [
  'account', 'avax', 'backend', 'bitcoin', 'confetti', 'contract', 'desktop', 'edit', 'etherscan',
  'files', 'flix', 'git', 'gun', 'help', 'ipfs', 'markdown', 'moralis', 'peer', 'ping', 'screensaver',
  'torrent', 'usb', 'view', 'wasm', 'wpm', 'www'
]

export const defaultPackages = [
  'https://unpkg.com/@web3os-apps/doom',
  'https://unpkg.com/@web3os-apps/wolfenstein'
]

// TODO: i18n this (and everything else)
const configDescriptions = {
  'autostart.sh': 'Executed at startup line by line',
  packages: 'Master local package list'
}

export const utils = { path: pathUtil }
export const modules = {}
export let fs
export let term
export let BrowserFS
let memory

colors.theme(theme)

const showBootIntro = () => {
  log(colors.info(`\t Made with  ${colors.red('♥')}  by Jay Mathis`))
  log(colors.heading.success.bold(`\t    web3os kernel v${pkg.version}    `))
  log(colors.warning('\t⚠           ALPHA          ⚠\n'))

  log(colors.warning(`If things get wacky, just ${colors.bold.underline('reboot')}!`))
  log(colors.warning("If they're still wacky, clear local storage!\n"))

  log(colors.danger(`Type ${colors.bold.underline('help')} for help`))
  log(colors.gray(`Type ${colors.bold.underline('markdown /docs/README.md')} to view the README`))
  log(colors.info(`Type ${colors.bold.underline('desktop')} to launch the desktop`))
  log(colors.primary(`Type ${colors.bold.underline('account connect')} to connect your wallet`))
  log(colors.success(`Type ${colors.bold.underline('ls /bin')} to see all commands`))
  log(colors.magenta(`Type ${colors.bold.underline('confetti')} to fire the confetti gun\n`))

  log('Learn how to interact with smart contracts:')
  log(`\t${colors.blue.underline('contract --help')}`)
  log(`\t${colors.blue('https://github.com/web3os-org/sample-scripts')}\n`)

  // log('https://docs.web3os.sh')
  log('https://github.com/web3os-org')

  log(colors.muted('\nBooting...'))
}

function updateLocalStorage () { localStorage.setItem('memory', JSON.stringify(memory)) }

function loadLocalStorage () {
  try {
    const storedMemory = localStorage.getItem('memory')
    if (!storedMemory) memory = { version: pkg.version }
    else { memory = JSON.parse(storedMemory) }
  } catch (err) {
    console.error(err)
    memory = {}
  }
}

export function set (namespace, key, value) {
  if (!namespace || namespace === '') throw new Error('Invalid namespace')
  if (!key || key === '') throw new Error('Invalid key')
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

export function log (msg, options = {}) {
  if (!msg) return
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
  const exec = cmd.split(' ')[0]
  const term = options.terminal || window.terminal
  let command = term.aliases[exec] ? modules[term.aliases[exec]] : modules[exec]
  if (options.topbar) topbar.show()

  if (!command) {
    try {
      if (fs.existsSync(exec)) {
        const data = JSON.parse(fs.readFileSync(exec).toString())
        command = modules[data?.name]
      } else {
        command = await import(`./modules/${exec}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (options.topbar) topbar.hide()
  if (!command?.run) { term.log(colors.danger('Invalid command')); return term.prompt() }
  options.doPrompt = options.doPrompt || false

  try {
    if (options.topbar) topbar.show()
    const args = cmd.split(' ').slice(1).join(' ')
    const result = await command.run(term, args)
    if (options.topbar) topbar.hide()
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
  filename = utils.path.resolve(term.cwd, filename)

  const value = fs.readFileSync(filename, 'utf8')
  const commands = value.split('\n')

  for (const cmd of commands) {
    if (cmd !== '' && cmd?.[0] !== '#' && cmd?.substr(0, 2) !== '//') await execute(cmd, { terminal: term, doPrompt: false })
  }
}

export async function autostart () {
  try {
    if (!fs.existsSync('/config/autostart.sh')) fs.writeFileSync('/config/autostart.sh', 'alias doom @web3os-org/doom\n#account connect\n#desktop\n#markdown docs/README.md\n') // Setup default autostart.sh
    if (fs.existsSync('/config/autostart.sh')) await executeScript('/config/autostart.sh')
  } catch (err) {
    console.error(err)
    log(colors.danger('Failed to complete autostart script'))
  } finally {
    window.terminal?.prompt()
  }
}

export async function download (term, context) {
  let filename = context
  if (!filename || filename === '') return log(colors.danger('Invalid filename'))

  if (context.match(/^http/i) || context.match(/^blob/i)) {
    const url = new URL(context.split(' ')[0])
    filename = utils.path.parse(url.pathname).base
    if (context.split(' ')?.[1] && context.split(' ')[1] !== '') filename = context.split(' ')[1]
    const buffer = await (await fetch(url.href)).arrayBuffer()
    const data = BrowserFS.Buffer.from(buffer)
    console.log({ filename, data })
    fs.writeFileSync(utils.path.resolve(term.cwd, filename), data)
  } else {
    filename = utils.path.resolve(term.cwd, filename)
    const data = fs.readFileSync(filename)
    const file = new File([data], utils.path.parse(filename).base, { type: 'application/octet-stream' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = utils.path.parse(filename).base
    link.click()
  }
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
        const filepath = utils.path.resolve(term.cwd, file.name)
        fs.writeFileSync(filepath, buffer)
        snackbar({ labelText: `Uploaded ${filepath}` })
      }
    }
  })

  input.click()
}

export function colorChars (str, options = {}) {
  if (typeof str !== 'string') throw new Error('You must provide a string to colorChars')
  const numbers = options.numbers || colors.blue
  const letters = options.letters || colors.white
  return str.split('').map(c => isNaN(c) ? letters(c) : numbers(c)).join('')
}

export async function notify (options = {}) {
  if (Notification.permission !== 'granted') throw new Error('Notification permission denied')
  return new Notification(options.title, options)
}

export async function snackbar (options = {}) {
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
  // const browserfs = await import('C:/ode/web3os/BrowserFS/build/browserfs.js')
  const browserfs = await import('browserfs')
  const filesystem = {}

  let initfs
  const bootArgs = new URLSearchParams(window.location.search)
  const initfsUrl = bootArgs.get('initfs')

  if (bootArgs.has('initfs')) {
    try {
      const result = await dialog({
        title: 'Use initfs?',
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        showLoaderOnConfirm: true,
        focusDeny: true,
        confirmButtonText: 'Yes',
        html: `
          <p>Do you want to overwrite existing files in your filesystem with the initfs located at:</p>
          <h4><a href="${initfsUrl}" target="_blank">${initfsUrl}</a></h4>
          <p><strong>Be sure you trust the source!</strong></p>
        `,
        preConfirm: async () => {
          try {
            return await unzip(initfsUrl)
          } catch (err) {
            console.error(err)
            // await alert('Failed to unzip initfsUrl at ' + initfsUrl)
            window.terminal?.log(colors.danger(`Failed to unzip initfsUrl at ${initfsUrl}`))
            return true
          }
        }
      })

      if (result.isDenied) throw new Error('User rejected using initfs')
      const { entries } = result.value
      initfs = entries
      window.history.replaceState(null, null, '/') // prevent reload with initfs
    } catch (err) {
      window.terminal?.log(colors.danger('Failed to unzip initfsUrl ' + initfsUrl))
      window.terminal?.log(colors.danger(err.message))
      console.error(err)
    }
  }

  browserfs.install(filesystem)
  browserfs.configure({
    fs: 'MountableFileSystem',
    options: {
      '/': { fs: 'LocalStorage' },
      // '/home': { fs: 'IndexedDB', options: { storeName: 'web3os' } },
      '/bin': { fs: 'InMemory' },
      '/tmp': { fs: 'InMemory' },
      '/docs': { fs: 'InMemory' }
    }
  }, err => {
    if (err) {
      console.error(err)
      log(colors.danger(`Failed to initialize filesystem: ${err.message}`))
    } else {
      BrowserFS = filesystem
      fs = filesystem.require('fs')
      window.fs = fs

      // Use an initfs if available
      if (initfs) {
        Object.entries(initfs).forEach(async ([name, entry]) => {
          const filepath = utils.path.join('/', name)

          if (entry.isDirectory) !fs.existsSync(filepath) && fs.mkdirSync(utils.path.join('/', name))
          else {
            const parentDir = utils.path.parse(filepath).dir
            if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir)
            fs.writeFileSync(filepath, BrowserFS.Buffer.from(await entry.arrayBuffer()))
          }
        })
      }

      // Prepare required paths
      if (!fs.existsSync('/var')) fs.mkdirSync('/var')
      if (!fs.existsSync('/var/packages')) fs.mkdirSync('/var/packages')
      if (!fs.existsSync('/config')) fs.mkdirSync('/config')
      if (!fs.existsSync('/config/packages')) fs.writeFileSync('/config/packages', JSON.stringify(defaultPackages))

      // Populate /docs
      const docs = fs.readdirSync('/docs')
      if (docs.length === 0) fs.writeFileSync('/docs/README.md', README)

      // Drag and drop on terminal
      // const dragenter = e => { e.stopPropagation(); e.preventDefault() }
      // const dragover = e => { e.stopPropagation(); e.preventDefault() }
      // const drop = e => {
      //   e.stopPropagation()
      //   e.preventDefault()
      //   const dt = e.dataTransfer
      //   const files = dt.files

      //   for (const file of files) {
      //     const reader = new FileReader()

      //     reader.readAsArrayBuffer(file)
      //     reader.onload = () => {
      //       const buffer = BrowserFS.Buffer.from(reader.result)
      //       const filepath = utils.path.resolve(terminal.cwd, file.name)
      //       fs.writeFileSync(filepath, buffer)
      //       snackbar({ labelText: `Uploaded ${filepath}` })
      //     }
      //   }
      // }

      // terminal.addEventListener('dragenter', dragenter)
      // terminal.addEventListener('dragover', dragover)
      // terminal.addEventListener('drop', drop)

      // Setup FS commands
      modules.cwd = { description: 'Get the current working directory', run: term => term.log(term.cwd) }
      modules.cd = {
        description: 'Change the current working directory',
        run: (term, context) => {
          const newCwd = utils.path.resolve(term.cwd, context)
          if (!fs.existsSync(newCwd)) throw new Error(`cd: ${context}: No such directory`)
          if (!fs.statSync(newCwd).isDirectory()) throw new Error(`cd: ${context}: No such directory`)
          term.cwd = newCwd
        }
      }

      modules.read = {
        description: 'Read contents of file',
        run: (term, context) => {
          const dir = utils.path.resolve(term.cwd, context)
          if (!fs.existsSync(dir)) throw new Error(`read: ${dir}: No such file`)
          return term.log(fs.readFileSync(dir, 'utf8'))
        }
      }

      modules.upload = { description: 'Upload files', run: upload }
      modules.download = {
        description: 'Download URL to CWD, or download FILE to PC',
        run: download
      }

      modules.mkdir = {
        description: 'Create a directory',
        run: (term, context) => {
          if (!context || context === '') throw new Error(`mkdir: ${context}: Invalid directory name`)
          fs.mkdirSync(utils.path.resolve(term.cwd, context))
        }
      }

      modules.rm = {
        description: 'Remove a file',
        run: (term, context) => {
          const target = utils.path.resolve(term.cwd, context)
          if (!context || context === '') throw new Error(`rm: ${context}: Invalid path`)
          if (!fs.existsSync(target)) throw new Error(`rm: ${context}: No such file`)
          fs.unlinkSync(target)
        }
      }

      modules.rmdir = {
        description: 'Remove a directory',
        run: (term, context) => {
          const target = utils.path.resolve(term.cwd, context)
          if (!context || context === '') throw new Error(`rmdir: ${context}: Invalid path`)
          if (!fs.existsSync(target)) throw new Error(`rmdir: ${context}: No such directory`)
          fs.rmdirSync(target)
        }
      }

      modules.mv = {
        description: 'Move a file or directory',
        run: (term, context) => {
          const [fromStr, toStr] = context.split(' ')
          const from = utils.path.resolve(term.cwd, fromStr)
          const to = utils.path.resolve(term.cwd, toStr)
          if (!fs.existsSync(from)) throw new Error(`mv: source ${from} does not exist`)
          if (fs.existsSync(to)) throw new Error(`mv: target ${to} already exists`)
          fs.renameSync(from, to)
        }
      }

      modules.cp = {
        description: 'Copy a file or directory',
        run: (term, context) => {
          const [fromStr, toStr] = context.split(' ')
          const from = utils.path.resolve(term.cwd, fromStr)
          const to = utils.path.resolve(term.cwd, toStr)
          if (!fs.existsSync(from)) throw new Error(`cp: source ${from} does not exist`)
          if (fs.existsSync(to)) throw new Error(`cp: target ${to} already exists`)
          fs.copySync(from, to)
        }
      }

      modules.ls = {
        description: 'List directory contents',
        run: (term, context) => {
          if (!context || context === '') context = term.cwd
          const entries = fs.readdirSync(utils.path.resolve(term.cwd, context)).sort()
          const data = []

          entries.forEach(entry => {
            const filename = utils.path.resolve(term.cwd, context, entry)
            const stat = fs.statSync(filename)

            const isNamespacedBin = stat.isFile() && Boolean(filename.match(/^\/bin\/.+\//))

            // console.log({ entry, filename, context, stat, isNamespacedBin })

            const info = modules[filename.replace('/bin/', '')]
            if (isNamespacedBin && context !== 'bin') {
              data.push({
                name: colors.cyanBright(entry),
                description: colors.muted(info.description?.substr(0, 75) || '')
              })
            }

            // Show custom output for special dirs
            switch (utils.path.resolve(context)) {
              case '/bin':
                data.push({
                  name: colors.cyanBright(entry),
                  description: colors.muted(modules[filename.replace('/bin/', '')]?.description?.substr(0, 50) || '')
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
                if (!isNamespacedBin) {
                  data.push({
                    name: stat.isDirectory() ? colors.green('/' + entry) : colors.blue(entry),
                    type: colors.muted.em(stat.isDirectory() ? 'dir' : 'file'),
                    size: colors.muted(bytes(stat.size).toLowerCase())
                  })
                }
            }
          })

          return term.log(columnify(data, {
            config: {
              name: { minWidth: 20 },
              type: { minWidth: 8 },
              size: { minWidth: 8 }
            }
          }))
        }
      }

      // FS command aliases
      modules.cat = { description: 'Alias of read', run: modules.read.run }
      modules.dir = { description: 'Alias of ls', run: modules.ls.run }
      modules.rename = { description: 'Alias of mv', run: modules.mv.run }
    }
  })
}

async function registerKernelBins () {
  const kernelBins = []
  kernelBins.alert = { description: 'Show an alert', run: (term, context) => dialog({ text: context }) }
  kernelBins.clear = { description: 'Clear the terminal', run: term => term.clear() }
  kernelBins.dump = { description: 'Dump the memory state', run: term => term.log(dump()) }
  kernelBins.echo = { description: 'Echo some text to the terminal', run: (term, context) => term.log(context) }
  kernelBins.history = { description: 'Show command history', run: term => { return term.log(JSON.stringify(term.history)) } }
  kernelBins.import = { description: 'Import a module from a URL', run: async (term, context) => await loadModuleUrl(context) }
  kernelBins.man = { description: 'Alias of help', run: (term, context) => modules.help.run(term, context) }
  kernelBins.notify = { description: 'Show a notification with <title> and <body>', run: (term, context) => notify({ title: context.split(' ')[0], body: context.split(' ')[1] }) }
  kernelBins.sh = { description: 'Execute a web3os script', run: (term, context) => executeScript(context, { terminal: term }) }
  kernelBins.reboot = { description: 'Reload web3os', run: () => location.reload() }
  kernelBins.restore = { description: 'Restore the memory state', run: (term, context) => restore(context) }
  kernelBins.snackbar = { description: 'Show a snackbar with <message>', run: (term, context) => snackbar({ labelText: context }) }
  kernelBins.wait = { description: 'Wait for the specified number of milliseconds', run: (term, context) => wait(context) }

  kernelBins.alias = {
    description: 'Set or list command aliases',
    help: 'Usage: alias [src] [dest]',
    run: (term, context) => {
      if (!context || context === '') return term.log(term.aliases)
      const command = context.split(' ')
      if (command.length !== 2) throw new Error('You must specify the src and dest commands')
      term.aliases[command[0]] = command[1]
    }
  }

  kernelBins.ipecho = {
    description: 'Echo your public IP address',
    run: async term => {
      const result = await fetch('https://ipecho.net/plain')
      const ip = await result.text()
      console.log({ ip })
      term.log(ip)
      return ip
    }
  }

  kernelBins.set = {
    description: 'Set a kernel memory value',
    help: 'Usage: set <namespace> <key> <value>',
    run: (term, context = '') => {
      const parts = context.split(' ')
      const namespace = parts[0]
      const key = parts[1]
      const value = parts.slice(2, parts.length).join(' ')
      term.log(set(namespace, key, value))
    }
  }

  kernelBins.get = {
    description: 'Get a kernel memory namespace or key',
    help: 'Usage: get <namespace> [key]',
    run: (term, context = '') => {
      const parts = context.split(' ')
      const namespace = parts[0]
      const key = parts[1]
      const result = get(namespace, key)
      term.log(typeof result === 'string' ? result : JSON.stringify(result))
    }
  }

  kernelBins.unset = {
    description: 'Delete specified memory namespace or key',
    help: 'Usage: delkey <namespace> [key]',
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

  kernelBins.eval = {
    description: 'Load and evaluate a Javascript file',
    run: (term, filename) => {
      if (!filename || filename === '') return term.log(colors.danger('Invalid filename'))
      filename = utils.path.resolve(term.cwd, filename)
      const code = fs.readFileSync(filename, 'utf-8')
      eval(code) // eslint-disable-line
    }
  }

  kernelBins.clip = {
    description: 'Copy output of command to clipboard',
    run: async (term, context) => {
      const parts = context.split(' ')
      const mod = modules[parts[0]]
      const result = await mod.run(term, parts.splice(1).join(' '))
      return await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    }
  }

  kernelBins.height = {
    description: 'Set body height',
    run: (term, context) => { document.body.style.height = context }
  }

  kernelBins.width = {
    description: 'Set body width',
    run: (term, context) => { document.body.style.width = context }
  }

  kernelBins.objectUrl = {
    description: 'Create an ObjectURL for a file',
    run: (term, filename) => {
      if (!filename || filename === '') throw new Error('Invalid filename')
      const data = fs.readFileSync(utils.path.join(term.cwd, filename))
      const file = new File([data], utils.path.parse(filename).base, { type: 'application/octet-stream' })
      const url = URL.createObjectURL(file)
      return term.log(url)
    }
  }

  Object.entries(kernelBins).forEach(bin => {
    loadModule(bin[1], { name: bin[0] })
  })
}

async function registerBuiltinModules () {
  const mods = process.env.BUILTIN_MODULES ? process.env.BUILTIN_MODULES.split(',') : builtinModules

  for (const mod of mods) {
    const modBin = await import(`./modules/${mod}`)
    await loadModule(modBin, { name: mod })
  }
}

export async function loadModule (mod, options = {}) {
  if (!mod) throw new Error('Invalid module provided to kernel.loadModule')
  let { description, help, name, run, version, web3osData } = options
  help = help || mod.help || 'Help is not exported from this module'
  name = name || mod.name
  run = run || mod.run || mod.default
  if (!name || name === '') name = 'module_' + Math.random().toString(36).slice(2)

  if (modules[name]) delete modules[name]
  modules[name] = { ...mod, run }

  const modInfo = {
    name,
    version,
    description,
    web3osData,
    help
  }

  if (mod.run) {
    let modBin

    if (name.includes('/')) {
      modBin = utils.path.join('/bin', name.split('/')[0], name.split('/')[1])
      if (!fs.existsSync(`/bin/${name.split('/')[0]}`)) fs.mkdirSync(`/bin/${name.split('/')[0]}`)
    } else {
      modBin = utils.path.join('/bin', name)
    }

    fs.writeFileSync(modBin, JSON.stringify(modInfo, null, 2))
  }
}

export async function loadModuleUrl (url) {
  return await import(/* webpackIgnore: true */ url)
}

export async function loadPackages () {
  const packages = JSON.parse(fs.readFileSync('/config/packages').toString())
  for (const pkg of packages) {
    try {
      if (pkg.match(/^http/i)) {
        await modules.wpm.install(pkg, { warn: false })
        continue
      }

      const pkgJson = JSON.parse(fs.readFileSync(`/var/packages/${pkg}/package.json`))
      const main = pkgJson.web3osData.main || pkgJson.main
      const mod = await loadModuleUrl(`${pkgJson.web3osData.url}/${main}`)
      await loadModule(mod, pkgJson)
    } catch (err) {
      console.error(err)
      window.terminal.log(colors.danger(err.message))
    }
  }
}

export async function showSplash (msg, options = {}) {
  document.querySelector('#web3os-splash')?.remove()

  const icon = document.createElement('mwc-icon')
  icon.id = 'web3os-splash-icon'
  icon.style.color = options.iconColor || '#03A062'
  icon.style.fontSize = options.iconFontSize || '10em'
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

  // if (!options.disableVideoBackground) {
  //   const video = document.createElement('video')
  //   const file = (await import('./assets/splash.mp4')).default

  //   video.id = 'web3os-splash-video'
  //   video.src = file
  //   video.muted = true
  //   video.loop = true
  //   video.autoplay = true
  //   video.style.width = '100vw'
  //   video.style.height = '100vh'
  //   video.style.objectFit = 'cover'

  //   background.appendChild(video)
  // }

  const message = document.createElement('h3')
  message.id = 'web3os-splash-message'
  message.style.color = 'silver'
  message.style.fontSize = '2.5rem'
  message.innerText = msg || '💾 Booting... 💾'

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
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'

  container.appendChild(title)
  container.appendChild(subtitle)
  container.appendChild(icon)
  container.appendChild(message)

  document.body.appendChild(background)
  document.body.appendChild(container)

  // TODO: Make flexible
  if (!options.disableAnimation) {
    let index = 0
    const icons = ['hourglass_empty', 'hourglass_bottom', 'hourglass_top']

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
    setTimeout(closeSplash, 2000) // Prevent splash flash. The splash is pretty and needs to be seen and validated.

    // Automatically start the desktop on small screens since xterm struggles with the keyboard
    // TODO: Fix everything on small screens
    if (window.innerWidth < 768) {
      // document.querySelector('#terminal').style.display = 'none'
      // setTimeout(() => execute('desktop'), 2100)
      // setTimeout(() => dialog({ icon: 'warning', title: 'Limited Mobile Support', text: 'web3os alpha is currently quite broken on mobile devices. Please consider running on a larger screen.' }), 2500)
    } else {
      // document.querySelector('#terminal').style.display = 'block'
      // setTimeout(window.terminal?.fit, 50)
      // window.terminal?.focus()
    }

    document.querySelector('#terminal').style.display = 'block'
    setTimeout(window.terminal?.fit, 50)
    window.terminal?.focus()
  } else {
    document.querySelector('#terminal').style.display = 'block'
    setTimeout(window.terminal?.fit, 50)
    window.terminal?.focus()
  }

  setInterval(() => window.terminal?.fit(), 200)

  figlet.parseFont(figletFontName, figletFont)
  figlet.text('web3os', { font: figletFontName }, async (err, data) => {
    if (err) log(err)
    if (data && window.innerWidth >= 768) log(`\n${colors.green.bold(data)}`)
    else log(`\n${colors.green.bold('web3os')}`)

    console.log(`%cweb3os %c${pkg.version}`, `
      font-family: "Lucida Console", Monaco, monospace;
      font-size: 25px;
      letter-spacing: 2px;
      word-spacing: 2px;
      color: #028550;
      font-weight: 700;
      font-style: normal;
      font-variant: normal;
      text-transform: none;`, null)

    console.log('%chttps://github.com/web3os-org/kernel', 'font-size:14px;')

    await showBootIntro()
    await loadLocalStorage()
    await setupFilesystem()
    await registerKernelBins()
    await registerBuiltinModules()
    await loadPackages()

    // Check for notification permission and request if necessary
    if (Notification?.permission === 'default') Notification.requestPermission()
    if (Notification?.permission === 'denied') log(colors.warning('Notification permission denied'))

    await autostart()
    await execute('confetti --startVelocity 90 --particleCount 150')
    topbar.hide()
  })
}

export async function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Integrate basic wallet functionality within the kernel
const kernelWalletInterface = {
  get account () {
    return modules.account?.account
  },

  get web3 () {
    return modules.account?.web3
  }
}

export const wallet = kernelWalletInterface

// Setup screensaver interval
let idleTimer
const resetIdleTime = () => {
  clearTimeout(idleTimer)
  if (!modules.screensaver) return
  idleTimer = setTimeout(() => modules.screensaver.run(window.terminal, get('user', 'screensaver') || 'matrix'), get('config', 'screensaver-timeout') || get('user', 'screensaver-timeout') || 90000)
}

window.addEventListener('load', resetIdleTime)
document.addEventListener('mousemove', resetIdleTime)
document.addEventListener('keydown', resetIdleTime)
document.addEventListener('keyup', resetIdleTime)
document.addEventListener('keypress', resetIdleTime)
document.addEventListener('pointerdown', resetIdleTime)

// Register service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//   })
// }
