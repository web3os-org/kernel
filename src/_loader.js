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

  import('./terminal').then(async term => {
    if (globalThis.Terminal) document.querySelector('#web3os-terminal').innerHTML = ''
    const bootArgs = new URLSearchParams(globalThis.location.search)

    globalThis.Terminal = term.default.create({
      fontFamily: bootArgs.get('fontFamily') || "'Fira Mono', monospace",
      fontSize: bootArgs.get('fontSize') || 18,
      fontWeight: bootArgs.get('fontWeight') || 900,
      theme: { background: bootArgs.get('themeBackground') || '#121212' }
    })

    console.log({ bootArgs, isMobile: kernel.isMobile })

    globalThis.Terminal.open(document.querySelector('#web3os-terminal'))
    if (!kernel.isMobile) globalThis.Terminal.loadWebglAddon() // webgl addon does weird things on small screens
    globalThis.Terminal.fit()
    globalThis.Terminal.focus()

    try {
      await kernel.boot()
    } catch (err) {
      console.error(err)
      Terminal.log(err.message)
      globalThis.alert?.(`Kernel Boot Error: ${err.message}`)
    }

    if (document.querySelector('#web3os-desktop')) document.querySelector('#web3os-terminal').style.display = 'none'
  })
})

if (module.hot) module.hot.accept()
