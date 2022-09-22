import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'runkit'
export const version = '0.1.0'
export const description = 'Run Node.js code within web3os'
export const help = `
  Run Node.js code within web3os
  Powered by https://runkit.com

  Usage:
    runkit [command] [options]

  Commands:
    open <path/to/node-script.js>             Open a file
    playground                                Launch the RunKit+NPM playground

  Options:
    --help                                    Print this help message
    --version                                 Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

const script = document.createElement('script')
script.src = 'https://embed.runkit.com'
document.body.appendChild(script)

export async function playground (args) {
  args.kernel.execute(`www --no-toolbar --title RunKit+NPM https://npm.runkit.com`)
}

export async function open (args) {
  const filename = args.kernel.utils.path.resolve(args.terminal.cwd, args._[1])
  const container = document.createElement('div')
  const content = args.kernel.fs.readFileSync(filename, 'utf8')

  container.style.height = '100%'

  const win = args.kernel.windows.create({
    title: filename,
    mount: container,
    max: true,
    x: 'center',
    y: 'center'
  })

  win.window.body.style.overflowX = 'hidden'

  RunKit.createNotebook({
    element: container,
    source: content,
    minHeight: `${container.clientHeight - 100}px`
  })
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'playground':
      return await playground(args)
    case 'open':
      return await open(args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  args.kernel = term.kernel
  return execute(args._?.[0], args)
}
