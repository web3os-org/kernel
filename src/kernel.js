/**
 * Web3os Kernel
 *
 * @description Entrypoint of the web3os kernel
 * @author Jay Mathis <code@mathis.network>
 * @license MIT
 * @see https://github.com/web3os-org/kernel
 */

/* global Kernel, Terminal, System */
/* global fetch, File, FileReader, localStorage, location, Notification */

import rootPkgJson from '../package.json'

import AwesomeNotifications from 'awesome-notifications'
import bytes from 'bytes'
import colors from 'ansi-colors'
import columnify from 'columnify'
import CustomEvent from 'custom-event-js'
import figlet from 'figlet'
import figletFont from 'figlet/importable-fonts/Graffiti'
import i18next from 'i18next'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import iconify from '@iconify/iconify'
import Keyboard from 'simple-keyboard'
import path from 'path'
import sweetalert from 'sweetalert2'
import topbar from 'topbar'

import { unzip } from 'unzipit'
import { v4 as uuidv4 } from 'uuid'

import 'systemjs'
import 'animate.css'
import 'awesome-notifications/dist/style.css'
// import 'simple-keyboard/build/css/index.css'
import './css/index.css'
import './themes/default/index.css'
import './themes/default/sweetalert2.css'

import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-snackbar'

import AppWindow from './windows'
import locales from './locales'
import README from '../README.md'
import theme from './themes/default/index.js'
import { default as W3OSTerminal } from './terminal'
import { fsModules } from './fs'

let BrowserFS
let memory
const figletFontName = 'Graffiti'

globalThis.topbar = topbar
globalThis.global = globalThis.global || globalThis

export const bootArgs = new URLSearchParams(globalThis.location.search)
export const isMobile = window.matchMedia('only screen and (max-width: 760px)').matches
export const version = rootPkgJson.version

export const KernelEvents = [
  'MemoryLoaded', 'FilesystemLoaded', 'KernelBinsLoaded', 'BuiltinModulesLoaded',
  'PackagesLoaded', 'AutostartStart', 'AutostartEnd', 'ScreensaverStart'
]

/** 
 * The array of default builtin modules 
 * @todo Whittle this down and migrate to packages
*/
export const builtinModules = [
  '3pm', 'account', 'backend', 'backup', 'bluetooth', 'confetti', 'contract', 'desktop', 'edit',
  'files', 'gamepad', 'help', 'hid', 'lang', 'markdown', 'peer', 'ping', 'repl', 'runkit', 'screensaver',
  'speak', 'socket', 'three', 'usb', 'view', 'vm', 'wallet', 'wasm', 'worker', 'www'
]

/** The array of default 3pm packages to install on new system */
export const defaultPackages = [
  'https://unpkg.com/@web3os-apps/doom',
  'https://unpkg.com/@web3os-apps/wolfenstein',
  'https://unpkg.com/@web3os-apps/minipaint',
  'https://unpkg.com/@web3os-apps/rubikscube',
]

const FileSystemOverlayConfig = {
  // AsyncMirror is not the ideal way to handle this, but it works for now
  // until migration from sync to async in the fsModules is complete
  '/': {
    fs: 'AsyncMirror',
    options: {
      sync: { fs: 'InMemory' },
      async: {
        fs: 'IndexedDB',
        options: {
          storeName: 'web3os'
        }
      }
    }
  },

  '/bin': { fs: 'InMemory' },
  '/tmp': { fs: 'InMemory' },
  '/mount': { fs: 'InMemory' },
  '/proc': { fs: 'InMemory' }
}

/**
 * Add HTML5
 * @todo Broken on Firefox
 * @see: webkitStorageOptions
 */

if (!navigator.userAgent.includes('Firefox')) {
  FileSystemOverlayConfig['/mount/html5fs'] = {
    fs: 'AsyncMirror',
    options: {
      sync: { fs: 'InMemory' },
      async: {
        fs: 'HTML5FS',
        options: {}
      }
    }
  }
}

colors.theme(theme)

/**
 * References the initialized i18next instance
 * @type {Object}
 * @see https://i18next.com
 */
export const i18n = i18next
const t = i18n.t

i18n.loadAppLocales = locales => {
  for (const [key, data] of Object.entries(locales)) {
    i18n.addResourceBundle(key, 'app', data, true)
    if (data.common) i18n.addResources(key, 'common', data.common, true)
  }
}

export const Web3osTerminal = W3OSTerminal

/**
 * Contains miscellaneous utilities
 * @todo Do this better
 * @type {Object}
 */
export const utils = { bytes, colorChars, path, wait }

/**
 * Contains all registered kernel modules
 * @type {Object}
 */
export const modules = {}

/**
 * Contains all registered kernel intervals
 * @type {Object}
 */
export const intervals = {}

/**
 * References the @iconify/iconify library
 */
export const icons = iconify

/**
 * Create an icon element
 * 
 * @param {string} id - The @iconify/iconify icon identifier
 * @param {Array.<string>} classes - Array of additional classes to apply to the element
 * @returns {HTMLElement}
 */
export const createIcon = (id, classes) => {
  const icon = document.createElement('i')
  icon.classList.add(...classes)
  icon.dataset.icon = id
  return icon
}

/**
 * Gives access to the virtual keyboard
 * 
 * This gives us more control and consistency over mobile input
 * 
 * @type {SimpleKeyboard}
 * @see https://virtual-keyboard.js.org
 */
export let keyboard

/**
 * Gives access to the BrowserFS API
 * @type {Object}
 */
export let fs

/**
 * The main kernel event bus
 * 
 * @type {CustomEvent}
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://www.npmjs.com/package/custom-event-js
 * 
 * @property {Function} dispatch - Dispatch an event
 * @property {string} dispatch.eventName - The name of the event
 * @property {Object} dispatch.detail - The event detail payload
 * @property {Function} on - Subscribe to event
 * @property {string} on.eventName - The name of the event
 * @property {Function} on.callback - Execute when this event is triggered
 * @property {Function} off - Unsubscribe from event
 * @property {string} off.eventName - The name of the event
 * @property {Function} off.callback - Execute when this event is triggered
 */
export const events = CustomEvent

/**
 * The primary Broadcast Channel for web3os
 * 
 * @type {BroadcastChannel}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
 */
export const broadcast = new BroadcastChannel('web3os')
broadcast.onmessage = msg => {
  console.log('Incoming Broadcast:', msg)
}

/**
 * 
 */
export async function analyticsEvent ({ event, user, details }) {
  if (/^localhost/.test(location.host)) return
  if (kernel.get('config', 'analytics-opt-out')) return

  if (!get('user', 'uuid')) set('user', 'uuid', uuidv4())
  user = user || get('user', 'uuid')

  await fetch('https://zqqgwwumllncmhfcxexw.functions.supabase.co/logger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: event || 'log', user, details: details || {} })
  })
}

/**
 * Output system information
 */
export async function printSystemInfo () {
  const isSmall = window.innerWidth <= 445
  let output = ''

  // if (navigator.deviceMemory) output += `\n${colors.info('RAM:')} >= ${colors.muted(navigator.deviceMemory + 'GB')}\n`

  if (navigator.userAgentData) {
    const { brand, version } = navigator.userAgentData.brands.slice(-1)?.[0]
    const browser = `${brand} v${version}`

    output += `${colors.info(`${t('Host')}:    `)}\t${location.host}\n`
    output += `${colors.info(`${t('Platform')}:`)}\t${navigator.userAgentData.platform || t('unknown', 'Unknown')}\n`
    output += `${colors.info(`${t('Browser')}:`)}\t${browser}\n`
  }

  if (navigator.getBattery) {
    const batt = await navigator.getBattery()

    batt.addEventListener('chargingchange', () => {
      if (batt.charging) execute('confetti')
    })

    output += `${colors.info(`${t('Battery')}:`)}\t${batt.charging ? `${batt.level * 100}% ⚡` : `${batt.level * 100}% 🔋`}\n`
  }

  if (navigator.storage?.estimate) {
    const storageDetails = await navigator.storage.estimate()
    const used = bytes(storageDetails.usage)
    const free = bytes(storageDetails.quota - storageDetails.usage)
    output += `${colors.info(`${t('Storage')}:`)}\t${used} ${isSmall ? '\n\t ' : '/'} ${free}\n`
  }

  if (console.memory) output += `${colors.info(t('Heap Limit') + ':')}\t${bytes(console.memory.jsHeapSizeLimit)}\n`
  if (navigator.hardwareConcurrency) output += `${colors.info(t('Cores') + ':')}\t\t${navigator.hardwareConcurrency}\n`
  if (typeof navigator.onLine === 'boolean') output += `${colors.info(t('Online') + ':')}\t\t${navigator.onLine ? t('Yes') : t('No')}\n`
  if (navigator.connection) output += `${colors.info(t('Downlink') + ':')}\t~${navigator.connection.downlink} Mbps\n`

  log(output)
  return output
}

/**
 * Output the boot introduction
 * */
export async function printBootIntro () {
  const { t } = i18n
  const isSmall = window.innerWidth <= 445

  log(colors.info(`${t('kernel:bootIntroSubtitle', '\t     https://web3os.sh')}`))
  log(colors.heading.success.bold(`\n${isSmall ? '' : '\t '}  web3os kernel v${rootPkgJson.version}   `))
  log(colors.warning(`${isSmall ? '' : '\t '}⚠         BETA         ⚠\n`))

  await printSystemInfo()

  if (!localStorage.getItem('web3os_first_boot_complete')) {
    log(colors.danger(`\n⚠ ${t('kernel:firstBootWarning', 'The first boot will take the longest, please be patient!')} ⚠`))
  }

  if (navigator.userAgentData?.platform === 'Android' || window.innerWidth < 500 || window.innerHeight < 500) {
    log(colors.danger(`\n⚠ 🐉  ${t('kernel:mobileExperienceWarning', 'NOTE: The mobile experience is pretty wacky and experimental - proceed with caution!')} ⚠`))
  }

  log(colors.underline(t('A few examples') + ':'))
  log(colors.danger(`\n${t('typeVerb', 'Type')} ${colors.bold.underline(Terminal.createSpecialLink('web3os:execute:help', 'help'))} ${t('kernel:bootIntro.help', 'for help')}`))
  log(colors.gray(`${t('typeVerb', 'Type')} ${colors.bold.underline(Terminal.createSpecialLink('web3os:execute:docs', 'docs'))} ${t('kernel:bootIntro.docs', 'to open the documentation')}`))
  log(colors.info(`${t('typeVerb', 'Type')} ${colors.bold.underline(Terminal.createSpecialLink('web3os:execute:desktop', 'desktop'))} ${t('kernel:bootIntro.desktop', 'to launch the desktop')}`))
  // log(colors.primary(`${t('typeVerb', 'Type')} ${colors.bold.underline('wallet connect')} ${t('kernel:bootIntro.wallet', 'to connect your wallet')}`))
  log(colors.success(`${t('typeVerb', 'Type')} ${colors.bold.underline(Terminal.createSpecialLink('web3os:execute:files /bin', 'files /bin'))} ${t('kernel:bootIntro.filesBin', 'to explore all executable commands')}`))
  // log(colors.warning(`${t('typeVerb', 'Type')} ${colors.bold.underline('lsmod')} ${t('kernel:bootIntro.lsmod', 'to list all kernel modules')}`))
  log(colors.muted(`${t('typeVerb', 'Type')} ${colors.bold.underline(`clip <${t('Command')}>`)} ${t('kernel:bootIntro.clip', 'to copy the output of a command to the clipboard')}`))
  // log(colors.white(`${t('typeVerb', 'Type')} ${colors.bold.underline('repl')} ${t('kernel:bootIntro.repl', 'to run the interactive Javascript terminal')}`))
  log(colors.cyan(`${t('typeVerb', 'Type')} ${colors.bold.underline(Terminal.createSpecialLink('web3os:execute:confetti', 'confetti'))} ${t('kernel:bootIntro.confetti', 'to fire the confetti gun 🎉')}`))
  // log(colors.magenta(`${t('typeVerb', 'Type')} ${colors.bold.underline('minipaint')} ${t('kernel:bootIntro.minipaint', 'to draw Art™ 🎨')}`))

  isSmall ? log('\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-') : log('\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
  log(colors.success(`${t('typeVerb', 'Type')} ${colors.bold.underline('install')} ${t('kernel:bootIntro.install', 'to install web3os to your device')}`))
  isSmall ? log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-') : log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')

  log('\nhttps://docs.web3os.sh')
  log('https://github.com/web3os-org')

  log(colors.muted(`\n${t('Booting')}...`))
}

/**
 * Write the kernel memory to localStorage
 */
function updateLocalStorage () { localStorage.setItem('memory', JSON.stringify(memory)) }

/**
 * Restore the kernel memory from localStorage
 */
function loadLocalStorage () {
  try {
    const storedMemory = localStorage.getItem('memory')
    memory = storedMemory ? JSON.parse(storedMemory) : { firstBootVersion: rootPkgJson.version,  }
    updateLocalStorage()
  } catch (err) {
    console.error(err)
    memory = {}
  }
}

/**
 * Set a value in the kernel memory object
 * @param {!string} namespace - The namespace in which to set the value
 * @param {!string} key - The key in which to set the value
 * @param {!string} value - The value to set
 */
export function set (namespace, key, value) {
  if (!namespace || namespace === '') throw new Error(t('Invalid namespace'))
  if (!key || key === '') throw new Error(t('Invalid key'))
  if (!value || value === '') throw new Error(t('Invalid value'))
  memory[namespace] = memory[namespace] || {}
  memory[namespace][key] = value
  updateLocalStorage()
  return memory[namespace]?.[key]
}

/**
 * Get a value from the kernel memory object
 * @param {!string} namespace - The namespace from which to get the value
 * @param {?string} key - The key to retrieve, or undefined to get entire namespace
 */
export function get (namespace, key) {
  if (!key) return memory[namespace] || null
  return memory[namespace]?.[key] || null
}

/**
 * Dump the kernel memory to a JSON object
 * @returns {string} dump The memory dump
 */
export function dump () { return JSON.stringify(memory) }

/**
 * Restore the kernel memory from a JSON object
 * @param {!string} json - The JSON object generated from dump()
 */
export function restore (json) {
  memory = JSON.parse(json)
  updateLocalStorage()
  return memory
}

/**
 * Delete the specified key from the kernel memory object
 * @param {!string} namespace - The namespace containing the key
 * @param {!key} key - The key to delete
 */
export function deleteKey (namespace, key) {
  if (!memory[namespace]?.[key]) throw new Error('Invalid namespace or key')
  delete memory[namespace][key]
  updateLocalStorage()
}

/**
 * Delete the specified namespace from the kernel memory object
 * @param {!namespace} namespace - The namespace to delete
 */
export function deleteNamespace (namespace) {
  if (!memory[namespace]) throw new Error('Invalid namespace')
  delete memory[namespace]
  updateLocalStorage()
}

/**
 * Log a message to the terminal
 * @param {!any} message - The message or object to log
 * @param {?Object} options - Logging options
 * @param {Boolean=} [options.console=true] - Enable logging to both browser console and Terminal
 * @param {?Web3osTerminal} options.terminal - The terminal to attach to, or undefined for global Terminal
 */
export function log (message, options = { console: true }) {
  if (!message) return
  message = message.replace(/\\n/gm, '\n')
  if (options.console) console.log(message)
  const term = options.terminal || globalThis.Terminal
  term.log(message)
}

/**
 * Manages interactions with the windowing system
 * @type Object
 * @property {Set} _collection - The collection of windows
 *
 * @property {Function} create - Create a new window
 * @property {Object} create.options - Options to pass to WinBox
 *
 * @property {Function} find - Find a window by ID
 * @property {string} find.id - The ID of the window (usually winbox-#; stored on app.window.id)
 * 
 * @see https://nextapps-de.github.io/winbox/
 */
export const windows = {
  _collection: new Set(),

  create: options => {
    const app = new AppWindow(options)
    windows._collection.add(app)
    return app
  },

  find: id => {
    return Array.from(windows._collection.values()).find(app => app.window.id === id)
  }
}

/**
 * Show a SweetAlert dialog
 * @async
 * @param {Object} options - SweetAlert2 options
 * @returns {SweetAlertDialog}
 */
export async function dialog (options = {}) {
  return sweetalert.fire({
    heightAuto: false,
    denyButtonColor: 'red',
    confirmButtonColor: 'green',
    customClass: { container: 'web3os-kernel-dialog-container' },
    ...options
  })
}

/**
 * Execute a command
 * @async
 * @param {string} cmd - The command to execute
 * @returns {CommandResult}
 */
export async function execute (cmd, options = {}) {
  const exec = cmd.split(' ')[0]
  const term = options.terminal || globalThis.Terminal
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

  options.doPrompt = options.doPrompt || false
  if (options.topbar) topbar.hide()
  if (!command?.run) {
    term.log(colors.danger(`Invalid command; try ${colors.underline.white('help')}`))
    navigator.vibrate([200, 50, 200])
    return term.prompt()
  }

  try {
    if (options.topbar) topbar.show()
    const args = cmd.split(' ').slice(1).join(' ')
    const result = await command.run(term, args)
    if (options.topbar) topbar.hide()
    if (options.doPrompt) term.prompt()
    return result
  } catch (err) {
    navigator.vibrate([200, 50, 200])
    console.error(command, err)
    if (err) term.log(err.message || 'An unknown error occurred')
    if (options.doPrompt) term.prompt()
    throw err
  }
}

/**
 * Execute a script file
 * @async
 * @param {string} path - The path of the script
 * @returns {SweetAlertDialog}
 */
export async function executeScript (filename, options = {}) {
  const term = options.terminal || globalThis.Terminal
  if (!filename || filename === '') return term.log(colors.danger('Invalid filename'))
  filename = utils.path.resolve(term.cwd, filename)

  const value = fs.readFileSync(filename, 'utf8')
  const commands = value.split('\n').map(c => c.trim())

  for (const cmd of commands) {
    if (cmd?.trim().length > 0 && cmd?.[0] !== '#' && cmd?.substr(0, 2) !== '//') await execute(cmd, { terminal: term, doPrompt: false })
  }
}

/**
 * Execute the /config/autostart.sh script
 * @async
 * @param {string=} defaultAutoStart - Write autostart script with this content if it doesn't exist
 */
export async function autostart (defaultAutoStart) {
  try {
    if (defaultAutoStart && !fs.existsSync('/config/autostart.sh')) {
      fs.writeFileSync('/config/autostart.sh', defaultAutoStart) // Setup default autostart.sh
    }

    if (fs.existsSync('/config/autostart.sh')) await executeScript('/config/autostart.sh')
  } catch (err) {
    console.error(err)
    log(colors.danger('Failed to complete autostart script'))
  } finally {
    globalThis.Terminal?.prompt()
  }
}

/**
 * Colorize a string to differentiate numbers and letters
 * @param {string} str - The string to colorize
 * @param {Object=} options - Options for colorization
 * @param {Function=} [options.numbers=colors.blue()] - The function to colorize numbers
 * @param {Function=} [options.letters=colors.white()] - The function to colorize letters
 */
export function colorChars (str, options = {}) {
  if (typeof str !== 'string') throw new Error('You must provide a string to colorChars')
  const numbers = options.numbers || colors.blue
  const letters = options.letters || colors.white
  return str.split('').map(c => isNaN(c) ? letters(c) : numbers(c)).join('')
}

/**
 * Send an awesome-notification
 * @type {AwesomeNotifications}
 * @see https://f3oall.github.io/awesome-notifications
 */
export const notify = new AwesomeNotifications({
  position: 'top-right',
  icons: {
    enabled: true,
    prefix: '<i class="iconify" data-icon="fa6-regular:',
    suffix: '" />'
  }
})

/**
 * Send a browser/platform notification
 * @async
 * @param {Object=} options - The notification options (Notification API)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/notification
 */
export async function systemNotify (options = {}) {
  if (Notification.permission !== 'granted') throw new Error('Notification permission denied')
  try {
    const notification = new Notification(options.title, options)
  } catch (err) {
    console.warn(err)
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Notification with ServiceWorker')
    })
  }
}

/**
 * Show a snackbar notification
 * 
 * @deprecated
 * This can still be useful I think, but it's being deprecated
 * in favor of awesome-notifications. Should this be removed?
 * 
 * @async
 * @param {Object=} options - The snackbar options
 * @see https://www.npmjs.com/package/@material/mwc-snackbar
 */
export async function snackbar (options = {}) {
  const snack = document.createElement('mwc-snackbar')
  snack.id = options.id || 'snack-' + Math.random()
  snack.leading = options.leading || false
  snack.closeOnEscape || false
  snack.labelText = options.labelText || ''
  snack.stacked = options.stacked || false

  const closeButton = document.createElement('mwc-icon-button')
  closeButton.icon = 'close'
  closeButton.slot = 'dismiss'

  snack.appendChild(closeButton)
  document.body.appendChild(snack)
  snack.show()
}

/**
 * Sets up the filesystem
 * 
 * These parameters can also be provided as a query parameter:
 * 
 * https://web3os.sh/?initfsUrl=https://my.place.com/initfs.zip
 * 
 * Bare minimum, temporary, fs:
 * https://web3os.sh/?mountableFilesystemConfig={ "/": { "fs": "InMemory" }, "/bin": { "fs": "InMemory" } }
 * 
 * @async
 * @param {string=} initfsUrl - URL to a zipped filesystem snapshot
 * @param {MountableFileSystemOptions=} mountableFilesystemConfig - Filesystem configuration object for BrowserFS for customization
 * @see https://jvilk.com/browserfs/2.0.0-beta/index.html
 */
export async function setupFilesystem (initfsUrl, mountableFilesystemConfig) {
  return new Promise(async (resolve, reject) => {
    const browserfs = await import('browserfs')
    const filesystem = {}
  
    let initfs
    initfsUrl = initfsUrl || bootArgs.get('initfsUrl')
    mountableFilesystemConfig = initfsUrl || bootArgs.get('mountableFilesystemConfig')
      ? JSON.parse(bootArgs.get('mountableFilesystemConfig')) : FileSystemOverlayConfig
  
    if (bootArgs.has('initfsUrl')) {
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
              globalThis.Terminal?.log(colors.danger(`Failed to unzip initfsUrl at ${initfsUrl}`))
              return true
            }
          }
        })
  
        if (result.isDenied) throw new Error('User rejected using initfs')
        const { entries } = result.value
        initfs = entries
        globalThis.history.replaceState(null, null, '/') // prevent reload with initfs
      } catch (err) {
        globalThis.Terminal?.log(colors.danger('Failed to unzip initfsUrl ' + initfsUrl))
        globalThis.Terminal?.log(colors.danger(err.message))
        console.error(err)
      }
    }
  
    browserfs.install(filesystem)
    browserfs.configure({
      fs: 'MountableFileSystem',
      options: mountableFilesystemConfig
    }, err => {
      if (err) {
        console.error(err)
        log(colors.danger(`Failed to initialize filesystem: ${err.message}`))
      } else {
        BrowserFS = filesystem
        fs = filesystem.require('fs')
  
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

        // Populate initial procfs
        fs.writeFileSync('/proc/host', location.host)
        fs.writeFileSync('/proc/version', rootPkgJson.version)
        fs.writeFileSync('/proc/platform', navigator.userAgentData.platform)
        fs.writeFileSync('/proc/querystring', location.search)
  
        if (!bootArgs.has('noDefaultPackages') && !fs.existsSync('/config/packages')) {
          fs.writeFileSync('/config/packages', JSON.stringify(defaultPackages))
        }

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
        //       const filepath = utils.path.resolve(Terminal.cwd, file.name)
        //       fs.writeFileSync(filepath, buffer)
        //       snackbar({ labelText: `Uploaded ${filepath}` })
        //     }
        //   }
        // }
  
        // Terminal.addEventListener('dragenter', dragenter)
        // Terminal.addEventListener('dragover', dragover)
        // Terminal.addEventListener('drop', drop)

        resolve(fs)
      }
    })
  })
}

/**
 * Load the kernel's core internal commands
 * 
 * These are here because they're relatively simple, but many of them should be
 * moved to their own respective external modules.
 * 
 * @async
 */
async function registerKernelBins () {
  const { t } = Kernel.i18n
  const kernelBins = {}

  kernelBins.alert = { description: t('kernel:bins.descriptions.alert', 'Show an alert'), run: (term, context) => dialog({ text: context }) }
  kernelBins.clear = { description: t('kernel:bins.descriptions.clear', 'Clear the terminal'), run: term => term.clear() }
  kernelBins.date = { description: t('kernel:bins.descriptions.date', 'Display the date/time'), run: term => term.log(new Intl.DateTimeFormat(Kernel.i18n.language || 'en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date()))}
  kernelBins.docs = { description: t('kernel:bins.descriptions.docs', 'Open the documentation'), run: term => { modules.www.run(term, '--title "Web3os Documentation" --no-toolbar /docs') }}
  kernelBins.dump = { description: t('kernel:bins.descriptions.dump', 'Dump the memory state'), run: term => term.log(dump()) }
  kernelBins.echo = { description: t('kernel:bins.descriptions.echo', 'Echo some text to the terminal'), run: (term, context) => term.log(context) }
  kernelBins.history = { description: t('kernel:bins.descriptions.history', 'Show command history'), run: term => { return term.log(JSON.stringify(term.history)) } }
  kernelBins.import = { description: t('kernel:bins.descriptions.import', 'Import a module from a URL'), run: async (term, context) => await importModuleUrl(context) }
  kernelBins.man = { description: t('kernel:bins.descriptions.man', 'Alias of help'), run: (term, context) => modules.help.run(term, context) }
  kernelBins.sh = { description: t('kernel:bins.descriptions.sh', 'Execute a web3os script'), run: (term, context) => executeScript(context, { terminal: term }) }
  kernelBins.systeminfo = { description: t('kernel:bins.descriptions.systeminfo', 'Print system information'), run: async () => await printSystemInfo() }
  kernelBins.systemnotify = { description: t('kernel:bins.descriptions.systemnotify', 'Show a browser/platform notification; e.g., systemnotify Title Body'), run: (term, context) => systemNotify({ title: context.split(' ')[0], body: context.split(' ')[1] }) }
  kernelBins.reboot = { description: t('kernel:bins.descriptions.reboot', 'Reload web3os'), run: () => location.reload() }
  kernelBins.restore = { description: t('kernel:bins.descriptions.restore', 'Restore the memory state'), run: (term, context) => restore(context) }
  kernelBins.snackbar = { description: t('kernel:bins.descriptions.snackbar', 'Show a snackbar; e.g. snackbar Alert!'), run: (term, context) => snackbar({ labelText: context }) }
  kernelBins.wait = { description: t('kernel:bins.descriptions.wait', 'Wait for the specified number of milliseconds'), run: (term, context) => wait(context) }

  kernelBins.alias = {
    description: t('kernel:bins.descriptions.alias', 'Set or list command aliases'),
    help: `${t('Usage', 'Usage')}: alias [src] [dest]`,
    run: (term, context) => {
      if (!context || context === '') return term.log(term.aliases)
      const command = context.split(' ')
      if (command.length !== 2) throw new Error('You must specify the src and dest commands')
      term.aliases[command[0]] = command[1]
    }
  }

  kernelBins.ipecho = {
    description: t('kernel:bins.descriptions.ipecho', 'Echo your public IP address'),
    run: async (term = globalThis.Terminal) => {
      const result = await fetch('https://ipecho.net/plain')
      const ip = await result.text()
      console.log({ ip })
      term.log(ip)
      return ip
    }
  }

  kernelBins.lsmod = {
    description: t('kernel:bins.descriptions.lsmod', 'List loaded kernel modules'),
    run: async (term = globalThis.Terminal) => {
      const mods = {
        ...modules,
        ...module.exports,
        ...exports
      }

      term.log(Object.keys(mods).sort())
      return Object.keys(mods).sort()
    }
  }

  kernelBins.memoryinfo = {
    description: `${t('kernel:bins.descriptions.memoryinfo', 'Show Javascript heap information')}`,
    run: async (term = globalThis.Terminal) => {
      const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = console.memory

      const meminfo = {
        jsHeapSizeLimit: bytes(jsHeapSizeLimit),
        totalJSHeapSize: bytes(totalJSHeapSize),
        usedJSHeapSize: bytes(usedJSHeapSize)
      }

      term.log(meminfo)
      return meminfo
    }
  }

  kernelBins.open = {
    description: `${t('kernel:bins.descriptions.open', 'Open a shortcut defined in /config/shortcuts')}`,
    run: async (term = globalThis.Terminal, context) => {
      if (!fs.existsSync('/config/shortcuts')) throw new Error('/config/shortcuts does not exist')
      const shortcuts = JSON.parse(fs.readFileSync('/config/shortcuts', 'utf8'))
      if (!context || context === '') return term.log(JSON.stringify(shortcuts, null, 2))
      if (!shortcuts[context]) throw new Error('Invalid shortcut')
      const shortcut = shortcuts[context]

      switch (shortcut.type) {
        case 'execute':
          const cmds = shortcut.target.split(';').map(cmd => cmd.trim())
          for await (const cmd of cmds) term.kernel.execute(cmd)
          break
        case 'url':
          return window.open(shortcut.target, '_blank')
      }
    }
  }

  kernelBins.storageinfo = {
    description: t('kernel:bins.descriptions.storage', 'Display storage usage information'),
    run: async (term = globalThis.Terminal) => {
      const rawData = await navigator.storage.estimate()
      const data = {
        quota: bytes(rawData.quota),
        usage: bytes(rawData.usage),
        usageDetails: {}
      }

      Object.entries(rawData.usageDetails).forEach(entry => {
        data.usageDetails[entry[0]] = bytes(entry[1])
      })

      term.log(data)
      return data
    }
  }

  kernelBins.set = {
    description: t('kernel:bins.descriptions.set', 'Set a kernel memory value'),
    help: `${t('Usage', 'Usage')}: set <namespace> <key> <value>`,
    run: (term, context = '') => {
      const parts = context.split(' ')
      const namespace = parts[0]
      const key = parts[1]
      const value = parts.slice(2, parts.length).join(' ')
      term.log(set(namespace, key, value))
    }
  }

  kernelBins.get = {
    description: t('kernel:bins.descriptions.get', 'Get a kernel memory namespace or key'),
    help: `${t('Usage', 'Usage')}: get <namespace> [key]`,
    run: (term, context = '') => {
      const parts = context.split(' ')
      const namespace = parts[0]
      const key = parts[1]
      const result = get(namespace, key)
      term.log(typeof result === 'string' ? result : JSON.stringify(result))
    }
  }

  kernelBins.unset = {
    description: t('kernel:bins.descriptions.unset', 'Delete specified memory namespace or key'),
    help: `${t('Usage', 'Usage')}: unset <namespace> [key]`,
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
    description: t('kernel:bins.descriptions.eval', 'Load and evaluate a Javascript file'),
    run: (term, context) => {
      if (!context || context === '') return term.log(colors.danger('Invalid filename'))
      const filename = utils.path.resolve(term.cwd, context)

      if (fs.existsSync(filename)) {
        const code = fs.readFileSync(filename, 'utf-8')
        eval(code) // eslint-disable-line
      } else {
        eval(context)
      }
    }
  }

  kernelBins.clip = {
    description: t('kernel:bins.descriptions.clip', 'Copy return value of command to clipboard'),
    help: `${t('Usage', 'Usage')}: clip <command>`,
    run: async (term, context) => {
      if (!context || context === '') return
      const parts = context.split(' ')
      const mod = modules[parts[0]]

      let result = await mod.run(term, parts.splice(1).join(' '))
      if (Array.isArray(result) && result.length === 1) result = result[0] 
      return await navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result, null, 2))
    }
  }

  kernelBins.height = {
    description: t('kernel:bins.descriptions.height', 'Set body height'),
    run: (term, context) => { document.body.style.height = context }
  }

  kernelBins.width = {
    description: t('kernel:bins.descriptions.width', 'Set body width'),
    run: (term, context) => { document.body.style.width = context }
  }

  kernelBins.objectUrl = {
    description: t('kernel:bins.descriptions.objectUrl', 'Create an ObjectURL for a file'),
    run: (term, filename) => {
      const { t } = Kernel.i18n
      if (!filename || filename === '') throw new Error(t('invalidFilename', 'Invalid filename'))
      const data = fs.readFileSync(utils.path.join(term.cwd, filename))
      const file = new File([data], utils.path.parse(filename).base, { type: 'application/octet-stream' })
      const url = URL.createObjectURL(file)
      term.log(url)
      return url
    }
  }

  kernelBins.geo = {
    description: t('kernel:bins.descriptions.geo', 'Geolocation Utility'),
    run: async (term = globalThis.Terminal) => {
      if (!navigator.geolocation) throw new Error(t('kernel:bins.errors.geo.geolocationUnavailable', 'Geolocation is not available'))
      return new Promise((resolve, reject) => {
        try {
          navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords
            const link = `https://www.openstreetmap.org/search?query=${latitude}%2C${longitude}`
            term.log({ latitude, longitude, link, pos })
            resolve({ latitude, longitude, link, pos })
          })
        } catch (err) {
          console.error(err)
          if (err.message) term.log(colors.danger(err.message))
          reject(err)
        }
      })
    }
  }

  kernelBins.eyedropper = {
    description: t('kernel:bins.descriptions.eyeDropper', 'Pick colors using the eyedropper'),
    run: async (term = globalThis.Terminal) => {
      const dropper = new EyeDropper()
      const color = await dropper.open()
      term.log(color)
      return color
    }
  }

  for (const [name, mod] of Object.entries(kernelBins)) {
    loadModule(mod, { name: `@web3os-core/${name}` })
  }
}

/**
 * Load the kernel's core external modules
 * @async
 */
async function registerBuiltinModules () {
  const mods = process.env.BUILTIN_MODULES ? process.env.BUILTIN_MODULES.split(',') : builtinModules

  for (const mod of mods) {
    try {
      const modBin = await import(`./modules/${mod}`)
      await loadModule(modBin, { name: `@web3os-core/${mod}` })
    } catch (err) {
      console.error(err)
      Terminal.log(colors.danger(`Error loading module: ${mod}`))
      Terminal.log(err.message)
    }
  }
}

/**
 * Load a module into the kernel
 * @async
 * @param {!ModInfo} mod - The mod to load
 * @param {Object=} options - Options for loading the module
 */
export async function loadModule (mod, options = {}) {
  const { t } = Kernel.i18n
  if (!mod) throw new Error(`${t('kernel:invalidModule', 'Invalid module provided to')} kernel.loadModule`)

  let { description, help, name, run, version, pkgJson } = options
  description = description || mod.description
  version = version || pkgJson?.version || mod.version
  help = help || mod.help || t('kernel:helpNotExported', 'Help is not exported from this module')
  name = name || mod.name || 'module_' + Math.random().toString(36).slice(2)
  run = run || mod.run || mod.default

  if (!modules[name]) modules[name] = {}
  modules[name] = { ...modules[name], ...mod, run, name, version, description, help }

  const web3osData = pkgJson?.web3osData

  const modInfo = {
    name,
    version,
    description,
    web3osData,
    help
  }

  if (run) {
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

/**
 * Directly import an ES module from a URL
 * @async
 * @param {string} url - The URL of the module to import
 * @return {Module}
 */
export async function importModuleUrl (url) {
  return await import(/* webpackIgnore: true */ url)
}

/**
 * Directly import a UMD module from a URL
 * @async
 * @param {string} url - The URL of the module to import
 * @return {Module}
 */
export async function importUMDModule (url, name, module = { exports: {} }) {
  // Dark magic stolen from a lost tome of stackoverflow
  const mod = (Function('module', 'exports', await (await fetch(url)).text())
    .call(module, module, module.exports), module).exports

  mod.default = mod.default || mod
  return mod
}

/**
 * Load or install the packages defined in /config/packages
 * @async
 */
export async function loadPackages () {
  const packages = JSON.parse(fs.readFileSync('/config/packages').toString())
  for await (const pkg of packages) {
    try {
      if (/^(http|ftp).*\:/i.test(pkg)) {
        if (modules?.['3pm']) {
          await modules['3pm'].install(pkg, { warn: false })
        } else {
          const waitFor3pm = async () => {
            if (!modules?.['3pm']) return setTimeout(waitFor3pm, 500)
            await modules['3pm'].install(pkg, { warn: false })
          }

          await waitFor3pm()
        }

        continue
      }

      const pkgJson = JSON.parse(fs.readFileSync(`/var/packages/${pkg}/package.json`))
      const main = pkgJson.web3osData.main || pkgJson.main || 'index.js'
      const type = pkgJson.web3osData.type || 'es'
      const mainUrl = `${pkgJson.web3osData.url}/${main}`

      const mod = type === 'umd'
        ? await importUMDModule(mainUrl)
        : await importModuleUrl(mainUrl)

      await loadModule(mod, pkgJson)
    } catch (err) {
      console.error(err)
      globalThis.Terminal.log(colors.danger(err.message))
    }
  }
}

/**
 * Show the boot splash screen
 * @async
 * @todo Make this more customizable
 * @param {string} msg - The message to display
 * @param {Object=} options - The splash screen options
 */
export async function showSplash (msg, options = {}) {
  const { t } = Kernel.i18n
  document.querySelector('#web3os-splash')?.remove()

  // TODO: Migrating everything to iconify
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
  subtitle.innerHTML = options.subtitle || t('kernel:bootIntroSubtitle', 'Made with <span class="heart">♥</span> by Jay Mathis')
  subtitle.style.margin = 0
  subtitle.style.color = options.subtitleColor || '#ccc'
  subtitle.style.fontStyle = options.subtitleFontStyle || 'italic'

  if (subtitle.querySelector('span.heart')) {
    subtitle.querySelector('span.heart').style.color = 'red'
    subtitle.querySelector('span.heart').style.fontSize = '1.5em'
  }

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
  message.textContent = msg || `💾 ${t('Booting', 'Booting')}... 💾`

  const versionInfo = document.createElement('h4')
  versionInfo.id = 'web3os-splash-version'
  versionInfo.style.color = '#333'
  versionInfo.style.position = 'fixed'
  versionInfo.style.bottom = '0.5rem'
  versionInfo.style.right = '1rem'
  versionInfo.textContent = `v${rootPkgJson.version}`

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
  container.appendChild(versionInfo)

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

/**
 * Boot the kernel
 * 
 * This kicks off the process of initializing the filesystem, modules, and other components
 * @async
 */
export async function boot () {
  i18n
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'en-US',
      debug: process.env.I18N_DEBUG === 'true',
      ns: ['common', 'kernel'],
      defaultNS: 'common',
      resources: locales
    })

  topbar.show()
  const bootArgs = new URLSearchParams(globalThis.location.search)
  globalThis.addEventListener('beforeunload', async () => {
    await showSplash(`${t('Rebooting', 'Rebooting')}...`, { icon: 'autorenew', disableAnimation: true, disableVideoBackground: true })
    document.querySelector('#web3os-splash-icon').classList.add('rotating')
  })

  // const keyboardElement = document.createElement('div')
  // keyboardElement.classList.add('simple-keyboard')
  // // keyboardElement.style.display = 'none'
  // keyboardElement.style.position = 'absolute'
  // keyboardElement.style.top = '0'
  // document.body.appendChild(keyboardElement)
  // keyboard = new Keyboard({
  //   onChange: input => events.dispatch('MobileKeyboardChange', input),
  //   onKeyPress: button => events.dispatch('MobileKeyboardKeyPress', button)
  // })

  // TODO: Make nobootsplash settable in config as well as query string
  if (!bootArgs.has('nobootsplash')) {
    events.dispatch('ShowSplash')
    const closeSplash = await showSplash()
    setTimeout(closeSplash, 1500) // Prevent splash flash. The splash is pretty and needs to be seen and validated.
    document.querySelector('#web3os-terminal').style.display = 'block'
    setTimeout(globalThis.Terminal?.fit, 50)
    globalThis.Terminal?.focus()
  } else {
    document.querySelector('#web3os-terminal').style.display = 'block'
    setTimeout(globalThis.Terminal?.fit, 50)
    globalThis.Terminal?.focus()
  }

  setInterval(() => globalThis.Terminal?.fit(), 200)

  const isSmall = window.innerWidth <= 445
  figlet.parseFont(figletFontName, figletFont)
  figlet.text('web3os', { font: figletFontName }, async (err, data) => {
    if (err) log(err)
    if (data && globalThis.innerWidth >= 768) log(`\n${colors.green.bold(data)}`)
    else log(`\n${colors.green.bold(`${isSmall ? '' : '\t   '}🐉  web3os 🐉`)}`)

    console.log(`%cweb3os %c${rootPkgJson.version}`, `
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
    console.log({ Kernel, Terminal, System })

    for (const evt of KernelEvents) events.on(evt, console.log('Kernel Event:', evt))

    if (!bootArgs.has('nobootintro')) await printBootIntro()
    await loadLocalStorage()
    events.dispatch('MemoryLoaded', memory)
    await setupFilesystem()
    events.dispatch('FilesystemLoaded')
    await registerKernelBins()
    events.dispatch('KernelBinsLoaded')
    await registerBuiltinModules()
    events.dispatch('BuiltinModulesLoaded')

    // Load builtin kernel FS modules into the kernel
    for await (const [name, mod] of Object.entries(await fsModules({ BrowserFS, fs, execute, modules, t, utils }))) {
      loadModule(mod, { name: `@web3os-fs/${name}` })
    }

    await loadPackages() // TODO: This should be offloaded to 3pm
    events.dispatch('PackagesLoaded')

    // Copy namespaced core modules onto root object
    const web3osCoreNamespaces = ['@web3os-core', '@web3os-fs']
    for (const mod of Object.values(modules)) {
      const [namespace, name] = mod.name.split('/')
      if (web3osCoreNamespaces.includes(namespace)) modules[name] = mod
    }

    // Check for notification permission and request if necessary
    if (Notification?.permission === 'default') Notification.requestPermission()
    if (Notification?.permission === 'denied') log(colors.warning('Notification permission denied'))

    localStorage.setItem('web3os_first_boot_complete', 'true')
    events.dispatch('AutostartStart')
    await autostart()
    events.dispatch('AutostartEnd')
    await execute('confetti --startVelocity 90 --particleCount 150')
    topbar.hide()
    const heartbeat = setInterval(() => navigator.vibrate([200, 50, 200]), 1000)
    setTimeout(() => clearInterval(heartbeat), 5000)
    
    // Expose this globally in case it needs to be cleared externally by an app
    window.blinkyTitleInterval = setInterval(() => {
      document.title = document.title.includes('_') ? 'web3os# ' : 'web3os# _'
    }, 600)

    events.dispatch('BootComplete')
    analyticsEvent({ event: 'boot-complete' })
  })
}

/**
 * Wait for the specified number of milliseconds
 * @async
 * @param {number} ms - The number of milliseconds to wait
 * @return {Module}
 */
export async function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ----------------------------------------------------------------

// Setup screensaver interval
let idleTimer
const resetIdleTime = () => {
  clearTimeout(idleTimer)
  if (!modules.screensaver) return
  idleTimer = setTimeout(() => {
    events.dispatch('ScreensaverStart')
    modules.screensaver.run(globalThis.Terminal, get('user', 'screensaver') || 'matrix')
  }, get('config', 'screensaver-timeout') || get('user', 'screensaver-timeout') || 90000)
}

// Activity listeners to reset idle time
globalThis.addEventListener('load', resetIdleTime)
globalThis.addEventListener('mousemove', resetIdleTime)
globalThis.addEventListener('keydown', resetIdleTime)
globalThis.addEventListener('keyup', resetIdleTime)
globalThis.addEventListener('keypress', resetIdleTime)
globalThis.addEventListener('pointerdown', resetIdleTime)

// Setup protocol handler
if (navigator.registerProtocolHandler) navigator.registerProtocolHandler('web+threeos', '?destination=%s')

// Handle PWA installability
globalThis.addEventListener('beforeinstallprompt', e => {
  const installer = {
    name: '@web3os-core/install',
    description: t('kernel:bins.descriptions.install', 'Install web3os as a PWA'),
    run: async () => {
      const result = await e.prompt()
      Terminal.log(result)
      analyticsEvent({ event: 'pwa-install', details: result })
    }
  }

  modules[installer.name] = installer
  modules.install = installer
})

// Register service worker
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  globalThis.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
  })
}
