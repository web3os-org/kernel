export const name = 'worker'
export const version = '0.1.0'
export const description = 'Web Worker Utility'
export const help = `
  WIP: Web Worker Utility
`

export const workers = []

export function run (terminal = globalThis.Terminal, context) {
  const { kernel } = terminal
  const url = kernel.modules.objectUrl.run(terminal, context)
  const worker = new Worker(url)
  workers.push({ id: Math.random().toString(36).slice(2), worker })
}
