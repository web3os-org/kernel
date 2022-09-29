var blessed = require('reblessed')
const { createServer } = require('wss')
const { createWebSocketStream } = require('ws')

const bbsServer = createServer(ws => {
  ws.send('connected!')

  // process.stdin.on('data', data => {
  //   ws.send(data)
  // })

  // process.stdout.on('data', data => {
  //   ws.send(data)
  // })

  const socketStream = createWebSocketStream(ws)

  ws.write = ws.send
  // ws.read = ws.read
  
  ws.program = blessed.program({
    tput: true,
    input: ws,
    output: ws
  })

  ws.screen = blessed.screen({
    program: ws.program,
    tput: ws.program.tput,
    input: ws,
    output: ws,
    terminal: 'xterm-256color',
    fullUnicode: true
  })

  ws.on('message', data => {
    const str = data.toString() === '\r' ? '\r\n' : data.toString()
    ws.send(str)
    console.log(str)

    ws.screen.data.main = blessed.box({
      parent: ws.screen,
      left: 'center',
      top: 'center',
      width: '80%',
      height: '90%',
      border: 'line',
      content: 'Welcome to my server. Here is your own private session.'
    })

    ws.screen.render()
  })
})

bbsServer.listen(30103)

// const screen = blessed.screen({ smartCSR: true })

// screen.title = 'my window title'

// const box = blessed.box({
//   top: 'center',
//   left: 'center',
//   width: '50%',
//   height: '50%',
//   content: 'Hello {bold}world{/bold}!',
//   tags: true,
//   border: {
//     type: 'line'
//   },
//   style: {
//     fg: 'white',
//     bg: 'magenta',
//     border: {
//       fg: '#f0f0f0'
//     },
//     hover: {
//       bg: 'green'
//     }
//   }
// })

// screen.append(box)

// box.on('click', () => {
//   box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}')
//   screen.render()
// })

// box.key('enter', () => {
//   box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n')
//   box.setLine(1, 'bar')
//   box.insertLine(1, 'foo')
//   screen.render()
// })

// screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
// box.focus()
// screen.render()
