export const name = 'repl'
export const version = '0.1.0'
export const description = 'Read Eval Print Loop'
export const help = `
  An interactive Javascript command line

  To store and retrieve values, either use the global/window object or the "env" object.

  To log to the REPL, use "term.log".

  E.g., term.log(env)

  Use the command "$custom" to see other builtin REPL commands
`

let originalConsoleLog
export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

export async function execute (cmd = () => {}, term = globalThis.Terminal) {
  try {
    const func = new AsyncFunction('term', 'env', cmd)
    const results = await func(term, term.env)
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

  const replTerm = term.kernel.Web3osTerminal.create({
    kernel: term.kernel,
    fontSize: 22,
    promptFormat: '> ',
    customCommands: [
      {
        name: '.clear',
        run: term => { term.clear(); term.prompt() }
      },
      {
        name: '.exit',
        run: () => app.window.close()
      }
    ]
  })

  replTerm.execute = line => execute(line, replTerm)

  replTerm.open(mount)
  mount.querySelector('.xterm').style.position = 'unset'
  fitInterval = setInterval(() => replTerm.fit(), 200)
  replTerm.focus()
  replTerm.log(`3os REPL v${version}`)
  replTerm.log(help)
  replTerm.prompt()
}
