import arg from 'arg'
import CBOR from 'cbor'
import { parse as cliParse } from 'shell-quote'

export const devices = []

export const name = 'auth'
export const version = '0.1.0'
export const description = 'Web Authentication Utility'
export const help = `
  Manage user credentials with webauthn

  Usage:
    auth register <url>                Register with server at <url>
    auth login <url>                   Login to the server at <url>

  Options:
    --help                             Print this help message
    --version                          Print the version information
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function request (url) {
  const result = await (await fetch(url)).json()
  if (!result.rp || !result.challenge) return null

  const id = new ArrayBuffer(result.user.id.length)
  for (const [index, byte] of result.user.id.entries()) id[index] = byte

  const challenge = new ArrayBuffer(result.challenge.length)
  for (const [index, byte] of result.challenge.entries()) challenge[index] = byte

  const publicKey = { ...result, challenge, user: { ...result.user, id } }
  const cred = await navigator.credentials.create({ publicKey })
  console.log({ challenge, cred })

  const decoder = new TextDecoder('utf-8')
  const clientData = JSON.parse(decoder.decode(cred.response.clientDataJSON))
  console.log({ clientData })

  const attestationObject = CBOR.decode(cred.response.attestationObject)
  console.log({ attestationObject })

  // Credit to Suby Raman; this stuff gets complicated!
  // https://www.youtube.com/watch?v=MesXuMg0WKo
  const dataView = new DataView(new ArrayBuffer(2))
  const idLenBytes = attestationObject.authData.slice(53, 55)
  idLenBytes.forEach((value, index) => dataView.setUint8(index, value))
  const credentialIdLength = dataView.getUint16()

  const credentialId = attestationObject.authData.slice(55, credentialIdLength)
  const publicKeyBytes = attestationObject.authData.slice(55 + credentialIdLength)
  const publicKeyObject = CBOR.decode(publicKeyBytes.buffer)

  console.log({ publicKeyObject })
}

export async function execute (cmd, args) {
  switch (cmd) {
    case 'register':
      return request(args._?.[1], args)
    default:
      return args.terminal.log(help)
  }
}

export async function run (term, context = '') {
  if (!navigator.credentials) throw new Error(colors.danger('Client does not support the Web Authentication API'))

  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term
  return execute(args._?.[0], args)
}
