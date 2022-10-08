import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'midi'
export const version = '0.1.0'
export const description = 'Web MIDI Utility'
export const help = `
  Usage:
    midi inputs                       List MIDI inputs
    midi outputs                      List MIDI outputs

  Options:
    --help                            Print this help message
    --version                         Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function printDevices(type, args) {
  const data = []
  const { terminal } = args

  const midi = await navigator.requestMIDIAccess()

  for (const [id, device] of midi[type].entries()) {
    const { connection, manufacturer, name, state, type, version } = device
    data.push({ id, manufacturer, name, state, connection, type, version })
  }

  terminal.log(JSON.stringify(data, null, 2))
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'inputs':
      return await printDevices('inputs', args)
    case 'outputs':
      return await printDevices('outputs', args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  if (!navigator.requestMIDIAccess) throw new Error(colors.danger('Client does not support Web MIDI'))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
