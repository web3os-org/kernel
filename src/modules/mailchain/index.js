import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'mailchain'
export const version = '0.1.0'
export const description = 'Mailchain Blockchain Messaging Utility'
export const help = `
  ${colors.bold(colors.danger('This is experimental technology'))}

  Please read the Mailchain documentation at:
  ${colors.underline('https://docs.mailchain.xyz')}

  Usage:
    mailchain <command> <options>

  Commands:
    inbox                           Open the Mailchain Web UI
    install                         Open the Mailchain Getting Started Guide in a new tab
    addresses                       List addresses known to the Mailchain API
    list                            List messages
      --to <address>                  The address that received the message (optional)
      --from <address>                The address that sent the message (optional)
      --file <file>                   Save the list to a file
    send                            Send a message
      --to <address>                  The address of the recipient
      --from <address>                The address of the sender
      --subject <subject>             The subject of the message
      --file <file>                   The path to the file to use as message content
    download
      --id <id>                       The message id to download
      --file <file>                   The path to the output file

  Options:
    --help                          Print this help message
    --host <localhost>              The hostname or IP address of the mailchain server
    --network <mainnet>             The network to use (mainnet, ropsten, goerli, rinkeby, local)
    --port <8080>                   The port of the mailchain server
    --protocol <ethereum>           The protocol to use (ethereum, algorand, substrate)
    --version                       Print the version information
`

export const spec = {
  '--file': String,
  '--from': String,
  '--help': Boolean,
  '--host': String,
  '--id': String,
  '--network': String,
  '--port': String,
  '--protocol': String,
  '--subject': String,
  '--to': String,
  '--version': Boolean
}

export async function install () {
  globalThis.open('https://docs.mailchain.xyz/getting-started', '_blank')
}

export async function send (args) {
  console.log('send', args)
}

export async function list (args) {
  console.log('list', args)
}

export async function download (args) {
  console.log('download', args)
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'inbox':
      return await kernel.execute('www --no-toolbar --title Mailchain https://inbox.mailchain.xyz')
    case 'install':
      return await install()
    case 'send':
      return await send(args)
    case 'list':
      return await list(args)
    case 'download':
      return await download(args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
