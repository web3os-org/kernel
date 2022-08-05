import arg from 'arg'
import { parse as cliParse } from 'shell-quote'

import locales from './locales'
const { t } = Kernel.i18n
Kernel.i18n.loadAppLocales(locales)

export const name = 'backup'
export const version = '0.1.0'
export const description = t('app:backup.description', 'Backup Utility')
export const help = `
  ${t('app:backup.helpHeading', 'Backup your web3os data')}

  ${t('Usage')}:
    backup <${t('command')}> [${t('options')}]

  ${t('Commands')}:
    download                    ${t('app:backup.helpCommandDownload', 'Download a complete backup')}
    upload                      ${t('app:backup.helpCommandUpload', 'Upload a complete backup')}

  ${t('Options')}:
    --help                      ${t('app:backup.helpOptionHelp', 'Display this help message')}
    --version                   ${t('app:wallet.helpOptionVersion', 'Display the version')}
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function execute (cmd, args) {
  switch (cmd) {
    default:
      return args.terminal.log?.(help)
  }
}

export function run (terminal = globalThis.Terminal, context) {
  const { kernel } = terminal
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = terminal
  args.kernel = kernel

  return execute(args._?.[0], args)
}
