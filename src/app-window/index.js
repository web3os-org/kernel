import 'winbox/dist/css/winbox.min.css'
import 'winbox/dist/css/themes/modern.min.css'
import WinBox from 'winbox/src/js/winbox.js'

const defaults = {
  class: 'modern',
  title: 'Untitled Window'
}

class AppWindow {
  constructor (options = {}) {
    this.options = {...defaults, ...options}
    this.window = new WinBox(this.options)
    return this
  }
}

export default AppWindow
