/**
 * Build configuration
 */

export default function () {
  return {
    analyticsEndpoint: 'https://zqqgwwumllncmhfcxexw.functions.supabase.co/logger',

    builtinModules: [
      '3pm', 'auth', 'backup', 'bluetooth', 'confetti', 'contract', 'desktop', 'edit',
      'files', 'gamepad', 'help', 'hid', 'lang', 'midi', 'peer', 'ping', 'repl', 'screensaver', 'serial',
      'speak', 'socket', 'three', 'usb', 'view', 'vm', 'wallet', 'wasm', 'worker', 'www'
    ],

    defaultFilesystemOverlayConfig: {
      // AsyncMirror is not the ideal way to handle this, but it works for now
      // until migration from sync to async in the fsModules is complete
      '/': {
        fs: 'AsyncMirror',
        options: {
          sync: { fs: 'InMemory' },
          async: {
            fs: 'IndexedDB',
            options: {
              storeName: 'web3os'
            }
          }
        }
      },
    
      '/bin': { fs: 'InMemory' },
      '/tmp': { fs: 'InMemory' },
      '/mount': { fs: 'InMemory' },
      '/proc': { fs: 'InMemory' }
    },

    defaultPackages: [
      'https://unpkg.com/@web3os-apps/etherscan',
      'https://unpkg.com/@web3os-apps/git',
      'https://unpkg.com/@web3os-apps/runkit',
      'https://unpkg.com/@web3os-apps/markdown',
      'https://unpkg.com/@web3os-apps/doom',
      'https://unpkg.com/@web3os-apps/diablo',
      'https://unpkg.com/@web3os-apps/wolfenstein',
      'https://unpkg.com/@web3os-apps/minipaint',
      'https://unpkg.com/@web3os-apps/rubikscube'
    ],

    ipechoEndpoint: 'https://ipecho.net/plain',

    kernelEvents: [
      'MemoryLoaded', 'FilesystemLoaded', 'FilesystemModulesLoaded', 'KernelBinsLoaded', 'BuiltinModulesLoaded',
      'ModuleLoaded', 'PackagesLoaded', 'AutostartStart', 'AutostartEnd', 'ScreensaverStart', 'ScreensaverEnd'
    ],

    screensaverTimeout: 90000
  }
}
