/* global FileReader */

import { ctxmenu } from 'ctxmenu'
import { lookup } from 'mime-types'

import './files.css'

export const name = 'files'
export const description = 'File Explorer'
export const help = `
  Usage:
    files <path>         Open a window at <url>
`

export let appWindow
let kernel = globalThis.Kernel
let history = []
let historyPosition = 0

async function loadFolder (browser, url) {
  browser.cloneNode(true) // Remove all event listeners

  const explorer = browser.querySelector('.web3os-files-explorer')
  const addressBar = browser.querySelector('.web3os-files-explorer-toolbar-addressbar-input')

  const upIcon = browser.querySelector('mwc-icon[title=Up]')
  const backIcon = browser.querySelector('mwc-icon[title=Back]')
  const forwardIcon = browser.querySelector('mwc-icon[title=Forward]')

  try {
    const files = kernel.fs.readdirSync(url)
    explorer.textContent = ''

    files.sort().forEach(file => {
      const fileData = { name: file }
      const location = kernel.utils.path.resolve(url, file)
      const stat = kernel.fs.statSync(location)

      fileData.type = stat.isDirectory() ? 'dir' : 'file'
      fileData.location = location

      const entry = document.createElement('div')
      entry.classList.add('web3os-files-explorer-entry')

      const icon = document.createElement('mwc-icon')
      const title = document.createElement('h1')

      let fileIcon
      switch (fileData.type) {
        case 'dir':
          fileIcon = 'folder'
          break
        default:
          fileIcon = 'text_snippet'
      }

      const extension = kernel.utils.path.extname(file)
      const mime = lookup(extension)
      const isBin = !!(!mime && fileData.type === 'file' && /^\/bin\//.test(fileData.location))

      switch (extension) {
        case '.js':
          fileIcon = 'javascript'
          break
        case '.sh':
          fileIcon = 'code'
          break
        case '.md':
          fileIcon = 'assignment'
          break
        case '.link':
          fileIcon = 'link'
          break
        case '.jpg':
        case '.png':
        case '.webp':
        case '.svg':
        case '.gif':
          fileIcon = 'image'
          break
      }

      switch (location) {
        case '/var':
        case '/config':
        case '/desktop':
        case '/usr':
        case '/var/packages':
          fileIcon = 'source'
          break
        case '/bin':
          fileIcon = 'folder_special'
          break
        case '/config/packages':
          fileIcon = 'apps'
          break
        case '/docs':
          fileIcon = 'snippet_folder'
          break
        case '/tmp':
          fileIcon = 'folder_delete'
          break
      }

      if (isBin) fileIcon = 'terminal'

      icon.textContent = fileIcon
      title.textContent = file
      entry.dataset.file = file
      icon.dataset.file = entry.dataset.file
      title.dataset.file = entry.dataset.file

      let divider = false
      let entryContextMenu = []
      const setAriaLabel = label => [icon, title].forEach(el => { el.setAttribute('aria-label', label) }) // .ariaLabel isn't yet supported in firefox

      switch (extension) {
        case '.js':
          divider = true
          setAriaLabel('Run script')
          entryContextMenu.push({ text: 'Run', action: () => kernel.execute(`eval ${location}`) })
          break
        case '.sh':
          divider = true
          setAriaLabel('Run script')
          entryContextMenu.push({ text: 'Run', action: () => kernel.execute(`sh ${location}`) })
          break
        case '.md':
          divider = true
          setAriaLabel('View Markdown')
          entryContextMenu.push({ text: 'View', action: () => kernel.execute(`markdown ${location}`) })
          break
        case '.link':
          divider = true
          setAriaLabel('Open link in new tab')
          entryContextMenu.push({
            text: 'Open',
            action: () => {
              try {
                const { url, useWeb3osBrowser } = JSON.parse(kernel.fs.readFileSync(location, 'utf8'))
                if (!useWeb3osBrowser) globalThis.open(url, '_blank')
                else kernel.execute(`www ${url}`)
              } catch (err) {
                console.error(err)
                kernel.dialog({ title: 'Error', text: err.message, icon: 'error' })
              }
            }
          })
          break
        case '.jpg':
        case '.png':
        case '.webp':
        case '.svg':
        case '.gif':
          divider = true
          setAriaLabel('View image')
          entryContextMenu.push({ text: 'View', action: () => kernel.execute(`view ${location}`) })
          break
      }

      if (icon.getAttribute('aria-label')) icon.classList.add('hint--right', 'hint--info')
      if (title.getAttribute('aria-label')) title.classList.add('hint--right', 'hint--info')
      if (divider) entryContextMenu.push({ isDivider: true })

      if (fileData.type !== 'dir') {
        entryContextMenu.push({
          text: 'Edit',
          action: () => kernel.execute(`edit ${location}`)
        })
      }

      entryContextMenu.push(
        {
          text: 'Delete',
          action: async () => {
            const { isConfirmed } = await kernel.dialog({
              title: `Delete ${location}?`,
              text: 'Are you sure you want to delete this file? It cannot be undone.',
              icon: 'error',
              reverseButtons: true,
              showDenyButton: true,
              denyButtonText: 'Cancel',
              confirmButtonText: 'Delete',
              confirmButtonColor: 'red',
              denyButtonColor: '#888'
            })

            if (isConfirmed) {
              if (fileData.type !== 'dir') await kernel.execute(`rm ${location}`)
              else await kernel.execute(`rmdir ${location}`)
              loadFolder(browser, url)
            }
          }
        }
      )

      if (isBin) {
        entryContextMenu = [
          {
            text: 'Run',
            action: () => kernel.execute(location)
          },
          {
            text: 'Run in new terminal',
            action: () => kernel.modules.desktop.launchTerminal({ startup: location })
          }
        ]
      }

      entry.addEventListener('contextmenu', e => {
        e.preventDefault()
        e.stopPropagation()
        ctxmenu.show(entryContextMenu, e.target.closest('.web3os-files-explorer-entry').querySelector('mwc-icon'))
      })

      entry.addEventListener('click', e => {
        const { file } = e.target.dataset

        const location = kernel.utils.path.resolve(addressBar.value, file)
        const stat = kernel.fs.statSync(location)
        const fileParts = kernel.utils.path.parse(file)
        const extension = fileParts.ext

        if (stat.isDirectory()) {
          history.push(location)
          historyPosition = history.length - 1
          addressBar.value = location
          return loadFolder(browser, location)
        }

        if (isBin) return kernel.execute(location) // && appWindow.window.minimize()

        const promptExecute = async allow => {
          const { isConfirmed } = await kernel.dialog({
            title: `Execute Script: ${location}`,
            text: 'Executing scripts can be dangerous. Are you sure?',
            icon: 'warning',
            showDenyButton: true,
            denyButtonColor: 'green',
            denyButtonText: 'Cancel',
            confirmButtonColor: 'red',
            confirmButtonText: 'Run'
          })

          if (isConfirmed) allow()
        }

        switch (extension) {
          case '.sh':
            return promptExecute(() => kernel.executeScript(location) && appWindow.window.minimize())
          case '.js':
            return promptExecute(() => kernel.execute(`eval ${location}`) && appWindow.window.minimize())
          case '.json':
          case '.txt':
            return kernel.execute(`edit ${location}`) && appWindow.window.minimize()
          case '.md':
            return kernel.execute(`markdown ${location}`) && appWindow.window.minimize()
          case '.link':
            try {
              const { url, useWeb3osBrowser } = JSON.parse(kernel.fs.readFileSync(location, 'utf8'))
              if (!useWeb3osBrowser) globalThis.open(url, '_blank')
              else { kernel.execute(`www ${url}`) && appWindow.window.minimize() }
            } catch (err) {
              console.error(err)
              kernel.dialog({ title: 'Error', text: err.message, icon: 'error' })
            }
            break
          default:
            if (mime && /^(image|video|audio|application\/pdf)/.test(mime)) return kernel.execute(`view ${location}`) && appWindow.window.minimize()
            kernel.execute("alert I'm not sure how to handle this file!")
        }
      })

      entry.appendChild(icon)
      entry.appendChild(title)

      explorer.appendChild(entry)
    })

    addressBar.value = url
    browser.appWindow.window.setTitle(`${url}`)

    upIcon.style.color = addressBar.value === '/' ? 'darkslateblue' : 'white'
    backIcon.style.color = historyPosition === 0 ? 'darkslateblue' : 'white'
    forwardIcon.style.color = historyPosition === history.length - 1 ? 'darkslateblue' : 'white'

    upIcon.style.cursor = addressBar.value === '/' ? 'initial' : 'pointer'
    backIcon.style.cursor = historyPosition === 0 ? 'initial' : 'pointer'
    forwardIcon.style.cursor = historyPosition === history.length - 1 ? 'initial' : 'pointer'
  } catch (err) {
    console.error(err)
    addressBar.style.color = 'red'
    kernel.execute('snackbar Invalid path')
  }
}

export async function run (terminal = globalThis.Terminal, url) {
  kernel = terminal.kernel || globalThis.Kernel
  url = (!url || url === '') ? '/' : url
  history = [url]
  historyPosition = 0

  const browser = document.createElement('div')
  const toolbar = document.createElement('div')
  const addressBar = document.createElement('input')
  const buttonWrapper = document.createElement('div')
  const backIcon = document.createElement('mwc-icon')
  const forwardIcon = document.createElement('mwc-icon')
  const upIcon = document.createElement('mwc-icon')
  const terminalIcon = document.createElement('mwc-icon')
  const explorer = document.createElement('div')

  backIcon.style.color = 'darkslateblue'
  backIcon.textContent = 'arrow_back_ios'
  backIcon.title = 'Back'

  forwardIcon.style.color = 'darkslateblue'
  forwardIcon.textContent = 'arrow_forward_ios'
  forwardIcon.title = 'Forward'

  upIcon.style.color = 'darkslateblue'
  upIcon.textContent = 'arrow_upward'
  upIcon.title = 'Up'

  terminalIcon.style.color = 'white'
  terminalIcon.style.cursor = 'pointer'
  terminalIcon.textContent = 'terminal'
  terminalIcon.title = 'Open Terminal Here'

  addressBar.value = url
  explorer.dataset.url = url

  browser.classList.add('web3os-files-browser')
  toolbar.classList.add('web3os-files-explorer-toolbar')
  addressBar.classList.add('web3os-files-explorer-toolbar-addressbar-input')
  buttonWrapper.classList.add('web3os-files-explorer-toolbar-button-wrapper')
  explorer.classList.add('web3os-files-explorer')

  addressBar.spellcheck = false
  addressBar.addEventListener('focus', () => addressBar.select())
  addressBar.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addressBar.style.color = 'white'
      const newUrl = addressBar.value
      history.push(newUrl)
      historyPosition = history.length - 1
      gotoHistory()
    }
  })

  const gotoHistory = () => {
    url = history[historyPosition]
    loadFolder(browser, url)
  }

  backIcon.addEventListener('click', () => {
    if (historyPosition === 0) return
    historyPosition--
    gotoHistory()
  })

  forwardIcon.addEventListener('click', () => {
    if (historyPosition === history.length - 1) return
    historyPosition++
    gotoHistory()
  })

  upIcon.addEventListener('click', () => {
    if (addressBar.value === '/') return
    const newUrl = kernel.utils.path.resolve(addressBar.value, '..')
    history.push(newUrl)
    historyPosition = history.length - 1
    gotoHistory()
  })

  terminalIcon.addEventListener('click', async () => {
    await kernel.modules.desktop.launchTerminal({ path: addressBar.value })
  })

  buttonWrapper.appendChild(backIcon)
  buttonWrapper.appendChild(forwardIcon)
  buttonWrapper.appendChild(upIcon)
  buttonWrapper.appendChild(terminalIcon)

  toolbar.appendChild(buttonWrapper)
  toolbar.appendChild(addressBar)

  browser.appendChild(toolbar)
  browser.appendChild(explorer)

  const dragstart = e => { e.dataTransfer.effectAllowed = 'copy' }
  const dragover = e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }
  const drop = e => {
    e.stopPropagation()
    e.preventDefault()
    const dt = e.dataTransfer
    const files = dt.files

    for (const file of files) {
      const reader = new FileReader()

      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        const buffer = kernel.BrowserFS.Buffer.from(reader.result)
        const filepath = kernel.utils.path.resolve(addressBar.value, file.name)
        kernel.fs.writeFileSync(filepath, buffer)
        kernel.snackbar({ labelText: `Uploaded ${filepath}` })

        loadFolder(browser, url)
      }
    }
  }

  browser.addEventListener('dragstart', dragstart)
  browser.addEventListener('dragover', dragover)
  browser.addEventListener('drop', drop)

  appWindow = kernel.windows.create({
    mount: browser,
    title: url,
    class: ['web3os-window', 'web3os-files-explorer-window'],
    height: '60%',
    width: '60%',
    x: 'center',
    y: 'center'
  })

  appWindow.window.body.style.margin = '0'
  appWindow.window.body.style.overflow = 'hidden'
  appWindow.window.body.style.color = '#121212'

  browser.appWindow = appWindow

  gotoHistory()
}
