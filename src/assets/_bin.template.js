import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'myapp'
export const version = '0.1.0'
export const description = 'My app'
export const help = `
  ${colors.magenta.bold('My Sample Application')}

  Usage:
    myapp <command> [options]
  
  Examples:
    myapp hello --name Teal'c                Print "Hello World"

  Commands:
    hello                                    Print "Hello World"

  Options:
    --help                                   Print this help message
    --name                                   Specify the name to use instead of "World"
    --version                                Print the version information
`

export const spec = {
  '--help': Boolean,
  '--name': String,
  '--version': Boolean
}

export function hello ({ args }) {
  return `Hello ${args?.['--name'] || 'World'}`
}

// Run function is required to be a valid application
// Accepts the terminal instance, and a string context
export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  switch (cmd) {
    case 'hello':
      return term.log(hello({ args }))
    default:
      return term.log(help)
  }
}
