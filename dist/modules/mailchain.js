(()=>{var e={55481:(e,t,n)=>{"use strict";var r=n(14224);const o=/[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g,i=()=>{const e={enabled:void 0!==r&&"0"!==r.env.FORCE_COLOR,visible:!0,styles:{},keys:{}},t=(e,t,n)=>"function"==typeof e?e(t):e.wrap(t,n),i=(n,r)=>{if(""===n||null==n)return"";if(!1===e.enabled)return n;if(!1===e.visible)return"";let o=""+n,i=o.includes("\n"),s=r.length;for(s>0&&r.includes("unstyle")&&(r=[...new Set(["unstyle",...r])].reverse());s-- >0;)o=t(e.styles[r[s]],o,i);return o},s=(t,n,r)=>{e.styles[t]=(e=>{let t=e.open=`[${e.codes[0]}m`,n=e.close=`[${e.codes[1]}m`,r=e.regex=new RegExp(`\\u001b\\[${e.codes[1]}m`,"g");return e.wrap=(e,o)=>{e.includes(n)&&(e=e.replace(r,n+t));let i=t+e+n;return o?i.replace(/\r*\n/g,`${n}$&${t}`):i},e})({name:t,codes:n}),(e.keys[r]||(e.keys[r]=[])).push(t),Reflect.defineProperty(e,t,{configurable:!0,enumerable:!0,set(n){e.alias(t,n)},get(){let n=e=>i(e,n.stack);return Reflect.setPrototypeOf(n,e),n.stack=this.stack?this.stack.concat(t):[t],n}})};return s("reset",[0,0],"modifier"),s("bold",[1,22],"modifier"),s("dim",[2,22],"modifier"),s("italic",[3,23],"modifier"),s("underline",[4,24],"modifier"),s("inverse",[7,27],"modifier"),s("hidden",[8,28],"modifier"),s("strikethrough",[9,29],"modifier"),s("black",[30,39],"color"),s("red",[31,39],"color"),s("green",[32,39],"color"),s("yellow",[33,39],"color"),s("blue",[34,39],"color"),s("magenta",[35,39],"color"),s("cyan",[36,39],"color"),s("white",[37,39],"color"),s("gray",[90,39],"color"),s("grey",[90,39],"color"),s("bgBlack",[40,49],"bg"),s("bgRed",[41,49],"bg"),s("bgGreen",[42,49],"bg"),s("bgYellow",[43,49],"bg"),s("bgBlue",[44,49],"bg"),s("bgMagenta",[45,49],"bg"),s("bgCyan",[46,49],"bg"),s("bgWhite",[47,49],"bg"),s("blackBright",[90,39],"bright"),s("redBright",[91,39],"bright"),s("greenBright",[92,39],"bright"),s("yellowBright",[93,39],"bright"),s("blueBright",[94,39],"bright"),s("magentaBright",[95,39],"bright"),s("cyanBright",[96,39],"bright"),s("whiteBright",[97,39],"bright"),s("bgBlackBright",[100,49],"bgBright"),s("bgRedBright",[101,49],"bgBright"),s("bgGreenBright",[102,49],"bgBright"),s("bgYellowBright",[103,49],"bgBright"),s("bgBlueBright",[104,49],"bgBright"),s("bgMagentaBright",[105,49],"bgBright"),s("bgCyanBright",[106,49],"bgBright"),s("bgWhiteBright",[107,49],"bgBright"),e.ansiRegex=o,e.hasColor=e.hasAnsi=t=>(e.ansiRegex.lastIndex=0,"string"==typeof t&&""!==t&&e.ansiRegex.test(t)),e.alias=(t,n)=>{let r="string"==typeof n?e[n]:n;if("function"!=typeof r)throw new TypeError("Expected alias to be the name of an existing color (string) or a function");r.stack||(Reflect.defineProperty(r,"name",{value:t}),e.styles[t]=r,r.stack=[t]),Reflect.defineProperty(e,t,{configurable:!0,enumerable:!0,set(n){e.alias(t,n)},get(){let t=e=>i(e,t.stack);return Reflect.setPrototypeOf(t,e),t.stack=this.stack?this.stack.concat(r.stack):r.stack,t}})},e.theme=t=>{if(null===(n=t)||"object"!=typeof n||Array.isArray(n))throw new TypeError("Expected theme to be an object");var n;for(let n of Object.keys(t))e.alias(n,t[n]);return e},e.alias("unstyle",(t=>"string"==typeof t&&""!==t?(e.ansiRegex.lastIndex=0,t.replace(e.ansiRegex,"")):"")),e.alias("noop",(e=>e)),e.none=e.clear=e.noop,e.stripColor=e.unstyle,e.symbols=n(66394),e.define=s,e};e.exports=i(),e.exports.create=i},66394:(e,t,n)=>{"use strict";var r=n(14224);const o=void 0!==r&&"Hyper"===r.env.TERM_PROGRAM,i=void 0!==r&&"win32"===r.platform,s=void 0!==r&&"linux"===r.platform,a={ballotDisabled:"☒",ballotOff:"☐",ballotOn:"☑",bullet:"•",bulletWhite:"◦",fullBlock:"█",heart:"❤",identicalTo:"≡",line:"─",mark:"※",middot:"·",minus:"－",multiplication:"×",obelus:"÷",pencilDownRight:"✎",pencilRight:"✏",pencilUpRight:"✐",percent:"%",pilcrow2:"❡",pilcrow:"¶",plusMinus:"±",question:"?",section:"§",starsOff:"☆",starsOn:"★",upDownArrow:"↕"},l=Object.assign({},a,{check:"√",cross:"×",ellipsisLarge:"...",ellipsis:"...",info:"i",questionSmall:"?",pointer:">",pointerSmall:"»",radioOff:"( )",radioOn:"(*)",warning:"‼"}),c=Object.assign({},a,{ballotCross:"✘",check:"✔",cross:"✖",ellipsisLarge:"⋯",ellipsis:"…",info:"ℹ",questionFull:"？",questionSmall:"﹖",pointer:s?"▸":"❯",pointerSmall:s?"‣":"›",radioOff:"◯",radioOn:"◉",warning:"⚠"});e.exports=i&&!o?l:c,Reflect.defineProperty(e.exports,"common",{enumerable:!1,value:a}),Reflect.defineProperty(e.exports,"windows",{enumerable:!1,value:l}),Reflect.defineProperty(e.exports,"other",{enumerable:!1,value:c})},94654:(e,t,n)=>{var r=n(14224);const o=Symbol("arg flag");class i extends Error{constructor(e,t){super(e),this.name="ArgError",this.code=t,Object.setPrototypeOf(this,i.prototype)}}function s(e,{argv:t=r.argv.slice(2),permissive:n=!1,stopAtPositional:s=!1}={}){if(!e)throw new i("argument specification object is required","ARG_CONFIG_NO_SPEC");const a={_:[]},l={},c={};for(const t of Object.keys(e)){if(!t)throw new i("argument key cannot be an empty string","ARG_CONFIG_EMPTY_KEY");if("-"!==t[0])throw new i(`argument key must start with '-' but found: '${t}'`,"ARG_CONFIG_NONOPT_KEY");if(1===t.length)throw new i(`argument key must have a name; singular '-' keys are not allowed: ${t}`,"ARG_CONFIG_NONAME_KEY");if("string"==typeof e[t]){l[t]=e[t];continue}let n=e[t],r=!1;if(Array.isArray(n)&&1===n.length&&"function"==typeof n[0]){const[e]=n;n=(t,n,r=[])=>(r.push(e(t,n,r[r.length-1])),r),r=e===Boolean||!0===e[o]}else{if("function"!=typeof n)throw new i(`type missing or not a function or valid array type: ${t}`,"ARG_CONFIG_VAD_TYPE");r=n===Boolean||!0===n[o]}if("-"!==t[1]&&t.length>2)throw new i(`short argument keys (with a single hyphen) must have only one character: ${t}`,"ARG_CONFIG_SHORTOPT_TOOLONG");c[t]=[n,r]}for(let e=0,r=t.length;e<r;e++){const r=t[e];if(s&&a._.length>0){a._=a._.concat(t.slice(e));break}if("--"===r){a._=a._.concat(t.slice(e+1));break}if(r.length>1&&"-"===r[0]){const o="-"===r[1]||2===r.length?[r]:r.slice(1).split("").map((e=>`-${e}`));for(let r=0;r<o.length;r++){const s=o[r],[h,u]="-"===s[1]?s.split(/=(.*)/,2):[s,void 0];let g=h;for(;g in l;)g=l[g];if(!(g in c)){if(n){a._.push(s);continue}throw new i(`unknown or unexpected option: ${h}`,"ARG_UNKNOWN_OPTION")}const[f,d]=c[g];if(!d&&r+1<o.length)throw new i(`option requires argument (but was followed by another short argument): ${h}`,"ARG_MISSING_REQUIRED_SHORTARG");if(d)a[g]=f(!0,g,a[g]);else if(void 0===u){if(t.length<e+2||t[e+1].length>1&&"-"===t[e+1][0]&&(!t[e+1].match(/^-?\d*(\.(?=\d))?\d*$/)||f!==Number&&("undefined"==typeof BigInt||f!==BigInt)))throw new i(`option requires argument: ${h}${h===g?"":` (alias for ${g})`}`,"ARG_MISSING_REQUIRED_LONGARG");a[g]=f(t[e+1],g,a[g]),++e}else a[g]=f(u,g,a[g])}}else a._.push(r)}return a}s.flag=e=>(e[o]=!0,e),s.COUNT=s.flag(((e,t,n)=>(n||0)+1)),s.ArgError=i,e.exports=s},14224:e=>{var t,n,r=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:o}catch(e){t=o}try{n="function"==typeof clearTimeout?clearTimeout:i}catch(e){n=i}}();var a,l=[],c=!1,h=-1;function u(){c&&a&&(c=!1,a.length?l=a.concat(l):h=-1,l.length&&g())}function g(){if(!c){var e=s(u);c=!0;for(var t=l.length;t;){for(a=l,l=[];++h<t;)a&&a[h].run();h=-1,t=l.length}a=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function d(){}r.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];l.push(new f(e,t)),1!==l.length||c||s(g)},f.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=d,r.addListener=d,r.once=d,r.off=d,r.removeListener=d,r.removeAllListeners=d,r.emit=d,r.prependListener=d,r.prependOnceListener=d,r.listeners=function(e){return[]},r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},25105:(e,t)=>{["\\|\\|","\\&\\&",";;","\\|\\&","\\<\\(",">>",">\\&","[&;()|<>]"].join("|");for(var n=0;n<4;n++)(Math.pow(16,8)*Math.random()).toString(16)}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";n(94654);var e=n(55481),t=n.n(e);n(25105),"\n  ".concat(t().bold(t().danger("This is experimental technology")),"\n\n  Please read the Mailchain documentation at:\n  ").concat(t().underline("https://docs.mailchain.xyz"),"\n\n  Usage:\n    mailchain <command> <options>\n\n  Commands:\n    inbox                           Open the Mailchain Web UI\n    install                         Open the Mailchain Getting Started Guide in a new tab\n    addresses                       List addresses known to the Mailchain API\n    list                            List messages\n      --to <address>                  The address that received the message (optional)\n      --from <address>                The address that sent the message (optional)\n      --file <file>                   Save the list to a file\n    send                            Send a message\n      --to <address>                  The address of the recipient\n      --from <address>                The address of the sender\n      --subject <subject>             The subject of the message\n      --file <file>                   The path to the file to use as message content\n    download\n      --id <id>                       The message id to download\n      --file <file>                   The path to the output file\n\n  Options:\n    --help                          Print this help message\n    --host <localhost>              The hostname or IP address of the mailchain server\n    --network <mainnet>             The network to use (mainnet, ropsten, goerli, rinkeby, local)\n    --port <8080>                   The port of the mailchain server\n    --protocol <ethereum>           The protocol to use (ethereum, algorand, substrate)\n    --version                       Print the version information\n"),Boolean,Boolean})()})();
//# sourceMappingURL=mailchain.js.map