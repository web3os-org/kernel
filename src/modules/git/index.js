import arg from 'arg'
import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/web'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'git'
export const version = '0.1.0'
export const description = 'Git'
export const help = `
  ${colors.magenta.bold('Powered by https://github.com/isomorphic-git/isomorphic-git')}

  Usage:
    git <command> <args> [options]
  
  Examples:
    git clone https://github.com/web3os-org/sample-scripts

  Commands:
    clone <repo> [path]                      Clone a repository

  Options:
    --branch <name>                          Specify branch
    --force                                  Force action/overwrite
    --help                                   Print this help message
    --version                                Print the version information
`

export const spec = {
  '--branch': String,
  '--force': Boolean,
  '--help': Boolean,
  '--version': Boolean
}

export async function clone (url, dir, args) {
  if (!url) throw new Error('No URL specified')
  if (!dir || dir === '') {
    const parts = url.split('/')
    const dirname = parts[parts.length - 1]?.replace(/\.git$/, '')
    dir =kernel.utils.path.join(args.terminal.cwd, dirname)
  }

  args.terminal.log(`Cloning into '${dir}'...`)

  const result = await git.clone({
    fs: args.kernel.fs,
    http,
    dir,
    url,
    corsProxy: 'https://cors.isomorphic-git.org',
    force: args['--force'] || false,
    ref: args['--branch'] || 'main',
    singleBranch: true
  })
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  args.terminal = term
  args.kernel = term.kernel

  switch (cmd) {
    case 'clone':
      return await clone(args._?.[1], args._?.[2], args)
    default:
      return term.log(help)
  }
}
