import 'regenerator-runtime/runtime'

import('./index').then(kernel => {
  // Have to do a full reboot to get the new kernel during HMR
  if (!globalThis.Kernel) globalThis.Kernel = kernel

  import('./terminal').then(term => {
    let coldBoot = true

    if (globalThis.Terminal) {
      coldBoot = false
      document.querySelector('#terminal').innerHTML = ''
    }

    globalThis.Terminal = term.create({
      fontFamily: "'Fira Mono', monospace",
      fontSize: 18,
      fontWeight: 900,
      theme: { background: '#121212' }
    })

    globalThis.Terminal.open(document.querySelector('#terminal'))
    globalThis.Terminal.fit()
    globalThis.Terminal.focus()

    if (coldBoot) kernel.boot()
    else {
      globalThis.Terminal.log('System terminal reloaded via HMR')
      globalThis.Terminal.prompt()

    }
  })
})

if (module.hot) {
  module.hot.accept()
}
