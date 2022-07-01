import arg from 'arg'
import Onboard from '@web3-onboard/core'
import onboardInjected from '@web3-onboard/injected-wallets'
import onboardTrezor from '@web3-onboard/trezor'
import { parse as cliParse } from 'shell-quote'

import icon from '../../assets/icon.png'
import logo from '../../assets/logo-text.png'
import allChains from './chains.json'
import locales from './locales'

const { t } = Kernel.i18n
for (const [key, data] of Object.entries(locales)) Kernel.i18n.addResourceBundle(key, 'app', data, true)

export const name = '@web3os-core/wallet'
export const version = '0.1.0'
export const description = t('app:wallet.description', 'Wallet Utility')
export const help = `
  ${t('Usage')}:
    wallet <${t('Command')}> <${t('Arguments')}> [${t('Options')}]

  ${t('Commands')}:
    ls                             ${t('app:wallet.helpCommandLs', 'List loaded wallets')}
    describe <id>                  ${t('app:wallet.helpCommandDescribe', 'Describe wallet')}

  ${t('Options')}:
    --help                         ${t('app:wallet.helpOptionHelp', 'Display this help message')}
    --version                      ${t('app:wallet.helpOptionVersion', 'Display the version')}
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}

export const recommendedInjectedWallets = [{ name: 'MetaMask', url: 'https://metamask.io' }]
export const metadata = { name, icon, logo, description, recommendedInjectedWallets }

export const walletTypes = [
  onboardInjected(),
  onboardTrezor({
    appUrl: Kernel.get('wallet', 'trezor-appUrl') || 'https://web3os.sh',
    email: Kernel.get('wallet', 'trezor-email') || 'nobody@web3os.dev'
  })
]

export const chains = allChains
export const onboardChains = chains
  .filter(chain => chain.rpc?.length > 0)
  .map(chain => ({
    id: '0x' + chain.chainId.toString(16),
    label: chain.name,
    rpcUrl: chain.rpc[0].replace('${INFURA_API_KEY}', Kernel.get('infura', 'apiKey')),
    token: chain.nativeCurrency.symbol
  }))

export const onboard = Onboard({
  wallets: walletTypes,
  chains: onboardChains,
  appMetadata: metadata,
  notify: {
    desktop: {
      enabled: true,
      transactionHandler: transaction => {
        console.log({ transaction })
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: t('app:wallet.txInMempool', 'Your transaction from web3os is in the mempool'),
          }
        }
      },
      position: 'bottomRight'
    },
    mobile: {
      enabled: true,
      transactionHandler: transaction => {
        console.log({ transaction })
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: t('app:wallet.txInMempool', 'Your transaction from web3os is in the mempool'),
          }
        }
      },
      position: 'topRight'
    }
  },
  accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: true,
      minimal: true
    },
    mobile: {
      position: 'topRight',
      enabled: true,
      minimal: true
    }
  }
})

export function wallets () {
  return onboard.state.get().wallets
}

export async function connect () {
  const walletsSubscription = onboard.state.select('wallets')
  walletsSubscription.subscribe(wallets => {
    const connectedWallets = wallets.map(({ label }) => label)
    globalThis.localStorage.setItem('web3os.wallet.wallets', JSON.stringify(connectedWallets))
  })
  
  const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets'))
  
  if (previouslyConnectedWallets) {
    await onboard.connectWallet({
      autoSelect: { label: previouslyConnectedWallets[0] }
    })
  } else {
    await onboard.connectWallet()
  }

  const element = document.querySelector('onboard-v2')
  element.style.position = 'absolute'
  element.style.zIndex = 100000
}

export async function toggleAccountCenter () {
  const element = document.querySelector('onboard-v2')
  element.style.display = element.style.display === 'none' ? 'block' : 'none'
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'connect':
      return await connect()
    case 'ls':
      return await args.terminal.log(wallets().map(wallet => wallet.label + ':' + wallet.accounts[0].address))
    case 'describe':
      const wallet = wallets().find(wallet => wallet.name === args._?.[1])
      console.log({ wallet })
      return await args.terminal.log(wallet)
    default:
      return await args.terminal.log(help)
  }
}

export async function run (terminal = globalThis.Terminal, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return terminal.log(version)
  if (args['--help']) return terminal.log(help)

  args.terminal = terminal
  args.kernel = terminal.kernel

  return execute(args._?.[0], args)
}