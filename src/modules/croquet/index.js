import * as Croquet from '@croquet/croquet'
import arg from 'arg'
import { parse as cliParse } from 'shell-quote'
import { term } from '../account'

import { RootModel as RootModelSimpleAnimation, RootView as RootViewSimpleAnimation } from './apps/simple-animation'

const { t } = Kernel.i18n

export const name = '@web3os-apps/croquet'
export const version = ''
export const description = 'Croquet OS Utility'
export const help = `
  ${t('Powered by')} https://croquet.io

  ${t('Usage')}:
    croquet <${t('Command')}> <${t('Arguments')}> [${t('Options')}]

  ${t('Commands')}:
    ls                             ${t('app:croquet.helpCommandLs', 'List loaded Croquet applications')}
    run <${t('Name')}> [${t('Options')}]           ${t('app:croquet.helpCommandRun', 'Run the given Croquet application')}

  ${t('Options')}:
    --apiKey <${t('String')}>              ${t('app:croquet.helpOptionApiKey', "Croquet API key {kernel.get('croquet', 'apiKey')}")}
    --appId <${t('String')}>               ${t('app:croquet.helpOptionAppId', "Croquet application ID {kernel.get('croquet', 'appId')}")}
    --help                         ${t('app:croquet.helpOptionHelp', 'Display this help message')}
    --version                      ${t('app:croquet.helpOptionVersion', 'Display the version')}
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}

export const apps = [
  {
    name: 'simple-animation',
    description: t('app:croquet.appSimpleAnimationDescription', 'A simple animation synchronized with Croquet OS'),
    model: RootModelSimpleAnimation,
    view: RootViewSimpleAnimation
  }
]

export async function execute (cmd, args) {
  switch (cmd) {
    case 'ls':
      return await args.terminal.log(apps.map(app => app.name))
    case 'run':
      const app = apps.find(app => app.name === args._?.[1])
      const { model, view } = app
      const name = Croquet.App.autoSession()
      const password = Croquet.App.autoPassword()

      console.log({ name, password, args })

      return await Croquet.Session.join({
        apiKey: args['--apiKey'],
        appId: args['--appId'],
        name,
        password,
        model,
        view
      })
    default:
      return await args.terminal.log(help)
  }
}

export async function run (terminal = globalThis.Terminal, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return terminal.log(version)
  if (args['--help']) return terminal.log(help)

  args['--apiKey'] = args['--apiKey'] || terminal.kernel.get('croquet', 'apiKey')
  args['--appId'] = args['--appId'] || terminal.kernel.get('croquet', 'appId')

  args.terminal = terminal
  args.kernel = terminal.kernel

  return execute(args._?.[0], args)
}