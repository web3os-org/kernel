/* global fetch, localStorage */

import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const name = 'wpm'
export const version = '0.1.0'
export const description = 'web3os Package Manager'
export const help = `
  Usage:
    ${colors.blue('Installation URL Examples:')}
    https://unpkg.com/@web3os-org/sample.snowpack

    wpm install <url>         Install the package located at <url>
    wpm update <name>         Update package
    wpm uninstall <name>      Uninstall package
`

const spec = {
  '--help': Boolean,
  '--version': Boolean,

  '-h': '--help',
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
  const pkgJson = await (await fetch(`${url}/package.json`)).json()
  const pkgName = pkgJson.name.split('/')
  const main = pkgJson.main || 'index.js'
  const mod = await import(/* webpackIgnore: true */ `${url}/${main}`)

  if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}`)
  if (pkgName.length > 1) {
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}/${pkgName[1]}`)) {
      kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}/${pkgName[1]}`)
    }
  }

  const pkgFolder = pkgName.length > 1 ? `/var/packages/${pkgName[0]}/${pkgName[1]}` : `/var/packages/${pkgName[0]}`
  pkgJson.web3osData = { pkgFolder, url }
  kernel.fs.writeFileSync(`${pkgFolder}/package.json`, JSON.stringify(pkgJson, null, 2), 'utf8')
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  packages.push(pkgJson.name)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(packages, null, 2))
  kernel.addBin(mod)
}

export async function uninstall (args) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.name === args[0])
  if (!pkg) throw new Error('Package not found')

  const pkgJson = JSON.parse(kernel.fs.readFileSync(`/var/packages/${pkg}/package.json`))

  const newPackages = packages.filter(p => p.name !== pkgJson.name)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(newPackages, null, 2))
  kernel.fs.unlinkSync(`/var/packages/${pkgJson.web3osData.pkgFolder}/package.json`)
  kernel.fs.unlinkSync(`/bin/${pkgJson.name}`)
  delete kernel.bin[pkgJson.name]
}

export async function update (args) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.exe === args[0])
  if (!pkg) throw new Error('Package not found')

  return

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

  const args = arg(spec, { argv: cliParse(context) })
  const cmd = args._?.[0]

  if (args['--help']) return term.log(help)
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
