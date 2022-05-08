export default async function ({ listenForKeypress }) {
  if (document.getElementById('screensaver')) return false
  const canvas = document.createElement('canvas')
  canvas.id = 'screensaver'
  canvas.width = globalThis.innerWidth
  canvas.height = globalThis.innerHeight
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
