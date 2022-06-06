import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'
import TrezorConnect from 'trezor-connect'

export const name = 'trezor'
export const version = '0.1.0'
export const description = 'Trezor Utility'
export const help = `
  ${colors.magenta.bold('Trezor Utility')}
  (coming soon)

  Usage:
    trezor <command> [options]

  Commands:
    connect                         Connect to your Trezor device

  Options:
    --help                          Print this help message
    --version                       Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  switch (cmd) {
    default:
      return term.log(help)
  }
}
