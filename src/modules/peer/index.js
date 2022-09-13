/**
 * @module @web3os-core/peer
 * @author Jay Mathis <code@mathis.network>
 * @license MIT
 * @see https://peerjs.com
 * @see https://github.com/web3os-org/kernel
 * 
 * @todo Fix receiving emojis causing BinaryPackFailure
 * 
 * @description
 * PeerJS Utility
 * 
 * <pre>
 * 
 * 
 * 
    Usage:
      peer <command> <args> [options]

    To set your ID (default is UUID):
      peer id --id myfirstdevice

    Default Connection Broker:
      Kernel.get('peerjs', 'server-host') if set, or 0.peerjs.com

    Commands:
      call <peer-id> [--video] [--audio]                                     Call a peer with media streams
      chat <peer-id>                                                         Open a text chat with a peer
      connect <peer-id>                                                      Connect to a peer
      id                                                                     Display your peer ID
      list                                                                   List available peers
      send <peer-id> [--text] [--text-file] [--json] [--json-file]           Send a raw message
      screen <peer-id>                                                       Share your screen with a peer
      upload <peer-id> [--file]                                              Upload a file to a peer

    Options:
      --debug                                                                Debug level ({0},1,2,3)
      --file                                                                 Path of the file to upload
      --help                                                                 Print this help message
      --id                                                                   Set your peer ID
      --json                                                                 JSON string to send
      --json-file                                                            Path to JSON file to send
      --server-host                                                          Set the peerjs broker host
      --server-key                                                           Server API key (for 0.peerjs.com)
      --server-path                                                          Set the peerjs broker path {/}
      --server-port                                                          Set the peerjs broker port {443}
      --text                                                                 Text message to send
      --text-file                                                            Path to the text file to send
      --version                                                              Print the version information
 * </pre>
 */

import arg from 'arg'
import Peer from 'peerjs/dist/peerjs.esm'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

import styles from './peer.module.css'

export const name = 'peer'
export const version = '0.1.0'
export const description = 'PeerJS Utility'
export const help = `
  ${colors.magenta.bold('PeerJS Utility')}

  Usage:
    peer <command> <args> [options]

  To set your ID (default is UUID):
    peer id --id myfirstdevice

  Default Connection Broker:
    ${colors.bold("Kernel.get('peerjs', 'server-host')")} if set, or ${colors.bold('0.peerjs.com')}

  Commands:
    call <peer-id> [--video] [--audio]                                     Call a peer with media streams
    chat <peer-id>                                                         Open a text chat with a peer
    connect <peer-id>                                                      Connect to a peer
    id                                                                     Display your peer ID
    list                                                                   List available peers
    send <peer-id> [--text] [--text-file] [--json] [--json-file]           Send a raw message
    screen <peer-id>                                                       Share your screen with a peer
    upload <peer-id> [--file]                                              Upload a file to a peer

  Options:
    --debug                                                                Debug level ({0},1,2,3)
    --file                                                                 Path of the file to upload
    --help                                                                 Print this help message
    --id                                                                   Set your peer ID
    --json                                                                 JSON string to send
    --json-file                                                            Path to JSON file to send
    --server-host                                                          Set the peerjs broker host
    --server-key                                                           Server API key (for 0.peerjs.com)
    --server-path                                                          Set the peerjs broker path {/}
    --server-port                                                          Set the peerjs broker port {443}
    --text                                                                 Text message to send
    --text-file                                                            Path to the text file to send
    --version                                                              Print the version information
`

export const spec = {
  '--audio': Boolean,
  '--debug': Number,
  '--file': String,
  '--id': String,
  '--help': Boolean,
  '--json': String,
  '--json-file': String,
  '--server-key': String,
  '--server-host': String,
  '--server-port': Number,
  '--server-path': String,
  '--server-secure': Boolean,
  '--server-ping-interval': Number,
  '--text': String,
  '--text-file': String,
  '--version': Boolean,
  '--video': Boolean
}

let kernel = globalThis.Kernel
let terminal
const { t } = kernel.i18n

export let id = ''
export let instance
export const connections = {}

export function setupInstance () {
  return new Promise((resolve, reject) => {
    instance.on('open', myId => { id = myId; resolve(id) })
    instance.on('error', err => { console.error(err); reject(err) })
    instance.on('connection', connection => {
      connection.on('open', () => {
        console.log('Incoming connection from', connection.peer)
        kernel.execute(`snackbar Incoming connection from ${connection.peer}`)
        connections[connection.peer] = { connection }
        connection.on('data', data => processIncomingData(data, connection))
      })
    })

    instance.on('call', async call => {
      let avState = ''
      if (call.metadata.video && call.metadata.audio) avState = 'Audio & Video'
      if (call.metadata.video && !call.metadata.audio) avState = 'Video Only'
      if (!call.metadata.video && call.metadata.audio) avState = 'Audio Only'
      if (call.metadata.screen) avState = 'Screenshare'

      const container = document.createElement('div')
      container.innerHTML = `
        <p>
          You have an incoming call (${avState}) from:
          <br />
          <strong style='font-family: monospace'>${call.peer}</strong>
        </p>
      `
    
      const result = await kernel.dialog({
        icon: 'info',
        title: `Incoming ${call.metadata.screen ? 'Screenshare' : 'Call'}`,
        html: container.outerHTML,
        reverseButtons: true,
        showDenyButton: true,
        denyButtonText: 'Decline',
        confirmButtonText: call.metadata.screen ? 'Accept' : 'Answer'
      })

      if (result.isConfirmed) {
        if (call.metadata.screen) {
          call.answer()
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: call.metadata?.audio, video: call.metadata?.video })
          call.answer(stream)
        }

        call.on('stream', peerStream => {
          const video = document.createElement('video')
          video.style.width = '100%'
          video.style.height = '100%'

          if ('srcObject' in video) {
            video.srcObject = peerStream
          } else {
            video.src = URL.createObjectURL(peerStream)
          }

          video.onloadedmetadata = () => video.play()

          const title = call.metadata.screen ? t('Screen') : `${t('Call')} ${call.metadata.audio ? `(${t('Audio')})` : ''}${call.metadata.video ? `(${t('Video')})` : ''}`

          kernel.windows.create({
            title: `${title}: ${call.peer}`,
            mount: video,
            max: true,
            onclose: () => {

              call.close()
            }
          })
        })

        call.on('close', () => {
          console.log('call closed')
        })
      }
    })
  })
}

async function processIncomingData (data, connection) {
  console.debug({ data, connection })
  if (typeof data === 'object' && data.cmd) {
    let result
    switch (data.cmd) {
      case 'chat':
        result = await kernel.dialog({
          title: 'Incoming Chat',
          html: `<p>Peer ID:<br />${connection.peer}</p><h3>Accept?</h3>`,
          showDenyButton: true,
          confirmButtonText: 'Yes'
        })

        if (result.isConfirmed) openChatWindow(connections[connection.peer])
        break
      case 'upload':
        result = await kernel.dialog({
          title: t('Incoming Upload'),
          html: `<p>${t('Peer ID')}:<br />${connection.peer}</p><p>${t('Filename')}:<br />${data.filename}</p>`,
          inputLabel: t('Where would you like to save this file?'),
          inputValue: kernel.get('peer', 'defaultReceivePath') || '/tmp',
          reverseButtons: true,
          showDenyButton: true,
          denyButtonText: t('Cancel'),
          confirmButtonText: t('Save'),
          input: 'text'
        })

        if (result.isConfirmed) return kernel.fs.writeFileSync(data.filename, data.content)
        break
      default:
        throw new Error(`Invalid command ${JSON.stringify(data)} received from peer ${connection.peer}`)
    }
  }
}

export function connect (peerId, args) {
  return new Promise((resolve, reject) => {
    if (!peerId || peerId === '') return reject(new Error('Invalid peer'))
    connections[peerId] = { connection: instance.connect(peerId) }
    connections[peerId].connection.on('open', () => resolve(peerId))
    connections[peerId].connection.on('error', err => {
      console.error(err)
      reject(err)
    })
  })
}

export async function call (peerId, args) {
  const peer = connections[peerId]
  if (!peer) throw new Error('Not connected to that peer')
  if (!navigator.mediaDevices) throw new Error('Media devices not available')

  const metadata =
    args.screen
    ? { screen: true }
    : { audio: args['--audio'], video: args['--video'] }

  const stream = args.screen ? await navigator.mediaDevices.getDisplayMedia() : await navigator.mediaDevices.getUserMedia(metadata)
  const call = instance.call(peerId, stream, { metadata })

  call.on('stream', peerStream => {
    const video = document.createElement('video')
    video.style.width = '100%'
    video.style.height = '100%'

    if ('srcObject' in video) {
      video.srcObject = peerStream
    } else {
      video.src = URL.createObjectURL(peerStream)
    }

    video.onloadedmetadata = () => video.play()

    const title = metadata.screen ? t('Screen') : `${t('Call')} ${metadata.audio ? `(${t('Audio')})` : ''}${metadata.video ? `(${t('Video')})` : ''}`

    kernel.windows.create({
      title: `${title}: ${call.peer}`,
      mount: video,
      max: true,
      onclose: () => {
        call.close()
      }
    })
  })

  call.on('close', () => {
    console.log('call closed')
  })
}

export function openChatWindow (peer) {
  const container = document.createElement('div')
  container.classList.add(styles.container)
  const chat = document.createElement('div')
  chat.classList.add(styles.chat)
  const form = document.createElement('form')
  form.classList.add(styles.form)
  const input = document.createElement('input')
  input.classList.add(styles.input)
  const button = document.createElement('button')
  button.classList.add(styles.button)
  button.type = 'submit'
  button.textContent = 'Send'

  container.appendChild(chat)
  form.appendChild(input)
  form.appendChild(button)
  container.appendChild(form)

  const receiveMessage = data => {
    if (typeof data !== 'string') return
    const bubble = document.createElement('div')
    bubble.classList.add(styles.bubble, styles.toMe)
    bubble.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    chat.appendChild(bubble)
    bubble.scrollIntoView()
  }

  const sendMessage = data => {
    if (!data || data === '') return
    const bubble = document.createElement('div')
    bubble.classList.add(styles.fromMe)
    bubble.textContent = data
    chat.appendChild(bubble)
    bubble.scrollIntoView()
    peer.connection.send(data)
  }

  peer.connection.on('data', receiveMessage)
  peer.connection.send({ cmd: 'chat' })

  form.addEventListener('submit', e => {
    e.preventDefault()
    sendMessage(input.value)
    input.value = ''
  })

  kernel.windows.create({
    title: `Chat: ${peer.connection.peer}`,
    mount: container,
    width: '100%',
    max: false,
    onclose: () => {
      peer.connection.off('data', receiveMessage)
    }
  })
}

export async function chat (peerId) {
  const peer = connections[peerId]
  if (!peer) throw new Error('Not connected to that peer')
  openChatWindow(peer)
}

export async function screen (peerId) {
  const peer = connections[peerId]
  if (!peer) throw new Error('Not connected to that peer')
  if (!navigator.mediaDevices) throw new Error('Media devices not available')
  call(peerId, { screen: true })
}

export async function send (peerId, args) {
  const peer = connections[peerId]
  if (!peer) throw new Error('Not connected to that peer')
  if (args['--text']) return peer.connection.send(args['--text'])
  if (args['--text-file']) return peer.connection.send(kernel.fs.readFileSync(args['--text-file']).toString())
  if (args['--json']) return peer.connection.send(JSON.parse(args['--json']))
  if (args['--json-file']) return peer.connection.send(JSON.parse(kernel.fs.readFileSync(args['--json-file']).toString()))
}

export async function upload (peerId, args) {
  const peer = connections[peerId]
  if (!peer) throw new Error('Not connected to that peer')
  const content = kernel.fs.readFileSync(args['--file'])
  peer.connection.send({ cmd: 'upload', filename: kernel.utils.path.parse(args['--file']).base, content })
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]

  terminal = term
  kernel = term.kernel

  const peerOptions = {}

  if (args['--debug']) peerOptions.debug = args['--debug']
  if (args['--server-key']) peerOptions.key = args['--server-key']
  if (args['--server-host']) peerOptions.host = args['--server-host']
  if (args['--server-port']) peerOptions.port = args['--server-port']
  if (args['--server-path']) peerOptions.path = args['--server-path']
  if (args['--server-secure']) peerOptions.secure = args['--server-secure']
  if (args['--server-ping-interval']) peerOptions.pingInterval = args['--server-ping-interval']

  if (!args['--server-host'] && kernel.get('peerjs', 'server-host')) {
    peerOptions.host = kernel.get('peerjs', 'server-host')
  }

  if (args['--id'] && id !== args['--id']) {
    instance = new Peer(args?.['--id'], peerOptions)
    await setupInstance()
  }

  if (!instance) {
    instance = new Peer(peerOptions)
    await setupInstance()
  }

  switch (cmd) {
    case 'call':
      return await call(args._?.[1], args)
    case 'chat':
      return await chat(args._?.[1], args)
    case 'connect':
      return await connect(args._?.[1], args)
    case 'id':
      return term.log(id)
    case 'list':
      return term.log(Object.keys(connections))
    case 'screen':
      return await screen(args._?.[1], args)
    case 'send':
      return await send(args._?.[1], args)
    case 'upload':
      return await upload(args._?.[1], args)
    default:
      return term.log(help)
  }
}
