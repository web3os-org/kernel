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
- [Alpha Footage](#alpha-footage)
- [Disclaimer](#disclaimer)
- [Help Wanted](#help-wanted)
- [User Quickstart](#user-quickstart)
- [Developer Quickstart](#developer-quickstart)
<<<<<<< HEAD
- [Autostart](#autostart)
- [Scripting](#scripting)
- [Kernel Interface](#kernel-interface)
- [App Structure](#app-structure)
- [Backend (web3os-server)](#backend-web3os-server)
- [WebUSB](#webusb)
=======
- [Filesystem](#filesystem)
- [Scripting](#scripting)
- [Kernel Interface](#kernel-interface)
- [App Structure](#app-structure)
- [Gibson Backend Server](#gibson-backend-server)
  - [Connecting to a Gibson Server](#connecting-to-a-gibson-server)
>>>>>>> development
- [TODO](#todo)
- [Can it do *thing*?](#can-it-do-thing)
- [Further Documentation](#further-documentation)

---

## Features

<<<<<<< HEAD
- Runs completely in a web browser
=======
- Developer-friendly *(eventually)*:
  - apps are just HTML/CSS/JS!
  - or Web3OS Scripts!
  - or WebComponents!
  - or WebAssembly!
  - [You can probably squeeze anything into it if you tried hard enough.](https://memegenerator.net/img/instances/43742458/thats-what-she-said.jpg)
>>>>>>> development
- Optional desktop environment
- Web-based terminal with [xterm.js](https://github.com/xtermjs/xterm.js)
- Web3 wallet integration with [web3](https://github.com/ChainSafe/web3.js) and [ethers.js](https://github.com/ethers-io/ethers.js)
  - Currently, it only integrates with [MetaMask](https://metamask.io/)
  - Still in heavy development, so more to come!
- Fully in-browser filesystem with [BrowserFS](https://github.com/jvilk/BrowserFS)
- IPFS Integration with [js-ipfs](https://github.com/ipfs/js-ipfs)
- Sexy dialogs with [sweetalert2](https://github.com/sweetalert2/sweetalert2)
- Slick windowing system with [WinBox](https://github.com/nextapps-de/winbox)
<<<<<<< HEAD
- IPFS integration with [ipfs-core](https://github.com/)
- It runs Doom (and Wolfenstein 3D!) with [JS-DOS](https://js-dos.com/)
- WebAssembly executable support *(very experimental)*:
  - [WASI](https://wasi.dev/)
  - [Emscripten](https://emscripten.org/)
  - [AssemblyScript](https://www.assemblyscript.org/)
- Decentralized:
  - Open source to run your own copy
  - Backup site hosted on IPFS
    - *(soon, there are still some issues to resolve)*
- Developer-friendly:
  - Easily scriptable and hookable ecosystem of modules
    - This sacrifices some security; WASM helps
  - Programs are just HTML/CSS/JS/WebGL, or any language that compiles to WebAssembly
  - A package manager, wpm, is in development but not yet functional
=======
- WASM Executable Support with [as-bind](https://github.com/torch2424/as-bind)
- It runs Doom (and Wolfenstein 3D!) - and more with [js-dos](https://github.com/caiiiycuk/js-dos)
>>>>>>> development

## Alpha Footage

Here's a quick video showcasing a few of the features: [web3os alpha demo](https://youtu.be/JsyJ8mbWMxc) [![Watchers](https://img.shields.io/youtube/views/JsyJ8mbWMxc?style=social)](https://youtu.be/JsyJ8mbWMxc)

## Disclaimer

This project is still considered to be in an alpha state. All apps run in the same context and can access every other app, as well as the entire virtual browserfs.

The code in this repository has not been audited. Do not rely on it to keep anything safe, and never paste commands you don't understand. Anywhere, ever.

Heavily scrutinize any application or script you install or run, as well as its authors.

## Help Wanted

It's going to take people far smarter than me to make this project achieve its full potential.

<<<<<<< HEAD
Please consider digging into the code and see what you can come up with and submit a PR!

See [CONTRIBUTING.md](CONTRIBUTING.md)
=======
APIs may change without notice before v1.0.0, so develop with some flexibility.

All wallet-related features have only been developed and tested with MetaMask. WalletConnect and more coming soon.

Do not rely on it to keep anything safe, and never paste commands you don't understand. *Anywhere, ever.*
>>>>>>> development

## User Quickstart

<details open>
<summary><strong>Expand User Quickstart</strong></summary>

---

- **Visit [https://web3os.sh](https://web3os.sh)**
- Type `help`
- Type `ls /bin`
- Edit a file: `edit /tmp/test.txt`
- Launch the desktop: `desktop`
- Learn more about commands: `help command`
- Run the screensaver: `screensaver`
- Play DOOM: `doom`
- Play Wolfenstein 3D: `wolfenstein`
- Read this README: `markdown /docs/README.md`
- 🎉 Fire the Confetti Gun: `confetti`
- Launch the file explorer: `files /docs`
- Launch a browser: `www https://instacalc.com`
- Show your wallet address: `account`
- Check native coin balance: `account balance`
- Check token balance: `account balance USDC`
<<<<<<< HEAD
- Switch to another network: `account chain polygon`, `account chain bsc`, `account chain 0x2`
- Learn more about commands: `help command`
- Run the screensaver: `screensaver`
- 🎉 Fire the Confetti Gun: `confetti`
=======
- See info about current chain: `account chain`
- Change to Polygon network: `account chain polygon`

</details>
>>>>>>> development

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

From here, simply connect to [https://localhost:8080](https://localhost:8080) and accept the self-signed certificate warning.

<<<<<<< HEAD
## Autostart

To modify the commands the system executes on startup:

- `edit /config/autostart.sh`
- then add `desktop` to the end of the file
- insert any additional commands you want to run on startup
=======
</details>

## Filesystem

<details open>
<summary><strong>Expand Filesystem</strong></summary>

---

Currently, LocalStorage is used for storage, so there is a **limit of 5MB**.

Work is being done to get IndexedDB working with BrowserFS (as well as backend/cloud storage options) to open up more potential storage space, but in the meantime it's advised to access your larger files via IPFS or HTTP.

However, you may store more data in `/tmp` which does not use LocalStorage but will be lost on reload.

- `/bin` - this directory is filled with stubs of all installed apps
- `/config` - various system configuration files go here
  - `/config/autostart.sh` - this file is executed on every boot
- `/desktop` - this directory holds all of the files shown in the desktop environment
- `/docs` - this directory holds all documentation files
- `/tmp` - temporary storage that is cleared on reload
- `/var` - various system and app data storage

These directories are cleared on every boot: `/bin`, `/docs`, `/tmp`

</details>
>>>>>>> development

## Scripting

<details>
<summary><strong>Expand Scripting</strong></summary>

---

Web3os scripts (.sh) are a simple line-by-line execution, while Javascript (.js) offers far more power.

To run a web3os script: `sh /path/to/script.sh`

- Or from an app: `window.kernel.executeScript('/path/to/script.sh')`

To run a Javascript script: `eval /path/to/script.js`

- Or from an app: `window.kernel.execute('eval /path/to/script.js')`

</details>

## Kernel Interface

<details>
<summary><strong>Expand Kernel Interface</strong></summary>

---

This (and everything else) is subject to change before version 1.0.

<<<<<<< HEAD
Also, expect undocumented features for now.
=======
Also, expect undocumented methods. Play around with the `window.kernel` object to learn more.

Some examples:

`window.kernel.appWindow` ({ ...[winboxoptions](https://github.com/nextapps-de/winbox) }) => { options: { ...winboxoptions }, window: WinBox }

- Open a new window for your app
>>>>>>> development

`window.kernel.bin` = { name: app }

- Contains all apps registered in the kernel
- e.g., `window.kernel.bin.desktop.run()`

`window.kernel.wallet.web3` = :Web3Provider

- The web3 provider setup with the `account` command

`window.kernel.wallet.account` = { address: '0x..', chainId: 1 }

- You may also interact directly with the account app.
  - e.g., `window.kernel.bin.account.connect()`
  - e.g., `window.kernel.bin.account.account.address`

`window.kernel.dialog` ({ ...[sweetalert2options](https://sweetalert2.github.io/#configuration) }) = :Promise(sweetalert2result)

- Convenience method to create a sweetalert2 dialog with appropriate defaults
- e.g., `window.kernel.dialog({ title: 'Are you sure?', text: 'Scary stuff!', icon: 'warning' })`

`window.kernel.set` ('namespace', 'key', :any)

- Sets a value in the kernel "memory" - persists in localStorage
- e.g., `window.kernel.set('user', 'name', 'hosk')`
- e.g., `window.kernel.set('myapp', 'theme', { color: 'rebeccapurple' })`

`window.kernel.get` ('namespace', 'key') = value

- Gets a value from the kernel "memory" - loaded from localStorage
- e.g., `window.kernel.get('user', 'name')`
- e.g., `const { color } = window.kernel.get('myapp', 'theme')`

<<<<<<< HEAD
`window.kernel.appWindow` (options) = { options, window }

- Creates a new application window with [WinBox](https://github.com/nextapps-de/winbox) options
=======
</details>
>>>>>>> development

## App Structure

<details>
<summary><strong>Expand App Structure</strong></summary>

---

Developers should be able to create apps in any way they like, with as few requirements as possible. Remember, your app is simply running in a browser - you have access to everything that any other script does.

Here is the structure of a very minimal app:

```js
export const name = 'myapp'
export const version = '0.1.0'
export const description = 'My application'
export const help = `
  Myapp enables developers to Do An App!

  Usage: myapp <options>        Run myapp with some options!
`

export async function run (terminal, context) {
  console.log(terminal) // the xterm.js terminal in which your app is running
  console.log(context) // the plain string of arguments passed to your app
  terminal.log('Thanks for checking out myapp!')
  terminal.log(context)
}
```

A good example of a more full-featured app can be found in [src/bin/confetti/index.js](https://github.com/web3os-org/kernel/blob/master/src/bin/confetti/index.js).

<<<<<<< HEAD
## Backend (web3os-server)

The `backend` command is the utility to connect to and interact with backend servers. The web3os-server spins up a private Docker container for performing various server-side tasks at the request of the web3os client, authenticated with a user's wallet.

It offers multi-user capability while restricting access based on user's authenticated wallet address.

[View the web3os-server repository](https://github.com/web3os-org/server)

## WebUSB

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

Access the array of devices within an app: `kernel.bin.usb.devices`
=======
</details>

## Gibson Backend Server

<details>
<summary><strong>Expand Gibson Backend Server</strong></summary>

---

For more power and features, web3os can connect to a backend server running in a Docker container. The connection is authenticated by signing a message with the browser wallet (currently only MetaMask).

The server software is [@web3os/gibson-server](https://github.com/web3os-org/gibson-server), and can be run using Docker Compose:

```sh
docker compose build
docker compose up
```

The server is based off of Alpine Linux, and exposes port `1922` for SSH connections, and `1995` for WebSocket connections.

The default SSH user is `gibson`/`gibs1234` - be sure to change this in the `Dockerfile`.

### Connecting to a Gibson Server

`(ETH)[0x1]<0x..>:/# gibson connect` *localhost:1995 is the default, or specify host:port()*
`(ETH)[0x1]<0x..>:/# gibson auth` *sign the message to authenticate*
`(ETH)[0x1]<0x..>:/{localhost:1995}# gibson shell` *admin can get raw shell, but SSH is better*

</details>
>>>>>>> development

## TODO

- There's a lot to do... please help. 😅
- Decoupling of built-in apps into their own packages
- P2P messaging and file sharing
- Unified WASM handling
- Finish development of backend Node.js web3os-server API
- Finish the packaging system to be able to install apps
- Rewrite most core modules in Rust
- Increase inter-module security
- Some apps are basically just placeholders
- Adding more things to the TODO list

## Can it do *thing*?

If it's not in this README or not readily apparent in the included apps, the answer is probably not **yet**. PR's are always welcome and encouraged. Let's talk about it in [Discord](https://discord.gg/yA4M83fXn9)!

Better yet, if you can make it do the thing, please [submit a PR](CONTRIBUTING.md)! This project will never grow without a thriving community of developers!

## Further Documentation

Further documentation will soon be available at [https://docs.web3os.sh](https://docs.web3os.sh)
