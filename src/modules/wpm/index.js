/* global fetch, localStorage */
/* eslint-disable no-new-func */

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
    install <name>         Install package named <name>
    install <url>          Install package located at <url>
    uninstall <name>       Uninstall package
    update <name>          Update package

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

export async function install (url, args = { warn: true }) {
  const warned = localStorage.getItem('web3os_wpm_install_warning_hidden')
  if (!warned && args.warn) {
    localStorage.setItem('web3os_wpm_install_warning_hidden', true)
    terminal.log(`\n${colors.bgRed.white('WARNING')}: Do not install any packages unless you trust them completely.`)
    terminal.log(colors.bold(`All apps run in an inherently insecure context. ${colors.danger('This will be your last warning!')}`))
    terminal.log(colors.underline('Repeat the command to continue with the installation\n'))
    return false
  }

  if (typeof url === 'object') url = url.url || url.pattern
  if (!url) throw new Error('Invalid package name or URL')

  if (!url.match(/^(http|ftp).*\:/i)) url = `${args['--registry'] || DefaultPackageRegistry}/${url}`
  const pkgJson = await (await fetch(`${url}/package.json?t=${Math.random().toString(36)}`, { cache: 'no-store' })).json()
  const name = pkgJson.name
  const pkgName = name.split('/')
  const main = args['--main'] || pkgJson.browser || pkgJson.module || pkgJson.main || 'index.js'
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

  kernel.execute(`snackbar Installed ${modInfo.name}@${pkgJson.version}`)
  return modInfo
}

export async function uninstall (name, args = {}) {
  const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
  const pkg = packages.find(p => p.match(new RegExp(`^${name}@`)))
  if (!pkg) throw new Error('Package not found')
  const pkgJson = JSON.parse(kernel.fs.readFileSync(`/var/packages/${pkg}/package.json`))
  const newPackages = packages.filter(p => p !== `${pkgJson.name}@${pkgJson.version}`)
  kernel.fs.writeFileSync('/config/packages', JSON.stringify(newPackages, null, 2))
  if (kernel.fs.existsSync(`/bin/${pkgJson.name}`)) kernel.fs.unlinkSync(`/bin/${pkgJson.name}`)
  // TODO: Delete package folder
  delete kernel.modules[pkgJson.name]
}

export async function update (name, args) {
  return await install(name, args)
}

// export async function update (name, args) {
//   const packages = JSON.parse(kernel.fs.readFileSync('/config/packages', 'utf8'))
//   const nameRegex = new RegExp(`^${name}@`)
//   const pkg = packages.find(p => p.match(nameRegex))
//   console.log({ packages, pkg, name })
//   if (!pkg) throw new Error('Package not found')

//   const installedPkgJson = JSON.parse(kernel.fs.readFileSync(`/var/packages/${pkg}/package.json`))
//   const { web3osData } = installedPkgJson
//   console.log({ web3osData })
//   const candidatePkgJson = await (await fetch(`${web3osData.url}/package.json?t=${Math.random().toString(36)}`, { cache: 'no-store' })).json()

//   const { version: installedVersion } = installedPkgJson
//   const { version: candidateVersion } = candidatePkgJson

//   console.log({ installedVersion, candidateVersion })
//   if (installedVersion === candidateVersion) throw new Error('Package is already up-to-date')

//   await uninstall(name)

//   const main = candidatePkgJson.web3osData?.main || candidatePkgJson.main || 'index.js'
//   const type = candidatePkgJson.web3osData?.type || 'es'
//   const mainUrl = `${DefaultPackageRegistry}/${main}`

//   let mod
//   try {
//     switch (type) {
//       case 'umd':
//         mod = await kernel.importUMDModule(mainUrl)
//         break
//       case 'systemjs':
//         mod = await globalThis.System.import(mainUrl)
//         break
//       default:
//         mod = await import(/* webpackIgnore: true */ mainUrl)
//     }

//     console.log({ main, type, mod })
//   } catch (err) {
//     console.error('IMPORT ERROR:', err, { name, type, main, mod })
//   }

//   // const updatedPackages = packages.filter(p => p.exe !== pkg.exe)
//   // const { name, exe, version, description } = fetchedPkg
//   // updatedPackages.push({ name, exe, version, description, url: pkg.url })
//   // kernel.fs.writeFileSync('/config/packages', JSON.stringify(updatedPackages, null, 2))
//   // kernel.fs.writeFile(`/var/packages/${exe}`, code)

//   // delete kernel.modules[exe]
//   // kernel.loadPackage(exe)
// }

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
