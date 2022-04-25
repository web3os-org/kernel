import 'regenerator-runtime/runtime'

import('./index').then(kernel => {
  window.kernel = kernel
  import('./terminal').then(term => {
    window.terminal = term.create({
      fontFamily: "'Fira Mono', monospace",
      fontSize: 18,
      fontWeight: 900,
      theme: { background: '#121212' }
    })

    window.terminal.open(document.querySelector('#terminal'))
    window.terminal.fit()
    window.terminal.focus()

    kernel.boot()
  })
})

if (module.hot) {
  module.hot.accept()
}
