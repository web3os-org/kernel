import colors from 'ansi-colors'
import { create as createTerminal } from '../../terminal'

export const name = 'backend'
export const args = ['command', 'arguments']
export const description = 'Manages the connection to a Backend server'
export const help = `
  Usage:
    backend <command> <arguments>      Send a command to the currently connected Backend server

  Commands:
    connect <host:port>               Connect to a Backend server at host:port
    auth                              Sign a message with your wallet to authenticate to the server
    shell                             Run a bash shell on a server with admin privileges

`

let kernel
let oldPrompt
export let connection

async function authSign ({ address, key }) {
  console.log('authSign', { address, key })
  const signature = await kernel.bin.account.sign(JSON.stringify({ address, key }))
  connection.send(`auth-verify ${signature}`)
}

export async function launchShell (options = {}) {
  if (connection?.readyState !== 1) throw new Error('Not connected')
  let win

  const newTerm = createTerminal({
    fontFamily: options.fontFamily || `'Fira Mono', monospace`,
    fontSize: options.fontSize || 18,
    fontWeight: options.fontWeight || 900,
    theme: options.theme || { background: '#131820' },
    socket: connection
  })

  const container = document.createElement('div')
  container.style.width = '100%'
  container.style.height = '100%'
  newTerm.open(container)

  win = kernel.appWindow({
    title: 'Backend Shell',
    mount: container,
    width: options.windowWidth || '75%',
    height: options.windowHeight || '70%'
  })

  win.term = newTerm

  setInterval(newTerm.fit, 100)

  connection.send('shell')
}

export async function run (terminal, context = '') {
  kernel = terminal.kernel
  let { log } = kernel

  if (context.split(' ')[0] === 'shell') return launchShell()

  if (context.split(' ')[0] === 'connect') {
    if (connection?.readyState === 1) throw new Error('Already connected')
    let host = context.split(' ')[1]
    if (!host) host = 'localhost:1995'
    if (!host.includes(':')) host += ':1995'

    log(colors.success(`Connecting to ${host}...`))

    connection = new WebSocket(`ws://${host}`)

    connection.onerror = err => {
      console.error(err)
      log(colors.danger('\nBackend connection error'))
      terminal.prompt()
    }

    connection.onopen = () => {
      const initHandler = async e => {
        console.log('backend:init', e.data)

        if (e.data === 'HI') return connection.send(kernel.wallet.account.address)
        if (e.data.split(' ')[0] === 'SUCCESS') {
          log(colors.success("We're in. 🚀"))
          oldPrompt = terminal.promptFormat
          terminal.prompt(terminal.promptFormat.replace('#', `{${colors.warning(host)}}#`))

          const handler = async ({ data }) => {
            data = data[0] === '{' ? JSON.parse(data) : data
            console.log('backend:handler', data)

            switch (data.cmd) {
              case 'authSign':
                await authSign(data.payload)
                break
              case 'stream:start':
                console.log('stream:start')
                connection.removeEventListener('message', handler)
                break
              case 'stream:end':
                console.log('stream:end')
                connection.addEventListener('message', handler)
                break
              default:
                // log('\n' + data)
                // terminal.prompt()
            }
          }

          connection.removeEventListener('message', initHandler)
          connection.addEventListener('message', handler)
        }
      }

      connection.addEventListener('message', initHandler)

      connection.onclose = () => {
        const msg = 'Connection to Backend was closed'
        terminal.log(msg)
        terminal.prompt(oldPrompt)
      }
    }
  } else {
    connection?.send(context)
  }
}
