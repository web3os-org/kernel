import colors from 'ansi-colors'

export const name = 'gibson'
export const args = ['command', 'arguments']
export const description = 'Manages the connection to a Gibson server'
export const help = `
  Usage:
    gibson connect host:port       Connect to a Gibson server
    gibson <gibson-command>        Send a command to the currently connected Gibson server
`

let oldPrompt

export async function run (terminal, context = '') {
  const { kernel } = terminal
  let { log } = kernel

  if (context.split(' ')[0] === 'connect') {
    let host = context.split(' ')[1]
    if (!host) host = 'localhost:1989'
    if (!host.includes(':')) host += ':1989'

    log(colors.success(`Hacking the Gibson at ${host}...`))

    const gibsonSocket = new WebSocket(`ws://${host}`)

    gibsonSocket.onerror = err => {
      log(colors.danger('\nGibson connection error'))
      terminal.prompt()
    }

    gibsonSocket.onopen = () => {
      gibsonSocket.onmessage = async e => {
        console.log('got:', e.data)
        if (e.data === 'HI') return gibsonSocket.send(kernel.get('user', 'address'))
        if (e.data.split(' ')[0] === 'SUCCESS') {
          const key = e.data.split(' ')[1]

          // TODO: Require signing key
          // const provider = kernel.Web3Provider
          // provider.sign(kernel.get('user', 'address'), 'this is a test', (err, result) => {
          //   if (err) console.error(err)
          //   console.log({ result })
          // })

          kernel.set('gibson', 'host', host)
          kernel.set('gibson', 'key', key)
          kernel.setGibson(gibsonSocket)

          log(colors.success("We're in. 🚀"))
          oldPrompt = terminal.promptFormat
          terminal.prompt(terminal.promptFormat.replace('#', `{${colors.warning(host)}}#`))

          gibsonSocket.onmessage = ({ data }) => {
            log('\n' + data)
            terminal.prompt()
          }
        }
      }

      gibsonSocket.onclose = () => {
        const msg = 'Connection to Gibson was closed'
        console.warn(msg)
        log('\n' + colors.warning(msg))
        kernel.deleteNamespace('gibson')
        terminal.prompt(oldPrompt)
      }
    }
  } else {
    const gibsonSocket = kernel.getGibson()
    gibsonSocket?.send(context)
  }
}

