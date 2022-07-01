const { createServer } = require('wss')

const echoServer = createServer(ws => {
  ws.on('message', data => {
    const str = data.toString() === '\r' ? '\r\n' : data.toString()
    process.stdout.write(str)
    ws.send(str)
  })
})

const streamServer = createServer(ws => {
  let point = 0

  setInterval(() => {
    if (point > 65535) point = 0
    ws.send(String.fromCodePoint(point))
    point++
  }, 5)
})

echoServer.listen(30101)
streamServer.listen(30102)
console.log('Echo Server: ws://localhost:30101')
console.log('Stream Server: ws://localhost:30102')
console.log('-----------------------------------')
