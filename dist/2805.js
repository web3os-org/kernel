/*! For license information please see 2805.js.LICENSE.txt */
(self.webpackChunk_web3os_core_kernel=self.webpackChunk_web3os_core_kernel||[]).push([[2805],{94654:(t,e,n)=>{var r=n(14224);const o=Symbol("arg flag");class i extends Error{constructor(t,e){super(t),this.name="ArgError",this.code=e,Object.setPrototypeOf(this,i.prototype)}}function a(t,{argv:e=r.argv.slice(2),permissive:n=!1,stopAtPositional:a=!1}={}){if(!t)throw new i("argument specification object is required","ARG_CONFIG_NO_SPEC");const c={_:[]},s={},l={};for(const e of Object.keys(t)){if(!e)throw new i("argument key cannot be an empty string","ARG_CONFIG_EMPTY_KEY");if("-"!==e[0])throw new i(`argument key must start with '-' but found: '${e}'`,"ARG_CONFIG_NONOPT_KEY");if(1===e.length)throw new i(`argument key must have a name; singular '-' keys are not allowed: ${e}`,"ARG_CONFIG_NONAME_KEY");if("string"==typeof t[e]){s[e]=t[e];continue}let n=t[e],r=!1;if(Array.isArray(n)&&1===n.length&&"function"==typeof n[0]){const[t]=n;n=(e,n,r=[])=>(r.push(t(e,n,r[r.length-1])),r),r=t===Boolean||!0===t[o]}else{if("function"!=typeof n)throw new i(`type missing or not a function or valid array type: ${e}`,"ARG_CONFIG_VAD_TYPE");r=n===Boolean||!0===n[o]}if("-"!==e[1]&&e.length>2)throw new i(`short argument keys (with a single hyphen) must have only one character: ${e}`,"ARG_CONFIG_SHORTOPT_TOOLONG");l[e]=[n,r]}for(let t=0,r=e.length;t<r;t++){const r=e[t];if(a&&c._.length>0){c._=c._.concat(e.slice(t));break}if("--"===r){c._=c._.concat(e.slice(t+1));break}if(r.length>1&&"-"===r[0]){const o="-"===r[1]||2===r.length?[r]:r.slice(1).split("").map((t=>`-${t}`));for(let r=0;r<o.length;r++){const a=o[r],[u,f]="-"===a[1]?a.split(/=(.*)/,2):[a,void 0];let h=u;for(;h in s;)h=s[h];if(!(h in l)){if(n){c._.push(a);continue}throw new i(`unknown or unexpected option: ${u}`,"ARG_UNKNOWN_OPTION")}const[d,p]=l[h];if(!p&&r+1<o.length)throw new i(`option requires argument (but was followed by another short argument): ${u}`,"ARG_MISSING_REQUIRED_SHORTARG");if(p)c[h]=d(!0,h,c[h]);else if(void 0===f){if(e.length<t+2||e[t+1].length>1&&"-"===e[t+1][0]&&(!e[t+1].match(/^-?\d*(\.(?=\d))?\d*$/)||d!==Number&&("undefined"==typeof BigInt||d!==BigInt)))throw new i(`option requires argument: ${u}${u===h?"":` (alias for ${h})`}`,"ARG_MISSING_REQUIRED_LONGARG");c[h]=d(e[t+1],h,c[h]),++t}else c[h]=d(f,h,c[h])}}else c._.push(r)}return c}a.flag=t=>(t[o]=!0,t),a.COUNT=a.flag(((t,e,n)=>(n||0)+1)),a.ArgError=i,t.exports=a},42805:(t,e,n)=>{"use strict";n.r(e),n.d(e,{description:()=>m,execute:()=>b,help:()=>y,name:()=>p,run:()=>w,spec:()=>v,version:()=>g});var r=n(94654),o=n.n(r),i=n(55481),a=n.n(i),c={};!function t(e,n,r,o){var i=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL);function a(){}function c(t){var r=n.exports.Promise,o=void 0!==r?r:e.Promise;return"function"==typeof o?new o(t):(t(a,a),null)}var s,l,u,f,h,d,p,g,m,y=(u=Math.floor(1e3/60),f={},h=0,"function"==typeof requestAnimationFrame&&"function"==typeof cancelAnimationFrame?(s=function(t){var e=Math.random();return f[e]=requestAnimationFrame((function n(r){h===r||h+u-1<r?(h=r,delete f[e],t()):f[e]=requestAnimationFrame(n)})),e},l=function(t){f[t]&&cancelAnimationFrame(f[t])}):(s=function(t){return setTimeout(t,u)},l=function(t){return clearTimeout(t)}),{frame:s,cancel:l}),v=(g={},function(){if(d)return d;if(!r&&i){var e=["var CONFETTI, SIZE = {}, module = {};","("+t.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join("\n");try{d=new Worker(URL.createObjectURL(new Blob([e])))}catch(t){return void 0!==typeof console&&"function"==typeof console.warn&&console.warn("🎊 Could not load worker",t),null}!function(t){function e(e,n){t.postMessage({options:e||{},callback:n})}t.init=function(e){var n=e.transferControlToOffscreen();t.postMessage({canvas:n},[n])},t.fire=function(n,r,o){if(p)return e(n,null),p;var i=Math.random().toString(36).slice(2);return p=c((function(r){function a(e){e.data.callback===i&&(delete g[i],t.removeEventListener("message",a),p=null,o(),r())}t.addEventListener("message",a),e(n,i),g[i]=a.bind(null,{data:{callback:i}})}))},t.reset=function(){for(var e in t.postMessage({reset:!0}),g)g[e](),delete g[e]}}(d)}return d}),b={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function w(t,e,n){return function(t,e){return e?e(t):t}(t&&null!=t[e]?t[e]:b[e],n)}function x(t){return t<0?0:Math.floor(t)}function E(t){return parseInt(t,16)}function _(t){return t.map(M)}function M(t){var e=String(t).replace(/[^0-9a-f]/gi,"");return e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),{r:E(e.substring(0,2)),g:E(e.substring(2,4)),b:E(e.substring(4,6))}}function N(t){t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight}function k(t){var e=t.getBoundingClientRect();t.width=e.width,t.height=e.height}function O(t,n){var a,s=!t,l=!!w(n||{},"resize"),u=w(n,"disableForReducedMotion",Boolean),f=i&&w(n||{},"useWorker")?v():null,h=s?N:k,d=!(!t||!f||!t.__confetti_initialized),p="function"==typeof matchMedia&&matchMedia("(prefers-reduced-motion)").matches;function g(e,n,i){for(var s,l,u,f,d=w(e,"particleCount",x),p=w(e,"angle",Number),g=w(e,"spread",Number),m=w(e,"startVelocity",Number),v=w(e,"decay",Number),b=w(e,"gravity",Number),E=w(e,"drift",Number),M=w(e,"colors",_),N=w(e,"ticks",Number),k=w(e,"shapes"),O=w(e,"scalar"),S=function(t){var e=w(t,"origin",Object);return e.x=w(e,"x",Number),e.y=w(e,"y",Number),e}(e),I=d,L=[],C=t.width*S.x,R=t.height*S.y;I--;)L.push((void 0,void 0,l=(s={x:C,y:R,angle:p,spread:g,startVelocity:m,color:M[I%M.length],shape:k[(0,f=k.length,Math.floor(Math.random()*(f-0))+0)],ticks:N,decay:v,gravity:b,drift:E,scalar:O}).angle*(Math.PI/180),u=s.spread*(Math.PI/180),{x:s.x,y:s.y,wobble:10*Math.random(),wobbleSpeed:Math.min(.11,.1*Math.random()+.05),velocity:.5*s.startVelocity+Math.random()*s.startVelocity,angle2D:-l+(.5*u-Math.random()*u),tiltAngle:(.5*Math.random()+.25)*Math.PI,color:s.color,shape:s.shape,tick:0,totalTicks:s.ticks,decay:s.decay,drift:s.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:3*s.gravity,ovalScalar:.6,scalar:s.scalar}));return a?a.addFettis(L):(a=function(t,e,n,i,a){var s,l,u=e.slice(),f=t.getContext("2d"),h=c((function(e){function c(){s=l=null,f.clearRect(0,0,i.width,i.height),a(),e()}s=y.frame((function e(){!r||i.width===o.width&&i.height===o.height||(i.width=t.width=o.width,i.height=t.height=o.height),i.width||i.height||(n(t),i.width=t.width,i.height=t.height),f.clearRect(0,0,i.width,i.height),u=u.filter((function(t){return function(t,e){e.x+=Math.cos(e.angle2D)*e.velocity+e.drift,e.y+=Math.sin(e.angle2D)*e.velocity+e.gravity,e.wobble+=e.wobbleSpeed,e.velocity*=e.decay,e.tiltAngle+=.1,e.tiltSin=Math.sin(e.tiltAngle),e.tiltCos=Math.cos(e.tiltAngle),e.random=Math.random()+2,e.wobbleX=e.x+10*e.scalar*Math.cos(e.wobble),e.wobbleY=e.y+10*e.scalar*Math.sin(e.wobble);var n=e.tick++/e.totalTicks,r=e.x+e.random*e.tiltCos,o=e.y+e.random*e.tiltSin,i=e.wobbleX+e.random*e.tiltCos,a=e.wobbleY+e.random*e.tiltSin;return t.fillStyle="rgba("+e.color.r+", "+e.color.g+", "+e.color.b+", "+(1-n)+")",t.beginPath(),"circle"===e.shape?t.ellipse?t.ellipse(e.x,e.y,Math.abs(i-r)*e.ovalScalar,Math.abs(a-o)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):function(t,e,n,r,o,i,a,c,s){t.save(),t.translate(e,n),t.rotate(i),t.scale(r,o),t.arc(0,0,1,0,c,void 0),t.restore()}(t,e.x,e.y,Math.abs(i-r)*e.ovalScalar,Math.abs(a-o)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):(t.moveTo(Math.floor(e.x),Math.floor(e.y)),t.lineTo(Math.floor(e.wobbleX),Math.floor(o)),t.lineTo(Math.floor(i),Math.floor(a)),t.lineTo(Math.floor(r),Math.floor(e.wobbleY))),t.closePath(),t.fill(),e.tick<e.totalTicks}(f,t)})),u.length?s=y.frame(e):c()})),l=c}));return{addFettis:function(t){return u=u.concat(t),h},canvas:t,promise:h,reset:function(){s&&y.cancel(s),l&&l()}}}(t,L,h,n,i)).promise}function m(n){var r=u||w(n,"disableForReducedMotion",Boolean),o=w(n,"zIndex",Number);if(r&&p)return c((function(t){t()}));s&&a?t=a.canvas:s&&!t&&(t=function(t){var e=document.createElement("canvas");return e.style.position="fixed",e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",e.style.zIndex=t,e}(o),document.body.appendChild(t)),l&&!d&&h(t);var i={width:t.width,height:t.height};function m(){if(f){var e={getBoundingClientRect:function(){if(!s)return t.getBoundingClientRect()}};return h(e),void f.postMessage({resize:{width:e.width,height:e.height}})}i.width=i.height=null}function y(){a=null,l&&e.removeEventListener("resize",m),s&&t&&(document.body.removeChild(t),t=null,d=!1)}return f&&!d&&f.init(t),d=!0,f&&(t.__confetti_initialized=!0),l&&e.addEventListener("resize",m,!1),f?f.fire(n,i,y):g(n,i,y)}return m.reset=function(){f&&f.reset(),a&&a.reset()},m}function S(){return m||(m=O(null,{useWorker:!0,resize:!0})),m}n.exports=function(){return S().apply(this,arguments)},n.exports.reset=function(){S().reset()},n.exports.create=O}(function(){return"undefined"!=typeof window?window:"undefined"!=typeof self?self:this||{}}(),c,!1);const s=c.exports;c.exports.create;var l=n(25105);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function f(){f=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",i=r.asyncIterator||"@@asyncIterator",a=r.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var o=e&&e.prototype instanceof d?e:d,i=Object.create(o.prototype),a=new N(r||[]);return i._invoke=function(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return{value:void 0,done:!0}}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var c=E(a,n);if(c){if(c===h)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var s=l(t,e,n);if("normal"===s.type){if(r=n.done?"completed":"suspendedYield",s.arg===h)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r="completed",n.method="throw",n.arg=s.arg)}}}(t,n,a),i}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var h={};function d(){}function p(){}function g(){}var m={};c(m,o,(function(){return this}));var y=Object.getPrototypeOf,v=y&&y(y(k([])));v&&v!==e&&n.call(v,o)&&(m=v);var b=g.prototype=d.prototype=Object.create(m);function w(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function r(o,i,a,c){var s=l(t[o],t,i);if("throw"!==s.type){var f=s.arg,h=f.value;return h&&"object"==u(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(h).then((function(t){f.value=t,a(f)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}}function E(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,E(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var r=l(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,h;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function M(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0)}function k(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:O}}function O(){return{value:void 0,done:!0}}return p.prototype=g,c(b,"constructor",g),c(g,"constructor",p),p.displayName=c(g,a,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===p||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,c(t,a,"GeneratorFunction")),t.prototype=Object.create(b),t},t.awrap=function(t){return{__await:t}},w(x.prototype),c(x.prototype,i,(function(){return this})),t.AsyncIterator=x,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new x(s(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},w(b),c(b,a,"Generator"),c(b,o,(function(){return this})),c(b,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=k,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(M),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),M(n),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;M(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:k(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),h}},t}function h(t,e,n,r,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function d(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){h(i,r,o,a,c,"next",t)}function c(t){h(i,r,o,a,c,"throw",t)}a(void 0)}))}}var p="confetti",g="0.1.0",m="Confetti Gun",y="\n  ".concat(a().magenta.bold("web3os Confetti Gun"),"\n  Powered by https://github.com/catdad/canvas-confetti\n\n  Usage:\n    confetti <options>          Fire the confetti gun\n\n  Options:\n    --angle <num:90>            The angle in which to launch the confetti (90° is up)\n    --decay <num:0.9>           How quickly the confetti loses speed\n    --drift <num:0>             How much the confetti will drift towards the side\n    --gravity <num:1>           How quickly the confetti is pulled down\n    --originx, -x <num:0.5>     X origin of confetti between 0 (left) and 1 (right)\n    --originy, -y <num:0.5>     Y origin of confetti between 0 (top) and 1 (bottom)\n    --particleCount <int:50>    Number of confetti particles\n    --scalar <num:1>            Scale factor for each particle\n    --spread <num:90>           How far confetti spreads from center\n    --startVelocity <num:45>    How fast the confetti starts, in pixels\n    --ticks <num:200>           How fast the confetti will disappear\n    --zIndex, -z <num:1000000>  z-index of the confetti\n"),v={"--angle":Number,"--decay":Number,"--drift":Number,"--gravity":Number,"--help":Boolean,"--originx":Number,"--originy":Number,"--particleCount":Number,"--scalar":Number,"--spread":Number,"--startVelocity":Number,"--ticks":Number,"--version":Boolean,"--zIndex":Number,"-x":"--originx","-y":"--originy","-z":"--zIndex"};function b(t){s({disableForReducedMotion:!0,angle:t["--angle"]||90,decay:t["--decay"]||.9,drift:t["--drift"]||0,gravity:t["--gravity"]||1,origin:{x:t["--originx"]||.5,y:t["--originy"]||1},particleCount:t["--particleCount"]||50,scalar:t["--scalar"]||1,spread:t["--spread"]||90,startVelocity:t["--startVelocity"]||45,ticks:t["--ticks"]||400,zIndex:t["--zIndex"]||1e6})}function w(t){return x.apply(this,arguments)}function x(){return x=d(f().mark((function t(e){var n,r,i=arguments;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=i.length>1&&void 0!==i[1]?i[1]:"",!(r=o()(v,{argv:(0,l.Q)(n)}))["--version"]){t.next=4;break}return t.abrupt("return",e.log(g));case 4:if(!r["--help"]){t.next=6;break}return t.abrupt("return",e.log(y));case 6:return t.abrupt("return",b(r));case 7:case"end":return t.stop()}}),t)}))),x.apply(this,arguments)}},25105:(t,e)=>{for(var n="(?:"+["\\|\\|","\\&\\&",";;","\\|\\&","\\<\\(",">>",">\\&","[&;()|<>]"].join("|")+")",r="",o=0;o<4;o++)r+=(Math.pow(16,8)*Math.random()).toString(16);e.Q=function(t,e,o){var i=function(t,e,o){var i=new RegExp(["("+n+")","((\\\\['\"|&;()<> \\t]|[^\\s'\"|&;()<> \\t])+|\"((\\\\\"|[^\"])*?)\"|'((\\\\'|[^'])*?)')*"].join("|"),"g"),a=t.match(i).filter(Boolean),c=!1;return a?(e||(e={}),o||(o={}),a.map((function(t,i){if(!c){if(RegExp("^"+n+"$").test(t))return{op:t};for(var s=o.escape||"\\",l=!1,u=!1,f="",h=!1,d=0,p=t.length;d<p;d++){var g=t.charAt(d);if(h=h||!l&&("*"===g||"?"===g),u)f+=g,u=!1;else if(l)g===l?l=!1:"'"==l?f+=g:g===s?(d+=1,f+='"'===(g=t.charAt(d))||g===s||"$"===g?g:s+g):f+="$"===g?m():g;else if('"'===g||"'"===g)l=g;else{if(RegExp("^"+n+"$").test(g))return{op:t};if(RegExp("^#$").test(g))return c=!0,f.length?[f,{comment:t.slice(d+1)+a.slice(i+1).join(" ")}]:[{comment:t.slice(d+1)+a.slice(i+1).join(" ")}];g===s?u=!0:f+="$"===g?m():g}}return h?{op:"glob",pattern:f}:f}function m(){var n,o,i,a,c;if(d+=1,"{"===t.charAt(d)){if(d+=1,"}"===t.charAt(d))throw new Error("Bad substitution: "+t.substr(d-2,3));if((n=t.indexOf("}",d))<0)throw new Error("Bad substitution: "+t.substr(d));o=t.substr(d,n-d),d=n}else/[*@#?$!_\-]/.test(t.charAt(d))?(o=t.charAt(d),d+=1):(n=t.substr(d).match(/[^\w\d_]/))?(o=t.substr(d,n.index),d+=n.index-1):(o=t.substr(d),d=t.length);return i="",a=o,void 0===(c="function"==typeof e?e(a):e[a])&&""!=a?c="":void 0===c&&(c="$"),"object"==typeof c?i+r+JSON.stringify(c)+r:i+c}})).reduce((function(t,e){return void 0===e?t:t.concat(e)}),[])):[]}(t,e,o);return"function"!=typeof e?i:i.reduce((function(t,e){if("object"==typeof e)return t.concat(e);var n=e.split(RegExp("("+r+".*?"+r+")","g"));return 1===n.length?t.concat(n[0]):t.concat(n.filter(Boolean).map((function(t){return RegExp("^"+r).test(t)?JSON.parse(t.split(r)[1]):t})))}),[])}}}]);
//# sourceMappingURL=2805.js.map