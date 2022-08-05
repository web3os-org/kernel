import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'worker'
export const version = '0.1.0'
export const description = 'Web Worker Utility'
export const help = `
  Spawn Web Workers

  Usage:
    worker <command> [options]

  Commands:
    ls                                              List Web Workers
    message <id> <payload>                          Send payload to Web Worker
    spawn <path> [options]                          Spawn a new Web Worker

  Interface:
    const { workers } = Kernel.modules.worker
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export const workers = []

export function list (args) {
  console.log(workers)
  return args.terminal.log(workers.map(worker => worker.id))
}

export function spawn (args) {
  const id = Math.random().toString(36).slice(2)
  const url = args.kernel.modules.objectUrl.run(args.terminal, args._?.[1])
  const worker = new Worker(url)
  const listeners = [payload => console.log('Payload:', payload)]
  const record = { id, listeners, worker }

  worker.onmessage = function (payload) {
    console.log({ payload })
    for (const listener of record.listeners) {
      listener(payload)
    }
  }

  workers.push(record)
  args.terminal.log('Worker ID: ' + id)
  return record
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'ls':
      return list(args)
    case 'spawn':
      return spawn(args)
    default:
      return args.terminal.log?.(help)
  }
}

export function run (terminal = globalThis.Terminal, context) {
  const { kernel } = terminal
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = terminal
  args.kernel = kernel

  return execute(args._?.[0], args)
}
