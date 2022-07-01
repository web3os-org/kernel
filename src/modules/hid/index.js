import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const devices = []

export const name = 'hid'
export const version = '0.1.0'
export const description = 'WebHID Utility'
export const help = `
  ${colors.bold(colors.danger('This is experimental technology'))}

  Please check the compatibility table at:
  ${colors.underline('https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API#browser_compatibility')}

  Usage:
    hid devices                          List paired HID devices
    hid request <options>                Request HID device (blank for user choice)

  Options:
    --help                               Print this help message
    --product                            Product ID of the HID device
    --vendor                             Vendor ID of the HID device
    --version                            Print the version information
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
    const { productId, productName, vendorId } = device
    data.push({ productId, productName, vendorId })
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

  const devs = await navigator.hid.requestDevice({ filters })
  console.log({ devs })
  devices.push(...devs)
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
  if (!navigator.hid) throw new Error(colors.danger('Client does not support WebHID'))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
