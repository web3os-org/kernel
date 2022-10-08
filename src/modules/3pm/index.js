/**
 * Web3os Package Manager
 * @module @web3os-core/3pm
 * @description Manage installed packages
 * @author Jay Mathis <code@mathis.network>
 * @license MIT
 * @see https://github.com/web3os-org/kernel
 */

/* global fetch, localStorage */
/* eslint-disable no-new-func */

import arg from 'arg'
import colors from 'ansi-colors'
import { parse as cliParse } from 'shell-quote'

export let DefaultPackageRegistry = 'https://unpkg.com'

export const name = '3pm'
export const version = '0.1.0'
export const description = 'Web3os Package Manager'
export const help = `
  ${colors.blue('3pm')}: ${colors.green('The web3os package manager')}

  Usage:
    3pm <command> <args> [options]

  Commands:
    install <name>         Install (or update) package named <name> from the registry
    install <url>          Install (or update) package located at <url>
    ls                     List installed packages
    uninstall <name>       Uninstall package

  Options:
    --help                 Show this help message
    --main                 Override a package's main entrypoint
    --registry             Package registry {https://unpkg.com}
    --system               Install the package as a SystemJS module
    --umd                  Install the package as a UMD module
    --version              Show version information
`

const spec = {
  '--help': Boolean,
  '--main': String,
  '--registry': String,
  '--system': Boolean,
  '--umd': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}

let kernel = globalThis.Kernel
let terminal = globalThis.Terminal

/**
 * ModInfo Object
 * @typedef ModInfo
 * @property {string} name - Module name
 * @property {string} description - Module description
 * @property {string} help - Module help information
 * @property {string} url - Module URL
 * @property {string} pkgJson - Module package.json
 * @property {string} pkgJson.web3osData - Data specific to web3os
 */

/**
 * Install a package
 * @async
 * @param {!string} url - The package URL (or just package name to use default registry)
 * @param {Object=} args - The arguments for the installation
 * @param {boolean=} [args.warn=true] - Show the installation warning if the user has never seen it
 * @returns {Promise<(boolean|ModInfo)>} ModInfo or false on error
 */
export async function install (url, args = { warn: true }) {
  console.log({ url })
  const warned = localStorage.getItem('web3os_3pm_install_warning_hidden')
  if (!warned && args.warn) {
    localStorage.setItem('web3os_3pm_install_warning_hidden', true)
    terminal.log(`\n${colors.bgRed.white('WARNING')}: Do not install any packages unless you trust them completely.`)
    terminal.log(colors.bold(`All apps run in an inherently insecure context. ${colors.danger('This will be your last warning!')}`))
    terminal.log(colors.underline('Repeat the command to continue with the installation\n'))
    return false
  }

  if (typeof url === 'object') url = url.url || url.pattern
  if (!url) throw new Error('Invalid package name or URL')

  if (!/^(http|ftp).*\:/i.test(url)) url = `${args['--registry'] || kernel.get('3pm', 'default-package-registry') || DefaultPackageRegistry}/${url}`
  const pkgJson = await (await fetch(`${url}/package.json?t=${Math.random().toString(36)}`, { cache: 'no-store' })).json()
  const name = pkgJson.name
  const pkgName = name.split('/')
  const pkgBrowser = pkgJson.browser ? (typeof pkgJson.browser === 'string' ? pkgJson.browser : Object.values(pkgJson.browser)[0]) : null
  const pkgModule = pkgJson.module ? (typeof pkgJson.module === 'string' ? pkgJson.module : Object.values(pkgJson.module)[0]) : null
  const main = args['--main'] || pkgBrowser || pkgModule || pkgJson.main || 'index.js'
  const mainUrl = `${url}/${main}`

  let type = 'es'
  if (args['--umd']) type = 'umd'
  if (args['--system']) type = 'system'

  if (kernel.modules[name]) await uninstall(name)

  let mod
  try {
    switch (type) {
      case 'umd':
        mod = await kernel.importUMDModule(mainUrl)
        break
      case 'systemjs':
        mod = await globalThis.System.import(mainUrl)
        break
      default:
        mod = await import(/* webpackIgnore: true */ mainUrl)
    }
  } catch (err) {
    console.error('IMPORT ERROR:', err, { name, type, main, mod, pkgJson })
  }

  if (!mod) throw new Error('Failed to import module')

  if (pkgName.length > 1) {
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}`)
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}/${pkgName[1]}@${pkgJson.version}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}/${pkgName[1]}@${pkgJson.version}`)
  } else {
    if (!kernel.fs.existsSync(`/var/packages/${pkgName[0]}@${pkgJson.version}`)) kernel.fs.mkdirSync(`/var/packages/${pkgName[0]}@${pkgJson.version}`)
  }

  const pkgFolder = pkgName.length > 1 ? `/var/packages/${pkgName[0]}/${pkgName[1]}@${pkgJson.version}` : `/var/packages/${pkgName[0]}@${pkgJson.version}`
  pkgJson.web3osData = { pkgFolder, url, main, type }
  kernel.fs.writeFileSync(`${pkgFolder}/package.json`, JSON.stringify(pkgJson, null, 2), 'utf8')

  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const index = packages.indexOf(url)
  if (index > -1) packages.splice(index, 1)
  packages.push(`${pkgJson.name}@${pkgJson.version}`)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(packages, null, 2))

  const description = pkgJson.description || mod.description
  const help = pkgJson.help || mod?.help
  const modInfo = { description, help, name, url, pkgJson }
  await kernel.loadModule(mod, modInfo)
  await mod.web3osInstall?.(modInfo)

  kernel.notify.success(`Installed ${modInfo.name}@${pkgJson.version}`)
  return modInfo
}

/**
 * Uninstall a package
 * @async
 * @param {!string} name - The name of the package to uninstall
 * @returns {boolean} true if the package was uninstalled
 */
export async function uninstall (name) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => (new RegExp(`^${name}@`)).test(p))
  if (!pkg) throw new Error('Package not found')
  const pkgJson = JSON.parse(kernel.fs.readFileSync(`/var/packages/${pkg}/package.json`))
  const newPackages = packages.filter(p => p !== `${pkgJson.name}@${pkgJson.version}`)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(newPackages, null, 2))
  if (kernel.fs.existsSync(`/bin/${pkgJson.name}`)) kernel.fs.unlinkSync(`/bin/${pkgJson.name}`)
  // TODO: Delete package folder
  delete kernel.modules[pkgJson.name]
  return true
}

/**
 * Run the 3pm CLI
 * @async
 * @param {Web3osTerminal} term - The terminal to attach to
 * @param {string} context - The arguments string to parse
 * @returns {any} result of the command
 */
export async function run (term, context) {
  terminal = term
  kernel = term.kernel

  const args = arg(spec, { argv: cliParse(context) })
  const cmd = args._?.[0]

  if (args['--help']) return term.log(help)
  if (args['--version']) return term.log(version)

  try {
    switch (cmd) {
      case 'install':
        return await install(args._?.slice(1)[0], args)
      case 'ls':
        return await kernel.execute('cat /config/packages')
      case 'uninstall':
        return await uninstall(args._?.slice(1)[0], args)
      default:
        return term.log(help)
    }
  } catch (err) {
    console.error(err)
    term.log(err.message)
  }
}
