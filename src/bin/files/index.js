import path from 'path'
import colors from 'ansi-colors'
import { ctxmenu } from 'ctxmenu'
import sweetalert from 'sweetalert2'

import './files.css'

export const name = 'files'
export const args = ['path']
export const description = 'File Explorer'
export const help = `
  Usage:
    files <path>         Open a window at <url>
`

let term
let kernel
let history = []
let historyPosition = 0

async function loadFolder (browser, url) {
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
      const location = path.resolve(url, file)
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

      const extension = path.extname(file)
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
        case '/bin':
        case '/var/packages':
          fileIcon = 'source'
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

      icon.textContent = fileIcon
      title.textContent = file
      entry.dataset.file = file
      icon.dataset.file = entry.dataset.file
      title.dataset.file = entry.dataset.file

      const entryContextMenu = [
        {
          text: 'Edit',
          action: () => kernel.execute(`edit ${location}`)
        },
        { isDivider: true },
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
              await kernel.execute(`rm ${location}`)
              loadFolder(browser, url)
            }
          }
        }
      ]
  
      entry.addEventListener('contextmenu', e => {
        e.preventDefault()
        e.stopPropagation()
        ctxmenu.show(entryContextMenu, e.target)
      })
  
      entry.addEventListener('click', e => {
        const { file } = e.target.dataset

        const location = path.resolve(addressBar.value, file)
        const stat = kernel.fs.statSync(location)
        const fileParts = path.parse(file)
        const extension = fileParts.ext
  
        if (stat.isDirectory()) {          
          history.push(location)
          historyPosition = history.length - 1
          addressBar.value = location
          return loadFolder(browser, location)
        }

        const promptExecute = async allow => {
          const { isConfirmed } = await kernel.dialog({
            title: `Execute Script: ${location}`,
            text: `Executing scripts can be dangerous. Are you sure?`,
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
            return promptExecute(() => kernel.executeScript(location))
          case '.js':
            return promptExecute(() => kernel.execute(`eval ${location}`))
          case '.txt':
            return kernel.execute(`edit ${location}`)
          case '.md':
            return kernel.execute(`markdown ${location}`)
          case '.jpg':
          case '.png':
          case '.webp':
          case '.svg':
          case '.gif':
            return kernel.execute(`view ${location}`)
          default:
            kernel.execute(`alert I'm not sure how to handle this file!`)
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

    upIcon.style.cursor = addressBar.value === '/' ? 'initial': 'pointer'
    backIcon.style.cursor = historyPosition === 0 ? 'initial' : 'pointer'
    forwardIcon.style.cursor = historyPosition === history.length - 1 ? 'initial' : 'pointer'
  } catch (err) {
    console.error(err)
    addressBar.style.color = 'red'
    kernel.execute('snackbar Invalid path')
  }
}

export async function run (terminal, url) {
  term = terminal
  kernel = terminal.kernel

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
      addressBar.style.color = '#121212'
      let newUrl = addressBar.value
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
    let newUrl = path.resolve(addressBar.value, '..')
    history.push(newUrl)
    historyPosition = history.length - 1
    gotoHistory()
  })

  buttonWrapper.appendChild(backIcon)
  buttonWrapper.appendChild(forwardIcon)
  buttonWrapper.appendChild(upIcon)

  toolbar.appendChild(buttonWrapper)
  toolbar.appendChild(addressBar)

  browser.appendChild(toolbar)
  browser.appendChild(explorer)

  const appWindow = kernel.appWindow({
    mount: browser,
    title: url,
    class: ['modern', 'web3os-files-explorer'],
    right: '2%',
    height: '60%',
    minwidth: '60%',
    x: 'center',
    y: 'center'
  })

  appWindow.window.body.style.margin = '0'
  appWindow.window.body.style.overflow = 'hidden'

  browser.appWindow = appWindow

  gotoHistory()
}
