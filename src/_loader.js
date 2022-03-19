import 'regenerator-runtime/runtime'

import('./index').then(kernel => {
  window.kernel = kernel
  import('./terminal').then(term => {
    window.terminal = term.create({
      fontFamily: `'Fira Mono', monospace`,
      fontSize: 18,
      fontWeight: 900,
      theme: { background: '#121212' }
    })
  
    terminal.open(document.querySelector('#terminal'))
    terminal.fit()
    terminal.focus()

    kernel.boot()
  })
})

if (module.hot) {
  module.hot.accept(e => {
    console.log('hmr:accept', e)
  })
}
