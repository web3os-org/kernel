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
    
    web3os has many commands, which you can list by typing ${colors.green('ls /bin/@web3os-core')} or ${colors.blue('files /bin/@web3os-core')}
    To learn more about a command, type ${colors.green('help <command>')}

    ${colors.info('💾   Development:')}
    \tAll the cool shit happens over at ${colors.underline('https://github.com/web3os-org')}

    ${colors.info('🚀   Quick Start:')}
    \t1. Connect your MetaMask account using the ${colors.green('account connect')} command
    \t2. Check your coin balance with the ${colors.green('account balance')} command
    \t3. Check your token balance with the ${colors.green('account balance <token>')} command
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
