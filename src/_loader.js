import 'regenerator-runtime/runtime'

import('./index').then(kernel => {
  globalThis.Kernel = kernel

  import('./terminal').then(term => {
    if (globalThis.Terminal) document.querySelector('#terminal').innerHTML = ''

    globalThis.Terminal = term.create({
      fontFamily: "'Fira Mono', monospace",
      fontSize: 18,
      fontWeight: 900,
      theme: { background: '#121212' }
    })

    globalThis.Terminal.open(document.querySelector('#terminal'))
    globalThis.Terminal.fit()
    globalThis.Terminal.focus()

    kernel.boot()

    if (document.querySelector('#web3os-desktop')) document.querySelector('#terminal').style.display = 'none'
  })
})

if (module.hot) module.hot.accept()
