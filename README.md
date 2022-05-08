<!-- markdownlint-disable MD033 MD036 MD041 -->

<img alt="Web3OS" src="http://github.com/web3os-org/kernel/raw/master/.github/iconlogo.png" style="width:100%">

*"The computer can be used as a tool to liberate and protect people, rather than to control them."*
-Hal Finney

[![Launch web3os.sh](https://img.shields.io/badge/launch-web3os-blue?style=for-the-badge)](https://web3os.sh)

---

[![Netlify Status](https://api.netlify.com/api/v1/badges/29125922-6ff4-43bd-8771-37dab6138567/deploy-status)](https://web3os.sh)
[![Version](https://img.shields.io/github/package-json/v/web3os-org/kernel?color=success)](https://web3os.sh)
[![Site Status](https://img.shields.io/website?url=https%3A%2F%2Fweb3os.sh)](https://web3os.sh)
[![Last Commit](https://img.shields.io/github/last-commit/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/commit/master)
[![Open issues](https://img.shields.io/github/issues/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/issues)
[![Closed issues](https://img.shields.io/github/issues-closed/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/issues?q=is%3Aissue+is%3Aclosed)

[![Sponsors](https://img.shields.io/github/sponsors/web3os-org?color=red)](https://github.com/web3os-org/kernel/blob/master/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/web3os-org/kernel?color=yellow)](https://github.com/web3os-org/kernel/graphs/contributors)
[![GitHub license](https://img.shields.io/github/license/web3os-org/kernel.svg?color=blue)](https://github.com/web3os-org/kernel/blob/master/LICENSE)
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

A developer-friendly ecosystem of apps designed to build a crypto-focused web-based operating system. The goal is for the entire system to run within any modern browser, while having the capability to connect to backend systems for more features.

The project is still very young, and proper documentation and organization is Coming Soon™.

---

- [Features](#features)
- [Footage](#footage)
- [Disclaimer](#disclaimer)
- [Help Wanted](#help-wanted)
- [User Quickstart](#user-quickstart)
- [Developer Quickstart](#developer-quickstart)
- [Autostart](#autostart)
- [Scripting](#scripting)
- [Kernel Interface](#kernel-interface)
- [App Structure](#app-structure)
- [Backend (web3os-server)](#backend-web3os-server)
- [WebUSB](#webusb)
- [TODO](#todo)
- [Can it do *thing*?](#can-it-do-thing)
- [Further Documentation](#further-documentation)

---

## Features

<details open>
<summary><strong>Expand Features</strong></summary>

- Runs completely in the browser
- Optional desktop environment
- Optional backend environment runs in Docker container
- Web-based terminal with [xterm.js](https://github.com/xtermjs/xterm.js)
- [Web3os Package Manager](#web3os-package-manager)
- Web3 wallet integration with [web3.js](https://github.com/ChainSafe/web3.js)
  - Interact with smart contracts
  - Programmatically switch chains
- Fully in-browser filesystem with [BrowserFS](https://github.com/jvilk/BrowserFS)
- IPFS Integration with [js-ipfs](https://github.com/ipfs/js-ipfs)
  - Built-in IPFS video search and player; type `help flix`
- Sexy dialogs with [sweetalert2](https://github.com/sweetalert2/sweetalert2)
- Slick windowing system with [WinBox](https://github.com/nextapps-de/winbox)
- Decentralized messaging support with [Mailchain](https://mailchain.xyz)
- IPFS integration with [ipfs-core](https://github.com/ipfs/js-ipfs)
- Git integration with [isomorphic-git](https://isomorphic-git.org/)
- GunJS integration with [GUN](https://gun.eco)
- Moralis integration with [Moralis](https://moralis.io)
- P2P communication with [PeerJS](https://peerjs.com)
- Torrent integration with [WebTorrent](https://webtorrent.io)
- It runs Doom (and Wolfenstein 3D!) with [JS-DOS](https://js-dos.com/)
- WebUSB support *(Chrome only; very experimental)*
- WebAssembly executable support *(very experimental - incomplete)*:
  - [Native](https://developer.mozilla.org/en-US/docs/WebAssembly)
  - [WASI](https://wasi.dev/)
  - [Emscripten](https://emscripten.org/)
  - [AssemblyScript](https://www.assemblyscript.org/)
- Decentralized:
  - Open source to run your own copy
  - Backup site hosted on IPFS
    - *(soon, there are still some issues to resolve)*
- Developer-friendly:
  - Easily scriptable and hookable ecosystem of modules
  - Programs are just HTML/CSS/JS/WebGL, or any language that compiles to WebAssembly

</details>

## Footage

<details open>
<summary><strong>Expand Footage</strong></summary>

Here's a quick video showcasing a few of the features: [web3os alpha demo](https://youtu.be/JsyJ8mbWMxc) [![Watchers](https://img.shields.io/youtube/views/JsyJ8mbWMxc?style=social)](https://youtu.be/JsyJ8mbWMxc)

</details>

## Disclaimer

<details>
<summary><strong>Expand Disclaimer</strong></summary>

This project is still considered to be in an alpha state. All apps run in the same context and can access every other app, as well as the entire virtual browserfs.

The code in this repository has not been audited. Do not rely on it to keep anything safe, and never paste commands you don't understand. Anywhere, ever.

Heavily scrutinize any application or script you install or run, as well as its authors.

</details>

## Help Wanted

<details>
<summary><strong>Expand Help Wanted</strong></summary>

It's going to take people far smarter than me to make this project achieve its full potential.

Please consider digging into the code and see what you can come up with and submit a PR!

See [CONTRIBUTING.md](CONTRIBUTING.md)

</details>

## User Quickstart

<details open>
<summary><strong>Expand User Quickstart</strong></summary>

- Visit [https://web3os.sh](https://web3os.sh)
- Type `help` for generic helpful information
- Type `ls /bin` to list all available commands
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

</details>

## Developer Quickstart

<details open>
<summary><strong>Expand Developer Quickstart</strong></summary>

---

```sh
git clone git@github.com:web3os-org/kernel.git
cd kernel
yarn # or npm install
yarn start # or npm start
```

From here, simply connect to [https://localhost:8080](https://localhost:8080) and accept the certificate warning.

Alternatively, install [src/assets/ssl/localhost.crt](https://github.com/web3os-org/kernel/blob/master/src/assets/ssl/localhost.crt) to your trusted certificate store.

</details>

## Autostart

<details open>
<summary><strong>Expand Autostart</strong></summary>

To modify the commands the system executes on startup:

- `edit /config/autostart.sh`
- For example, add `desktop` to the end of the file
- insert any additional commands you want to run on startup

</details>

## Scripting

<details>
<summary><strong>Expand Scripting</strong></summary>

---

Web3os scripts (.sh) are a simple line-by-line execution, while Javascript (.js) offers far more power.

To run a web3os script: `sh /path/to/script.sh`

- Or from an app: `globalThis.kernel.executeScript('/path/to/script.sh')`

To run a Javascript script: `eval /path/to/script.js`

- Or from an app: `globalThis.kernel.execute('eval /path/to/script.js')`

</details>

See some sample scripts at: [https://github.com/web3os-org/sample-scripts](https://github.com/web3os-org/sample-scripts)

## Web3os Package Manager

<details>
<summary><strong>Expand Web3os Package Manager</strong></summary>

---

The `wpm` command can be used to manage installed packages. Installing a package adds an entry to `/config/packages` and all packages in this file are loaded on startup.

Packages are generally ES Modules, located at a url that contains a `package.json`.

You may also just use the `import` command to directly import an ES module from a URL.

This means you can attempt to install any package from npm using a CDN such as [unpkg](https://unpkg.com). This doesn't mean the package will work as expected, but here are a few examples of npm libraries that can be loaded in web3os:

- [lodash](https://www.npmjs.com/package/lodash)
  - `wpm install https://unpkg.com/lodash`
  - This doesn't add an executable, but `_` is now available in the global scope.

- [umbrellajs](https://umbrellajs.com/)
  - `wpm install https://unpkg.com/umbrellajs --main umbrella.esm.js`
  - Now you can use it by accessing:
    - `const u = kernel.modules.umbrellajs.default`
    - `const body = u('body')`

</details>

## Kernel Interface

<details>
<summary><strong>Expand Kernel Interface</strong></summary>

---

This (and everything else) is subject to change before version 1.0.

Also, expect undocumented features for now.

`globalThis.kernel.modules` = { name: app }

- Contains all apps registered in the kernel
- e.g., `globalThis.kernel.modules.desktop.run()`

`globalThis.kernel.wallet.web3` = :Web3Provider

- The web3 provider setup with the `account` command

`globalThis.kernel.wallet.account` = { address: '0x..', chainId: 1 }

- You may also interact directly with the account app.
  - e.g., `globalThis.kernel.modules.account.connect()`
  - e.g., `globalThis.kernel.modules.account.account.address`

`globalThis.kernel.dialog` ({ ...[sweetalert2options](https://sweetalert2.github.io/#configuration) }) = :Promise(sweetalert2result)

- Convenience method to create a sweetalert2 dialog with appropriate defaults
- e.g., `globalThis.kernel.dialog({ title: 'Are you sure?', text: 'Scary stuff!', icon: 'warning' })`

`globalThis.kernel.set` ('namespace', 'key', :any)

- Sets a value in the kernel "memory" - persists in localStorage
- e.g., `globalThis.kernel.set('user', 'name', 'hosk')`
- e.g., `globalThis.kernel.set('myapp', 'theme', { color: 'rebeccapurple' })`

`globalThis.kernel.get` ('namespace', 'key') = value

- Gets a value from the kernel "memory" - loaded from localStorage
- e.g., `globalThis.kernel.get('user')`
- e.g., `globalThis.kernel.get('user', 'name')`
- e.g., `const { color } = globalThis.kernel.get('myapp', 'theme')`

`globalThis.kernel.appWindow` (options) = { options, window }

- Creates a new application window with [WinBox](https://github.com/nextapps-de/winbox) options

</details>

## App Structure

<details>
<summary><strong>Expand App Structure</strong></summary>

---

Developers should be able to create apps in any way they like, with as few requirements as possible. Remember, your app is simply running in a browser - you have access to everything that any other script does.

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
import pkg from './package.json'

export const name = pkg.name
export const version = pkg.version
export const description = pkg.description
export const help = `
  This app enables developers to Do An App!

  Usage: @yourorg/yourapp [options]        Run yourapp with some options!
`

export async function run (terminal, context) {
  console.log(terminal) // the xterm.js terminal in which your app is running
  console.log(context) // the plain string of arguments passed to your app
  terminal.log('Thanks for checking out myapp!')
  terminal.log(context)
}
```

A good example of some more full-featured apps can be found at:

[src/modules/confetti/index.js](https://github.com/web3os-org/kernel/blob/master/src/modules/confetti/index.js)

[]

</details>

## Backend (web3os-server)

<details>
<summary><strong>Expand Backend</strong></summary>

The `backend` command is the utility to connect to and interact with backend servers. The web3os-server spins up a private Docker container for performing various server-side tasks at the request of the web3os client, authenticated with a user's wallet.

It offers multi-user capability while restricting access based on user's authenticated wallet address.

[View the web3os-server repository](https://github.com/web3os-org/server)

</details>

## WebUSB

<details>
<summary><strong>Expand WebUSB</strong></summary>

Experimental WebUSB features are only available in Chrome-based browsers at this time.

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

Access the array of devices within an app: `kernel.modules.usb.devices`

</details>

## TODO

<details>
<summary><strong>Expand TODO</strong></summary>

- There's a lot to do... please help. 😅
- Decoupling of built-in apps into their own packages
- Unified WASM handling
- Finish development of backend Node.js web3os-server API
- Rewrite expensive core modules in Rust
- Improve security/isolation
- Some apps are just placeholders
- Modify command interfaces to conform to IEEE Std 1003.1-2017
- Flesh out rm command and remove rmdir; allow recursive delete
- Migrate all global CSS to CSS modules
- Add more things to the TODO list

</details>

## Can it do *thing*?

If it's not in this README or not readily apparent in the included apps, the answer is probably not **yet**. PR's are always welcome and encouraged. Let's talk about it on [Discord](https://discord.gg/yA4M83fXn9)!

Better yet, if you can make it do the thing, please [submit a PR](CONTRIBUTING.md)! This project will never grow without a thriving community of developers!

## Further Documentation

Further documentation will soon be available at [https://docs.web3os.sh](https://docs.web3os.sh)
