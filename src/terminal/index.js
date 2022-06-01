import path from 'path'
import colors from 'ansi-colors'
import escapes from 'ansi-escape-sequences'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import { WebLinksAddon } from 'xterm-addon-web-links'

import 'xterm/css/xterm.css'
import { term } from '..'

let defaults = {
  convertEol: true,
  cursorBlink: true,
  macOptionIsMeta: true,
  fontSize: 16
}

class Web3osTerminal extends Terminal {
  cmd = ''
  cwd = '/'
  env = {}
  debug = false
  aliases = {}
  history = []
  binSearchPath = []
  customCommands = []
  cursorPosition = 0
  historyPosition = 0
  promptFormat = `<${colors.cyan('3os')}>${colors.blue('{cwd}')}${colors.green('#')} `

  escapes = escapes

  constructor (options = {}) {
    super(options) // 🦸‍♂️⚙
    this.kernel = options.kernel || globalThis.Kernel
    this.customCommands = options.customCommands || []
    this.binSearchPath = options.binSearchPath || ['@web3os-core', '@web3os-fs', '@web3os-apps', '@web3os-utils']
    this.debug = options.debug || false
    this.log = this.log.bind(this)
    if (this.debug) console.log('New Terminal Created:', this, { options })
  }

  log (...args) {
    for (let arg of args) {
      arg = typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
      if (arg) this.writeln(arg)
    }

    return args
  }

  promptCompile () {
    return this.promptFormat.replace(/\{cwd\}/g, colors.muted(this.cwd))
  }
  
  prompt (value) {
    if (value) this.promptFormat = value
    this.write(this.promptCompile())
    this.listen()
  }

  async paste (data) {
    const clip = data ? data : await navigator.clipboard.readText()
    this.write(clip)
    this.cmd += clip
  }

  isPrintable (domEvent) {
    const code = domEvent.which
    if (!code) return false

    return !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey &&
      (
        code >= 32 && code <= 126 ||
        code >= 186 && code <= 192 ||
        code >= 219 && code <= 222 ||
        [173].includes(code)
      )
  }

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
            return this.prompt()
          }

          return await navigator.clipboard.writeText(this.getSelection())
        default:
          return
      }
    }

    switch (keyName) {
      case 'Enter':
        this.write('\n')
        this.unlisten()

        if (this.cmd !== '') {
          this.interruptListener = this.onKey(this.interruptHandler.bind(this))
          this.history.push(this.cmd)

          let exec = this.aliases[this.cmd] ? this.aliases[this.cmd] : this.cmd
          const options = { terminal: this, doPrompt: true }

          const customCommand = this.customCommands?.find(c => c.name === this.cmd)
          if (customCommand) customCommand.run(this.cmd)
          else {
            if (this.cwd.match(/^\/bin\/.+/)) {
              const scopedBin = path.join(this.cwd, this.cmd)
              if (this.kernel.fs.existsSync(scopedBin)) {
                this.kernel.execute(scopedBin.replace('/bin/', ''), options)
              } else {
                this.kernel.execute(exec, options)
              }
            } else {
              const searchPaths = [...this.cwd, ...this.binSearchPath.map(p => `/bin/${p}`)]
              const match = searchPaths.find(p => p !== '/' && this.kernel.fs.existsSync(`${p}/${exec.split(' ')[0]}`))
              if (match) exec = path.join(`${match}/${exec.split(' ')[0]}`) + ' ' + exec.split(' ').slice(1).join(' ')
              this.kernel.execute(exec, options)
            }
          }
        } else {
          return this.prompt()
        }

        this.cmd = ''
        this.cursorPosition = 0
        this.historyPosition = 0
        break
      case 'Delete':
        if (this.cursorPosition === this.cmd.length) break
        this.cmd = `${this.cmd.slice(0, this.cursorPosition)}${this.cmd.slice(this.cursorPosition + 1)}`
        this.write(escapes.erase.inLine())
        this.write(this.cmd.slice(this.cursorPosition))
        if (this.cmd.length > this.cursorPosition) this.write(escapes.cursor.back(this.cmd.length - this.cursorPosition))
        break
      case 'Backspace':
        if (this.cursorPosition === 0) break
        this.cursorPosition--
        this.write(escapes.cursor.back())
        this.cmd = `${this.cmd.slice(0, this.cursorPosition)}${this.cmd.slice(this.cursorPosition + 1)}`
        this.write(escapes.erase.inLine())
        this.write(this.cmd.slice(this.cursorPosition))
        if (this.cmd.length > this.cursorPosition) this.write(escapes.cursor.back(this.cmd.length - this.cursorPosition))
        break
      case 'ArrowLeft':
        if (this.cursorPosition === 0) break
        this.cursorPosition--
        this.write(key)
        break
      case 'ArrowRight':
        if (this.cursorPosition >= this.cmd.length) break
        this.cursorPosition++
        this.write(key)
        break
      case 'ArrowUp':
        if (this.history.length > 0) this.historyPosition += 1
        const previousCommand = this.history[this.history.length - this.historyPosition]

        if (previousCommand) {
          this.cmd.split('').forEach(() => this.write('\b \b'))
          this.write(previousCommand)
          this.cmd = previousCommand
        } else {
          this.historyPosition = 0
        }

        break
      case 'ArrowDown':
        if (this.history.length > 0) this.historyPosition -= 1
        if (this.historyPosition < 0) this.historyPosition = 0
        const nextCommand = this.history[this.history.length - this.historyPosition]

        if (nextCommand) {
          this.cmd.split('').forEach(() => this.write('\b \b'))
          this.write(nextCommand)
          this.cmd = nextCommand
        } else {
          this.historyPosition = this.history.length
        }

        break
      case 'Escape':
        this.cmd = ''
        this.cursorPosition = 0
        this.writeln('')
        this.prompt()
        break
      default:
        this.cursorPosition++
        if (printable) {
          // A bit of wackiness to handle cursor movement
          this.cmd = `${this.cmd.slice(0, this.cursorPosition - 1)}${key}${this.cmd.slice(this.cursorPosition - 1)}`
          this.write(escapes.erase.inLine())
          this.write(this.cmd.slice(this.cursorPosition - 1))
          if (this.cmd.length > this.cursorPosition) this.write(escapes.cursor.back(this.cmd.length - this.cursorPosition))
        }
    }
  }

  // This doesn't actually kill anything, but it will return access to the terminal
  interruptHandler ({ key, domEvent }) {
    if (!key) return
    const keyName = domEvent.key

    if (
      (keyName === 'Escape') ||
      (domEvent.ctrlKey && keyName.toLowerCase() === 'c')
    ) {
      this.interruptListener.dispose()
      this.cursorPosition = 0
      this.cmd = ''
      this.write('^C\n')
      return this.prompt()
    }
  }

  listen () {
    this.unlisten()
    this.keyListener = this.onKey(this.keyHandler.bind(this))

    // TODO: Get mobile keyboard to work
    // this.textarea.onkeyup = e => {
    //   if (e.key === 'Unidentified') return
    //   console.log({ up: e })
    //   this.keyHandler({ key: e.key, domEvent: e })
    // }

    // A little workaround: optimistically assume any data over one character is a paste
    // TODO: Also catch other paste events
    this.pasteListener = this.onData(data => {
      const containsUnprintable = data.split('').some(char => !this.isPrintable(data))
      data.length > 1 && !containsUnprintable && this.paste()
    })
  }

  unlisten () {
    try {
      this.keyListener.dispose()
      this.pasteListener.dispose()
      this.interruptListener.dispose()
    } catch {}
  }
}

export function create (options = {}) {
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
