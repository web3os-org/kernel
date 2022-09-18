import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

const { t } = globalThis.Kernel.i18n

export const name = 'worker'
export const version = '0.1.0'
export const description = 'Web Worker Utility'
export const help = `
  Spawn Web Workers

  Usage:
    worker <command> [options]

  Commands:
    ls                               List Web Workers
    message <id> <payload>           Send payload to Web Worker
    spawn <path> [options]           Spawn a new Web Worker
    terminate <id>                   Terminate Web Worker specified by <id>

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
  return args.terminal.log(workers.map(worker => ({ id: worker.id, status: worker.status, file: worker.file, listeners: worker.listeners.length })))
}

export function message (id, payload) {
  workers.find(w => w.id === id)?.worker.postMessage(payload)
}

export function spawn (file, args) {
  const id = Math.random().toString(36).slice(2)
  const url = args.kernel.modules.objectUrl.run(args.terminal, file)
  const worker = new Worker(url)
  const listeners = [payload => console.log(t('Worker received message:'), payload)]
  const record = { id, file, listeners, worker, status: 'active' }

  worker.onmessage = payload => { for (const listener of record.listeners) listener(payload) }
  workers.push(record)

  args.terminal.log('Worker ID: ' + id)
  return record
}

export function terminate (id) {
  const worker = workers.find(w => w.id === id)

  if (worker) {
    worker.worker.terminate()
    worker.listeners = []
    worker.status = 'terminated'
  }
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'ls':
      return list(args)
    case 'message':
      return message(args._?.[1], args._?.[2], args)
    case 'spawn':
      return spawn(args._?.[1], args)
    case 'terminate':
      return terminate(args._?.[1])
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
