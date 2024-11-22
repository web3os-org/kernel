<!-- markdownlint-disable MD033 MD036 MD041 -->

# DEPRECATED

## web3os is being replaced by ecmaOS

- [https://ecmaos.sh](https://ecmaos.sh)
- [https://docs.ecmaos.sh](https://docs.ecmaos.sh)
- [https://github.com/ecmaos/ecmaos](https://github.com/ecmaos/ecmaos)
- [https://www.youtube.com/watch?v=WOsbRim0b6E](https://www.youtube.com/watch?v=WOsbRim0b6E)

---

<img alt="Web3OS" src="http://github.com/web3os-org/kernel/raw/master/.github/iconlogo.png" style="width:100%">

*"The computer can be used as a tool to liberate and protect people, rather than to control them."*
-Hal Finney

[![Launch web3os.sh](https://img.shields.io/badge/launch-web3os.sh-blue?style=for-the-badge)](https://web3os.sh)
[![Launch web3os.sh on IPFS](https://img.shields.io/badge/launch-web3os%20on%20ipfs-silver?style=for-the-badge)](https://web3os-sh.ipns.dweb.link)
[![Launch web3os.sh on Fleek](https://img.shields.io/badge/launch-web3os%20on%20Fleek-silver?style=for-the-badge)](https://web3os.on.fleek.co)

---

[![API Reference](https://img.shields.io/badge/API-Reference-success)](https://docs.web3os.sh)
[![Version](https://img.shields.io/github/package-json/v/web3os-org/kernel?color=success)](https://web3os.sh)
[![Site Status](https://img.shields.io/website?url=https%3A%2F%2Fweb3os.sh)](https://web3os.sh)
[![Last Commit](https://img.shields.io/github/last-commit/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/commit/master)
[![Open issues](https://img.shields.io/github/issues/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/issues)
[![Closed issues](https://img.shields.io/github/issues-closed/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/issues?q=is%3Aissue+is%3Aclosed)

[![Sponsors](https://img.shields.io/github/sponsors/web3os-org?color=red)](https://github.com/web3os-org/kernel/blob/master/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/web3os-org/kernel?color=yellow)](https://github.com/web3os-org/kernel/graphs/contributors)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/web3os-org/kernel/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/web3os-org/kernel/compare)
[![Discord](https://img.shields.io/discord/926916877689700373?label=discord)](https://discord.gg/yA4M83fXn9)
[![Observatory Grade](https://img.shields.io/mozilla-observatory/grade/web3os.sh?publish)](https://observatory.mozilla.org/analyze/web3os.sh)

[![Twitter](https://img.shields.io/twitter/follow/web3os?style=social)](https://twitter.com/web3os)
[![Reddit](https://img.shields.io/reddit/subreddit-subscribers/web3os?style=social)](https://reddit.com/r/web3os)
[![Medium](https://img.shields.io/badge/Medium-@web3os-blue?style=social&logo=medium)](https://web3os.medium.com)
[![Facebook](https://img.shields.io/badge/Facebook-web3os-blue?style=social&logo=facebook)](https://www.facebook.com/Web3os-111014368120117)
[![Youtube](https://img.shields.io/badge/Youtube-web3os-blue?style=social&logo=youtube)](https://www.youtube.com/channel/UC2EqcpVYpyB6RSopi1GaLSg)

[![Followers](https://img.shields.io/github/followers/web3os-org?style=social)](https://github.com/web3os-org)
[![Watchers](https://img.shields.io/github/watchers/web3os-org/kernel?style=social)](https://github.com/web3os-org/kernel)
[![Stars](https://img.shields.io/github/stars/web3os-org/kernel?style=social)](https://github.com/web3os-org/kernel)

A decentralized web-based operating system for the next web, empowering users and developers to:

- Easily install many npm browser packages
- Run Node.js code using [RunKit](https://runkit.com)
- Customize the OS to suit your individual needs
- Write scripts to perform particular tasks
- Write full applications that can create windows and interface with the kernel
- Interact with crypto wallets and smart contracts
- Utilize a number of P2P protocols within the browser

Documentation: [https://docs.web3os.sh](https://docs.web3os.sh)

This project is still very young, and more documentation and organization is Coming Soon™.

This project is tested with [BrowserStack](https://browserstack.com).

---

- [Features](#features)
- [Disclaimer](#disclaimer)
- [Help Wanted](#help-wanted)
- [User Quickstart](#user-quickstart)
- [Developer Quickstart](#developer-quickstart)
- [Autostart](#autostart)
- [Globals](#globals)
- [Shortcuts](#shortcuts)
- [Scripting](#scripting)
- [Web3os Package Manager](#web3os-package-manager)
- [Official Apps](#official-apps)
- [Three (OS Assistant)](#three-os-assistant)
- [Kernel Interface](#kernel-interface)
- [App Structure](#app-structure)
- [Metal (@web3os-core/metal)](#metal-web3os-coremetal)
- [WebUSB](#webusb)
- [WebHID](#webhid)
- [Web Bluetooth](#web-bluetooth)
- [Web Serial](#web-serial)
- [Web MIDI](#web-midi)
- [TODO](#todo)
- [Can it do *thing*?](#can-it-do-thing)
- [Further Documentation](#further-documentation)

---

## Features

<details open>
<summary><strong>Expand Features</strong></summary>

- Runs completely in the browser (Chromium-based browsers are ideal)
- Browser filesystem with [BrowserFS](https://github.com/jvilk/BrowserFS)
- CLI Terminal with [xterm.js](https://github.com/xtermjs/xterm.js)
- [3pm: The web3os package manager](#web3os-package-manager)
- Modules may also be imported with [SystemJS](https://github.com/systemjs/systemjs)
- Installable as a Progressive Web App
- Optional desktop environment (type `desktop`)
- Optional backend environment / host link with [metal](https://github.com/web3os-org/metal)
- Provides interfaces for many standard and experimental browser APIs
- WebSocket support
- WebUSB support
- WebHID support
- Web Serial Support
- Web Bluetooth support
- Gamepad support
- It runs Doom (and Wolfenstein 3D! and other DOS stuff!) with [JS-DOS](https://js-dos.com/) (@web3os-apps/doom, @web3os-apps/wolfenstein)
- It runs Diablo with [diabloweb](https://d07riv.github.io/diabloweb) (@web3os-apps/diablo)
- It runs Winamp with [webamp](https://github.com/captbaritone/webamp) (@web3os-apps/webamp)
- It runs virtual machines with v86 by Copy.sh
- Apps can create sexy dialogs with [sweetalert2](https://github.com/sweetalert2/sweetalert2)
- Apps can create notifications with [awesome-notifications](https://f3oall.github.io/awesome-notifications) or native browser notifications
- Slick windowing system with [WinBox](https://github.com/nextapps-de/winbox)
- Decentralized messaging support with [Mailchain](https://mailchain.xyz) (@web3os-apps/mailchain)
- Git integration with [isomorphic-git](https://isomorphic-git.org/)
- GunJS integration with [GUN](https://gun.eco)
- Moralis integration with [Moralis](https://moralis.io)
- P2P communication (chat, audio, video, screenshare, fileshare) with [PeerJS](https://peerjs.com)
- Torrent integration with [WebTorrent](https://webtorrent.io)
- **(WIP)** IPFS Integration with [js-ipfs](https://github.com/ipfs/js-ipfs)
  - Built-in IPFS video search and player; type `flix`
- WebAssembly executable support *(WIP)*:
  - [Native](https://developer.mozilla.org/en-US/docs/WebAssembly)
  - [WIP] [WASI](https://wasi.dev/)
  - [WIP] [Emscripten](https://emscripten.org/)
  - [WIP] [AssemblyScript](https://www.assemblyscript.org/)
- Decentralized:
  - Open source to customize and host your own copy ([MIT License](https://github.com/web3os-org/kernel/blob/master/LICENSE))
  - Included [Fleek](https://github.com/web3os-org/kernel/blob/master/.fleek.json) and [Netlify](https://github.com/web3os-org/kernel/blob/master/netlify.toml) configs for easy deployment
  - Main site hosted by [Fleek](https://fleek.co) at [https://web3os.sh](https://web3os.sh)
  - Backup site hosted on IPFS at [https://web3os-sh.ipns.dweb.link/](https://web3os-sh.ipns.dweb.link/)
- Developer-friendly:
  - Easily scriptable and customizable
  - Use an [initfsUrl](https://docs.web3os.sh/global.html#setupFilesystem) query param to load a ZIP file from a URL to populate your filesystem
  - Use a [mountableFileSystemConfig](https://docs.web3os.sh/global.html#setupFilesystem) query param to specify how your filesystems should be mounted
  - Install nearly any browser package from npm
  - Programs are just HTML/CSS/JS/WebGL, or any language that compiles to WebAssembly

</details>

## Disclaimer

<details>
<summary><strong>Expand Disclaimer</strong></summary>

This project is still considered to be in an early preview state. Any code that runs can access the entire virtual browser filesystem, so there are currently no user accounts, access control lists, or anything of that nature.

The code in this repository has not been audited. Do not rely on it to keep anything safe, and never paste commands you don't understand. Anywhere, ever.

Heavily scrutinize any application or script you install or run, as well as its authors.

</details>

## Help Wanted

<details>
<summary><strong>Expand Help Wanted</strong></summary>

It's going to take people far smarter than me to make this project achieve its full potential.

Please consider digging into the code and see what you can come up with and submit a PR!

Not sure where to start? Check out [the issues](https://github.com/web3os-org/kernel/issues)!

See [CONTRIBUTING.md](https://github.com/web3os-org/kernel/blob/master/CONTRIBUTING.md)

</details>

## User Quickstart

<details open>
<summary><strong>Expand User Quickstart</strong></summary>

- Visit [https://web3os.sh](https://web3os.sh)
- Use `ls` and `cd` to look around the filesystem
- Type `help` for generic helpful information
- Type `files /bin` to browse all available commands
- Learn more about commands: `help [command]`
- Edit a file: `edit /tmp/test.txt`
- Launch the desktop: `desktop`
- Run the screensaver: `screensaver`
- Play DOOM: `doom`
- Play Wolfenstein 3D: `wolfenstein`
- Read this README: `markdown /docs/README.md`
- Launch the file explorer: `files /docs`
- Launch a browser: `www https://instacalc.com`
- Connect to your wallet: `account connect`
- Check native coin balance: `account balance`
- Check token balance: `account balance USDC`
- Switch to another network: `account chain polygon`, `account chain bsc`, `account chain 0x2`
- Interact with a smart contract: `contract --help`
- 🎉 Fire the Confetti Gun: `confetti`
- See the list of [official apps](#official-apps)

</details>

## Developer Quickstart

<details open>
<summary><strong>Expand Developer Quickstart</strong></summary>

---

```sh
git clone git@github.com:web3os-org/kernel.git
cd kernel
pnpm install # or npm install
pnpm start # or npm start
```

From here, simply connect to [https://localhost:30443](https://localhost:30443) and accept the certificate warning.

Alternatively, install [src/assets/ssl/localhost.crt](https://github.com/web3os-org/kernel/blob/master/src/assets/ssl/localhost.crt) to your trusted certificate store.

We use SSL locally so that all browser APIs work as expected.

</details>

## Autostart

<details open>
<summary><strong>Expand Autostart</strong></summary>

To modify the commands the system executes on startup:

- `edit /config/autostart.sh`
- For example, add `desktop` to the end of the file
- Insert any additional commands you want to run on startup

</details>

## Globals

<details>
<summary><strong>Expand Globals</strong></summary>

---

These objects are available on the global object (globalThis/window):

- `Kernel`: The global kernel
- `Terminal`: The kernel's main terminal
- `System`: The SystemJS library

</details>

## Shortcuts

<details open>
<summary><strong>Expand Shortcuts</strong></summary>

Shortcuts are managed via a JSON object at `/config/shortcuts` and accessed using the `open` command.

Current shortcut types: `execute` - `url`

Example:

```json
{
  "scarytime": {
    "type": "execute",
    "target": "snackbar Confetti attack! ; confetti --scalar 12"
  },

  "instacalc": {
    "type": "execute",
    "target": "www --no-toolbar --title Instacalc https://instacalc.com"
  },
    
  "github": {
    "type": "url",
    "target": "https://github.com"
  }
}
```

To open a shortcut: `open <key>`, e.g. `open github`

</details>

## Scripting

<details>
<summary><strong>Expand Scripting</strong></summary>

---

Web3os scripts (.sh) are a simple line-by-line execution, while Javascript (.js) offers far more power.

To run a web3os script: `sh /path/to/script.sh`

- Or from an app: `window.Kernel.executeScript('/path/to/script.sh')`

To run a Javascript script: `eval /path/to/script.js`

- Or from an app: `window.Kernel.execute('eval /path/to/script.js')`

</details>

See some sample scripts at: [https://github.com/web3os-org/sample-scripts](https://github.com/web3os-org/sample-scripts)

## Web3os Package Manager

<details>
<summary><strong>Expand Web3os Package Manager</strong></summary>

---

The `3pm` command can be used to manage installed packages. Installing a package adds an entry to `/config/packages` and all packages in this file are loaded on startup.

Packages are generally ES Modules, located at a url that contains a `package.json`.

You can attempt to install any package from npm using a CDN such as [unpkg](https://unpkg.com) (this is the default 3pm registry).

This means that during development, you can serve up your app locally, with Live Server for example, and `3pm install http://localhost:5500`.

You may also just use the `import` command to directly import an ES module from a URL. Or bypass all of this and use your own technique!

Dependency management is another monster altogether, so that's still a WIP. This means your package should already be bundled when web3os loads it, or pull in your dependencies some other way.

Here are a few examples of npm libraries that can be successfully loaded in web3os:

- [lodash](https://www.npmjs.com/package/lodash)
  - `3pm install lodash`
  - This doesn't add an executable, but `_` is now available in the global scope.

- [jquery](https://www.npmjs.com/package/jquery)
  - `3pm install jquery`
  - This doesn't add an executable, but `$` is now available in the global scope.

- [moment](https://momentjs.com)
  - `3pm install --umd moment`
  - `const now = Kernel.modules.moment.run()`

- [umbrellajs](https://umbrellajs.com/)
  - `3pm install umbrellajs --main umbrella.esm.js`
  - Now you can use it:
    - `const u = Kernel.modules.umbrellajs.default`
    - `const body = u('body')`

</details>

## Official Apps

<details>
<summary><strong>Expand Official Apps</strong></summary>

---

- [@web3os-apps/doom](https://npmjs.org/@web3os-apps/doom)
- [@web3os-apps/gun](https://npmjs.org/@web3os-apps/gun)
- [@web3os-apps/minipaint](https://npmjs.org/@web3os-apps/minipaint)
- [@web3os-apps/moralis](https://npmjs.org/@web3os-apps/moralis)
- [@web3os-apps/rubikscube](https://npmjs.org/@web3os-apps/rubikscube)
- [@web3os-apps/wolfenstein](https://npmjs.org/@web3os-apps/wolfenstein)

</details>

See the [full list](https://www.npmjs.com/org/web3os-apps)

Note: some apps are currently either very basic implementations or just placeholders to be developed further

## Three (OS Assistant)

<details>
<summary><strong>Expand Three</strong></summary>

---
(WIP)

Three is just a pet at this point, but eventually it will become a useful assistant, or go the way of Clippy.

Just type `three` at the terminal to get started!

Type `three --help` to see other commands you can use to control Three, and you can access all of the features on `Kernel.modules.three`, e.g.:

- `Kernel.modules.three.move('50%', '50%')`
- `Kernel.modules.three.say('Hello world')`
- `Kernel.modules.three.animate('heartBeat', 'infinite')`
  - Use any [animate.css](https://animate.style) style

Three uses the `speak` command for speech synthesis. You may customize the voice parameters using the kernel memory as follows:

- <3os># `set three voice Google italiano`
  - Use `speak --list-voices` to see available voices
- <3os># `set three volume 2`
- <3os># `set three pitch 1.5`
- <3os># `set three rate 0.5`

`console.log(Kernel.modules.three)` to inspect.

</details>

## Kernel Interface

<details>
<summary><strong>Expand Kernel Interface</strong></summary>

---

This is a brief overview of how to use the kernel, please check [https://docs.web3os.sh](https://docs.web3os.sh) for updated documentation.

This (and everything else) is subject to change before version 1.0.

`window.Kernel.modules` = { name: app }

- Contains all apps registered in the kernel
- e.g., `window.Kernel.modules.desktop.run()`
- e.g., `window.Kernel.modules['@author/package'].version`

`window.Kernel.dialog` ({ ...[sweetalert2options](https://sweetalert2.github.io/#configuration) }) = :Promise(sweetalert2result)

- Convenience method to create a sweetalert2 dialog with appropriate defaults
- e.g., `window.Kernel.dialog({ title: 'Are you sure?', text: 'Scary stuff!', icon: 'warning' })`

`window.Kernel.fs` = { ...BrowserFS }

- This object holds the initialized BrowserFS instance
- e.g., `const doesExist = window.Kernel.fs.existsSync('/config/packages')`

`window.Kernel.set` ('namespace', 'key', :any)

- Sets a value in the kernel "memory" - persists in localStorage
- e.g., `window.Kernel.set('user', 'name', 'hosk')`
- e.g., `window.Kernel.set('myapp', 'theme', { color: 'rebeccapurple' })`

`window.Kernel.get` ('namespace', 'key') = :any

- Gets a value from the kernel "memory" - loaded from localStorage
- e.g., `window.Kernel.get('user')`
- e.g., `window.Kernel.get('user', 'name')`
- e.g., `const { color } = window.Kernel.get('myapp', 'theme')`

`window.Kernel.windows.create` (options) = { options, window }

- Creates a new application window with [WinBox](https://github.com/nextapps-de/winbox) options

</details>

## App Structure

<details>
<summary><strong>Expand App Structure</strong></summary>

---

Developers should be able to create apps in any way they like, with as few requirements as possible. Remember, your app is simply running in a browser - you have access to everything that any other script or module does.

To make your module executable from the command line, you may export an async function named `run`, or your default export must be a function.

Your module or `package.json` may also contain a `help` property that contains your module's help text.

The best way to create applications for web3os is to create an `npm` package, using any bundler you'd like.

For example, to create an application with [snowpack](https://www.snowpack.dev):

`package.json`:

```json
{
  "name": "@yourorg/yourapp",
  "description": "A sample application",
  "version": "1.2.3",
  "license": "MIT",
  "main": "build/index.js",
  "module": "src/index.js",
  "scripts": {
    "start": "snowpack dev",
    "build": "snowpack build",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "snowpack": "^3.8.8"
  }
}
```

`index.js`:

```js
export const help = `
  This app enables developers to Do An App!

  Usage: @yourorg/yourapp [options]        Run yourapp with some options!
`

export async function run (terminal, context) {
// or: export default async function (terminal, context) {
  console.log(terminal) // the xterm.js terminal in which your app is running
  console.log(context) // the plain string of arguments passed to your app
  terminal.log('Thanks for checking out myapp!')
  terminal.log(context)

  // You may also access the web3os system terminal
  window.Terminal.log('This is output to the root globalThis.Terminal')
}
```

Apps can be written and bundled a number of different ways, for some ideas check out:

[@web3os-apps](https://github.com/web3os-org/web3os-apps)

</details>

## Metal (@web3os-core/metal)

<details>
<summary><strong>Expand Metal</strong></summary>

(WIP)

Metal is the web3os hardware link, allowing web3os access to certain hardware features and other capabilities of the host operating system.

It offers a multi-user environment while restricting access based on a user's authenticated wallet address, or other attributes such as NFT ownership, etc.

The `metal` command is the utility to connect to and interact with web3os metal servers.

[View the metal repository](https://github.com/web3os-org/metal)

</details>

## WebUSB

<details>
<summary><strong>Expand WebUSB</strong></summary>

Experimental WebUSB API features are limited in browser support at this time.

The `usb` command doesn't do much except pair and maintain a list of devices.

```text
Usage:
    usb devices            List paired USB devices
    usb request <options>  Request USB device (blank for user choice)

  Options:
    --help                 Print this help message
    --name                 Specify a friendly name for the USB device
    --product              Product ID of the USB device
    --vendor               Vendor ID of the USB device
    --version              Print the version information
```

Access the array of devices within an app: `Kernel.modules.usb.devices`

</details>

## WebHID

<details>
<summary><strong>Expand WebHID</strong></summary>

Experimental WebHID API features are limited in browser support at this time.

The `hid` command doesn't do much except pair and maintain a list of devices.

```text
Usage:
    hid devices            List paired HID devices
    hid request <options>  Request HID device (blank for user choice)

  Options:
    --help                 Print this help message
    --product              Product ID of the HID device
    --vendor               Vendor ID of the HID device
    --version              Print the version information
```

Access the array of devices within an app: `Kernel.modules.hid.devices`

</details>

## Web Bluetooth

<details>
<summary><strong>Expand Web Bluetooth</strong></summary>

Experimental Web Bluetooth API features are limited in browser support at this time.

The `bluetooth` command doesn't do much except pair and maintain a list of devices.

```text
Usage:
    bluetooth devices            List paired bluetooth devices
    bluetooth pair <options>     Request bluetooth device (blank for user choice)

  Options:
    --help                 Print this help message
    --name                 Specify a friendly name for the bluetooth device
    --version              Print the version information
```

Access the array of devices within an app: `Kernel.modules.bluetooth.devices`

</details>

## Web Serial

<details>
<summary><strong>Expand Web Serial</strong></summary>

Experimental Web Serial API features are limited in browser support at this time.

The `serial` command doesn't do much except pair and maintain a list of devices.

```text
Usage:
    serial devices            List paired serial devices
    serial request <options>  Request serial device (blank for user choice)

  Options:
    --help                    Print this help message
    --product                 Product ID of the serial device
    --vendor                  Vendor ID of the serial device
    --version                 Print the version information
```

Access the array of devices within an app: `await navigator.serial.getPorts()`

</details>

## Web MIDI

<details>
<summary><strong>Expand Web MIDI</strong></summary>

```text
Usage:
    midi inputs                       List MIDI inputs
    midi outputs                      List MIDI outputs

  Options:
    --help                            Print this help message
    --version                         Print the version information
```

</details>

## TODO

<details>
<summary><strong>Expand TODO</strong></summary>

- There's a lot to do... please help. 😅
- IO piping
- Tab completion
- Much more work on the `desktop` module
- Typescriptify everything
- Work on internationalization system and translations; RTL support
- Decoupling of most built-in modules into their own packages
- Unified WASM handling
- Rewrite expensive core modules using Emscripten
- Improve security/isolation
- Some apps are just placeholders; flesh them out
- Modify command interfaces to conform to IEEE Std 1003.1-2017
- Add more things to the TODO list

</details>

## Can it do *thing*?

If it's not in this README or not readily apparent in the included apps, the answer is probably not **yet**. PR's are always welcome and encouraged. Let's talk about it on [Discord](https://discord.gg/yA4M83fXn9)! But remember, you can always just use Javascript!

Better yet, if you can make it do the thing, please [submit a PR](https://github.com/web3os-org/kernel/blob/master/CONTRIBUTING.md)! This project will never grow without a thriving community of developers!

## Further Documentation

You can find the full API reference and other tutorials at [https://docs.web3os.sh](https://docs.web3os.sh)

Questions? Check out the [discussion forums](https://github.com/orgs/web3os-org/discussions)

Problems? Search the [issues](https://github.com/web3os-org/kernel/issues)
