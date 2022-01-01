# ![Web3OS.sh](https://github.com/web3os-org/.github/raw/main/logo.png) <!-- omit in toc -->

[![Netlify Status](https://api.netlify.com/api/v1/badges/29125922-6ff4-43bd-8771-37dab6138567/deploy-status)](https://web3os.sh)
[![Version](https://img.shields.io/github/package-json/v/web3os-org/kernel?color=success)](https://web3os.sh)
[![Site Status](https://img.shields.io/website?url=https%3A%2F%2Fweb3os.sh)](https://web3os.sh)
[![Last Commit](https://img.shields.io/github/last-commit/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/commit/master)
[![Open issues](https://img.shields.io/github/issues/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/issues)
[![Closed issues](https://img.shields.io/github/issues-closed/web3os-org/kernel.svg)](https://github.com/web3os-org/kernel/issues?q=is%3Aissue+is%3Aclosed)

[![Sponsors](https://img.shields.io/github/sponsors/web3os-org)](https://github.com/web3os-org/kernel/blob/master/LICENSE)
[![GitHub license](https://img.shields.io/github/license/web3os-org/kernel.svg?color=blue)](https://github.com/web3os-org/kernel/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/web3os-org/kernel/compare)
[![Contributors](https://img.shields.io/github/contributors/web3os-org/kernel)](https://github.com/web3os-org/kernel/graphs/contributors)
[![Discord](https://img.shields.io/discord/926916877689700373)](https://discord.gg/yA4M83fXn9)
[![Observatory Grade](https://img.shields.io/mozilla-observatory/grade/web3os.sh?publish)](https://observatory.mozilla.org/analyze/web3os.sh)

[![Twitter](https://img.shields.io/twitter/follow/web3os?style=social)](https://twitter.com/web3os)
[![Reddit](https://img.shields.io/reddit/subreddit-subscribers/web3os?style=social)](https://reddit.com/r/web3os)
[![Facebook](https://img.shields.io/badge/Facebook-web3os-blue?style=social&logo=facebook)](https://www.facebook.com/Web3os-111014368120117)
[![Youtube](https://img.shields.io/badge/Youtube-web3os-blue?style=social&logo=youtube)](https://www.youtube.com/channel/UC2EqcpVYpyB6RSopi1GaLSg)

[![Followers](https://img.shields.io/github/followers/web3os-org?style=social)](https://github.com/web3os-org)
[![Watchers](https://img.shields.io/github/watchers/web3os-org/kernel?style=social)](https://github.com/web3os-org/kernel)
[![Stars](https://img.shields.io/github/stars/web3os-org/kernel?style=social)](https://github.com/web3os-org/kernel)

A developer-friendly ecosystem of apps designed to build a crypto-focused web-based operating system. The goal is for the entire system to run within any modern browser, while having the capability to connect to backend systems for more features.

The project is still very young, and proper documentation is Coming Soon™.

---

## Features

- Web-based crypto console with [xterm.js](https://github.com/xtermjs/xterm.js)
- Web3 Wallet Integration with [web3](https://github.com/ChainSafe/web3.js)
- Fully in-browser filesystem with [BrowserFS](https://github.com/jvilk/BrowserFS)
- Sexy dialogs with [sweetalert2](https://github.com/sweetalert2/sweetalert2)
- Slick windowing system with [WinBox](https://github.com/nextapps-de/winbox)
- Developer-friendly: apps are just HTML/CSS/JS

## Alpha Footage [![Watchers](https://img.shields.io/youtube/views/JsyJ8mbWMxc?style=social)](https://youtu.be/JsyJ8mbWMxc)

Here's a quick video showcasing a few of the features: [web3os alpha demo](https://youtu.be/JsyJ8mbWMxc)

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
- Fire the Confetti Gun: `confetti`

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

- Or `window.kernel.executeScript('/path/to/script.sh')`

To run a Javascript script: `eval /path/to/script.js`

- Or `window.kernel.bin.eval.run(window.terminal, '/path/to/script.js')`

## w3 Packages

**The packaging system is not yet usable**

Packages are installed using `wpm`, the web3os package manager.

`wpm install http://localhost:5500/dist`
`wpm update demo-app`
`wpm uninstall demo-app`

Currently, a package url must provide `index.js` and `package.json` files.

The `package.json` should have an additional field `"exe": "cmd-to-run-app"`.

To see examples of how to write apps, check the `src/bin` folder. The [src/bin/confetti/index.js](src/bin/confetti/index.js) file gives a good introduction of a solid app structure without too much other code.

Apps should export the following:

`name` - Required: the executable name of your app
`run(term, context)` - Required: this function will be called when your app is executed
`help` - this text will be displayed when the user types `help yourcommand`
`description`
`version`

`context` is a string of arguments; e.g. subcommand --order 66 --text "quoted text with spaces"

Work is still being done on the packaging system - it is not ready for real usage.

See [@web3os-org/demo-app](https://github.com/web3os-org/demo-app) for a complete app boilerplate that uses webpack.

## Further Documentation

Further documentation will soon be available at [https://docs.web3os.sh](https://docs.web3os.sh)
