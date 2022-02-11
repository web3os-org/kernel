import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const devices = []

export const name = 'usb'
export const version = '0.1.0'
export const description = 'WebUSB tool'
export const help = `
  ${colors.bold(colors.danger('This is experimental technology'))}
  ${colors.muted('There is no real use for this tool yet')}

  Please check the compatibility table at:
  ${colors.underline('https://developer.mozilla.org/en-US/docs/Web/API/USBDevice#browser_compatibility')}

  Usage:
    usb devices                                  List paired USB devices
    usb request <options>                        Request USB device (blank for user choice)

  Options:
    --help                                       Print this help message
    --name                                       Specify a friendly name for the USB device
    --product                                    Product ID of the USB device
    --vendor                                     Vendor ID of the USB device
    --version                                    Print the version information
`

export const spec = {
  '--help': Boolean,
  '--name': String,
  '--product': String,
  '--vendor': String,
  '--version': Boolean
}

export async function printDevices(args) {
  const data = []
  const { terminal } = args

  devices.forEach(device => {
    const { connection, id, name } = device
    const { manufacturerName, opened, productId, productName, serialNumber, vendorId } = connection
    data.push({ id, name, manufacturerName, opened, productId, productName, serialNumber, vendorId })
  })

  terminal.log(columnify(data, {
    config: {
      minWidth: 8
    }
  }))
}

export async function request(args) {
  const filter = {}
  const filters = []

  if (args['--vendor']) filter.vendorId = args['--vendor']
  if (args['--product']) filter.productId = args['--product']
  if (filter.vendorId || filter.productId) filters.push(filter)

  const id = Math.random().toString(36).substr(2)
  const name = args['--name'] || Math.random().toString(36).substr(2)
  const connection = await navigator.usb.requestDevice({ filters })
  const device = { id, name, connection }
  console.log({ device })
  devices.push(device)
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'devices':
      return await printDevices(args)
    case 'request':
      return await request(args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  if (!navigator.usb) throw new Error(colors.danger('Client does not support WebUSB'))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
