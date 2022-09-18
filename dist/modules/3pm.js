(()=>{var e={55481:(e,t,r)=>{"use strict";var n=r(14224);const o=/[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g,i=()=>{const e={enabled:void 0!==n&&"0"!==n.env.FORCE_COLOR,visible:!0,styles:{},keys:{}},t=(e,t,r)=>"function"==typeof e?e(t):e.wrap(t,r),i=(r,n)=>{if(""===r||null==r)return"";if(!1===e.enabled)return r;if(!1===e.visible)return"";let o=""+r,i=o.includes("\n"),a=n.length;for(a>0&&n.includes("unstyle")&&(n=[...new Set(["unstyle",...n])].reverse());a-- >0;)o=t(e.styles[n[a]],o,i);return o},a=(t,r,n)=>{e.styles[t]=(e=>{let t=e.open=`[${e.codes[0]}m`,r=e.close=`[${e.codes[1]}m`,n=e.regex=new RegExp(`\\u001b\\[${e.codes[1]}m`,"g");return e.wrap=(e,o)=>{e.includes(r)&&(e=e.replace(n,r+t));let i=t+e+r;return o?i.replace(/\r*\n/g,`${r}$&${t}`):i},e})({name:t,codes:r}),(e.keys[n]||(e.keys[n]=[])).push(t),Reflect.defineProperty(e,t,{configurable:!0,enumerable:!0,set(r){e.alias(t,r)},get(){let r=e=>i(e,r.stack);return Reflect.setPrototypeOf(r,e),r.stack=this.stack?this.stack.concat(t):[t],r}})};return a("reset",[0,0],"modifier"),a("bold",[1,22],"modifier"),a("dim",[2,22],"modifier"),a("italic",[3,23],"modifier"),a("underline",[4,24],"modifier"),a("inverse",[7,27],"modifier"),a("hidden",[8,28],"modifier"),a("strikethrough",[9,29],"modifier"),a("black",[30,39],"color"),a("red",[31,39],"color"),a("green",[32,39],"color"),a("yellow",[33,39],"color"),a("blue",[34,39],"color"),a("magenta",[35,39],"color"),a("cyan",[36,39],"color"),a("white",[37,39],"color"),a("gray",[90,39],"color"),a("grey",[90,39],"color"),a("bgBlack",[40,49],"bg"),a("bgRed",[41,49],"bg"),a("bgGreen",[42,49],"bg"),a("bgYellow",[43,49],"bg"),a("bgBlue",[44,49],"bg"),a("bgMagenta",[45,49],"bg"),a("bgCyan",[46,49],"bg"),a("bgWhite",[47,49],"bg"),a("blackBright",[90,39],"bright"),a("redBright",[91,39],"bright"),a("greenBright",[92,39],"bright"),a("yellowBright",[93,39],"bright"),a("blueBright",[94,39],"bright"),a("magentaBright",[95,39],"bright"),a("cyanBright",[96,39],"bright"),a("whiteBright",[97,39],"bright"),a("bgBlackBright",[100,49],"bgBright"),a("bgRedBright",[101,49],"bgBright"),a("bgGreenBright",[102,49],"bgBright"),a("bgYellowBright",[103,49],"bgBright"),a("bgBlueBright",[104,49],"bgBright"),a("bgMagentaBright",[105,49],"bgBright"),a("bgCyanBright",[106,49],"bgBright"),a("bgWhiteBright",[107,49],"bgBright"),e.ansiRegex=o,e.hasColor=e.hasAnsi=t=>(e.ansiRegex.lastIndex=0,"string"==typeof t&&""!==t&&e.ansiRegex.test(t)),e.alias=(t,r)=>{let n="string"==typeof r?e[r]:r;if("function"!=typeof n)throw new TypeError("Expected alias to be the name of an existing color (string) or a function");n.stack||(Reflect.defineProperty(n,"name",{value:t}),e.styles[t]=n,n.stack=[t]),Reflect.defineProperty(e,t,{configurable:!0,enumerable:!0,set(r){e.alias(t,r)},get(){let t=e=>i(e,t.stack);return Reflect.setPrototypeOf(t,e),t.stack=this.stack?this.stack.concat(n.stack):n.stack,t}})},e.theme=t=>{if(null===(r=t)||"object"!=typeof r||Array.isArray(r))throw new TypeError("Expected theme to be an object");var r;for(let r of Object.keys(t))e.alias(r,t[r]);return e},e.alias("unstyle",(t=>"string"==typeof t&&""!==t?(e.ansiRegex.lastIndex=0,t.replace(e.ansiRegex,"")):"")),e.alias("noop",(e=>e)),e.none=e.clear=e.noop,e.stripColor=e.unstyle,e.symbols=r(66394),e.define=a,e};e.exports=i(),e.exports.create=i},66394:(e,t,r)=>{"use strict";var n=r(14224);const o=void 0!==n&&"Hyper"===n.env.TERM_PROGRAM,i=void 0!==n&&"win32"===n.platform,a=void 0!==n&&"linux"===n.platform,s={ballotDisabled:"☒",ballotOff:"☐",ballotOn:"☑",bullet:"•",bulletWhite:"◦",fullBlock:"█",heart:"❤",identicalTo:"≡",line:"─",mark:"※",middot:"·",minus:"－",multiplication:"×",obelus:"÷",pencilDownRight:"✎",pencilRight:"✏",pencilUpRight:"✐",percent:"%",pilcrow2:"❡",pilcrow:"¶",plusMinus:"±",question:"?",section:"§",starsOff:"☆",starsOn:"★",upDownArrow:"↕"},l=Object.assign({},s,{check:"√",cross:"×",ellipsisLarge:"...",ellipsis:"...",info:"i",questionSmall:"?",pointer:">",pointerSmall:"»",radioOff:"( )",radioOn:"(*)",warning:"‼"}),c=Object.assign({},s,{ballotCross:"✘",check:"✔",cross:"✖",ellipsisLarge:"⋯",ellipsis:"…",info:"ℹ",questionFull:"？",questionSmall:"﹖",pointer:a?"▸":"❯",pointerSmall:a?"‣":"›",radioOff:"◯",radioOn:"◉",warning:"⚠"});e.exports=i&&!o?l:c,Reflect.defineProperty(e.exports,"common",{enumerable:!1,value:s}),Reflect.defineProperty(e.exports,"windows",{enumerable:!1,value:l}),Reflect.defineProperty(e.exports,"other",{enumerable:!1,value:c})},94654:(e,t,r)=>{var n=r(14224);const o=Symbol("arg flag");class i extends Error{constructor(e,t){super(e),this.name="ArgError",this.code=t,Object.setPrototypeOf(this,i.prototype)}}function a(e,{argv:t=n.argv.slice(2),permissive:r=!1,stopAtPositional:a=!1}={}){if(!e)throw new i("argument specification object is required","ARG_CONFIG_NO_SPEC");const s={_:[]},l={},c={};for(const t of Object.keys(e)){if(!t)throw new i("argument key cannot be an empty string","ARG_CONFIG_EMPTY_KEY");if("-"!==t[0])throw new i(`argument key must start with '-' but found: '${t}'`,"ARG_CONFIG_NONOPT_KEY");if(1===t.length)throw new i(`argument key must have a name; singular '-' keys are not allowed: ${t}`,"ARG_CONFIG_NONAME_KEY");if("string"==typeof e[t]){l[t]=e[t];continue}let r=e[t],n=!1;if(Array.isArray(r)&&1===r.length&&"function"==typeof r[0]){const[e]=r;r=(t,r,n=[])=>(n.push(e(t,r,n[n.length-1])),n),n=e===Boolean||!0===e[o]}else{if("function"!=typeof r)throw new i(`type missing or not a function or valid array type: ${t}`,"ARG_CONFIG_VAD_TYPE");n=r===Boolean||!0===r[o]}if("-"!==t[1]&&t.length>2)throw new i(`short argument keys (with a single hyphen) must have only one character: ${t}`,"ARG_CONFIG_SHORTOPT_TOOLONG");c[t]=[r,n]}for(let e=0,n=t.length;e<n;e++){const n=t[e];if(a&&s._.length>0){s._=s._.concat(t.slice(e));break}if("--"===n){s._=s._.concat(t.slice(e+1));break}if(n.length>1&&"-"===n[0]){const o="-"===n[1]||2===n.length?[n]:n.slice(1).split("").map((e=>`-${e}`));for(let n=0;n<o.length;n++){const a=o[n],[u,g]="-"===a[1]?a.split(/=(.*)/,2):[a,void 0];let h=u;for(;h in l;)h=l[h];if(!(h in c)){if(r){s._.push(a);continue}throw new i(`unknown or unexpected option: ${u}`,"ARG_UNKNOWN_OPTION")}const[f,p]=c[h];if(!p&&n+1<o.length)throw new i(`option requires argument (but was followed by another short argument): ${u}`,"ARG_MISSING_REQUIRED_SHORTARG");if(p)s[h]=f(!0,h,s[h]);else if(void 0===g){if(t.length<e+2||t[e+1].length>1&&"-"===t[e+1][0]&&(!t[e+1].match(/^-?\d*(\.(?=\d))?\d*$/)||f!==Number&&("undefined"==typeof BigInt||f!==BigInt)))throw new i(`option requires argument: ${u}${u===h?"":` (alias for ${h})`}`,"ARG_MISSING_REQUIRED_LONGARG");s[h]=f(t[e+1],h,s[h]),++e}else s[h]=f(g,h,s[h])}}else s._.push(n)}return s}a.flag=e=>(e[o]=!0,e),a.COUNT=a.flag(((e,t,r)=>(r||0)+1)),a.ArgError=i,e.exports=a},14224:e=>{var t,r,n=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:o}catch(e){t=o}try{r="function"==typeof clearTimeout?clearTimeout:i}catch(e){r=i}}();var s,l=[],c=!1,u=-1;function g(){c&&s&&(c=!1,s.length?l=s.concat(l):u=-1,l.length&&h())}function h(){if(!c){var e=a(g);c=!0;for(var t=l.length;t;){for(s=l,l=[];++u<t;)s&&s[u].run();u=-1,t=l.length}s=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===i||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function p(){}n.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new f(e,t)),1!==l.length||c||a(h)},f.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(e){return[]},n.binding=function(e){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}},25105:(e,t)=>{["\\|\\|","\\&\\&",";;","\\|\\&","\\<\\(",">>",">\\&","[&;()|<>]"].join("|");for(var r=0;r<4;r++)(Math.pow(16,8)*Math.random()).toString(16)}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";r(94654);var e=r(55481),t=r.n(e);r(25105),"\n  ".concat(t().blue("3pm"),": ").concat(t().green("The web3os package manager"),"\n\n  Usage:\n    3pm <command> <args> [options]\n\n  Commands:\n    install <name>         Install (or update) package named <name> from the registry\n    install <url>          Install (or update) package located at <url>\n    ls                     List installed packages\n    uninstall <name>       Uninstall package\n\n  Options:\n    --help                 Show this help message\n    --main                 Override a package's main entrypoint\n    --registry             Package registry {https://unpkg.com}\n    --system               Install the package as a SystemJS module\n    --umd                  Install the package as a UMD module\n    --version              Show version information\n"),Boolean,Boolean,Boolean,Boolean,globalThis.Kernel,globalThis.Terminal})()})();
//# sourceMappingURL=3pm.js.map