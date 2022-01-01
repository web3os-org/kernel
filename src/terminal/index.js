import path from 'path-browserify'
import colors from 'ansi-colors'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

import 'xterm/css/xterm.css'
import { term } from '..'

let defaults = {
  convertEol: true,
  cursorBlink: true,
  macOptionIsMeta: true
}

class Web3osTerminal extends Terminal {
  cmd = ''
  cwd = '/'
  env = {}
  history = []
  historyPosition = 0
  customCommands = []
  promptFormat = `${colors.blue('{cwd}')}${colors.green('#')} `

  constructor (options = {}) {
    super(options)
    this.kernel = options.kernel || window.kernel
    this.customCommands = options.customCommands || []
    this.log = this.log.bind(this)
  }

  log (...args) {
    args.forEach(msg => {
      msg = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
      // msg = msg.replace(/\\n/gm, '\n')
      this.writeln(msg)
    })
  }
  
  prompt (value) {
    if (value) this.promptFormat = value
    const format = this.promptFormat
      .replace(/\{cwd\}/g, colors.muted(path.resolve(this.cwd)))

    this.write(format)
    this.listen()
  }

  async paste (data) {
    const clip = data ? data : await navigator.clipboard.readText()
    this.write(clip)
    this.cmd += clip
  }

  isPrintable (domEvent) {
    return !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey &&
      (
        (domEvent.keyCode === 32) ||
        (domEvent.keyCode >= 48 && domEvent.keyCode <= 111) ||
        (domEvent.keyCode >= 185 && domEvent.keyCode <= 222) ||
        (domEvent.key === 'Tab' || domEvent.key === 'ArrowLeft' || domEvent.key === 'ArrowRight')
      )
  }

  async keyHandler ({ key, domEvent }) {
    const keyName = domEvent.key
    const printable = this.isPrintable(domEvent)

    if (domEvent.ctrlKey) {
      switch (keyName.toLowerCase()) {
        case 'v':
          return await this.paste()
        case 'c':
          if (this.getSelection() === '') {
            this.cmd = ''
            this.write('^C\n')
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
        this.historyPosition = 0

        if (this.cmd !== '') {
          this.history.push(this.cmd)
          const customCommand = this.customCommands?.find(c => c.name === this.cmd)
          if (customCommand) customCommand.run(this.cmd)
          else this.kernel.execute(this.cmd, { terminal: this, doPrompt: true })
        } else {
          return this.prompt()
        }

        this.cmd = ''
        break
      case 'Backspace':
        if (this.cmd === '') break
        this.cmd = this.cmd.slice(0, -1)
        this.write('\b \b')
        break
      case 'ArrowUp':
        if (this.history.length > 0) this.historyPosition += 1
        const previousCommand = this.history[this.history.length - this.historyPosition]
        // console.log({ previousCommand, history: this.history, historyPosition: this.historyPosition, cmd: this.cmd })

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
      default:
        if (printable) {
          this.cmd += key
          this.write(key)
        }
    }
  }

  listen () {
    this.unlisten()
    this.keyListener = this.onKey(this.keyHandler.bind(this))
    // A little workaround: optimistically assume any data over one character is a paste
    this.pasteListener = this.onData(data => {
      const containsUnprintable = data.split('').some(char => !this.isPrintable(data))
      data.length > 1 && !containsUnprintable && this.paste()
    })
  }

  unlisten () {
    try {
      this.keyListener.dispose()
      this.pasteListener.dispose()
    } catch {}
  }
}

export function create (options = {}) {
  const term = new Web3osTerminal({ ...defaults, ...options })
  const fitAddon = new FitAddon()

  term.loadAddon(fitAddon)
  term.loadAddon(new WebLinksAddon())

  term.fit = fitAddon.fit.bind(fitAddon)
  return term
}
