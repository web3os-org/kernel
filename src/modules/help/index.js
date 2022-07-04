import colors from 'ansi-colors'

export const name = 'help'
export const description = 'Prints this help information, or help for the specified command'
export const help = `
  Usage:
    help                       Shows default help information
    help [command]             Shows help information for the specified command
`

const commonCommands = ['ls', 'edit', 'help', 'clear', 'desktop', 'screensaver', 'reboot', 'read', 'account']

export async function run (term, context) {
  const { kernel, log } = term
  if (context !== '') return term.log(showHelp(term, context))

  return log(`
    ${colors.underline.info('Web3os Help:')}
    
    web3os has many commands, which you can browse by typing
    \t${colors.green('ls /bin')} or ${colors.blue('files /bin')}
    To learn more about a command, type
    \t${colors.green('help <command>')} or ${colors.blue('<command> --help')}

    ${colors.info('💾   Development:')}
    \tAll the cool shit happens over at ${colors.underline('https://github.com/web3os-org')}
    \tAlso check out the documentation at ${colors.underline('https://docs.web3os.sh')} or type ${colors.blue('docs')}

    ${colors.info('🚀   Quick Start:')}
    \t1. Browse the filesystem: ${colors.green('files')}
    \t2. Start the desktop: ${colors.green('desktop')}
    \t3. Interact with your wallets: ${colors.green('wallet')}
  `)
}

export function showHelp (term, command) {
  const cmd = term.kernel.modules[command]
  if (!cmd) return colors.danger('Cannot provide help for non-existent command')

  return (
    `${command} ${cmd.args ? colors.muted.italic(JSON.stringify(cmd.args)) : ''}\n\t${colors.muted(cmd.description)}` +
    (cmd.help ? `\n${cmd.help}` : '')
  )
}
