import 'js-dos'

export const name = 'wolfenstein'
export const version = '0.1.0'
export const description = 'Smash some Nazis'

export let gameURL = 'https://cdn.dos.zone/original/2X/a/ac888d1660aa253f0ed53bd6c962c894125aaa19.jsdos'

export async function run (term) {
  const { kernel } = term

  const wrapper = document.createElement('div')
  wrapper.classList.add('web3os-jsdos')

  const dosOptions = { hardware: window.hardware }
  const game = await Dos(wrapper, dosOptions).run(gameURL)

  const appWindow = kernel.appWindow({
    title: 'Wolfenstein 3D',
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
