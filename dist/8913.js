/*! For license information please see 8913.js.LICENSE.txt */
(self.webpackChunk_web3os_core_kernel=self.webpackChunk_web3os_core_kernel||[]).push([[8913,7753,7076,2809,200],{15989:(t,e,n)=>{"use strict";n.r(e),n.d(e,{account:()=>N,allChains:()=>I,connect:()=>T,description:()=>_,getBalance:()=>F,help:()=>E,name:()=>k,provider:()=>b,run:()=>Y,send:()=>B,setPrompt:()=>S,sign:()=>$,signer:()=>{},spec:()=>C,switchChain:()=>G,term:()=>m,tokens:()=>x,updateTokenList:()=>O,version:()=>L,web3:()=>w});var r=n(94654),o=n.n(r),a=n(55481),c=n.n(a),i=n(25105),s=n(52018),u=n.n(s);const l="https://open-api.openocean.finance/v1/cross";async function h(t=1){const e=await fetch(`${l}/tokenList?chainId=${t}`),{code:n,data:r}=await e.json();if(200!==n)throw new Error(e);return r}async function f(t=1,e,n){if(!e||!n)throw new Error("Account and inTokenAddress are required");const r=await fetch(`${l}/getBalance?chainId=${t}&account=${e}&inTokenAddress=${n}`),{code:o,data:a}=await r.json();if(200!==o)throw new Error(r);return a}var d=n(53725);function p(t){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(t)}function y(){y=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",a=r.asyncIterator||"@@asyncIterator",c=r.toStringTag||"@@toStringTag";function i(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{i({},"")}catch(t){i=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var o=e&&e.prototype instanceof h?e:h,a=Object.create(o.prototype),c=new E(r||[]);return a._invoke=function(t,e,n){var r="suspendedStart";return function(o,a){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw a;return{value:void 0,done:!0}}for(n.method=o,n.arg=a;;){var c=n.delegate;if(c){var i=k(c,n);if(i){if(i===l)continue;return i}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var s=u(t,e,n);if("normal"===s.type){if(r=n.done?"completed":"suspendedYield",s.arg===l)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r="completed",n.method="throw",n.arg=s.arg)}}}(t,n,c),a}function u(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var l={};function h(){}function f(){}function d(){}var v={};i(v,o,(function(){return this}));var g=Object.getPrototypeOf,w=g&&g(g(C([])));w&&w!==e&&n.call(w,o)&&(v=w);var m=d.prototype=h.prototype=Object.create(v);function b(t){["next","throw","return"].forEach((function(e){i(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function r(o,a,c,i){var s=u(t[o],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==p(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,c,i)}),(function(t){r("throw",t,c,i)})):e.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,i)}))}i(s.arg)}var o;this._invoke=function(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}}function k(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,k(t,e),"throw"===e.method))return l;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return l}var r=u(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,l;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,l):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,l)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function E(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function C(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,a=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return a.next=a}}return{next:I}}function I(){return{value:void 0,done:!0}}return f.prototype=d,i(m,"constructor",d),i(d,"constructor",f),f.displayName=i(d,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===f||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,d):(t.__proto__=d,i(t,c,"GeneratorFunction")),t.prototype=Object.create(m),t},t.awrap=function(t){return{__await:t}},b(x.prototype),i(x.prototype,a,(function(){return this})),t.AsyncIterator=x,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var c=new x(s(e,n,r,o),a);return t.isGeneratorFunction(n)?c:c.next().then((function(t){return t.done?t.value:c.next()}))},b(m),i(m,c,"Generator"),i(m,o,(function(){return this})),i(m,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=C,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(_),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return c.type="throw",c.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var i=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(i&&s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(i){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var c=a?a.completion:{};return c.type=t,c.arg=e,a?(this.method="next",this.next=a.finallyLoc,l):this.complete(c)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),l},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),_(n),l}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;_(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:C(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),l}},t}function v(t,e,n,r,o,a,c){try{var i=t[a](c),s=i.value}catch(t){return void n(t)}i.done?e(s):Promise.resolve(s).then(r,o)}function g(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function c(t){v(a,r,o,c,i,"next",t)}function i(t){v(a,r,o,c,i,"throw",t)}c(void 0)}))}}var w,m,b,x,k="account",L="0.1.3",_="Manage your web3 wallet",E="\n  ".concat(c().magenta.bold("NOTE: This tool is being replaced by the ".concat(c().underline("wallet")," command")),"\n\n  Usage:\n    account                          ").concat(c().gray("Display your wallet address, or connects if none"),"\n    account <command>                ").concat(c().gray("Perform an account action"),"\n\n  Commands:\n    connect                          ").concat(c().gray("Connect to your wallet"),"\n    chain                            ").concat(c().gray("Display information about the current chain"),"\n    chain <id>                       ").concat(c().gray("Switch to chain id; may be hex, decimal, or name"),"\n    balance                          ").concat(c().gray("Display the account balance of the chain's native currency"),"\n    balance <token>                  ").concat(c().gray("Displays the account balance of the ERC20 token, eg. USDC"),"\n    sign <message>                   ").concat(c().gray("Sign a message using your wallet"),"\n    send <amount> <address>          ").concat(c().gray("Send <amount> of native coin to <address>"),"\n\n  Options:\n    --help                         Print this help message\n    --version                      Print the version information\n    --wallet                       {metamask},walletconnect\n"),C={"--help":Boolean,"--version":Boolean},I=d;function S(t){var e,n;t=t||m||globalThis.Terminal;var r="".concat(c().gray("0x")).concat(c().primary(null===(e=N.address)||void 0===e?void 0:e.substr(2,4))).concat(c().gray("..")).concat(c().primary(null===(n=N.address)||void 0===n?void 0:n.substr(-4,4)));t.promptFormat="(".concat(c().warning(N.chain.chain),")[").concat(c().info("0x".concat(N.chainId.toString(16))),"]<").concat(r,">:{cwd}").concat(c().green("#")," ")}b=u().givenProvider,w=new(u())(b);var N={address:null,_chainId:1,encryptionPublicKey:null,get chain(){var t=this;return null==d?void 0:d.find((function(e){return e.chainId===t._chainId}))},get chainId(){return this._chainId},set chainId(t){this._chainId=Number(t),O(),S()}};function O(){return P.apply(this,arguments)}function P(){return(P=g(y().mark((function t(){return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,h(N.chainId);case 3:x=t.sent,t.next=10;break;case 6:throw t.prev=6,t.t0=t.catch(0),console.error(t.t0),t.t0;case 10:case"end":return t.stop()}}),t,null,[[0,6]])})))).apply(this,arguments)}function T(){return j.apply(this,arguments)}function j(){return(j=g(y().mark((function t(){return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,w.eth.getAccounts();case 3:if(0!==t.sent.length){t.next=7;break}return t.next=7,b.request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]});case 7:return t.next=9,w.eth.getAccounts();case 9:return N.address=t.sent[0],t.next=12,w.eth.getChainId();case 12:N.chainId=t.sent,t.next=18;break;case 15:throw t.prev=15,t.t0=t.catch(0),new Error(c().danger("Failed to connect to web3 provider. Do you have https://metamask.io installed and unlocked?"));case 18:return m.log("".concat(c().success("Connected to account:")," ").concat(c().bold.blue(N.address))),b.on("accountsChanged",(function(t){N.address=t[0],S()})),b.on("chainChanged",(function(t){N.chainId=t})),b.on("connect",(function(t){console.log("connect",t)})),b.on("disconnect",(function(t){console.error("disconnect",t)})),t.abrupt("return",N.address);case 24:case"end":return t.stop()}}),t,null,[[0,15]])})))).apply(this,arguments)}function G(t){return A.apply(this,arguments)}function A(){return(A=g(y().mark((function t(e){var n,r,o,a;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e._[1]){t.next=2;break}return t.abrupt("return",m.log(N.chain));case 2:if(n=e._[1]){t.next=5;break}return t.abrupt("return",m.log(JSON.stringify(N.chain,null,2)));case 5:if(isNaN(parseInt(n))){t.next=9;break}r=parseInt(n),t.next=23;break;case 9:if("string"!=typeof n){t.next=23;break}if("0x"!==n.substr(0,2)){t.next=14;break}r=Number(n),t.next=23;break;case 14:t.t0=n,t.next="ethereum"===t.t0?17:19;break;case 17:return n="eth",t.abrupt("break",19);case 19:if(o=d.find((function(t){return t.chain.toLowerCase()===n.toLowerCase()||t.network.toLowerCase()===n.toLowerCase()||t.name.toLowerCase()===n.toLowerCase()||t.infoURL.toLowerCase()===n.toLowerCase()||t.shortName.toLowerCase()===n.toLowerCase()||t.nativeCurrency.name.toLowerCase()===n.toLowerCase()}))){t.next=22;break}return t.abrupt("return",m.log(c().danger("Cannot find chain ".concat(n))));case 22:r=o.chainId;case 23:if(a=null==d?void 0:d.find((function(t){return t.chainId===r})),a){t.next=26;break}return t.abrupt("return",m.log(c().danger("Cannot find chain ".concat(n))));case 26:return t.prev=26,m.log(c().warning("Trying to switch to the ".concat(a.name," network..."))),t.next=30,b.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x".concat(a.chainId.toString(16))}]});case 30:N.chainId=a.chainId,t.next=44;break;case 33:if(t.prev=33,t.t1=t.catch(26),4902!==t.t1.code){t.next=41;break}return m.log(c().warning("The network wasn't known by the wallet, trying to add it now..")),t.next=39,b.request({method:"wallet_addEthereumChain",params:[{chainId:"0x".concat(a.chainId.toString(16)),chainName:a.name,nativeCurrency:a.nativeCurrency,rpcUrls:a.rpc}]});case 39:t.next=42;break;case 41:console.error(t.t1);case 42:console.error(t.t1),m.log(c().danger(t.t1.message));case 44:case"end":return t.stop()}}),t,null,[[26,33]])})))).apply(this,arguments)}function F(t){return D.apply(this,arguments)}function D(){return(D=g(y().mark((function t(e){var n,r,o,a,i;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(N.address){t.next=2;break}throw new Error("Not connected to wallet");case 2:if(n=0,e){t.next=14;break}return t.t0=w.utils,t.next=7,w.eth.getBalance(N.address);case 7:t.t1=t.sent,t.t2=t.t0.fromWei.call(t.t0,t.t1),t.t3=t.t2+" ",t.t4=N.chain.nativeCurrency.symbol,n=t.t3+t.t4,t.next=21;break;case 14:if(a=x?"0x"===e.substr(0,2)?null===(r=x)||void 0===r?void 0:r.find((function(t){return t.address===e})):null===(o=x)||void 0===o?void 0:o.find((function(t){return t.symbol===e})):null){t.next=17;break}throw new Error(c().danger("Unknown token on this network"));case 17:return t.next=19,f(N.chainId,N.address,a.address);case 19:i=t.sent,n=i[0].balance+" "+i[0].symbol;case 21:return t.abrupt("return",n);case 22:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function $(t){return q.apply(this,arguments)}function q(){return(q=g(y().mark((function t(e){return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=e.replace(/\\n/g,"\n"),t.next=3,w.eth.personal.sign(e,N.address);case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function B(t){return U.apply(this,arguments)}function U(){return(U=g(y().mark((function t(e){return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w.eth.sendTransaction({from:N.address,to:e._[2],value:u().utils.toWei(e._[1])});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function R(){return W.apply(this,arguments)}function W(){return(W=g(y().mark((function t(){return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(N.address){t.next=4;break}return t.next=3,T();case 3:return t.abrupt("return",t.sent);case 4:m.log(N.address);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Y(t,e){return J.apply(this,arguments)}function J(){return(J=g(y().mark((function t(e,n){var r,a,c;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(m=e,a=o()(C,{argv:(0,i.Q)(n)}),c=null===(r=a._)||void 0===r?void 0:r[0],!a["--version"]){t.next=5;break}return t.abrupt("return",m.log(L));case 5:if(!a["--help"]){t.next=7;break}return t.abrupt("return",m.log(E));case 7:t.t0=c,t.next="connect"===t.t0?10:"chain"===t.t0?11:"balance"===t.t0?12:"sign"===t.t0?17:"send"===t.t0?22:void 0===t.t0?27:28;break;case 10:return t.abrupt("return",T(a));case 11:return t.abrupt("return",G(a));case 12:return t.t1=m,t.next=15,F(null==a?void 0:a._[1]);case 15:return t.t2=t.sent,t.abrupt("return",t.t1.log.call(t.t1,t.t2));case 17:return t.t3=m,t.next=20,$(null==a?void 0:a._[1]);case 20:return t.t4=t.sent,t.abrupt("return",t.t3.log.call(t.t3,t.t4));case 22:return t.t5=m,t.next=25,B(a);case 25:return t.t6=t.sent,t.abrupt("return",t.t5.log.call(t.t5,t.t6));case 27:return t.abrupt("return",R(a));case 28:throw new Error("account: invalid command");case 29:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},11314:()=>{},79391:()=>{},81388:()=>{},88941:()=>{},54504:()=>{}}]);
//# sourceMappingURL=8913.js.map