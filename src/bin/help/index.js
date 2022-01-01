import colors from 'ansi-colors'

export const name = 'help'
export const args = ['command']
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

  log('')
  log(colors.underline.info('Web3os Help:'))
  log('')
  log(`web3os has many commands, which you can list by typing ${colors.green('ls /bin')}`)
  log(colors.muted('Learn more about web3os at https://docs.web3os.sh'))
  log('')
  log(`${colors.info('💾   Development:')}\n`)
  log(`\tAll the cool shit happens over at ${colors.underline('https://github.com/web3os-org')}`)
  log('')
  log(`${colors.info('🚀   Quick Start:')}\n`)
  log(`\t1. Connect your MetaMask account using the ${colors.green('account')} command`)
  log(`\t2. Check your coin balance with the ${colors.green('account balance')} command`)
  log(`\t3. Check your token balance with the ${colors.green('account balance <token>')} command`)
  log('')
  log(`${colors.info('🙌   Common Commands:')}\n`)

  Object.keys(kernel.bin).filter(key => commonCommands.includes(key)).sort().forEach(key => {
    const bin = kernel.bin[key]
    log(`\t${key} ${bin.args ? colors.muted.italic(JSON.stringify(bin.args)) : ''}\n\t\t${colors.muted(bin.description)}`)
  })

  log(`\n\nTo see all commands: ${colors.bgBlue.white('ls /bin')}`)
}

export function showHelp (term, command) {
  const cmd = term.kernel.bin[command]
  if (!cmd) return colors.danger('Cannot provide help for non-existent command')

  return (
    `${command} ${cmd.args ? colors.muted.italic(JSON.stringify(cmd.args)) : ''}\n\t${colors.muted(cmd.description)}` +
    (cmd.help ? `\n${cmd.help}` : '')
  )
}
