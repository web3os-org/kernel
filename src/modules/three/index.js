import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

import 'animate.css'
import classes from './three.module.css'
import { speak } from '../speak'

export const name = 'three'
export const version = '0.2.0'
export const description = 'Three: The open source assistant for web3os'
export const help = `
  Usage:
    three                             Start Three
    three <command> [options]         Run a Three command

  Commands:
    move <x> <y>                      Move to specified coordinates; e.g. move 50% 50px
    say <text>                        Say the specified text

  Options:
    --help                            Print this help message
    --version                         Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

let kernel = globalThis.Kernel
let terminal = globalThis.Terminal

export let isAmorphous = true

function random (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getInstance () {
  return document.querySelector('#web3os-three-orb')
}

export function move (x, y) {
  const orb = getInstance()
  if (x) orb.style.left = x
  if (y) orb.style.top = y
}

export function animate (...styles) {
  const orb = getInstance()

  for (const cls of Array.from(orb.classList)) {
    if (cls !== 'animate__animated' && /^animate__/.test(cls)) {
      orb.classList.remove(cls)
    }
  }

  for (const style of styles) {
    setTimeout(() => orb.classList.add(`animate__${style}`), 0)
  }
}

export function setProperty (name, value) {
  document.documentElement.style.setProperty(name, value)
}

export async function angry (delay = 1000) {
  const orb = getInstance()

  const properties = {
    '--three-glow-inner': { new: '#eb4034' },
    '--three-glow-outer': { new: 'red' },
    '--three-glow-outer-left': { new: 'red' },
    '--three-glow-outer-right': { new: 'red' }
  }

  for (const prop of Object.keys(properties)) {
    properties[prop].old = getComputedStyle(document.documentElement).getPropertyValue(prop)
    setProperty(prop, properties[prop].new)
  }

  orb.style.color = 'white'
  orb.textContent = '!'
  animate('headShake')

  // Now calm down
  await Kernel.wait(delay)

  for (const prop of Object.keys(properties)) {
    setProperty(prop, properties[prop].old)
  }

  orb.style.color = 'rgba(0, 0, 0, 0.05)'
  orb.textContent = '3'
}

export function amorphous (enabled = true, delay = 50) {
  const orb = getInstance()
  clearInterval(orb.amorphousInterval)

  orb.style.borderTopLeftRadius = `50%`
  orb.style.borderTopRightRadius = `50%`
  orb.style.borderBottomLeftRadius = `50%`
  orb.style.borderBottomRightRadius = `50%`

  orb.amorphousInterval = enabled ? setInterval(() => {
    orb.style.borderTopLeftRadius = `${random(15, 80)}%`
    orb.style.borderTopRightRadius = `${random(15, 80)}%`
    orb.style.borderBottomLeftRadius = `${random(15, 80)}%`
    orb.style.borderBottomRightRadius = `${random(15, 80)}%`
  }, delay) : null
}

export async function createInstance () {
  const orb = document.createElement('figure')

  orb.id = 'web3os-three-orb'
  orb.textContent = '3'
  orb.draggable = true
  orb.classList.add(classes.orb, 'animate__animated')

  document.body.appendChild(orb)

  const dragStart = e => {
    let dragImage = document.createElement('div');
    dragImage.style.opacity = 0
    orb.style.transition = 'unset'
    e.dataTransfer?.setDragImage(dragImage, 0, 0)
    e.dataTransfer?.setData('text', 'three.orb')
  }

  const drag = e => {
    const coordinates = { x: null, y: null }
    coordinates.x = e.type === 'touchmove' ? e.changedTouches[0].pageX : e.clientX
    coordinates.y = e.type === 'touchmove' ? e.changedTouches[0].pageY : e.clientY
    if (coordinates.x === 0 && coordinates.y === 0) return
    move(`${coordinates.x - 25}px`, `${coordinates.y - 25}px`)
  }

  const dragEnd = e => {
    const { getUtterance, speak, voices } = Kernel.modules.speak

    orb.style.transition = ''
    const coordinates = { x: null, y: null }
    coordinates.x = e.type === 'touchend' ? e.changedTouches[0].pageX : e.clientX
    coordinates.y = e.type === 'touchend' ? e.changedTouches[0].pageY : e.clientY
    if (coordinates.x === 0 && coordinates.y === 0) return
    move(`${coordinates.x - 25}px`, `${coordinates.y - 25}px`)
    amorphous(true, 50)
    angry()

    if (
      coordinates.x >= window.innerWidth - 25
      || coordinates.y >= window.innerHeight - 25
      || coordinates.x <= 0
      || coordinates.y <= 0
    ) {
      console.log('Three is leaving')
      kernel.execute('speak --reset')
      say('Goodbye!')
      document.querySelector('#web3os-three-orb').remove()
    }
  }

  orb.ondragstart = dragStart
  orb.addEventListener('touchstart', dragStart)
  orb.ondragend = dragEnd
  orb.addEventListener('touchend', dragEnd)
  orb.ondrag = drag
  orb.addEventListener('touchmove', drag)

  orb.addEventListener('dblclick', () => {
    const hiding = orb.style.opacity === '' || orb.style.opacity === '1'

    if (hiding) orb.style.opacity = 0.3
    else orb.style.opacity = 1

    if (hiding) orb.style.backgroundColor = 'rgba(0, 200, 0, 0.3)'
    else orb.style.backgroundColor = 'inherit'

    if (hiding) orb.style.boxShadow = 'none'
    else orb.style.boxShadow = ''
  })

  amorphous(true)
  animate('zoomInUp')

  for await (const each of Array.from(Array(15).keys())) {
    move(random(10, 80) + '%', random(10, 80) + '%')
    await Kernel.wait(random(50, 100))
  }

  move('85%', '5%')

  return orb
}

export async function say (text) {
  if (kernel.get('three', 'disable-voice')) return
  let { getUtterance, speak, voices } = Kernel.modules.speak
  if (voices?.length === 0) voices = speechSynthesis.getVoices()

  const selectedVoice = Kernel.get('three', 'voice') || 'Google US English'
  const volume = parseFloat(Kernel.get('three', 'volume') || 2)
  const pitch = parseFloat(Kernel.get('three', 'pitch') || 0.2)
  const rate = parseFloat(Kernel.get('three', 'rate') || 1)
  const voice = voices.find(v => v.name.toLowerCase() === selectedVoice.toLowerCase())

  speak(getUtterance(text, voice, volume, pitch, rate))
}

export async function run (term, context) {
  let orb
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]
  terminal = args.terminal = term
  kernel = args.kernel = term.kernel

  if (!getInstance()) {
    orb = await createInstance()
    say("Welcome to web3 OS. I'm Three, and I'll be your guide.")
    say("There's lots to explore, so let's get started!")
    say("Just double tap me and I'll try to stay out of your way")
    say("Or you may also drag me to any edge and I'll go away")
  } else {
    orb = getInstance()
    orb.style.opacity = 1
    orb.style.backgroundColor = 'inherit'
    orb.style.boxShadow = ''
  }

  switch (cmd) {
    case 'move':
      return move(args._?.[1], args._?.[2])
    case 'say':
      return await say(args._?.[1])
    case undefined:
      return
    default:
      return term.log(help)
  }
}
