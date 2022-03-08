import arg from 'arg'
import Web3 from 'web3'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const name = 'donate'
export const version = '0.1.0'
export const description = 'Donate to web3os developers'
export const help = `
  Usage:
    donate [command] [options]

  Commands:
    {native}                           Donate the native currency of the current chain
    ada                                Donate Cardano ADA
    btc                                Donate Bitcoin
    ltc                                Donate Litecoin
    doge                               Donate Dogecoin

  Options:
    --address                       Override the default donation address
    --amount                        Specify the amount to send (defaults to 1)
    --help                          Print this help message
    --version                       Print the version information
`

let kernel

export const spec = {
  '--address': String,
  '--amount': String,
  '--help': Boolean,
  '--version': Boolean
}

async function sendNative (args) {
  return await kernel.wallet.web3.eth.sendTransaction({
    from: kernel.bin.account.account.address,
    to: args['--address'] || '0xF1b60919F4c8a842D68F99BcEEb7eb21D02c9988',
    value: Web3.utils.toWei(args['--amount'] || '1')
  })
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  kernel = term.kernel
  args.terminal = term
  const cmd = args._?.[0]

  switch (cmd) {
    case 'native':
    default:
      return await sendNative(args)
  }
}
