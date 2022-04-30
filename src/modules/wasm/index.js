/* global Blob, fetch, WebAssembly */

import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'wasm'
export const version = '0.2.0'
export const description = 'WebAssembly utility'
export const help = `
  Usage:
    wasm <path> <command> [args] [options]

  Examples:
    wasm /wasm/sum.wasm run main "[2,2]"
    wasm /wasm/factorial.wasm run _Z4facti 44

  Commands:
    exports                                         List a WebAssembly module's exports
    run <method> <jsonArg[]> [options]              Run WebAssembly

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

  let filename = args._?.[0]
  if (!filename || filename === '') throw new Error(colors.danger('Invalid filename') + '\n' + help)

  filename = kernel.utils.path.resolve(term.cwd, filename)
  if (!kernel.fs.existsSync(filename)) throw new Error(colors.danger('Invalid filename') + '\n' + help)

  const wasm = kernel.fs.readFileSync(filename)
  const wasmBlob = new Blob([wasm], { type: 'application/wasm' })
  const wasmUrl = URL.createObjectURL(wasmBlob)
  const wasmData = await fetch(wasmUrl)
  const wasmBin = await WebAssembly.compileStreaming(wasmData)
  const instance = await WebAssembly.instantiate(wasmBin, {})

  let params = []
  try {
    params = args._[3] ? JSON.parse(args._[3]) : []
  } catch (e) {
    console.error(e)
    term.log(colors.danger(e.message))
  }

  const passParams = Array.isArray(params) ? params : [params]

  switch (args._[1]) {
    case 'run':
      return term.log(instance?.exports?.[args._[2]](...passParams))
    case 'exports':
      return term.log(Object.keys(instance.exports))
    default:
      return term.log(help)
  }
}
