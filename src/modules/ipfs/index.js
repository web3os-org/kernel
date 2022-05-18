import arg from 'arg'
import path from 'path'
import colors from 'ansi-colors'

export const name = 'ipfs'
export const version = '0.1.0'
export const description = 'Interplanetary Filesystem Utility'
export const help = `
  ${colors.magenta('This tool is a WIP')}

  Usage:
    ipfs <command> <args> [options]

  Commands:
    download <cid> [path]                    Download CID to path or {cwd}
    ls <cid>                                 List contents of CID
    mfs <mfs-command> [args]                 Interact with the IPFS Mutable File System
    status                                   Display node status
    upload <path>                            Upload path to IPFS

  MFS Commands:
    cp <from> <to>                           Copy a file or directory (<from> may be IPFS or MFS path)
    ls <mfs-path>                            List contents of mfs-path
    mv <from> <to>                           Move a file or directory
    mkdir <mfs-path>                         Create a directory
    read <mfs-path>                          Read the contents of file at <mfs-path>
    rm <mfs-path>                            Delete a file or directory
    stat <mfs-path>                          Get directory stats
    upload <mfs-path> <local-file>           Upload <local-file> to <mfs-path>
`

const spec = {
  '--help': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}

let ipfs
let inst

export function core () {
  return ipfs
}

export function instance () {
  return inst
}

export async function upload (filename, args) {
  const data = args.terminal.kernel.fs.readFileSync(path.join(args.terminal.cwd, filename))
  const result = await ipfs.add(data)
  args.terminal.log(`${filename} -> https://ipfs.io/ipfs/${result.path}`)
  return result.path
}

export async function download (cid, args) {
  const outPath = path.join(args.terminal.cwd, args._?.[2] || cid)
  const data = []
  for await (const block of ipfs.cat(cid)) data.push(block.toString())
  const contents = data.join('')
  args.terminal.kernel.fs.writeFileSync(outPath, contents, 'utf8')
  args.terminal.log(`${cid} -> ${outPath}`)
}

export async function ls (cid) {
  for await (const file of inst.ls(cid)) {
    console.log(file.path)
  }
}

export async function run (terminal = globalThis.Terminal, context = '') {
  const args = arg(spec, { argv: context.split(' ') })
  const cmd = args._?.[0]

  if (args['--help']) return terminal.log(help)
  if (args['--version']) return terminal.log(version)
  if (!ipfs) ipfs = await import('ipfs-core')
  if (!inst) inst = await ipfs.create()
  args.terminal = terminal

  switch (cmd) {
    case 'ls':
      return await ls(args._?.slice(1)[0], args)
    case 'upload':
      return await upload(args._?.slice(1)[0], args)
    case 'download':
      return await download(args._?.slice(1)[0], args)
    default:
      return terminal.log(help)
  }
}
