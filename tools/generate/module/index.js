import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'wasm'
export const version = '0.2.0'
export const description = 'WebAssembly utility'
export const help = `
  Usage:
    @my/module <command> <args> [options]

  Commands:
    help

  Options:
    --help                                          Show this help message
    --version                                       Show version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function run (term, context) {
  const { kernel } = term

  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  switch (cmd) {
    default:
      return term.log(help)
  }
}
