import path from 'path-browserify'
import colors, { blue } from 'ansi-colors'

import './www.css'

export const name = 'www'
export const args = ['url']
export const description = 'WWW Browser'
export const help = `
  ${colors.danger.bold('NOTICE:')} This app is not designed to be a full-featured browser,
  but rather a shell to load url-based apps within web3os.
  
  Insecure HTTP urls are not supported. Many sites such as Google will simply refuse to load in an iframe, as they should.

  However, it should work for any HTTPS resource that can be loaded in an iframe that doesn't explicitly forbid it.

  ${colors.blue.bold('BACK')} and ${colors.blue.bold('FORWARD')} buttons use history of ${colors.cyan.bold('typed')} addresses, not ${colors.yellow.bold('browsed')} addresses.

  Usage:
    www <url>         Open a window at <url>
`

export async function run (terminal, url) {
  const { kernel, log } = terminal
  let { fs } = kernel

  url = (!url || url === '') ? 'about:blank' : url

  const history = [url]
  let historyPosition = 0

  const browser = document.createElement('div')
  const toolbar = document.createElement('div')
  const addressBar = document.createElement('input')
  const buttonWrapper = document.createElement('div')
  const backIcon = document.createElement('mwc-icon')
  const forwardIcon = document.createElement('mwc-icon')
  const iframe = document.createElement('iframe')

  backIcon.style.color = 'darkslateblue'
  backIcon.textContent = 'arrow_back_ios'
  backIcon.title = 'Back'

  forwardIcon.style.color = 'darkslateblue'
  forwardIcon.textContent = 'arrow_forward_ios'
  forwardIcon.title = 'Forward'

  iframe.src = url
  addressBar.value = url

  toolbar.classList.add('web3os-www-browser-toolbar')
  addressBar.classList.add('web3os-www-browser-toolbar-addressbar-input')
  buttonWrapper.classList.add('web3os-www-browser-toolbar-button-wrapper')

  addressBar.addEventListener('focus', () => addressBar.select())
  addressBar.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      let newUrl = addressBar.value
      newUrl = newUrl.match(/^about\:/) ? newUrl :
                (newUrl.match(/^https?\:\/\//) ? newUrl : `https://${newUrl}`)

      history.push(newUrl)
      historyPosition = history.length - 1
      gotoHistory()
    }
  })

  const gotoHistory = () => {
    url = history[historyPosition]
    iframe.src = url
    addressBar.value = url
    appWindow.window.setTitle(`WWW: ${url}`)

    backIcon.style.color = historyPosition === 0 ? 'darkslateblue' : 'white'
    forwardIcon.style.color = historyPosition === history.length - 1 ? 'darkslateblue' : 'white'
    backIcon.style.cursor = historyPosition === 0 ? 'initial' : 'pointer'
    forwardIcon.style.cursor = historyPosition === history.length - 1 ? 'initial' : 'pointer'
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

  buttonWrapper.appendChild(backIcon)
  buttonWrapper.appendChild(forwardIcon)

  toolbar.appendChild(buttonWrapper)
  toolbar.appendChild(addressBar)

  browser.appendChild(toolbar)
  browser.appendChild(iframe)

  const appWindow = kernel.appWindow({
    mount: browser,
    title: `WWW: ${url}`,
    class: ['modern', 'web3os-www-browser'],
    right: '2%',
    width: '60%',
    height: '60%'
  })

  appWindow.window.body.style.margin = '0'
  appWindow.window.body.style.overflow = 'hidden'
}