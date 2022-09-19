/**
 * Web3os Terminal
 * 
 * Unless you have a reason to directly create a new Web3osTerminal(),
 * you should probably use the static {@link Web3osTerminal.create} method
 * 
 * Prompt Format
 * 
 * When setting #promptFormat, you may include these substitutions:
 * 
 * {cwd} - When the prompt is compiled, this will be replaced with the current working directory
 * 
 * @class Web3osTerminal
 * @extends Terminal
 * 
 * @param {Object=} options - Options for the new terminal
 * @param {Web3osKernel=} [options.kernel=globalThis.Kernel] - The kernel for the terminal to attach to
 * @param {boolean=} [options.debug=false] - Enable verbose logging
 * @param {Array.<CustomCommand>} options.customCommands - An array of custom commands only for this terminal
 *
 * @property {string} cmd - The current user input
 * @property {string} cwd - The current working directory
 * @property {Object} env - The terminal's environment variables
 * @property {boolean} debug - Enable verbose output
 * @property {Function} execute - Override command execution
 * @property {Object} aliases - Map of command aliases
 * @property {Array.<string>} history - The history of commands entered
 * @property {Array.<string>} binSearchPath - An array of package scopes to search (in order) for executables
 * @property {Array.<CustomCommand>} customCommands - An array of custom commands only for this terminal
 * @property {number} cursorPosition - The current cursor position of the input string
 * @property {number} historyPosition - The current position in the history array
 * @property {string} promptFormat - The prompt format containing substitutions
 * @property {boolean} tabSelectMode - Whether the prompt is cycling tab choices
 * @property {Array.<string>} tabSelectChoices - The array of choices that match the user's input
 * @property {number} tabSelectCurrentChoice - The current index of tabSelectChoices
 * @property {Object} escapes - ANSI escapes via ansi-escape-sequences
 */

/**
 * @typedef CustomCommand
 * @memberof Web3osTerminal
 * @property {string} name - The name to enter into the terminal to invoke this command
 * @property {Function} run - The function to execute when this command is invoked
 * @example
 * {
 *    name: 'smile',
 *    run: (term, context) => console.log('😁', { term, context })
 * }
 */

import path from 'path'
import colors from 'ansi-colors'
import escapes from 'ansi-escape-sequences'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebglAddon } from 'xterm-addon-webgl'
import { AttachAddon } from 'xterm-addon-attach'
import { WebLinksAddon } from 'xterm-addon-web-links'

import 'xterm/css/xterm.css'
import { term } from '../kernel'

let defaults = {
  fontSize: 16,
  smoothScrollDuration: 100,
  convertEol: true,
  cursorBlink: true,
  macOptionIsMeta: true,
  allowProposedApi: true
}

export default class Web3osTerminal extends Terminal {
  cmd = ''
  cwd = '/'
  env = {}
  debug = false
  execute = false
  aliases = {}
  history = []
  binSearchPath = []
  customCommands = []
  cursorPosition = 0
  historyPosition = 0
  tabSelectMode = false
  tabSelectChoices = []
  tabSelectCurrentChoice = -1
  promptFormat = ''

  escapes = escapes

  constructor (options = {}) {
    super(options) // 🦸‍♂️⚙
    const self = this

    this.kernel = options.kernel || globalThis.Kernel
    this.customCommands = options.customCommands || []
    this.binSearchPath = options.binSearchPath || ['@web3os-core', '@web3os-fs', '@web3os-apps', '@web3os-utils']
    this.debug = options.debug || false
    this.execute = options.execute || false
    this.promptFormat = options.promptFormat || `<${colors.cyan('3os')}>${colors.blue('{cwd}')}${colors.green('#')} `
    this.log = this.log.bind(this)
    if (this.debug) console.log('New Terminal Created:', this, { options, kernel: this.kernel })

    this.options.linkHandler = this.options.linkHandler || {
      activate (event, text, range) {
        self.specialLinkHandler(event, text, range, self)
      }
    }

    this.customCommands.push({
      name: '$custom',
      run: (term, context) => {
        const customs = this.customCommands.map(command => ({ name: command.name, description: command.description }))
        term.log(customs)
        term.prompt()
        return customs
      }
    })

    this.customCommands.push({
      name: '$env',
      run: (term, context) => {
        let result
        const [key, value] = context.split(' ')
        if (this.debug) console.log('ENV:', { key, value })
        if (value) this.env[key] = isNaN(value) ? value : parseFloat(value)
        if (key) result = this.env[key]
        else result = this.env
        term.log(result)
        term.prompt()
        return result
      }
    })

    // Wait for textarea and apply fixes for mobile
    if (this.kernel.isMobile) {
      const waitInterval = setInterval(() => {
        if (this.textarea) {
          clearInterval(waitInterval)
          this.textarea.setAttribute('enterkeyhint', 'send')

          const pollInterval = setInterval(() => {
            const input = this.textarea.value
            if (input.trim().length > 0 && this.cmd.trim().length < input.trim().length) {
              this.cmd = input
              this.cursorPosition = this.cmd.length
            }
          }, 100)
        }
      }, 100)
    }
  }

  /**
   * Create a new Web3os Terminal instance with addons:
   * 
   * xterm-addon-fit, xterm-addon-web-links, xterm-addon-attach
   * 
   * @memberof Web3osTerminal
   * @param {Object} options - The options for the new terminal
   * @returns {Web3osTerminal}
   */
  static create (options = {}) {
    const term = new Web3osTerminal({ ...defaults, ...options })
    const fitAddon = new FitAddon()

  
    term.loadAddon(fitAddon)
    term.loadAddon(new WebLinksAddon())

    if (options.socket) {
      const attachAddon = new AttachAddon(options.socket)
      term.loadAddon(attachAddon)
    }
  
    term.fit = fitAddon.fit.bind(fitAddon)
    return term
  }

  /**
 * Create a special hyperlink introduced in xterm.js v5
 * 
 * @param {String} uri
 * @param {String} text
 */
  createSpecialLink (uri, text) {
    return `\x1b]8;;${uri}\x1b\\${text}\x1b]8;;\x1b\\`
  }

  /**
 * Handle special hyperlinks introduced in xterm.js v5
 */
  specialLinkHandler (event, text, range, term) {
    const parts = text.split(':')
    if (parts[0] !== 'web3os') return window.open(text)

    const cmd = parts[1]
    const args = parts[2]

    switch (cmd) {
      case 'execute':
        return this.kernel.execute(args)
    }
  }

  loadWebglAddon () {
    const addon = new WebglAddon()
    addon.onContextLoss(() => addon.dispose())
    this.loadAddon(addon)
  }

  /**
   * Log a message to the terminal
   * @memberof Web3osTerminal
   * @instance
   * @param {...any} args - Strings or stringifiable object to log
  */
  log (...args) {
    for (let arg of args) {
      arg = typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
      if (arg) this.writeln(arg)
    }

    return args
  }

  /**
   * Compile the prompt string (symbol replacement)
   * @memberof Web3osTerminal
   * @instance
   * @returns {string} prompt - The compiled prompt string
   */
  promptCompile () {
    return this.promptFormat.replace(/\{cwd\}/g, colors.muted(this.cwd))
  }

  /**
   * Write the prompt to the terminal and listen for input
   * @memberof Web3osTerminal
   * @instance
   * @param {string=} value - If passed, will update this terminal's promptFormat
   */
  prompt (value) {
    if (value) this.promptFormat = value
    this.write(this.promptCompile())
    this.listen()
  }

  /**
   * Handle pasting content from the clipboard
   * @memberof Web3osTerminal
   * @instance
   * @param {string=} [data=navigator.clipboard.readText()] - Data to paste into the terminal
   */
  async paste (data) {
    const clip = data ? data : await navigator.clipboard.readText()
    this.write(clip)
    this.cmd += clip
    this.cursorPosition += clip.length
  }

  /**
   * Check if the domEvent represents a printable character
   * @memberof Web3osTerminal
   * @instance
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {boolean} true if the event represents a printable character
   */
  isPrintable (event) {
    const code = event.which
    if (!code) return false

    return !event.altKey && !event.ctrlKey && !event.metaKey &&
      (
        code >= 32 && code <= 126 ||
        code >= 186 && code <= 192 ||
        code >= 219 && code <= 222 ||
        [173].includes(code)
      )
  }

  /**
   * Cancel tab completion
   * @memberof Web3osTerminal
   * @instance
   */
  cancelTabSelection () {
    if (!this.tabSelectMode) return
    const currentChoice = this.tabSelectChoices[this.tabSelectCurrentChoice]
    const goBack = currentChoice.slice(this.cmd.length).length
    this.tabSelectMode = false
    this.tabSelectChoices = []
    this.tabSelectCurrentChoice = 0
    if (goBack > 0) this.write(escapes.cursor.back(goBack))
    this.write(escapes.erase.inLine())
  }

  /**
   * Accept the current tab completion option
   * @memberof Web3osTerminal
   * @instance
   */
  acceptTabSelection () {
    this.cmd = this.tabSelectChoices[this.tabSelectCurrentChoice]
    this.cursorPosition = this.cmd.length
    this.tabSelectMode = false
    this.write(escapes.cursor.back(this.cmd.length))
    this.write(escapes.erase.inLine())
    this.write(this.cmd)
  }

  /**
   * Run the command
   * @memberof Web3osTerminal
   * @instance
   */
  run (cmd) {
    let exec = this.aliases[cmd] ? this.aliases[cmd] : cmd
    const options = { terminal: this, doPrompt: true }

    const customCommand = this.customCommands?.find(c => c.name === cmd.split(' ')[0])
    if (customCommand) customCommand.run(this, cmd.split(' ').slice(1).join(' '))
    else {
      if (/^\/bin\/.+/.test(this.cwd)) {
        const scopedBin = path.join(this.cwd, cmd)
        if (this.kernel.fs.existsSync(scopedBin)) {
          this.kernel.execute(scopedBin.replace('/bin/', ''), options)
        } else {
          this.kernel.execute(exec, options)
        }
      } else {
        const searchPaths = [...this.cwd, ...this.binSearchPath.map(p => `/bin/${p}`)]
        const match = searchPaths.find(p => p !== '/' && this.kernel.fs.existsSync(`${p}/${exec.split(' ')[0]}`))
        if (match) exec = path.join(`${match}/${exec.split(' ')[0]}`) + ' ' + exec.split(' ').slice(1).join(' ')
        this.execute ? this.execute(exec, options) : this.kernel.execute(exec, options)
      }
    }
  }

  /**
   * Handle the keypress event
   * @memberof Web3osTerminal
   * @instance
   * @param {Object} data - The data for the key handler
   * @param {string} data.key - The ASCII representation of the key
   * @param {KeyboardEvent} data.domEvent - The KeyboardEvent from the DOM listener
   */
  async keyHandler ({ key, domEvent }) {
    if (!key) return
    const keyName = domEvent.key
    const printable = this.isPrintable(domEvent)
    const cursorPosition = this.cursorPosition
    const cmd = this.cmd

    if (this.debug) console.log({ cursorPosition, cmd, keyName, domEvent, key, printable })

    if (domEvent.ctrlKey) {
      switch (keyName.toLowerCase()) {
        case 'v':
          return await this.paste()
        case 'c':
          if (this.getSelection() === '') {
            this.cmd = ''
            this.write('^C\n')
            this.cursorPosition = 0
            this.historyPosition = 0
            return this.prompt()
          }

          return await navigator.clipboard.writeText(this.getSelection())
        default:
          return
      }
    }

    switch (keyName) {
      case 'Enter':
        if (this.tabSelectMode) {
          this.acceptTabSelection()
          break
        }

        if (this.debug) console.log('Enter:', this.cmd, this.textarea)

        this.write('\n')
        this.unlisten()

        // Mobileish keyboard
        if (this.cmd.trim().length === 0 && this.textarea.value.trim().length > 0) this.cmd = this.textarea.value.trim()
        if (this.cmd.trim().length === 0) return this.prompt()

        this.interruptListener = this.onKey(this.interruptHandler.bind(this))

        const cmds = this.cmd.split(';').map(cmd => cmd.trim())
        for (const cmd of cmds) this.run(cmd)

        this.history.push(this.cmd)
        this.cmd = ''
        this.cursorPosition = 0
        this.historyPosition = 0
        break
      case 'Delete':
        if (this.tabSelectMode || this.cursorPosition === this.cmd.length) break
        this.cmd = `${this.cmd.slice(0, this.cursorPosition)}${this.cmd.slice(this.cursorPosition + 1)}`
        this.write(escapes.erase.inLine())
        this.write(this.cmd.slice(this.cursorPosition))
        if (this.cmd.length > this.cursorPosition) this.write(escapes.cursor.back(this.cmd.length - this.cursorPosition))
        break
      case 'Backspace':
        if (this.tabSelectMode) {
          this.cancelTabSelection()
          break
        }

        if (this.cursorPosition === 0) break
        this.cursorPosition--
        this.write(escapes.cursor.back())
        this.cmd = `${this.cmd.slice(0, this.cursorPosition)}${this.cmd.slice(this.cursorPosition + 1)}`
        this.write(escapes.erase.inLine())
        this.write(this.cmd.slice(this.cursorPosition))
        if (this.cmd.length > this.cursorPosition) this.write(escapes.cursor.back(this.cmd.length - this.cursorPosition))
        break
      case 'ArrowLeft':
        if (this.tabSelectMode) {
          this.cancelTabSelection()
          break
        }

        if (this.cursorPosition === 0) break
        this.cursorPosition--
        this.write(key)
        break
      case 'ArrowRight':
        if (this.tabSelectMode) {
          this.acceptTabSelection()
          break
        }

        if (this.cursorPosition >= this.cmd.length) break
        this.cursorPosition++
        this.write(key)
        break
      case 'ArrowDown':
        if (this.tabSelectMode) {
          this.acceptTabSelection()
          break
        }

        if (this.history.length > 0) this.historyPosition += 1
        if (this.historyPosition > this.history.length) this.historyPosition = 0
        if (this.historyPosition === 0 && this.cmd.length > 0) {
          this.cmd = ''
          this.write(escapes.cursor.back(this.cursorPosition))
          this.write(escapes.erase.inLine())
          this.cursorPosition = 0
          break
        }

        const previousCommand = this.history[this.historyPosition - 1]
        if (previousCommand) {
          if (this.cursorPosition > 0) this.write(escapes.cursor.back(this.cmd.length))
          this.write(escapes.erase.inLine())
          this.write(previousCommand)
          this.cmd = previousCommand
          this.cursorPosition = this.cmd.length
        } else {
          this.historyPosition = 0
        }

        break
      case 'ArrowUp':
        if (this.tabSelectMode) {
          this.acceptTabSelection()
          break
        }

        if (this.history.length > 0) this.historyPosition -= 1
        if (this.historyPosition < 0) this.historyPosition = this.history.length
        if (this.historyPosition === 0 && this.cmd.length > 0) {
          this.cmd = ''
          this.write(escapes.cursor.back(this.cursorPosition))
          this.write(escapes.erase.inLine())
          this.cursorPosition = 0
          break
        }

        const nextCommand = this.history[this.historyPosition - 1]
        if (nextCommand) {
          if (this.cursorPosition > 0) this.write(escapes.cursor.back(this.cmd.length))
          this.write(escapes.erase.inLine())
          this.write(nextCommand)
          this.cmd = nextCommand
          this.cursorPosition = this.cmd.length
        } else {
          this.historyPosition = 0
        }

        break
      case 'Tab':
        if (this.cmd.trim().length === 0) break
        this.tabCompletion(this.cmd)
        break
      case 'Home':
        if (this.tabSelectMode) {
          this.cancelTabSelection()
          break
        }

        if (this.cursorPosition === 0) break
        this.write(escapes.cursor.back(this.cursorPosition))
        this.cursorPosition = 0
        break
      case 'End':
        if (this.tabSelectMode) {
          this.acceptTabSelection()
          break
        }

        if (this.cursorPosition === this.cmd.length) break
        if (this.cursorPosition > 0) this.write(escapes.cursor.back(this.cursorPosition))
        this.write(escapes.cursor.forward(this.cmd.length))
        this.cursorPosition = this.cmd.length
        break
      case 'Escape':
        if (this.tabSelectMode) {
          this.cancelTabSelection()
          break
        }

        this.cmd = ''
        this.cursorPosition = 0
        this.setOption('cursorStyle', 'block')
        this.writeln('')
        this.prompt()
        break
      case 'Insert':
        this.setOption('cursorStyle', this.options.cursorStyle === 'block' ? 'underline' : 'block')
        break
      case 'PageUp':
        this.scrollPages(-1)
        break
      case 'PageDown':
        this.scrollPages(1)
        break
      default:
        if (printable) {
          if (this.tabSelectMode) {
            if (this.debug) console.log({ tabSelectChoices: this.tabSelectChoices })
            this.cmd = this.tabSelectChoices[this.tabSelectCurrentChoice]
            this.cursorPosition = this.cmd.length
            this.tabSelectMode = false
            this.write(escapes.cursor.back(this.cmd.length))
            this.write(escapes.erase.inLine())
            this.write(this.cmd)
          }

          const replaceMode = this.options.cursorStyle === 'underline'
          const remainderOffset = replaceMode && this.cursorPosition < this.cmd.length ? this.cursorPosition + 1: this.cursorPosition
          this.cmd = `${this.cmd.slice(0, this.cursorPosition)}${key}${this.cmd.slice(remainderOffset)}`
          const remainder = this.cmd.slice(remainderOffset)

          this.cursorPosition++
          this.write(escapes.erase.inLine())
          this.write(replaceMode && (this.cmd.length > this.cursorPosition || remainder === '') ? key + remainder : remainder)
          if (this.cmd.length > this.cursorPosition) this.write(escapes.cursor.back(this.cmd.length - this.cursorPosition))
        }
    }
  }

  /**
   * Handle ESC and CTRL-C to return control of the terminal to the user.
   * This doesn't actually kill anything, but it will recover terminal input.
   * 
   * @memberof Web3osTerminal
   * @instance
   * @param {Object} data - The data for the interrupt handler
   * @param {string} data.key - The ASCII representation of the key
   * @param {KeyboardEvent} data.domEvent - The KeyboardEvent from the DOM listener
   */
  interruptHandler ({ key, domEvent }) {
    if (!key) return
    const keyName = domEvent.key

    if (
      keyName === 'Escape'
      || domEvent.ctrlKey && keyName.toLowerCase() === 'c'
    ) {
      this.interruptListener.dispose()
      this.historyPosition = 0
      this.cursorPosition = 0
      this.cmd = ''
      this.write('^C\n')
      return this.prompt()
    }
  }

  /**
   * Start listening for user input on the terminal
   * 
   * @memberof Web3osTerminal
   * @instance
   * @todo fix mobile input
   */
  listen () {
    this.unlisten()
    this.keyListener = this.onKey(this.keyHandler.bind(this))
    // A little workaround: optimistically assume any data over one character is a paste
    // TODO: Also catch other paste events
    this.pasteListener = this.onData(data => {
      const containsUnprintable = data.split('').some(char => !this.isPrintable(data))
      data.length > 1 && !containsUnprintable && this.paste()
    })
  }

  /**
   * Stop listening for user input
   * @memberof Web3osTerminal
   * @instance
   */
  unlisten () {
    try {
      this.keyListener.dispose()
      this.pasteListener.dispose()
      this.interruptListener.dispose()
    } catch {}
  }

  /**
   * Handle tab completion
   * @memberof Web3osTerminal
   * @instance
   * @async
   */
  async tabCompletion (input) {
    if (!this.tabSelectMode) {
      const inputParts = input.split(' ')
      const binPaths = this.binSearchPath.map(searchPath => `/bin/${searchPath}`)
      
      const inputIsBin = binPaths.some(binPath => {
        return this.kernel.fs.existsSync(`${binPath}/${inputParts[0]}`)
      })

      let choices =
        (
          inputIsBin ?
            this.kernel.modules[inputParts[0]]?.autocomplete?.(input)
            : []
        ) || []

      if (inputIsBin && choices.length === 0) choices = this.kernel.fs.readdirSync(this.cwd).sort()

      if (choices.length === 0) {
        const entries = binPaths
          .filter(exe => this.kernel.fs.existsSync(exe))
          .map(exe => ({ path: exe, files: this.kernel.fs.readdirSync(exe) }))

        for (const entry of entries) {
          const reg = new RegExp(`^${input}`)
          const file = entry.files.find(file => reg.test(file))
          if (!file) continue
          choices.push(file)
        }
      }

      console.log({ choices })

      if (choices.length > 0) {
        this.tabSelectMode = true
        this.tabSelectChoices = choices
        this.tabSelectCurrentChoice = 0
        this.write(colors.muted(choices[0].slice(input.length)))
      }
    } else {
      const currentChoice = this.tabSelectChoices[this.tabSelectCurrentChoice]
      const goBack = currentChoice.slice(input.length + currentChoice.length).length
      if (goBack > 0) this.write(escapes.cursor.back(goBack))
      this.write(escapes.erase.inLine())
      this.tabSelectCurrentChoice++

      if (this.tabSelectCurrentChoice >= this.tabSelectChoices.length) {
        this.tabSelectMode = false
        this.tabSelectChoices = []
        this.tabSelectCurrentChoice = 0
      } else {
        const newChoice = this.tabSelectChoices[this.tabSelectCurrentChoice]
        this.write(colors.muted(newChoice.slice(input.length)))
      }
    }
  }
}
