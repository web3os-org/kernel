/* Inspired by https://codepen.io/yaclive/pen/EayLYO */

let canvas
let interval
let endScreensaverFn

export async function exit () {
  clearInterval(interval)
  canvas.remove()
  endScreensaverFn()
}

export default async function ({ endScreensaver }) {
  if (document.getElementById('screensaver')) return false

  endScreensaverFn = endScreensaver
  canvas = document.createElement('canvas')
  canvas.id = 'screensaver'
  canvas.width = globalThis.innerWidth
  canvas.height = globalThis.innerHeight
  canvas.style.position = 'absolute'
  canvas.style.top = 0
  canvas.style.left = 0
  canvas.style.zIndex = Number.MAX_SAFE_INTEGER

  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops = Array(columns).fill(1)
  const chars = '01~!#$%^&*()_+=-[]{}\\|;:",./<>?ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ'.split('')
  ctx.font = ctx.font.replace(/\d+px/, `${fontSize}px`);

  const animatrix = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const [x, y] of drops.entries()) {
      ctx.fillStyle = '#0f0'
      const char = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(char, x * fontSize, y * fontSize)
      drops[x]++
      if (y * fontSize > canvas.height && Math.random() > 0.95) drops[x] = 0
    }
  }

  interval = setInterval(animatrix, 33)
  canvas.addEventListener('click', exit)
}
