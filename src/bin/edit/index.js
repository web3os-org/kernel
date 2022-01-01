import path from 'path'
import colors from 'ansi-colors'
import CodeMirror from 'codemirror'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/yaml/yaml'

import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/jump-to-line'

import './edit.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/the-matrix.css'
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/matchesonscrollbar.css'

export const name = 'edit'
export const args = ['filename']
export const description = 'GUI File Editor'
export const help = `
  Usage:
    edit <filename>
`

export async function run (terminal, filename) {
  const { kernel, log } = terminal

  if (!filename || filename === '') return terminal.log(colors.danger('Invalid filename') + '\n' + help)
  filename = path.resolve(terminal.cwd, filename)
  const fileParts = path.parse(filename)
  const extension = fileParts.ext

  let mode

  switch (extension) {
    case '.js':
      mode = 'javascript'
      break
    case '.json':
      mode = { name: 'javascript', mode: 'json' }
      break
    case '.yml':
      mode = 'yaml'
      break
    default:
      mode = null
  }

  const content = document.createElement('div')
  const textarea = document.createElement('textarea')

  if (!kernel.fs.existsSync(filename)) kernel.fs.writeFileSync(filename, '')
  const value = kernel.fs.readFileSync(filename, 'utf8')
  textarea.value = value
  content.style.height = '100%'
  
  content.appendChild(textarea)

  const appWindow = kernel.appWindow({
    title: `Edit: ${filename}`,
    mount: content,
    right: '2%',
    minheight: '445px',
    minwidth: '310px'
  })

  const mirror = CodeMirror.fromTextArea(textarea, {
    mode,
    theme: 'the-matrix',
    lineNumbers: true,
    styleActiveLine: true,
    viewportMargin: Infinity,
    extraKeys: {
      'Ctrl-S': () => saveFile(),
      'Ctrl-Q': () => { appWindow.window.close(); terminal.focus() }
    }
  })

  appWindow.window.onresize = (width, height) => {
    mirror.refresh()
    mirror.focus()
  }

  const saveFile = dialog => {
    try {
      kernel.fs.writeFileSync(filename, mirror.getValue())
    } catch (err) {
      console.error(err)
      log(colors.danger(err.message))
      kernel.dialog({ title: 'Error Saving File', text: err.message })
    }
  }

  const buttons = [
    {
      component: `<mwc-button slot="primaryAction" icon="save" raised>Save</mwc-button>`,
      action: saveFile
    },

    {
      component: `<mwc-button icon="help_outline">Help</mwc-button>`,
      action: () => {
        kernel.dialog({
          title: 'Editor Documentation',
          html: `
            <p>
              <strong>Keyboard Shortcuts:</strong>
              <ul style='text-align:left'>
                <li>Ctrl+Q: Quit editor</li>
                <li>Ctrl+S: Save file</li>
                <li>Ctrl+F: Search</li>
                <li>Alt+G: Jump to line number</li>
              </ul>
            </p>
          `
        })
      }
    }
  ]

  const buttonWrapper = document.createElement('div')
  buttonWrapper.classList.add('app-actions')
  buttonWrapper.style.display = 'flex'
  buttonWrapper.style.justifyContent = 'flex-end'
  buttonWrapper.style.gap = '0.5rem'
  buttonWrapper.style.marginTop = '0.25rem'

  for (const button of buttons.reverse()) {
    const btn = document.createElement('div')
    btn.insertAdjacentHTML('beforeend', button.component)
    btn.firstChild.style = button.style || ''
    btn.firstChild.addEventListener('click', button.action)
    buttonWrapper.appendChild(btn)
  }

  content.appendChild(buttonWrapper)
  setTimeout(() => {
    mirror.refresh()
    mirror.focus()
  }, 200)  
}