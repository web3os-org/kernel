/**
 * Web3os Loader
 * @description The web3os bootloader
 * @module @web3os-core/_loader
 * @author Jay Mathis <code@mathis.network>
 * @license MIT
 * @see https://github.com/web3os-org/kernel
 */

import 'regenerator-runtime/runtime'

import('./kernel').then(kernel => {
  if (!globalThis.Kernel) {
    const term = document.createElement('div')
    term.id = 'web3os-terminal'
    document.body.appendChild(term)
  }

  globalThis.Kernel = kernel

  import('./terminal').then(term => {
    if (globalThis.Terminal) document.querySelector('#web3os-terminal').innerHTML = ''

    globalThis.Terminal = term.default.create({
      fontFamily: "'Fira Mono', monospace",
      fontSize: 18,
      fontWeight: 900,
      theme: { background: '#121212' }
    })

    globalThis.Terminal.open(document.querySelector('#web3os-terminal'))
    globalThis.Terminal.fit()
    globalThis.Terminal.focus()

    kernel.boot()

    if (document.querySelector('#web3os-desktop')) document.querySelector('#web3os-terminal').style.display = 'none'
  })
})

if (module.hot) module.hot.accept()
