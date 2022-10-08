import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const name = 'serial'
export const version = '0.1.0'
export const description = 'Web Serial Utility'
export const help = `
  ${colors.bold(colors.danger('This is experimental technology'))}

  Please check the compatibility table at:
  ${colors.underline('https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serial#browser_compatibility')}

  Usage:
    serial devices                       List paired serial devices
    serial request <options>             Request serial device (blank for user choice)

  Options:
    --help                               Print this help message
    --product                            Product ID of the serial device
    --vendor                             Vendor ID of the serial device
    --version                            Print the version information
`

export const spec = {
  '--help': Boolean,
  '--product': String,
  '--vendor': String,
  '--version': Boolean
}

export async function printDevices(args) {
  const data = []
  const { terminal } = args

  const devices = await navigator.serial.getPorts()

  for (const [index, device] of devices.entries()) {
    const { usbProductId, usbVendorId } = await device.getInfo()
    data.push({ index, usbProductId, usbVendorId })
  }

  terminal.log(columnify(data, { config: { minWidth: 8 } }))
}

export async function request(args) {
  const filter = {}
  const filters = []

  if (args['--vendor']) filter.usbVendorId = args['--vendor']
  if (args['--product']) filter.usbProductId = args['--product']
  if (filter.usbVendorId || filter.usbProductId) filters.push(filter)

  const device = await navigator.serial.requestPort({ filters })
  console.log({ device })
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
  if (!navigator.serial) throw new Error(colors.danger('Client does not support Web Serial'))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
