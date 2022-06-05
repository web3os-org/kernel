import 'winbox/dist/css/winbox.min.css'
import '../themes/default/window.css'
import WinBox from 'winbox/src/js/winbox.js'

const defaults = {
  class: 'web3os-window',
  title: 'Untitled Window',
  max: window.innerWidth < 768
}

class AppWindow {
  constructor (options = {}) {
    this.options = { ...defaults, ...options }
    this.window = new WinBox(this.options)
    return this
  }
}

export default AppWindow
