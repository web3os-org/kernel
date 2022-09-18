import colors from 'ansi-colors'
import locales from './locales'

const { t } = Kernel.i18n
Kernel.i18n.loadAppLocales(locales)

export const name = 'help'
export const description = t('app:help.description', 'Prints this help information, or help for the specified command')
export const help = `
  ${t('Usage')}:
    help                       ${t('app:help.showDefaultHelpInformation', 'Shows default help information')}
    help [command]             ${t('app:help.showCommandHelpInformation', 'Shows help information for the specified command')}
`

const commonCommands = ['ls', 'edit', 'help', 'clear', 'desktop', 'screensaver', 'reboot', 'read', 'account']

export async function run (term, context) {
  const { kernel, log } = term
  if (context !== '') return term.log(showHelp(term, context))

  return log(`
    ${colors.underline.info(`Web3os ${t('Help')}:`)}
    
    ${t('web3os has many commands, which you can browse by typing')}
    \t${colors.green('ls /bin')} ${t('or')} ${colors.blue('files /bin')}
    \n\t${t('To learn more about a command, type')}
    \t${colors.green(`help <${t('Command')}>`)} ${t('or')} ${colors.blue(`<${t('Command')}> --help`)} ${t('or')} ${colors.blue(`${t('lsmod')}`)}

    ${colors.info(`💾   ${t('Development')}:`)}
    \t${t('All the cool shit happens over at')} ${colors.underline('https://github.com/web3os-org/kernel')}
    \t${t('Also check out the documentation at')} ${colors.underline('https://docs.web3os.sh')} ${t('or type')} ${colors.blue('docs')}

    ${colors.info(`🚀   ${t('Quick Start')}:`)}
    \t1. ${t('Browse the filesystem')}: ${colors.green('files')}
    \t2. ${t('Start the desktop')}: ${colors.green('desktop')}
    \t3. ${t('Interact with your wallets')}: ${colors.green('wallet')}
  `)
}

export function showHelp (term, command) {
  const cmd = term.kernel.modules[command]
  if (!cmd) return colors.danger(t('Cannot provide help for non-existent command'))

  return (
    `${command} ${cmd.args ? colors.muted.italic(JSON.stringify(cmd.args)) : ''}\n\t${colors.muted(cmd.description)}` +
    (cmd.help ? `\n${cmd.help}` : '')
  )
}
