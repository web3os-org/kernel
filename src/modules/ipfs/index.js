import arg from 'arg'
import path from 'path'

export const name = 'ipfs'
export const version = '0.1.0'
export const description = 'Interplanetary Filesystem Utility'

const spec = {
  '--version': Boolean,
  '-v': '--version'
}

let kernel
let terminal
export let ipfs

export async function upload (filename) {
  const data = kernel.fs.readFileSync(filename)
  const result = await ipfs.add(data)
  console.log(result)
  terminal.log(`${filename} -> https://ipfs.io/ipfs/${result.path}`)
  return result.path
}

export async function download (cid) {
  const data = await ipfs.get(cid)
  console.log(data)
}

export async function ls (cid) {
  const data = await ipfs.ls(cid)
  console.log(data)
}

export async function run (term, context) {
  terminal = term
  kernel = terminal.kernel

  const args = arg(spec, { argv: context.split(' ') })
  const cmd = args._?.[0]

  // console.log({ args, version })
  if (args['--version']) return term.log(version)
  if (!ipfs) ipfs = await (await import('ipfs-core')).create()

  switch (cmd) {
    case 'ls':
      return await ls(args._?.slice(1)[0])
    case 'upload':
      return await upload(path.join(term.cwd, args._?.slice(1)[0]))
    case 'download':
      return await download(args._?.slice(1)[0])
  }
}
