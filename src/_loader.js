import 'regenerator-runtime/runtime'

import('./index').then(kernel => {
  globalThis.Kernel = kernel

  import('./terminal').then(term => {
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
  })
})

if (module.hot) {
  module.hot.accept()
}
