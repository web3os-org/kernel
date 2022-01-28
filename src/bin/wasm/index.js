import path from 'path'
import colors from 'ansi-colors'
import * as AsBind from 'as-bind'
import WasmTerminal from '@wasmer/wasm-terminal'
import { WasmFs } from '@wasmer/wasmfs'

export const name = 'wasm'
export const version = '0.1.0'
export const description = 'Run WebAssembly binaries'
export const help = `
  Usage:
    wasm <path> <method> <args>       Run WebAssembly <method> in binary at <path> with <args>
`

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

export async function run (term, args) {
  const { kernel } = term

  let filename = args.split(' ')[0]
  const passArgs = args.split(' ').slice(1)

  if (!filename || filename === '') throw new Error(colors.danger('Invalid filename') + '\n' + help)
  
  // if (filename === 'shell') return await createShell()
  if (filename === 'shell') return kernel.execute('www https://webassembly.sh --title WebAssembly.sh --no-toolbar')
  
  filename = path.resolve(term.cwd, filename)
  if (!kernel.fs.existsSync(filename)) throw new Error(colors.danger('Invalid filename') + '\n' + help)

  const data = kernel.fs.readFileSync(filename)
  const blob = new Blob([data], { type: 'application/wasm' })
  const url = URL.createObjectURL(blob)

  let sysInstance = null;
  let memoryStates = new WeakMap();

  function syscall(sysInstance, n, args) {
    switch (n) {
      default:
        // console.log("Syscall " + n + " NYI.");
        break;
      case /* brk */ 45: return 0;
      case /* writev */ 146:
        return sysInstance.exports.writev_c(args[0], args[1], args[2]);
      case /* mmap2 */ 192:
        debugger;
        const memory = sysInstance.exports.memory;
        let memoryState = memoryStates.get(sysInstance);
        const requested = args[1];
        if (!memoryState) {
          memoryState = {
            object: memory,
            currentPosition: memory.buffer.byteLength,
          };
          memoryStates.set(sysInstance, memoryState);
        }
        let cur = memoryState.currentPosition;
        if (cur + requested > memory.buffer.byteLength) {
          const need = Math.ceil((cur + requested - memory.buffer.byteLength) / 65536);
          memory.grow(need);
        }
        memoryState.currentPosition += requested;
        return cur;
    }
  }

  let s = ''

  const { instance, module } = await WebAssembly.instantiateStreaming(fetch(url), {
    env: {
      // web3os_log: message => { console.log(message); term.log(message) },
      // web3os_alert: message => kernel.execute(`alert ${message}`),
      // web3os_wallet_address: () => kernel.wallet.account.address,
      // web3os_wallet_chainId: () => kernel.wallet.account.chainId,
      __syscall0: function __syscall0(n) { return syscall(instance, n, []); },
      __syscall1: function __syscall1(n, a) { return syscall(instance, n, [a]); },
      __syscall2: function __syscall2(n, a, b) { return syscall(instance, n, [a, b]); },
      __syscall3: function __syscall3(n, a, b, c) { return syscall(instance, n, [a, b, c]); },
      __syscall4: function __syscall4(n, a, b, c, d) { return syscall(instance, n, [a, b, c, d]); },
      __syscall5: function __syscall5(n, a, b, c, d, e) { return syscall(instance, n, [a, b, c, d, e]); },
      __syscall6: function __syscall6(n, a, b, c, d, e, f) { return syscall(instance, n, [a, b, c, d, e, f]); },
      putc_js: function (c) {
        c = String.fromCharCode(c);
        if (c == "\n") {
          console.log(s);
          s = "";
        } else {
          s += c;
        }
      }
    }
  })

  const cmd = passArgs[0] || 'main'
  const argv = passArgs.slice(1)
  const result = instance.exports[cmd](argv)

  // console.log(result)
  // term.log(result)
  return result
}
