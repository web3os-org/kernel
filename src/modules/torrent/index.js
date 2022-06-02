import arg from 'arg'
import path from 'path'
import colors from 'ansi-colors'
import columnify from 'columnify'
import WebTorrent from 'webtorrent'
import { parse as cliParse } from 'shell-quote'

export const name = 'torrent'
export const version = '0.1.0'
export const description = 'WebTorrent Utility'
export const help = `
  ${colors.magenta.bold(description)}
  Note: this tool is a WIP

  Usage:
    torrent <command> <args> [options]

  Commands:
    add <torrent>                          Start downloading a torrent (magnet or http url)
    files <torrentID>                      List files in the specified torrent
    list                                   List torrents
    play <torrentID> <fileID>              Play a video

  Options:
    --help                                 Print this help message
    --version                              Print the version information
`

export let client

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export function add (url, args) {
  if (!url || url === '') throw new Error('You must specify a magnet or torrent url')
  client.add(url, torrent => {
    torrent.on('done', () => console.log('Done:', torrent))
  })
}

export function files (torrentID, args) {
  const torrent = client.torrents[torrentID]
  const data = torrent.files.map((file, id) => {
    return { id, length: file.length, path: file.path }
  })

  return data
}

export function list (args) {
  const data = client.torrents.map((torrent, id) => {
    const progress = (torrent.progress * 100).toFixed(1) + '%'
    const { name, files, length, numPeers: peers, downloaded, uploaded, downloadSpeed, uploadSpeed } = torrent

    return {
      id, name, length, progress, peers, downloaded, uploaded,
      dlSpeed: downloadSpeed.toFixed(1), ulSpeed: uploadSpeed.toFixed(1),
      files: files.length
    }
  })

  return data
}

export function play (torrentID, fileID, args) {
  const torrent = client.torrents[torrentID]
  const file = torrent.files[fileID]

  const div = document.createElement('div')
  div.style.width = '100%'
  div.style.height = '100%'

  const win = kernel.windows.create({
    title: file.name,
    mount: div
  })

  file.appendTo(div)
  div.querySelector('video').style.width = '100%'
  div.querySelector('video').style.height = '100%'
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  if (!client) client = new WebTorrent()

  switch (cmd) {
    case 'add':
      return add(args._?.[1], args)
    case 'files':
      return term.log(columnify(files(args._?.[1], args)))
    case 'list':
      return term.log(columnify(list(args)))
    case 'play':
      return play(args._?.[1], args._?.[2], args)
    default:
      return term.log(help)
  }
}
