import arg from 'arg'
import path from 'path'
import Peer from 'peerjs/lib/peer'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'peer'
export const version = '0.1.0'
export const description = 'PeerJS Utility'
export const help = `
  ${colors.magenta.bold('PeerJS Utility')}

  Usage:
    peer <command> <args> [options]

  Commands:
    id                                       Display your peer ID
    connect <peer-id>                        Clone a repository
    send <peer-id> --text "Hello world"      Send a message

  Options:
    --help                                   Print this help message
    --id                                     Set your peer ID
    --version                                Print the version information
`

export const spec = {
  '--file': String,
  '--id': String,
  '--help': Boolean,
  '--text': String,
  '--version': Boolean
}

export let id = ''
export let instance
export const connections = {}

export async function connect (peerId, args) {
  connections[peerId] = peer.connect(peerId)
  connections[peerId].on('open', () => {
    peer.on('connection', connection => {
      connection.on('open', () => {
        console.log('Connected to', peerId)
      })

      connection.on('data', data => {
        console.log({ data })
        args?.terminal?.log(data)
      })
    })
  })
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  args.terminal = term
  args.kernel = term.kernel

  if (id === '') instance = new Peer(args?.['--id'])
  instance.on('open', myId => { id = myId })

  switch (cmd) {
    case 'id':
      return term.log(id)
    case 'connect':
      return await connect(args._?.[1], args)
    default:
      return term.log(help)
  }
}
