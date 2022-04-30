import Gun from 'gun'
import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export let instance = new Gun()

export const name = 'gun'
export const version = '0.1.0'
export const description = 'Gun Decentralized Database'
export const help = `
  ${colors.magenta.bold('GunJS Decentralized Database Utility')}

  Usage:
    gun <command> [options]

  Examples:
    gun put hello "{\\"name\\": \\"world\\"}"
    gun get hello

  Commands:
    get <key>                                Get object
    put <key> <json>                         Put object

  Options:
    --help                                   Print this help message
    --version                                Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

function setupInstance (args = {}) {
  const defaults = {}
  const options = {...defaults, ...args}
  return new Gun(options)
}

export function get (key) {
  return new Promise((resolve, reject) => {
    try {
      instance.get(key).once(data => resolve(data))
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

export function put (key, data) {
  console.log('put', key, data)
  return new Promise((resolve, reject) => {
    try {
      instance.get(key).put(data, ack => {
        if (ack.err) return reject(ack.err)
        resolve(ack)
      })
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  const cmd = args._?.[0]
  const data = cmd === 'put' && args._?.[2] ? JSON.parse(args._?.[2]) : null

  switch (cmd) {
    case 'get':
      return term.log(await get(args._?.[1]))
    case 'put':
      return term.log(await put(args._?.[1], data))
    default:
      return term.log(help)
  }
}
