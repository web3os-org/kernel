const repl = require('repl')
const { WebSocketServer, createWebSocketStream } = require('ws')

const wss = new WebSocketServer({ port: 30104 })
wss.on('connection', (ws, req) => {
  console.log('Connected:', req.socket.remoteAddress)
  const stream = createWebSocketStream(ws, { encoding: 'utf8' })
  repl.start('<3os># ', stream)
  stream.pipe(process.stdout)
  process.stdin.pipe(stream)
})
