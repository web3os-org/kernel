import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const name = 'gamepad'
export const version = '0.1.0'
export const description = 'Gamepad Utility'
export const help = `
  Usage:
    gamepad devices                              List gamepads

  Options:
    --help                                       Print this help message
    --version                                    Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function printDevices(args) {
  const data = []
  const { terminal } = args
  const pads = await navigator.getGamepads()

  pads.filter(pad => pad).forEach(device => {
    const { index, id, connected, buttons } = device
    data.push({ index, id, connected, buttons: buttons.length })
  })

  terminal.log(columnify(data, {
    config: {
      minWidth: 8
    }
  }))
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'devices':
      return await printDevices(args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  if (!Gamepad) throw new Error(colors.danger('Client does not support the Gamepad API'))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
