import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'
import Moralis from 'moralis'

// Interact with the Moralis instance directly
// e.g., kernel.modules.moralis.instance.User.current()
export const instance = Moralis

export const name = 'moralis'
export const version = '0.1.0'
export const description = 'Moralis.io Utility'
export const help = `
  ${colors.magenta.bold('Moralis.io Utility')}
  https://moralis.io

  Usage:
    moralis <command> [options]

  Commands:
    start [--app-id] [--server-url]          Setup the Moralis client
    login                                    Login via Moralis
    logout                                   Logout of Moralis
    user                                     Show current user

  Options:
    --app-id                                 Specify Moralis App ID (default = kernel.get('moralis', 'app-id'))
    --help                                   Print this help message
    --server-url                             Specify Moralis Server URL (default = kernel.get('moralis', 'server-url'))
    --version                                Print the version information
`

export const spec = {
  '--app-id': String,
  '--help': Boolean,
  '--server-url': String,
  '--version': Boolean
}

export async function login () {
  return Moralis.User.current() || await Moralis.authenticate()
}

export async function logout () {
  return await Moralis.User.logOut()
}

export async function start (args) {
  const appId = args['--app-id'] || args.kernel.get('moralis', 'app-id')
  const serverUrl = args['--server-url'] || args.kernel.get('moralis', 'server-url')
  await Moralis.start({ appId, serverUrl })
  return Moralis
}

export function user () {
  return Moralis.User.current()
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]
  args.term = term
  args.kernel = term.kernel

  switch (cmd) {
    case 'login':
      return await login()
    case 'logout':
      return await logout()
    case 'start':
      return await start(args)
    case 'user':
      return term.log(user())
    default:
      return term.log(help)
  }
}
