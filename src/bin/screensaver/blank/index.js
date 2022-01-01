export default async function ({ listenForKeypress }) {
  const canvas = document.createElement('canvas')
  canvas.id = 'screensaver'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.position = 'absolute'
  canvas.style.top = 0
  canvas.style.left = 0
  canvas.style.zIndex = 1000000

  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const exit = () => canvas.remove()
  canvas.addEventListener('click', exit)
  listenForKeypress(exit)
}
