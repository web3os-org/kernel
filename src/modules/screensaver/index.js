import arg from 'arg'
import colors from 'ansi-colors'

// Rethinking how to approach the icon situation
// import { default as appIcon } from './icon.svg'

export const name = 'screensaver'
export const version = '1.0.0'
// export const icon = appIcon
export const description = 'web3os Screensaver'
export const screensavers = ['blank', 'matrix']
export const help = `
  Available Screensavers: ${screensavers.join(', ')}

  Usage:
    screensaver              Launch the default screensaver (${colors.green('matrix')})
    screensaver <name>       Launch screensaver with <name>
`

const spec = {
  '--version': Boolean,
  '-v': '--version'
}

let kernel = globalThis.Kernel
let terminal = globalThis.Terminal
export let running = false

function listenForKeypress (callback) {
  const keyTrap = document.createElement('input')
  keyTrap.style.opacity = 0

  keyTrap.addEventListener('keydown', e => {
    events.dispatch('ScreensaverEnd')
    e.preventDefault()
    callback(e)
    keyTrap.remove()
    terminal.focus()
  })

  document.body.appendChild(keyTrap)
  keyTrap.focus()
}

export async function run (term = globalThis.Terminal, context = '') {
  terminal = term
  kernel = term.kernel

  const args = arg(spec, { argv: context.split(' ') })
  const cmd = args._?.[0]

  if (args['--version']) return term.log(version)

  let saver

  switch (cmd) {
    case 'blank':
      saver = await import('./blank')
      break
    case 'matrix':
    default:
      saver = await import('./matrix')
  }

  if (!saver) throw new Error('Screensaver not found')
  terminal.blur()
  return await saver.default({ listenForKeypress })
}
