import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'
import { MnemonicWallet } from 'bitcoinjs-lib'

export const name = 'bitcoin'
export const version = '0.1.0'
export const description = 'Bitcoin Utility'
export const help = `
  ${colors.magenta.bold('Bitcoin Utility')}
  (coming soon)

  Usage:
    bitcoin <command> [options]

  Commands:
    generate                        Generate a new wallet
    
  Options:
    --help                          Print this help message
    --network                       Network to connect to, {mainnet} or testnet
    --version                       Print the version information
`

export const spec = {
  '--help': Boolean,
  '--network': String,
  '--version': Boolean
}

export async function generateWallet (args) {
  return
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  switch (cmd) {
    case 'generate':
      return term.log(await generateWallet())
    default:
      return term.log(help)
  }
}
