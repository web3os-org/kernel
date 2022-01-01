# ![Web3OS.sh](.github/logo.png) <!-- omit in toc -->

A developer-friendly ecosystem of apps designed to build a crypto-focused web-based operating system. The goal is for the entire system to run within any modern browser, while having the capability to connect to backend systems for more features.

The project is still very young, and proper documentation is Coming Soon™.

## Disclaimer

This project is still considered to be in an alpha state. Do not rely on it to keep anything safe, and never paste commands you don't understand. Anywhere, ever.

## User Quickstart

- Visit [https://web3os.sh](https://web3os.sh)
- Type `help`
- Type `ls /bin`
- Edit a file: `edit /tmp/test.txt`
- Launch the desktop: `desktop`
- Launch a browser: `www https://instacalc.com`
- Connect to MetaMask: `account connect`
- Check native token balance: `account balance`
- Learn more about commands: `help account`
- Run the screensaver: `screensaver`
- Fire the Confetti Gun: `confetti`

## Developer Quickstart

```sh
git clone git@github.com:web3os-org/kernel.git
cd kernel
npm install
npm start
```

From here, simply connect to [https://localhost:8080](https://localhost:8080) and accept the self-signed certificate warning.

## Scripting

Web3os scripts (.sh) are a simple line-by-line execution, while Javascript (.js) offers far more power.

To run a web3os script: `sh /path/to/script.sh`

To run a Javascript script: `eval /path/to/script.js`

## w3 Packages

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

Further documentation will soon be available at [https://docs.web3os.sh](https://docs.web3os.sh).
