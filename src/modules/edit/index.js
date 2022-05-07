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
export const description = 'GUI File Editor'
export const help = `
  Usage:
    edit <filename>
`

let kernel

async function executeFile ({ filename, extension }) {
  try {
    switch (extension) {
      case '.js':
        await kernel.execute(`eval ${filename}`)
        break
      case '.sh':
        await kernel.executeScript(filename)
        break
    }

    return true
  } catch (err) {
    console.error(err)
    kernel.dialog({ title: 'Error executing file', text: err.message })
    return false
  }
}

async function saveFile ({ filename, mirror }) {
  try {
    kernel.fs.writeFileSync(filename, mirror.getValue())
    return true
  } catch (err) {
    console.error(err)
    kernel.dialog({ title: 'Error saving file', text: err.message })
    return false
  }
}

export async function run (terminal, filename) {
  kernel = terminal.kernel

  if (filename === '') filename = `/tmp/editor-${Math.random().toString(36).slice(2)}`
  if (!filename) return terminal.log(colors.danger('Invalid filename') + '\n' + help)
  filename =kernel.utils.path.resolve(terminal.cwd, filename)
  const fileParts =kernel.utils.path.parse(filename)
  const extension = fileParts.ext

  let mode, executable

  switch (extension) {
    case '.js':
      mode = 'javascript'
      executable = true
      break
    case '.json':
      mode = { name: 'javascript', mode: 'json' }
      break
    case '.yml':
      mode = 'yaml'
      break
    case '.sh':
      executable = true
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
    height: '75%',
    width: '100%'
  })

  const mirror = CodeMirror.fromTextArea(textarea, {
    mode,
    theme: 'the-matrix',
    lineNumbers: true,
    styleActiveLine: true,
    viewportMargin: Infinity,
    extraKeys: {
      'Ctrl-S': () => saveFile({ filename, mirror }),
      'Ctrl-R': () => executeFile({ filename, extension }),
      'Ctrl-Q': () => { appWindow.window.close(); terminal.focus() }
    }
  })

  appWindow.window.onresize = (width, height) => {
    mirror.refresh()
    mirror.focus()
  }

  const buttons = [
    {
      component: '<mwc-button slot="primaryAction" icon="save" raised>Save</mwc-button>',
      action: () => saveFile({ mirror, filename })
    },

    {
      component: '<mwc-button icon="help_outline">Help</mwc-button>',
      action: () => {
        kernel.dialog({
          title: 'Editor Help',
          html: `
            <p>
              <strong>Keyboard Shortcuts:</strong>
              <ul style='text-align:left'>
                <li>Ctrl+Q: Quit editor</li>
                <li>Ctrl+S: Save file</li>
                ${executable ? '<li>Ctrl+R: Save & Run</li>' : ''}
                <li>Ctrl+F: Search</li>
                <li>Alt+G: Jump to line number</li>
              </ul>
            </p>
          `
        })
      }
    }
  ]

  if (executable) {
    buttons.unshift({
      component: '<mwc-button icon="play_arrow" raised>Save &amp; Run</mwc-button>',
      action: async () => {
        await saveFile({ filename, mirror })
        await executeFile({ filename, extension })
      }
    })
  }

  const buttonWrapper = document.createElement('div')
  buttonWrapper.classList.add('app-actions')
  buttonWrapper.style.display = 'flex'
  buttonWrapper.style.justifyContent = 'flex-end'
  buttonWrapper.style.gap = '0.5rem'
  buttonWrapper.style.marginTop = '0.25rem'
  buttonWrapper.style.marginRight = '0.5rem'

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
