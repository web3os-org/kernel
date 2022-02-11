import arg from 'arg'
import path from 'path'
import colors from 'ansi-colors'
import WasmTerminal from '@wasmer/wasm-terminal'
import { WasmFs } from '@wasmer/wasmfs'
import { parse as cliParse } from 'shell-quote'
import { init as initWasi, WASI } from '@wasmer/wasi'

export const name = 'wasm'
export const version = '0.1.0'
export const description = 'Run WebAssembly binaries'
export const help = `
  Usage:
    wasm <options> <path> <method> <args>       Run WebAssembly <method> in binary at <path> with <args>

  Options:
    --help             Show this help message
    --version          Show version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

function fetchCommand (cmd) {
  console.log({ cmd })
}

export async function createShell () {
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.top = 0
  wrapper.style.left = 0
  wrapper.style.height = '100vh'
  wrapper.style.width = '100%'

  const wterm = new WasmTerminal({
    fetchCommand,
    wasmfs: new WasmFs()
  })

  document.querySelector('#terminal').remove()

  wterm.open(wrapper)
  document.body.appendChild(wrapper)
  console.log({ wrapper, wterm })
}

export async function run (term, context) {
  const { kernel } = term

  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  let filename = args._?.[0]

  if (!filename || filename === '') throw new Error(colors.danger('Invalid filename') + '\n' + help)
  
  // if (filename === 'shell') return await createShell()
  if (filename === 'shell') return kernel.execute('www https://webassembly.sh --title WebAssembly.sh --no-toolbar')
  
  filename = path.resolve(term.cwd, filename)
  if (!kernel.fs.existsSync(filename)) throw new Error(colors.danger('Invalid filename') + '\n' + help)

  const wasm = kernel.fs.readFileSync(filename)
  // const wasmBlob = new Blob([wasm], { type: 'application/wasm' })
  // const wasmUrl = URL.createObjectURL(wasmBlob)
  // const wasmData = fetch(wasmUrl)
  // console.log(await wasmData)

  // Load Emscripten
  if (args['--emscripten']) {
    const loader = kernel.fs.readFileSync(filename)
    const loaderBlob = new Blob([loader], { type: 'text/javascript' })
    const loaderUrl = URL.createObjectURL(loaderBlob)

    // return result
  }

  const wasi = await import('./wasi-polyfill')
  const wasiModule = await wasi.load(wasm)
  console.log(args._[1], wasiModule.instance.exports)
  const result = wasiModule.instance.exports[args._[1]]()
  term.log(result)
  console.log(result)
  return

  // await initWasi()
  // let wasi = new WASI({
  //   env: {
  //     // IS_WEB3OS: 'true'
  //   },
  //   args: [
  //     // ...args._.join('') // cute
  //   ]
  // })

  // const module = await WebAssembly.compileStreaming(wasmData)
  // await wasi.instantiate(module, {})
  // let exitCode = wasi.start()
  // let stdout = wasi.getStdoutString()

  // console.log({ exitCode, stdout })

  // return

  // ---- TODO: CLEANUP

  // const data = kernel.fs.readFileSync(filename)
  // const blob = new Blob([data], { type: 'application/wasm' })
  // const url = URL.createObjectURL(blob)

  // let sysInstance = null
  // let memoryStates = new WeakMap()

  // // function syscall(sysInstance, n, args) {
  // //   switch (n) {
  // //     default:
  // //       console.log("Syscall " + n + " NYI.")
  // //       break
  // //     case /* brk */ 45: return 0
  // //     case /* writev */ 146:
  // //       return sysInstance.exports.writev_c(args[0], args[1], args[2])
  // //     case /* mmap2 */ 192:
  // //       debugger
  // //       const memory = sysInstance.exports.memory
  // //       let memoryState = memoryStates.get(sysInstance)
  // //       const requested = args[1]
  // //       if (!memoryState) {
  // //         memoryState = {
  // //           object: memory,
  // //           currentPosition: memory.buffer.byteLength,
  // //         }
  // //         memoryStates.set(sysInstance, memoryState)
  // //       }
  // //       let cur = memoryState.currentPosition
  // //       if (cur + requested > memory.buffer.byteLength) {
  // //         const need = Math.ceil((cur + requested - memory.buffer.byteLength) / 65536)
  // //         memory.grow(need)
  // //       }
  // //       memoryState.currentPosition += requested
  // //       return cur
  // //   }
  // // }

  // let s = ''

  // console.log(url)



  // const { instance, module } = await WebAssembly.instantiate(data, {
  //   env: {
  //     // web3os_log: message => { console.log(message); term.log(message) },
  //     // web3os_alert: message => kernel.execute(`alert ${message}`),
  //     // web3os_wallet_address: () => kernel.wallet.account.address,
  //     // web3os_wallet_chainId: () => kernel.wallet.account.chainId,
  //     putc_js: function (c) {
  //       c = String.fromCharCode(c)
  //       if (c == "\n") {
  //         console.log(s)
  //         term.log(s)
  //         s = ''
  //       } else {
  //         s += c
  //       }
  //     }
  //   }
  // })

  // const method = args._?.[1] || 'main'
  // const result = instance.exports[method](args)

  // console.log(method, result)
  // term.log(result)
  // return result
}
