import 'js-dos'

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
    width: 1036,
    height: 657,
    onclose: () => { game.exit() },
    onresize: (width, height) => {
      if (height === 0) game.pause()
    }
  })

  appWindow.window.body.style.color = 'black'
}
