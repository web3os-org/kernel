import Web3osTerminal from '../../terminal'

export const name = 'repl'
export const version = '0.1.0'
export const description = 'Read Eval Print Loop'
export const help = `
  An interactive Javascript command line
`

let originalConsoleLog
export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

export async function execute (cmd, term = globalThis.Terminal) {
  try {
    const func = new AsyncFunction(cmd)
    const results = await func()
    if (results) console.dir(results)
    term.log(results)
  } catch (err) {
    console.error(err)
    term.log(err.message)
  } finally {
    term.prompt()
  }
}

export default async function (term, context) {
  let fitInterval

  const replTerm = Web3osTerminal.create({
    kernel: term.kernel,
    fontSize: 22,
    promptFormat: '> '
  })

  replTerm.execute = line => execute(line, replTerm)

  const mount = document.createElement('div')
  mount.style.height = '100%'

  const app = term.kernel.windows.create({
    title: 'REPL',
    mount,
    max: true,
    x: 'center',
    y: 'center',
    onclose: () => {
      clearInterval(fitInterval)
      console.log = originalConsoleLog ? originalConsoleLog : console.log
      originalConsoleLog = null
    }
  })

  originalConsoleLog = console.log
  console.log = function () {
    replTerm.log(...arguments)
    originalConsoleLog.apply(console, arguments)
  }

  app.window.body.style.overflowY = 'hidden'
  replTerm.open(mount)
  mount.querySelector('.xterm').style.position = 'unset'
  fitInterval = setInterval(() => replTerm.fit(), 200)
  replTerm.focus()
  replTerm.log(`Welcome to 3os REPL v${version}`)
  replTerm.prompt()
}
