import arg from 'arg'
import colors from 'ansi-colors'
import columnify from 'columnify'
import { parse as cliParse } from 'shell-quote'
import { v86WASM, seabios, vgabios } from 'v86/build/binaries'

// import osList from './os-list'

const { t } = Kernel.i18n

export const name = 'vm'
export const version = '0.1.0'
export const description = 'Virtual Machine Utility'
export const help = `
  ${t('Powered by')} v86 by Copy
  https://github.com/copy/v86

  ${t('Usage')}:
    launch [profile]                 ${t('Launch the given VM profile, show menu if not specified')}

  ${t('Options')}:
    --help                           ${t('Print this help message')}
    --version                        ${t('Print the version information')}
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

let term = Terminal

export const machines = []

// export async function launch (image) {
//   const profile = osList.find(os => os.id === image || os.name === image)
//   if (!profile) throw new Error(t('Profile not found'))
//   console.log(profile)

//   let fitInterval
//   const mount = document.createElement('main')
//   const view = document.createElement('section')
//   const serial = document.createElement('div')
//   const screen = document.createElement('canvas')
//   const buttonWrapper = document.createElement('div')

//   const buttons = {
//     Screen: {
//       element: document.createElement('button'),
//       handler: () => switchView('screen')
//     },
//     Serial: {
//       element: document.createElement('button'),
//       handler: () => switchView('serial')
//     }
//   }

//   mount.style.width = '100%'
//   mount.style.height = '100%'
//   mount.style.display = 'flex'
//   screen.style.display = 'none'
//   screen.style.width = '100%'
//   screen.style.height = '100%'
//   serial.style.width = '100%'
//   buttonWrapper.style.display = 'flex'

//   for (const name of Object.keys(buttons)) {
//     const button = buttons[name]
//     button.innerText = name
//     button.element.addEventListener('click', button.handler)
//     buttonWrapper.appendChild(button.element)
//   }

//   mount.appendChild(buttonWrapper)
//   view.appendChild(screen)
//   view.appendChild(serial)
//   mount.appendChild(view)

//   const app = term.kernel.windows.create({
//     mount,
//     title: `VM: ${image}`,
//     x: 'center',
//     y: 'center',
//     max: true
//   })

//   const vm = new V86Starter({
//     wasm_fn: async param => (await WebAssembly.instantiate(await v86WASM, param)).instance.exports,
//     memory_size: profile?.memory_size || 32 * 1024 * 1024,
//     vga_memory_size: profile?.vga_memory_size || 2 * 1024 * 1024,
//     screen_container: screen,
//     serial_container_xtermjs: serial,
//     bios: { buffer: await seabios },
//     vga_bios: { buffer: await vgabios },
//     autostart: profile?.autostart || true,
//     preserve_mac_from_state_image: profile?.preserve_mac_from_state_image,
//     initial_state: profile?.state,
//     boot_order: profile?.boot_order,
//     filesystem: profile?.filesystem || {},
//     cmdline: profile?.cmdline,
//     multiboot: profile?.multiboot,
//     disable_speaker: profile?.disable_speaker,
//     bzimage_initrd_from_filesystem: profile?.bzimage_initrd_from_filesystem,
//     bzimage: profile?.bzimage,
//     initrd: profile?.initrd,
//     cdrom: profile?.cdrom,
//     acpi: profile?.acpi,
//     fda: profile?.fda,
//     hda: profile?.hda,
//     hdb: profile?.hdb,
//   })

//   vm.add_listener('emulator-ready', () => {
//     console.log('V86 Emulator Ready')
//   })

//   const vmTerm = term.kernel.Web3osTerminal.create({
//     kernel: term.kernel,
//     fontSize: 22,
//     promptFormat: ''
//   })

//   vmTerm.execute = line => console.log(line)
//   vmTerm.open(mount)
//   mount.querySelector('.xterm').style.position = 'unset'
//   fitInterval = setInterval(() => vmTerm.fit(), 200)
//   vmTerm.focus()

//   machines.push({ id: Math.random().toString(36).slice(2), vm })
// }

export async function execute (cmd, args) {
  switch (cmd) {
    case 'launch':
      // return await launch(args._?.[1])
      // for the sake of a better UI and UX, use Copy's live version instead for now
      const profile = args._?.[1]
      const vmUiUrl = 'https://copy.sh/v86'
      return await term.kernel.modules.www.run(term, `--title "VM${profile ? `: ${profile}` : ''}" --no-toolbar "${vmUiUrl}${profile ? `?profile=${profile}` : ''}"`)
    default:
      return term.log?.(help)
  }
}

export async function run (terminal = Terminal, context = '') {
  term = terminal
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  return execute(args._?.[0], args)
}
