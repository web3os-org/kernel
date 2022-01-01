import arg from 'arg'
import colors from 'ansi-colors'
import { ethers as Ethers } from 'ethers'
import { parse as cliParse } from 'shell-quote'

import Web3 from 'web3'
import Web3Modal from 'web3modal'

import chains from './chains.json'

// import ethIcon from '@fusion-icons/core/icons/coins/ETH_1027.svg'

export const name = 'account'
export const version = '0.1.1'
// export const icon = ethIcon
export const description = 'Manage everything related to your web3 wallet'
export const help = `
  Usage:
    account                ${colors.gray('Display your wallet address, or connects if none')}
    account <command>      ${colors.gray('Connect to your wallet')}

  Commands:
    connect                ${colors.gray('Connect to your wallet')}
    chain                  ${colors.gray('Display information about the current chain')}
    chain <id>             ${colors.gray('Switch to chain id; may be hex, decimal, or name')}
    balance                ${colors.gray(`Display the account balance of the chain's native currency`)}
    balance <token>        ${colors.gray('Displays the account balance of the ERC20 token, eg. USDC')}
    sign <message>         ${colors.gray('Sign a message using your wallet')}

`

export let web3
export let term
export let ethers
export let signer
export let provider
export let tokens = {}
export const allChains = chains

export const spec = {
  
}

export const tokenLists = {
  1: 'https://tokens.coingecko.com/uniswap/all.json',
  10: 'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json',
  56: 'https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/lists/apeswap.json',
  137: 'https://raw.githubusercontent.com/sameepsi/quickswap-default-token-list/master/src/tokens/mainnet.json',

  parser: (chain, response) => {
    switch (chain) {      
      case 137:
        return response
      default:
        return response.tokens
    }
  }
}

export function setPrompt (terminal) {
  terminal = terminal || term || window.terminal
  const displayAddress = `${colors.gray('0x')}${colors.primary(account.address.substr(2, 4))}${colors.gray('..')}${colors.primary(account.address.substr(-4, 4))}`
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
    setPrompt()
  }
}

export async function connect (args) {
  const modal = new Web3Modal({
    cacheProvider: true
  })

  try {
    provider = await modal.connect()
    web3 = new Web3(provider)
    window.web3 = web3
  } catch {
    throw new Error(colors.danger('Failed to connect to web3 provider'))
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
  const newChain = args._[1]

  if (!newChain) return term.log(JSON.stringify(account.chain, null, 2))

  let findBy
  if (!isNaN(parseInt(newChain))) findBy = parseInt(newChain)
  else if (typeof newChain === 'string') {
    if (newChain.substr(0, 2) === '0x') findBy = Number(newChain)
    else {
      let chain = chains.find(c => c.chain.toLowerCase() === newChain.toLowerCase())
      chain = chain || chains.find(c => c.name.toLowerCase() === newChain.toLowerCase())
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

export async function checkBalance (args) {
  const queryToken = args._[1] || ''
  let checkBalanceTimeout

  if (!account?.address) {
    checkBalanceTimeout = setTimeout(() => {
      if (checkBalanceTimeout) clearTimeout(checkBalanceTimeout)
      checkBalance(queryToken)
    }, 100)

    return
  }

  if (!queryToken) {
    const balance = Ethers.utils.formatEther(await ethers.getBalance(account.address)) + ' ' + account.chain.nativeCurrency.symbol
    term.log(balance)
  } else {
    let tokenInfo

    if (!tokens[account.chain.chainId]) {
      if (!tokenLists[account.chain.chainId]) {
        tokens[account.chain.chainId] = []
      } else {
        const response = await fetch(tokenLists[account.chain.chainId])
        const json = await response.json()
        tokens[account.chain.chainId] = tokenLists.parser(account.chain.chainId, json)
      }
    }

    if (queryToken.substr(0, 2) !== '0x') {
      tokenInfo = tokens[account.chain.chainId]?.find(token => token.symbol === queryToken)
      if (!tokenInfo) return term.log(colors.danger('Unknown token'))
    } else {
      tokenInfo = { address: queryToken }
    }

    const abi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function balanceOf(address) view returns (uint)',
      'function transfer(address to, uint amount)'
    ]

    const contract = new Ethers.Contract(tokenInfo.address, abi, signer)
    const balance = Ethers.utils.formatEther(await contract.balanceOf(account.address)) + ' ' + await contract.symbol()
    term.log(balance)
  }
}

export async function sign (args) {
  let message = args._[1]
  message = message.replace(/\\n/g, '\n')
  const result = await signer.signMessage(message)
  term.log(result)
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
      return checkBalance(args)
    case 'sign':
      return sign(args)
    case undefined:
      return displayOrConnect(args)
    default:
      throw new Error('account: invalid command')
  }
}
