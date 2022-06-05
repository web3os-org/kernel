import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const devices = []

export const name = 'bluetooth'
export const version = '0.1.0'
export const description = 'Bluetooth tool'
export const help = `
  ${colors.bold(colors.danger('This is experimental technology'))}

  Please check the compatibility table at:
  ${colors.underline('https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility')}

  Usage:
    bluetooth devices                            List paired Bluetooth devices
    bluetooth pair                               Pair a bluetooth device

  Options:
    --help                                       Print this help message
    --name                                       Specify a friendly name for the Bluetooth device
    --version                                    Print the version information
`

export const spec = {
  '--help': Boolean,
  '--name': String,
  '--version': Boolean
}

export async function printDevices(args) {
  const data = []
  const { terminal } = args

  devices.forEach(device => data.push(device))

  terminal.log(columnify(data, {
    config: {
      minWidth: 8
    }
  }))
}

export async function pair(args) {
  const filter = {}
  const filters = []

  // if (args['--product']) filter.productId = args['--product']
  // if (filter.vendorId || filter.productId) filters.push(filter)

  const id = Math.random().toString(36).substr(2)
  const name = args['--name'] || Math.random().toString(36).substr(2)
  const connection = await navigator.bluetooth.requestDevice(filters.length > 0 ? { filters } : { acceptAllDevices: true })
  const device = { id, name, connection }
  console.log({ device })
  devices.push(device)
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'devices':
      return await printDevices(args)
    case 'pair':
      return await pair(args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  if (!navigator.bluetooth) throw new Error(colors.danger('Client does not support WebBluetooth'))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
