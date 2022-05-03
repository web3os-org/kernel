import path from 'path'
import colors from 'ansi-colors'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
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
  aliases = {}
  customCommands = []
  historyPosition = 0
  binSearchPath = ['@web3os-core', '@web3os-apps', '@web3os-utils']
  promptFormat = `${colors.blue('{cwd}')}${colors.green('#')} `
  history = []

  constructor (options = {}) {
    super(options)
    this.kernel = options.kernel || window.kernel
    this.customCommands = options.customCommands || []
    this.log = this.log.bind(this)
  }

  log (...args) {
    args.forEach(msg => {
      msg = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
      this.writeln(msg)
    })
  }
  
  prompt (value) {
    if (value) this.promptFormat = value
    const format = this.promptFormat
      .replace(/\{cwd\}/g, colors.muted(this.cwd))

    this.write(format)
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

    // console.log({ keyName, domEvent, key, printable })

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
              const match = searchPaths.find(p => this.kernel.fs.existsSync(`${p}/${exec.split(' ')[0]}`))
              if (match) exec = path.join(match, exec)
              this.kernel.execute(exec, options)
            }
          }
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
      case 'Escape':
        this.cmd = ''
        this.writeln('')
        this.prompt()
        break
      default:
        if (printable) {
          this.cmd += key
          this.write(key)
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
