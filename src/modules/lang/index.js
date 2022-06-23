import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

import locales from './locales'
for (const [key, data] of Object.entries(locales)) Kernel.i18n.addResourceBundle(key, 'app', data, true)
const { t } = Kernel.i18n

export const name = 'lang'
export const version = '0.1.0'
export const description = t('app:lang.description', 'Internationalization Utility')

export const help = `
  ${t('Usage', 'Usage')}:
    lang                            ${t('app:lang.helpShowCurrentLanguage', 'Show the current system language')}
    lang <${t('language', 'Language')}>                 ${t('app:lang.helpSetLanguage', 'Set the system language')}

  ${t('Options', 'Options')}:
    --help                          ${t('printThisHelpMessage', 'Print this help message')}
    --version                       ${t('printVersionInformation', 'Print the version information')}
`

export const spec = {
  '--help': Boolean,
  '--version': Boolean
}

export async function run (term, context = '') {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)

  args.terminal = term

  if (context === '') return term.log(Kernel.i18n.language)
  Kernel.i18n.changeLanguage(context)
}
