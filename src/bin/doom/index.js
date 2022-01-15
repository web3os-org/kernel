import 'js-dos'
import 'js-dos/dist/js-dos.css'

export const name = 'doom'
export const version = '0.1.0'
export const description = 'Classic space-marine bang-bang'

export let gameURL = 'https://cdn.dos.zone/custom/dos/doom.jsdos'

export async function run (term) {
  const { kernel } = term

  const wrapper = document.createElement('div')
  wrapper.classList.add('web3os-jsdos')

  const dosOptions = { hardware: window.hardware }
  const game = await Dos(wrapper, dosOptions).run(gameURL)

  const appWindow = kernel.appWindow({
    title: 'Doom',
    mount: wrapper,
    max: true
  })

  appWindow.window.onclose = () => { game.exit() }
  appWindow.window.body.style.color = 'black'
}
