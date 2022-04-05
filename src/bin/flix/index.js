import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

export const name = 'flix'
export const version = '0.1.0'
export const description = 'Watch videos over IPFS'
export const help = `
  ${colors.magenta.bold('Flix: Watch videos over IPFS')}

  Usage:
    flix <command> [options]

  Commands:
    play <cid>                      Play the specified video
    search <name>                   Search for a movie by name
    
  Options:
    --help                          Print this help message
    --version                       Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export function play (cid, args) {
  const video = document.createElement('video')
  video.autoplay = true
  video.controls = true
  video.src = `https://ipfs.io/ipfs/${cid}`
  video.style.width = '100%'
  video.style.height = '100%'

  const win = kernel.appWindow({
    title: cid,
    mount: video
  })
}

export async function search (q, args) {
  const response = await fetch(`https://api.ipfs-search.com/v1/search?q=${q}&type=file&page=${args['--page'] || '0'}`)
  const results = await response.json()
  const data = results.hits
    .filter(hit => hit.mimetype.includes('video'))
    .map(({ hash, mimetype, title }) => ({ hash, mimetype, title: title.replace(/<\/?[^>]+(>|$)/g, '') }))

  args.terminal.log(columnify(data, {
    columnSplitter: ' | ',
    columns: ['mimetype', 'title', 'hash'],
    config: {
      mimetype: { minWidth: 15 },
      title: { minWidth: 10, maxWidth: 20 },
      hash: { minWidth: 20 }
    }
  }))
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]
  args.terminal = term

  switch (cmd) {
    case 'play':
      return play(args._?.[1], args)
    case 'search':
      return search(args._?.[1], args)
    default:
      return term.log(help)
  }
}
