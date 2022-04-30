import arg from 'arg'
import Web3 from 'web3'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'etherscan'
export const version = '0.1.0'
export const description = 'Etherscan Utility'
export const help = `
  ${colors.magenta.bold('Etherscan Utility')}

  Usage:
    etherscan <command> [options]

  Commands:
    balance                         Print the balance of address
      --address     <address>       You may specify multiple addresses, comma separated
      --tag         [{latest},pending,earliest]
    transactions                    List transactions
      --address     <address>
      --startBlock  [number]
      --endBlock    [number]
      --page        [number]
      --offset      [number]
      --sort        [{desc},asc]

  Options:
    --api-key                       {kernel.get('etherscan', 'api-key')}
    --help                          Print this help message
    --network                       {mainnet},goerli,kovan,rinkeby,ropsten
    --version                       Print the version information
`

export const spec = {
  '--address': String,
  '--api-key': String,
  '--help': Boolean,
  '--network': String,
  '--tag': String,
  '--version': Boolean
}

const provider = Web3.givenProvider
const web3 = new Web3(provider)

export const baseApiUrl = {
  mainnet: 'https://api.etherscan.io/api',
  goerli: 'https://api-goerli.etherscan.io/api',
  kovan: 'https://api-kovan.etherscan.io/api',
  rinkeby: 'https://api-rinkeby.etherscan.io/api',
  ropsten: 'https://api-ropsten.etherscan.io/api'
}

export async function balance (address, args = {}) {
  if (!address) throw new Error('No address specified')
  const requestUrl = `${baseApiUrl[args['--network'] || 'mainnet']}`
    + `?module=account`
    + `&action=${address.includes(',') ? 'balancemulti' : 'balance'}`
    + `&address=${address}`
    + `&tag=${args['--tag'] || 'latest'}`
    + `&apikey=${args['--api-key'] || kernel.get('etherscan', 'api-key') || ''}`

  const response = await fetch(requestUrl)
  const { result } = await response.json()
  return result
}

export async function transactions (address, args = {}) {
  if (!address) throw new Error('No address specified')
  const requestUrl = `${baseApiUrl[args['--network'] || 'mainnet']}`
    + `?module=account`
    + `&action=txlist`
    + `&address=${address}`
    + (args['--startBlock'] ? `&startBlock=${args['--startBlock']}` : '')
    + (args['--endBlock'] ? `&endBlock=${args['--endBlock']}` : '')
    + (args['--page'] ? `&page=${args['--page']}` : '')
    + (args['--offset'] ? `&offset=${args['--offset']}` : '')
    + (args['--sort'] ? `&sort=${args['--sort']}` : '')
    + `&apikey=${args['--api-key'] || kernel.get('etherscan', 'api-key') || ''}`

  const response = await fetch(requestUrl)
  const { result } = await response.json()
  return result
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  if (args['--network'] && !['mainnet', 'goerli', 'kovan', 'rinkeby', 'ropsten'].includes(args['--network'])) throw new Error('Invalid network')

  const cmd = args._?.[0]

  switch (cmd) {
    case 'balance':
      return term.log(await balance(args['--address'], args))
    case 'transactions':
      return term.log(await transactions(args['--address'], args))
    default:
      return term.log(help)
  }
}
