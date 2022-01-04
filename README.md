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
- [User Quickstart](#user-quickstart)
- [Developer Quickstart](#developer-quickstart)
- [Scripting](#scripting)
- [Kernel Interface](#kernel-interface)
- [App Structure](#app-structure)
- [TODO](#todo)
- [Further Documentation](#further-documentation)

---

## Features

- Web-based terminal with [xterm.js](https://github.com/xtermjs/xterm.js)
- Web3 Wallet Integration with [web3](https://github.com/ChainSafe/web3.js)
- Fully in-browser filesystem with [BrowserFS](https://github.com/jvilk/BrowserFS)
- Sexy dialogs with [sweetalert2](https://github.com/sweetalert2/sweetalert2)
- Slick windowing system with [WinBox](https://github.com/nextapps-de/winbox)
- Developer-friendly: apps are just HTML/CSS/JS
- Optional desktop environment

## Alpha Footage

Here's a quick video showcasing a few of the features: [web3os alpha demo](https://youtu.be/JsyJ8mbWMxc) [![Watchers](https://img.shields.io/youtube/views/JsyJ8mbWMxc?style=social)](https://youtu.be/JsyJ8mbWMxc)

## Disclaimer

This project is still considered to be in an alpha state. All apps run in the same context and can access every other app, as well as the entire browserfs.

Do not rely on it to keep anything safe, and never paste commands you don't understand. Anywhere, ever.

## User Quickstart

- Visit [https://web3os.sh](https://web3os.sh)
- Type `help`
- Type `ls /bin`
- Edit a file: `edit /tmp/test.txt`
- Launch the desktop: `desktop`
- Launch the file explorer: `files`
- Launch a browser: `www https://instacalc.com`
- Show your ETH address: `account`
- Check native coin balance: `account balance`
- Check token balance: `account balance USDC`
- Learn more about commands: `help command`
- Run the screensaver: `screensaver`
- 🎉 Fire the Confetti Gun: `confetti`

## Developer Quickstart

```sh
git clone git@github.com:web3os-org/kernel.git
cd kernel
yarn # or npm install
yarn start # or npm start
```

From here, simply connect to [https://localhost:8080](https://localhost:8080) and accept the self-signed certificate warning.

## Scripting

Web3os scripts (.sh) are a simple line-by-line execution, while Javascript (.js) offers far more power.

To run a web3os script: `sh /path/to/script.sh`

- Or from an app: `window.kernel.executeScript('/path/to/script.sh')`

To run a Javascript script: `eval /path/to/script.js`

- Or from an app: `window.kernel.execute('eval /path/to/script.js')`

## Kernel Interface

This (and everything else) is subject to change before version 1.0.

Also, expect undocumented methods.

`window.kernel.bin` { name: app }

- Contains all apps registered in the kernel
- e.g., `window.kernel.bin.desktop.run()`

`window.kernel.wallet.web3` :Web3Provider

- The web3 provider setup with the `account` command

`window.kernel.wallet.account` { address: '0x..', chainId: 1 }

- You may also interact directly with the account app.
  - e.g., `window.kernel.bin.account.connect()`

`window.kernel.dialog` ({ ...[sweetalert2options](https://sweetalert2.github.io/#configuration) })

- Convenience method to create a sweetalert2 dialog with appropriate defaults
- e.g., `window.kernel.dialog({ title: 'Are you sure?', text: 'Scary stuff!', icon: 'warning' })`

`window.kernel.set` ('namespace', 'key', :any)

- Sets a value in the kernel "memory" - persists in localStorage
- e.g., `window.kernel.set('user', 'name', 'hosk')`
- e.g., `window.kernel.set('myapp', 'theme', { color: 'rebeccapurple' })`

`window.kernel.get` ('namespace', 'key')

- Gets a value from the kernel "memory" - loaded from localStorage
- e.g., `window.kernel.get('user', 'name')`
- e.g., `const { color } = window.kernel.get('myapp', 'theme')`

## App Structure

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

## TODO

- There's a lot to do 😅
- Decoupling of built-in apps into their own packages
- Finish the packaging system to be able to install apps
- Some apps are really just placeholders and don't yet have full functionality
- Adding more things to this list

## Further Documentation

Further documentation will soon be available at [https://docs.web3os.sh](https://docs.web3os.sh)
