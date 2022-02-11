import arg from 'arg'
import colors from 'ansi-colors'
import { ethers as Ethers } from 'ethers'
import { parse as cliParse } from 'shell-quote'
import * as Ocean from '@web3os/openocean-api'

import Web3 from 'web3'
import chains from './chains.json'

export const name = 'account'
export const version = '0.1.2'
export const description = 'Manage everything related to your web3 wallet'
export const help = `
  Usage:
    account                          ${colors.gray('Display your wallet address, or connects if none')}
    account <command>                ${colors.gray('Perform an account action')}

  Commands:
    connect                          ${colors.gray('Connect to your wallet')}
    chain                            ${colors.gray('Display information about the current chain')}
    chain <id>                       ${colors.gray('Switch to chain id; may be hex, decimal, or name')}
    balance                          ${colors.gray(`Display the account balance of the chain's native currency`)}
    balance <token>                  ${colors.gray('Displays the account balance of the ERC20 token, eg. USDC')}
    sign <message>                   ${colors.gray('Sign a message using your wallet')}
    send <amount> <address>          ${colors.gray('Send <amount> of native coin to <address>')}

`

export const spec = {}

export let web3
export let term
export let ethers
export let signer
export let provider
export let tokens = {}
export const allChains = chains

export function setPrompt (terminal) {
  terminal = terminal || term || window.terminal
  const displayAddress = `${colors.gray('0x')}${colors.primary(account.address?.substr(2, 4))}${colors.gray('..')}${colors.primary(account.address?.substr(-4, 4))}`
  terminal.promptFormat = `(${colors.warning(account.chain.chain)})[${colors.info(`0x${account.chainId.toString(16)}`)}]<${displayAddress}>:{cwd}${colors.green('#')} `
}

export const account = {
  address: null, _chainId: 1,

  get chain () {
    return chains?.find(chain => chain.chainId === this._chainId)
  },

  get chainId () { return this._chainId },
  set chainId (newChainId) {
    this._chainId = Number(newChainId)
    updateTokenList()
    setPrompt()
  }
}

async function updateTokenList () {
  try {
    tokens = await Ocean.tokenList(account.chainId)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function connect (args) {
  try {
    await window.ethereum.enable()
    provider = window.web3.currentProvider
    web3 = new Web3(provider)
  } catch {
    throw new Error(colors.danger('Failed to connect to web3 provider. Do you have https://metamask.io installed?'))
  }

  account.address = (await web3.eth.getAccounts())[0]
  account.chainId = await web3.eth.getChainId()

  ethers = new Ethers.providers.Web3Provider(provider, 'any')
  signer = ethers.getSigner()

  term.log(`${colors.success('Connected to account:')} ${colors.bold.blue(account.address)}`)

  // Subscribe to accounts change
  provider.on('accountsChanged', accounts => {
    // console.log('accountsChanged', accounts)
    account.address = accounts[0]
    setPrompt()
  })

  // Subscribe to chainId change
  provider.on('chainChanged', chainId => {
    // console.log('chainChanged', chainId)
    account.chainId = chainId
  })

  // Subscribe to provider connection
  provider.on('connect', info => {
    console.log('connect', info)
  })

  // Subscribe to provider disconnection
  provider.on('disconnect', error => {
    console.error('disconnect', error)
  })
}

export async function switchChain (args) {
  if (!args._[1]) return term.log(account.chain)
  let newChain = args._[1]

  if (!newChain) return term.log(JSON.stringify(account.chain, null, 2))

  let findBy
  if (!isNaN(parseInt(newChain))) findBy = parseInt(newChain)
  else if (typeof newChain === 'string') {
    if (newChain.substr(0, 2) === '0x') findBy = Number(newChain)
    else {
      switch (newChain) {
        case 'ethereum':
          newChain = 'eth'
          break
      }

      let chain = chains.find(c => {
        return (
          c.chain.toLowerCase() === newChain.toLowerCase() ||
          c.network.toLowerCase() === newChain.toLowerCase() ||
          c.name.toLowerCase() === newChain.toLowerCase() ||
          c.infoURL.toLowerCase() === newChain.toLowerCase() ||
          c.shortName.toLowerCase() === newChain.toLowerCase() ||
          c.nativeCurrency.name.toLowerCase() === newChain.toLowerCase()
        )
      })

      if (!chain) return term.log(colors.danger(`Cannot find chain ${newChain}`))
      findBy = chain.chainId
    }
  }

  const chainInfo = chains?.find(chain => chain.chainId === findBy)
  if (!chainInfo) return term.log(colors.danger(`Cannot find chain ${newChain}`))

  try {
    term.log(colors.warning(`Trying to switch to the ${chainInfo.name} network...`))
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainInfo.chainId.toString(16)}` }]
    })

    account.chainId = chainInfo.chainId
  } catch (err) {
    if (err.code === 4902) {
      term.log(colors.warning(`The network wasn't known by the wallet, trying to add it now..`))
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainInfo.chainId.toString(16)}`,
          chainName: chainInfo.name,
          nativeCurrency: chainInfo.nativeCurrency,
          rpcUrls: chainInfo.rpc
        }]
      })
    } else {
      console.error(err)
    }

    console.error(err)
    term.log(colors.danger(err.message))
  }
}

export async function getBalance (symbol) {
  let balance = 0

  if (!symbol) {
    balance = Ethers.utils.formatEther(await ethers.getBalance(account.address)) + ' ' + account.chain.nativeCurrency.symbol
  } else {
    const token = (symbol.substr(0, 2) === '0x') ? tokens?.find(token => token.address === symbol) : tokens?.find(token => token.symbol === symbol)
    if (!token) throw new Error(colors.danger('Unknown token'))

    const data = await Ocean.getBalance(account.chainId, account.address, token.address)
    balance = data[0].balance + ' ' + data[0].symbol
  }

  return balance
}

export async function sign (message) {
  // message = message.replace(/\\n/g, '\n')
  const msg = Ethers.utils.hashMessage(message)
  console.log({ message, msg })
  const result = await signer.signMessage(msg)
  // const data = Ethers.utils.toUtf8Bytes(message)
  // const addr = await signer.getAddress()
  // const { result } = await provider.send('personal_sign', [Ethers.utils.hashMessage(message), addr.toLowerCase()])
  return result
}

export async function send (args) {
  const result = await web3.eth.sendTransaction({
    from: account.address,
    to: args._[2],
    value: Ethers.utils.parseEther(args._[1])
  })

  return result
}

async function displayOrConnect () {
  if (!account.address) return await connect()
  term.log(account.address)
}

export async function run (terminal, context) {
  term = terminal
  const args = arg(spec, { argv: cliParse(context) })
  const cmd = args._?.[0]

  switch (cmd) {
    case 'connect':
      return connect(args)
    case 'chain':
      return switchChain(args)
    case 'balance':
      return term.log(await getBalance(args?._[1]))
    case 'sign':
      return term.log(sign(args?._[1]))
    case 'send':
      return term.log(await send(args))
    case undefined:
      return displayOrConnect(args)
    default:
      throw new Error('account: invalid command')
  }
}
