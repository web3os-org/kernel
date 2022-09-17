/**
 * Web3os Core Filesystem Modules
 *
 * @description Entrypoint for core filesystem modules
 * @author Jay Mathis <code@mathis.network>
 * @license MIT
 * @see https://github.com/web3os-org/kernel
*/

import bytes from 'bytes'
import colors from 'ansi-colors'
import columnify from 'columnify'

const fsModules = {}

export default async function ({ BrowserFS, fs, execute, modules, t, utils }) {
  fsModules.cwd = {
    description: t('kernel:fsModules.descriptions.cwd', 'Get the current working directory'),
    run: term => term.log(term.cwd)
  }

  fsModules.cd = {
    description: t('kernel:fsModules.descriptions.cd', 'Change the current working directory'),
    run: (term, context) => {
      const newCwd = utils.path.resolve(term.cwd, context)
      if (!fs.existsSync(newCwd)) throw new Error(`cd: ${context}: No such directory`)
      if (!fs.statSync(newCwd).isDirectory()) throw new Error(`cd: ${context}: No such directory`)
      term.cwd = newCwd
    }
  }

  fsModules.read = {
    description: t('kernel:fsModules.descriptions.read', 'Read contents of file'),
    run: (term, context) => {
      const dir = utils.path.resolve(term.cwd, context)
      if (!fs.existsSync(dir)) throw new Error(`read: ${dir}: No such file`)
      return term.log(fs.readFileSync(dir, 'utf8'))
    }
  }

  fsModules.upload = {
    description: t('kernel:fsModules.descriptions.upload', 'Upload files'),
    run: term => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('multiple', true)
      input.addEventListener('change', e => {
        const { files } = e.target
        for (const file of files) {
          const reader = new FileReader()

          reader.readAsArrayBuffer(file)
          reader.onload = () => {
            const buffer = BrowserFS.Buffer.from(reader.result)
            const filepath = utils.path.resolve(term.cwd, file.name)
            fs.writeFileSync(filepath, buffer)
            snackbar({ labelText: `Uploaded ${filepath}` })
          }
        }
      })

      input.click()
    }
  }

  fsModules.download = {
    description: t('kernel:fsModules.descriptions.download', 'Download URL to CWD, or download FILE to PC'),
    run: async (term, context) => {
      let filename = context
      if (!filename || filename === '') return log(colors.danger('Invalid filename'))

      if (/^(http|https|ftp|blob)\:/i.test(context) || /^blob/i.test(context)) {
        const url = new URL(context.split(' ')[0])
        filename = utils.path.parse(url.pathname).base
        if (context.split(' ')?.[1] && context.split(' ')[1] !== '') filename = context.split(' ')[1]
        const buffer = await (await fetch(url.href)).arrayBuffer()
        const data = BrowserFS.Buffer.from(buffer)
        console.log({ filename, data })
        fs.writeFileSync(utils.path.resolve(term.cwd, filename), data)
      } else {
        filename = utils.path.resolve(term.cwd, filename)
        const data = fs.readFileSync(filename)
        const file = new File([data], utils.path.parse(filename).base, { type: 'application/octet-stream' })
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = utils.path.parse(filename).base
        link.click()
      }
    }
  }

  fsModules.mkdir = {
    description: t('kernel:fsModules.descriptions.mkdir', 'Create a directory'),
    run: (term, context) => {
      if (!context || context === '') throw new Error(`mkdir: ${context}: Invalid directory name`)
      fs.mkdirSync(utils.path.resolve(term.cwd, context))
    }
  }

  fsModules.rm = {
    description: t('kernel:fsModules.descriptions.rm', 'Remove a file'),
    run: (term, context) => {
      const target = utils.path.resolve(term.cwd, context)
      if (!context || context === '') throw new Error(`rm: ${context}: Invalid path`)
      if (!fs.existsSync(target)) throw new Error(`rm: ${context}: No such file`)
      if (fs.statSync(target).isDirectory()) throw new Error(`rm: ${context}: Is a directory, use rmdir`)
      fs.unlinkSync(target)
    }
  }

  fsModules.rmdir = {
    description: t('kernel:fsModules.descriptions.rmdir', 'Remove a directory and all of its contents'),
    run: async (term, context) => {
      const target = utils.path.resolve(term.cwd, context)
      if (!context || context === '') throw new Error(`rmdir: ${context}: Invalid path`)
      if (!fs.existsSync(target)) throw new Error(`rmdir: ${context}: No such directory`)
      if (!fs.statSync(target).isDirectory()) throw new Error(`rmdir: ${context}: Is not a directory, use rm`)

      const entries = fs.readdirSync(target)
      if (entries.length === 0) return fs.rmdirSync(target)

      for (const entry of entries) {
        const entryPath = utils.path.join(target, entry)
        const entryStat = fs.statSync(entryPath)
        if (entryStat.isDirectory()) {
          await fsModules.rmdir.run(term, entryPath)
          await fsModules.rmdir.run(term, target)
        } else await fs.unlink(entryPath)
      }

      return fs.rmdirSync(target)
    }
  }

  fsModules.touch = {
    description: t('kernel:fsModules.descriptions.touch', 'Touch a file'),
    run: (term, context) => {
      const target = utils.path.resolve(term.cwd, context)
      if (!context || context === '') throw new Error(`touch: ${context}: Invalid path`)
      fs.appendFileSync(target, '')
    }
  }

  fsModules.mv = {
    description: t('kernel:fsModules.descriptions.mv', 'Move a file or directory'),
    run: (term, context) => {
      const [fromStr, toStr] = context.split(' ')
      const from = utils.path.resolve(term.cwd, fromStr)
      const to = utils.path.resolve(term.cwd, toStr)
      if (!fs.existsSync(from)) throw new Error(`mv: source ${from} does not exist`)
      if (fs.existsSync(to)) throw new Error(`mv: target ${to} already exists`)
      fs.renameSync(from, to)
    }
  }

  fsModules.cp = {
    description: t('kernel:fsModules.descriptions.cp', 'Copy a file or directory'),
    run: (term, context) => {
      const [fromStr, toStr] = context.split(' ')
      const from = utils.path.resolve(term.cwd, fromStr)
      const to = utils.path.resolve(term.cwd, toStr)
      if (!fs.existsSync(from)) throw new Error(`cp: source ${from} does not exist`)
      if (fs.existsSync(to)) throw new Error(`cp: target ${to} already exists`)
      fs.copySync(from, to)
    }
  }

  fsModules.ls = {
    description: t('kernel:fsModules.descriptions.ls', 'List directory contents'),
    run: (term, context) => {
      if (!context || context === '') context = term.cwd
      const entries = fs.readdirSync(utils.path.resolve(term.cwd, context)).sort()
      const data = []

      entries.forEach(entry => {
        const filename = utils.path.resolve(term.cwd, context, entry)
        const stat = fs.statSync(filename)
        const isNamespacedBin = stat.isFile() && /^\/bin\/.+\//.test(filename)

        const info = modules[filename.replace('/bin/', '')]
        if (isNamespacedBin && context !== 'bin') {
          data.push({
            name: colors.cyanBright(entry),
            description: colors.muted(info.description?.substr(0, 75) || '')
          })
        }

        let filetype
        if (!stat.isDirectory()) {
          switch (filename.split('.')?.pop()?.toLowerCase()) {
            case 'aac':
            case 'aiff':
            case 'flac':
            case 'mp3':
            case 'ogg':
            case 'pcm':
            case 'wav':
            case 'wma':
              filetype = 'audio'
              break
            case 'avi':
            case 'mov':
            case 'mkv':
            case 'mp2':
            case 'mp4':
            case 'webm':
              filetype = 'video'
              break
            case 'json':
              filetype = 'json'
              break
            case 'md':
              filetype = 'markdown'
              break
            case 'txt':
              filetype = 'text'
              break
            case 'bz':
            case 'gz':
            case 'tar':
            case 'xz':
            case 'zip':
              filetype = 'archive'
              break
            case 'js':
              filetype = 'javascript'
              break
            case 'sh':
              filetype = 'script'
              break
          }
        }

        // Show custom output for special dirs
        switch (utils.path.resolve(context)) {
          case '/bin':
            data.push({
              name: colors.cyanBright(entry),
              description: colors.muted(
                stat.isDirectory()
                  ? `${t('Packages in the')} ${entry} ${t('namespace')}`
                  : (modules[filename.replace('/bin/', '')]?.description?.substr(0, 50) || '')
              )
            })

            break
          case '/config':
            data.push({
              name: colors.cyanBright(entry),
              size: colors.muted(bytes(stat.size).toLowerCase()),
              description: colors.muted(t('Configuration'))
            })

            break
          default:
            if (!isNamespacedBin) {
              data.push({
                name: stat.isDirectory() ? colors.green('/' + entry) : colors.blue(entry),
                type: colors.muted.em(filetype ? filetype : (stat.isDirectory() ? 'directory' : 'file')),
                size: colors.muted(bytes(stat.size).toLowerCase())
              })
            }
        }
      })

      return term.log(columnify(data, {
        config: {
          name: { minWidth: 20 },
          type: { minWidth: 15 },
          size: { minWidth: 8 }
        }
      }))
    }
  }

  // FS command aliases
  fsModules.cat = { description: 'Alias of read', run: fsModules.read.run }
  fsModules.dir = { description: 'Alias of ls', run: fsModules.ls.run }
  fsModules.rename = { description: 'Alias of mv', run: fsModules.mv.run }

  return fsModules
}
