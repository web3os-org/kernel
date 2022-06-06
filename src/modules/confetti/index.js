import arg from 'arg'
import colors from 'ansi-colors'
import confetti from 'canvas-confetti'
import { parse as cliParse } from 'shell-quote'

export const name = 'confetti'
export const version = '0.1.0'
export const description = 'Confetti Gun'
export const help = `
  ${colors.magenta.bold('web3os Confetti Gun')}
  Powered by https://github.com/catdad/canvas-confetti

  Usage:
    confetti <options>          Fire the confetti gun

  Options:
    --angle <num:90>            The angle in which to launch the confetti (90° is up)
    --decay <num:0.9>           How quickly the confetti loses speed
    --drift <num:0>             How much the confetti will drift towards the side
    --gravity <num:1>           How quickly the confetti is pulled down
    --originx, -x <num:0.5>     X origin of confetti between 0 (left) and 1 (right)
    --originy, -y <num:0.5>     Y origin of confetti between 0 (top) and 1 (bottom)
    --particleCount <int:50>    Number of confetti particles
    --scalar <num:1>            Scale factor for each particle
    --spread <num:90>           How far confetti spreads from center
    --startVelocity <num:45>    How fast the confetti starts, in pixels
    --ticks <num:200>           How fast the confetti will disappear
    --zIndex, -z <num:1000000>  z-index of the confetti
`

export const spec = {
  '--angle': Number,
  '--decay': Number,
  '--drift': Number,
  '--gravity': Number,
  '--help': Boolean,
  '--originx': Number,
  '--originy': Number,
  '--particleCount': Number,
  '--scalar': Number,
  '--spread': Number,
  '--startVelocity': Number,
  '--ticks': Number,
  '--version': Boolean,
  '--zIndex': Number,

  '-x': '--originx',
  '-y': '--originy',
  '-z': '--zIndex'
}

export function execute (args) {
  confetti({
    disableForReducedMotion: true,
    angle: args['--angle'] || 90,
    decay: args['--decay'] || 0.9,
    drift: args['--drift'] || 0,
    gravity: args['--gravity'] || 1,
    origin: { x: args['--originx'] || 0.5, y: args['--originy'] || 1 },
    particleCount: args['--particleCount'] || 50,
    scalar: args['--scalar'] || 1,
    spread: args['--spread'] || 90,
    startVelocity: args['--startVelocity'] || 45,
    ticks: args['--ticks'] || 400,
    zIndex: args['--zIndex'] || 1000000
  })
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)
  return execute(args)
}
