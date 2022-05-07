/* global fetch, localStorage */

import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export const DefaultPackageRegistry = 'https://unpkg.com'

export const name = 'wpm'
export const version = '0.1.0'
export const description = 'Web3os Package Manager'
export const help = `
  Usage:
    wpm <command> <args> [options]

  Commands:
    install <url>          Install the package located at <url>
    uninstall <name>       Uninstall package

  Options:
    --help                 Show this help message
    --main                 Override a package's main entrypoint
    --registry             Package registry {https://unpkg.com}
    --umd                  Install the package as a UMD module
    --version              Show version information
`

const spec = {
  '--help': Boolean,
  '--main': String,
  '--registry': String,
  '--umd': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}

let kernel = window.kernel
let terminal = window.terminal

const importUMD = async (url, module = {exports:{}}) =>
  (Function('module', 'exports', await (await fetch(url)).text()).call(module, module, module.exports), module).exports

export async function install (url, args = { warn: true }) {
  const warned = localStorage.getItem('web3os_wpm_install_warning_hidden')
  if (!warned && args.warn) {
    localStorage.setItem('web3os_wpm_install_warning_hidden', true)
    terminal.log(`\n${colors.bgRed.white('WARNING')}: Do not install any packages unless you trust them completely.`)
    terminal.log(colors.bold(`All apps run in an inherently insecure context. ${colors.danger('This will be your last warning!')}`))
    terminal.log(colors.underline('Repeat the command to continue with the installation\n'))
    return false
  }

  if (!url.match(/^http/i)) url = `${args['--registry'] || DefaultPackageRegistry}/${url}`

  const pkgJson = await (await fetch(`${url}/package.json`)).json()
  const name = pkgJson.name
  const pkgName = name.split('/')
  const main = args['--main'] || pkgJson.main || 'index.js'

  const mod = args['--umd']
    ? await importUMD(`${url}/${main}`)
    : await import(/* webpackIgnore: true */ `${url}/${main}`)

  console.log({ name, main, mod })

  if (pkgName.length > 1) {
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}`)
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}/${pkgName[1]}@${pkgJson.version}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}/${pkgName[1]}@${pkgJson.version}`)
  } else {
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}@${pkgJson.version}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}@${pkgJson.version}`)
  }

  const pkgFolder = pkgName.length > 1 ? `/var/packages/${pkgName[0]}/${pkgName[1]}@${pkgJson.version}` : `/var/packages/${pkgName[0]}@${pkgJson.version}`
  pkgJson.web3osData = { pkgFolder, url, main }
  kernel.fs.writeFileSync(`${pkgFolder}/package.json`, JSON.stringify(pkgJson, null, 2), 'utf8')
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const index = packages.indexOf(url)
  if (index > -1) packages.splice(index, 1)
  packages.push(`${pkgJson.name}@${pkgJson.version}`)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(packages, null, 2))
  await kernel.loadModule(mod, { name })
  return { mod, name, pkgJson, url }
}

export async function uninstall (name, args = {}) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.match(new RegExp(`^${name}@`)))
  if (!pkg) throw new Error('Package not found')
  const pkgJson = JSON.parse(kernel.fs.readFileSync(`/var/packages/${pkg}/package.json`))
  const newPackages = packages.filter(p => p !== `${pkgJson.name}@${pkgJson.version}`)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(newPackages, null, 2))
  if (kernel.fs.existsSync(`/bin/${pkgJson.name}`)) kernel.fs.unlinkSync(`/bin/${pkgJson.name}`)
  delete kernel.modules[pkgJson.name]
}

export async function update (name, args) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.exe === name)
  if (!pkg) throw new Error('Package not found')

  // const updatedPackages = packages.filter(p => p.exe !== pkg.exe)
  // const { name, exe, version, description } = fetchedPkg
  // updatedPackages.push({ name, exe, version, description, url: pkg.url })
  // kernel.fs.writeFileSync('/config/packages', JSON.stringify(updatedPackages, null, 2))
  // kernel.fs.writeFile(`/var/packages/${exe}`, code)

  // delete kernel.modules[exe]
  // kernel.loadPackage(exe)
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
      return await install(args._?.slice(1)[0], args)
    case 'uninstall':
      return await uninstall(args._?.slice(1)[0], args)
    case 'update':
      return await update(args._?.slice(1)[0], args)
    default:
      return term.log(help)
  }
}
