import path from 'path'
import colors from 'ansi-colors'
import * as AsBind from 'as-bind'

export const name = 'wasm'
export const version = '0.1.0'
export const description = 'Run WebAssembly binaries'
export const help = `
  Usage:
    wasm <path> <method> <args>       Run WebAssembly <method> in binary at <path> with <args>
`

export async function run (term, args) {
  const { kernel } = term

  let filename = args.split(' ')[0]
  const passArgs = args.split(' ').slice(1)

  if (!filename || filename === '') throw new Error(colors.danger('Invalid filename') + '\n' + help)
  filename = path.resolve(term.cwd, filename)
  if (!kernel.fs.existsSync(filename)) throw new Error(colors.danger('Invalid filename') + '\n' + help)

  const data = kernel.fs.readFileSync(filename)
  const blob = new Blob([data], { type: 'application/wasm' })
  const url = URL.createObjectURL(blob)

  const instance = await AsBind.instantiate(await fetch(url), {
    index: {
      web3os_log: message => { console.log(message); term.log(message) },
      web3os_alert: message => kernel.execute(`alert ${message}`),
      web3os_wallet_address: () => kernel.wallet.account.address,
      web3os_wallet_chainId: () => kernel.wallet.account.chainId
    }
  })

  const cmd = passArgs[0]
  const argv = passArgs.slice(1)
  const result = instance.exports[cmd](argv)

  if (result) {
    console.log(result)
    term.log(result)
  }
}
