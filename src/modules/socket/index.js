import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'

const { t } = Kernel.i18n

export let connections = []

export const name = 'socket'
export const version = '0.1.0'
export const description = 'WebSocket Utility'
export const help = `
  Usage:
    socket attach <id>               Attach a new terminal to the socket (id may be a partial match)
    socket connect <url>             Create a WebSocket connection
    socket disconnect <id>           Disconnect the WebSocket session (id may be a partial match)
    socket ls                        List connected sockets

  Options:
    --help                           Print this help message
    --version                        Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

let term = Terminal

export async function attach (id, args) {
  let fitInterval
  const socket = connections.find(socket => socket.id.includes(id))
  if (!socket) throw new Error(t('app:socket.socketNotFound', 'Socket not found'))
  const mount = document.createElement('div')
  mount.style.height = '100%'

  const app = term.kernel.windows.create({
    title: `Socket: ${socket.id}`,
    mount,
    max: true,
    x: 'center',
    y: 'center',
    onclose: () => {
      clearInterval(fitInterval)
    }
  })

  app.window.body.style.overflowY = 'hidden'

  const socketTerm = term.kernel.Web3osTerminal.create({
    socket: socket.socket,
    kernel: term.kernel,
    fontSize: 22
  })

  socketTerm.open(mount)
  mount.querySelector('.xterm').style.position = 'unset'
  fitInterval = setInterval(() => socketTerm.fit(), 200)
  socketTerm.focus()

  socket.socket.closeListeners.push(() => {
    console.log('Socket', socket.id, 'closed')
    app.window.close()
  })

  return { app, socket, socketTerm }
}

export async function connect (url, args) {
  const id = Math.random().toString(36).slice(2)
  const socket = new WebSocket(url)

  socket.openListeners = []
  socket.closeListeners = [() => connections = connections.filter(c => c === socket)]
  socket.errorListeners = [() => connections = connections.filter(c => c === socket)]
  socket.messageListeners = [message => console.log(id, { data: message.data }, { message })]

  socket.onopen = data => {
    for (const listener of socket.openListeners) {
      if (typeof listener === 'function') listener(data)
    }
  }

  socket.onclose = data => {
    for (const listener of socket.closeListeners) {
      if (typeof listener === 'function') listener(data)
    }
  }

  socket.onerror = data => {
    for (const listener of socket.errorListeners) {
      if (typeof listener === 'function') listener(data)
    }
  }

  socket.onmessage = message => {
    for (const listener of socket.messageListeners) {
      if (typeof listener === 'function') listener(message)
    }
  }

  connections.push({ id: `${id}#${socket.url}`, socket })
}

export async function disconnect (id, args) {
  const socket = connections.find(socket => socket.id.includes(id))
  if (!socket) throw new Error(t('app:socket.socketNotFound', 'Socket not found'))
  socket.socket.close()
}

export async function list () {
  return term.log(connections.map(socket => socket.id))
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'attach':
      return await attach(args._?.[1], args)
    case 'connect':
      return await connect(args._?.[1], args)
    case 'disconnect':
      return await disconnect(args._?.[1], args)
    case 'ls':
      return await list(args)
    default:
      return term.log?.(help)
  }
}

export async function run (terminal = Terminal, context = '') {
  term = terminal
  if (!WebSocket) throw new Error(colors.danger(t('app:socket.websocketsNotSupported', 'Client does not support WebSockets')))
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  return execute(args._?.[0], args)
}
