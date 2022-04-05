import arg from 'arg'
import Web3 from 'web3'
import colors from 'ansi-colors'
import Contract from 'web3-eth-contract'
import { parse as cliParse } from 'shell-quote'

export const name = 'contract'
export const version = '0.1.0'
export const description = 'Smart Contract Utility'
export const help = `
  ${colors.magenta.bold('Smart Contract Utility')}

  Usage:
    contract <command> [options]
  
  Examples:
    contract call 0xDEADBEEFCAFE retrieve()
    contract send 0xDEADBEEFCAFE store(12345)

  Commands:
    read <address> <method> [...args]        Call a method on a smart contract (call)
    write <address> <method> [...args]        Send a tx to a smart contract (send)

  Options:
    --abi-file                               Path to the contract ABI JSON file
    --abi-url                                Path to the contract ABI JSON url
    --artifact-url                           Path to the contract artifact url
    --help                                   Print this help message
    --version                                Print the version information
`

export const spec = {
  '--abi-file': String,
  '--abi-url': String,
  '--artifact-url': String,
  '--help': Boolean,
  '--version': Boolean
}

const provider = Web3.givenProvider
const web3 = new Web3(provider)
Contract.setProvider(web3)

export async function read (options) {
  return await call(options)
}

export async function write (options) {
  return await send(options)
}

export async function call (options) {
  return await execute({ ...options, cmd: 'call' })
}

export async function send (options) {
  return await execute({ ...options, cmd: 'send' })
}

async function execute ({ cmd, address, method, abiFile, abiUrl, args = [] }) {
  const callArgs = { _: [cmd, address, method, { op: '(' }, ...args, { op: ')' }] }
  if (abiFile) callArgs['--abi-file'] = abiFile
  if (abiUrl) callArgs['--abi-url'] = abiUrl

  try {
    return await go(cmd, address, method, callArgs)
  } catch (err) {
    return err
  }
}

export async function go (cmd, address, method, args) {
  // console.log(cmd, { address, method, args, web3 }, args._?.[3])

  if (!kernel.wallet.account?.address) throw new Error('You must have a connected account')

  if (args._?.[3]?.op === '(') {
    let done = false
    let methodParams = args._.filter((param, index) => {
      if (done || index < 4) return false
      if (typeof param === 'object' && param.op === ')') return !(done = true)
      return true
    }).join('').split(',').filter(p => p !== '')

    let abi, metadata
    if (!args['--abi-url'] && !args['--abi-file'] && ![args['--artifact-url']]) {
      throw new Error('You must specify --abi-file, --abi-url, or --artifact-url')
    }

    if (args['--abi-url']) {
      const response = await fetch(args['--abi-url'])
      abi = await response.json()
    } else if (args['--abi-file']) {
      metadata = { source: 'fs' }
      abi = JSON.parse(kernel.fs.readFileSync(args['--abi-file']).toString())
    } else if (args['--artifact-url']) {
      const response = await fetch(args['--artifact-url'])
      metadata = await response.json()
      abi = metadata.output?.abi
    }

    if (!abi || typeof abi !== 'object') throw new Error('Unable to load the ABI')

    const contract = new Contract(abi, address, { from: kernel.wallet.account?.address })
    return await contract.methods?.[method](...methodParams)[cmd]()
  }
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  if (args['--network'] && !['mainnet', 'goerli', 'kovan', 'rinkeby', 'ropsten'].includes(args['--network'])) throw new Error('Invalid network')

  const cmd = args._?.[0]

  switch (cmd) {
    case 'call':
    case 'read':
      return term.log(await go('call', args._?.[1], args._?.[2], args))
    case 'send':
    case 'write':
      return term.log(await go('send', args._?.[1], args._?.[2], args))
    default:
      return term.log(help)
  }
}
