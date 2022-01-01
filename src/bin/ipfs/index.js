import arg from 'arg'

export const name = 'ipfs'
export const version = '0.1.0'
export const description = 'Interplanetary Filesystem Utility'

const spec = {
  '--version': Boolean,
  '-v': '--version'
}

let log
let kernel
let terminal

async function upload (filename) {
  console.log('upload', filename)
}

export async function run (term, context) {
  terminal = term
  kernel = terminal.kernel

  const args = arg(spec, { argv: context.split(' ') })
  const cmd = args._?.[0]

  console.log({ args, version })
  if (args['--version']) return term.log(version)

  const { create } = import('ipfs-core')
  kernel.ipfs = await create()

  switch (cmd) {
    case 'upload':
      return await upload(args._?.slice(1))
  }
}
