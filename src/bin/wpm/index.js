import arg from 'arg'
import path from 'path'
import colors from 'ansi-colors'

export const name = 'wpm'
export const version = '0.1.0'
export const description = 'web3os Package Manager'
export const help = `
  Usage:
    ${colors.blue('Installation URL Examples:')}
      ${colors.muted('https://wpm.web3os.sh/demo-app')}
      ${colors.muted('http://localhost:5500/dist')}

    wpm install <url>         Install the package located at <url>
    wpm update <name>         Update package
    wpm uninstall <name>      Uninstall package
`

const spec = {
  '--version': Boolean,
  '-v': '--version'
}

let kernel
let terminal

export async function install (args) {
  const warned = localStorage.getItem('web3os_wpm_install_warning_hidden')
  if (!warned) {
    localStorage.setItem('web3os_wpm_install_warning_hidden', true)
    terminal.log(`\n${colors.bgRed.white('WARNING')}: Do not install any packages unless you trust them completely.`)
    terminal.log(colors.bold(`All apps run in an inherently insecure context. ${colors.danger('This will be your last warning!')}`))
    terminal.log(colors.underline('Repeat the command to continue with the installation\n'))
    return false
  }

  const url = args[0]
  const pkg = await (await fetch(url + '/package.json')).json()
  const code = await (await fetch(url + '/index.js')).text()

  if (kernel.bin[pkg.exe]) throw new Error(`There is already an app named: ${pkg.exe}`)
  kernel.fs.writeFile(`/var/packages/${pkg.exe}`, code)

  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf-8'))
  if (packages.some(p => p.exe === pkg.exe)) throw new Error(`There is already an app named: ${pkg.exe}`)

  const { name, exe, version, description } = pkg
  packages.push({ name, exe, version, description, url })
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(packages, null, 2))
  await kernel.loadPackage(exe)
}

export async function uninstall (args) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.exe === args[0])
  if (!pkg) throw new Error('Package not found')

  const newPackages = packages.filter(p => p.exe !== pkg.exe)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(newPackages, null, 2))
  kernel.fs.unlinkSync(`/var/packages/${pkg.exe}`)
  kernel.fs.unlinkSync(`/bin/${pkg.exe}`)
  delete kernel.bin[pkg.exe]
}

export async function update (args) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.exe === args[0])
  if (!pkg) throw new Error('Package not found')

  const fetchedPkg = await (await fetch(pkg.url + '/package.json')).json()
  if (pkg.version >= fetchedPkg.version) throw new Error('Package is already up-to-date')
  const code = await (await fetch(pkg.url + '/index.js')).text()

  const updatedPackages = packages.filter(p => p.exe !== pkg.exe)
  const { name, exe, version, description } = fetchedPkg
  updatedPackages.push({ name, exe, version, description, url: pkg.url })
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(updatedPackages, null, 2))
  kernel.fs.writeFile(`/var/packages/${exe}`, code)

  delete kernel.bin[exe]
  kernel.loadPackage(exe)
}

export async function run (term, context) {
  terminal = term
  kernel = term.kernel

  const args = arg(spec, { argv: context.split(' ') })
  const cmd = args._?.[0]

  if (args['--version']) return term.log(version)

  switch (cmd) {
    case 'install':
      return await install(args._?.slice(1))
    case 'uninstall':
      return await uninstall(args._?.slice(1))
    case 'update':
      return await update(args._?.slice(1))
  }
}
