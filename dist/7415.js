(self.webpackChunk_web3os_core_kernel=self.webpackChunk_web3os_core_kernel||[]).push([[7415,7753,7076,2809,200],{85529:(e,t,r)=>{"use strict";var i=r(61874).Buffer;e.exports=function(e){if(e.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),r=0;r<t.length;r++)t[r]=255;for(var n=0;n<e.length;n++){var o=e.charAt(n),a=o.charCodeAt(0);if(255!==t[a])throw new TypeError(o+" is ambiguous");t[a]=n}var c=e.length,s=e.charAt(0),p=Math.log(c)/Math.log(256),h=Math.log(256)/Math.log(c);function u(e){if("string"!=typeof e)throw new TypeError("Expected String");if(0===e.length)return i.alloc(0);for(var r=0,n=0,o=0;e[r]===s;)n++,r++;for(var a=(e.length-r)*p+1>>>0,h=new Uint8Array(a);e[r];){var u=t[e.charCodeAt(r)];if(255===u)return;for(var f=0,d=a-1;(0!==u||f<o)&&-1!==d;d--,f++)u+=c*h[d]>>>0,h[d]=u%256>>>0,u=u/256>>>0;if(0!==u)throw new Error("Non-zero carry");o=f,r++}for(var l=a-o;l!==a&&0===h[l];)l++;var y=i.allocUnsafe(n+(a-l));y.fill(0,0,n);for(var v=n;l!==a;)y[v++]=h[l++];return y}return{encode:function(t){if((Array.isArray(t)||t instanceof Uint8Array)&&(t=i.from(t)),!i.isBuffer(t))throw new TypeError("Expected Buffer");if(0===t.length)return"";for(var r=0,n=0,o=0,a=t.length;o!==a&&0===t[o];)o++,r++;for(var p=(a-o)*h+1>>>0,u=new Uint8Array(p);o!==a;){for(var f=t[o],d=0,l=p-1;(0!==f||d<n)&&-1!==l;l--,d++)f+=256*u[l]>>>0,u[l]=f%c>>>0,f=f/c>>>0;if(0!==f)throw new Error("Non-zero carry");n=d,o++}for(var y=p-n;y!==p&&0===u[y];)y++;for(var v=s.repeat(r);y<p;++y)v+=e.charAt(u[y]);return v},decodeUnsafe:u,decode:function(e){var t=u(e);if(t)return t;throw new Error("Non-base"+c+" character")}}}},31511:(e,t,r)=>{var i=r(85529);e.exports=i("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")},22971:(e,t,r)=>{"use strict";var i=r(31511),n=r(61874).Buffer;e.exports=function(e){function t(t){var r=t.slice(0,-4),i=t.slice(-4),n=e(r);if(!(i[0]^n[0]|i[1]^n[1]|i[2]^n[2]|i[3]^n[3]))return r}return{encode:function(t){var r=e(t);return i.encode(n.concat([t,r],t.length+4))},decode:function(e){var r=t(i.decode(e));if(!r)throw new Error("Invalid checksum");return r},decodeUnsafe:function(e){var r=i.decodeUnsafe(e);if(r)return t(r)}}}},74801:(e,t,r)=>{"use strict";var i=r(53644),n=r(22971);e.exports=n((function(e){var t=i("sha256").update(e).digest();return i("sha256").update(t).digest()}))},268:(e,t,r)=>{var i=r(42943),n=r(61874).Buffer,o=r(35906),a=r(74801),c=r(38049),s=n.from("Bitcoin seed","utf8"),p=2147483648,h={private:76066276,public:76067358};function u(e){this.versions=e||h,this.depth=0,this.index=0,this._privateKey=null,this._publicKey=null,this.chainCode=null,this._fingerprint=0,this.parentFingerprint=0}function f(e,t,r){var i=n.allocUnsafe(78);i.writeUInt32BE(t,0),i.writeUInt8(e.depth,4);var o=e.depth?e.parentFingerprint:0;return i.writeUInt32BE(o,5),i.writeUInt32BE(e.index,9),e.chainCode.copy(i,13),r.copy(i,45),i}function d(e){var t=o.createHash("sha256").update(e).digest();return o.createHash("ripemd160").update(t).digest()}Object.defineProperty(u.prototype,"fingerprint",{get:function(){return this._fingerprint}}),Object.defineProperty(u.prototype,"identifier",{get:function(){return this._identifier}}),Object.defineProperty(u.prototype,"pubKeyHash",{get:function(){return this.identifier}}),Object.defineProperty(u.prototype,"privateKey",{get:function(){return this._privateKey},set:function(e){i.equal(e.length,32,"Private key must be 32 bytes."),i(!0===c.privateKeyVerify(e),"Invalid private key"),this._privateKey=e,this._publicKey=n.from(c.publicKeyCreate(e,!0)),this._identifier=d(this.publicKey),this._fingerprint=this._identifier.slice(0,4).readUInt32BE(0)}}),Object.defineProperty(u.prototype,"publicKey",{get:function(){return this._publicKey},set:function(e){i(33===e.length||65===e.length,"Public key must be 33 or 65 bytes."),i(!0===c.publicKeyVerify(e),"Invalid public key"),this._publicKey=n.from(c.publicKeyConvert(e,!0)),this._identifier=d(this.publicKey),this._fingerprint=this._identifier.slice(0,4).readUInt32BE(0),this._privateKey=null}}),Object.defineProperty(u.prototype,"privateExtendedKey",{get:function(){return this._privateKey?a.encode(f(this,this.versions.private,n.concat([n.alloc(1,0),this.privateKey]))):null}}),Object.defineProperty(u.prototype,"publicExtendedKey",{get:function(){return a.encode(f(this,this.versions.public,this.publicKey))}}),u.prototype.derive=function(e){if("m"===e||"M"===e||"m'"===e||"M'"===e)return this;var t=e.split("/"),r=this;return t.forEach((function(e,t){if(0!==t){var n=e.length>1&&"'"===e[e.length-1],o=parseInt(e,10);i(o<p,"Invalid index"),n&&(o+=p),r=r.deriveChild(o)}else i(/^[mM]{1}/.test(e),'Path must start with "m" or "M"')})),r},u.prototype.deriveChild=function(e){var t,r=e>=p,a=n.allocUnsafe(4);if(a.writeUInt32BE(e,0),r){i(this.privateKey,"Could not derive hardened child key");var s=this.privateKey,h=n.alloc(1,0);s=n.concat([h,s]),t=n.concat([s,a])}else t=n.concat([this.publicKey,a]);var f=o.createHmac("sha512",this.chainCode).update(t).digest(),d=f.slice(0,32),l=f.slice(32),y=new u(this.versions);if(this.privateKey)try{y.privateKey=n.from(c.privateKeyTweakAdd(n.from(this.privateKey),d))}catch(t){return this.deriveChild(e+1)}else try{y.publicKey=n.from(c.publicKeyTweakAdd(n.from(this.publicKey),d,!0))}catch(t){return this.deriveChild(e+1)}return y.chainCode=l,y.depth=this.depth+1,y.parentFingerprint=this.fingerprint,y.index=e,y},u.prototype.sign=function(e){return n.from(c.ecdsaSign(e,this.privateKey).signature)},u.prototype.verify=function(e,t){return c.ecdsaVerify(Uint8Array.from(t),Uint8Array.from(e),Uint8Array.from(this.publicKey))},u.prototype.wipePrivateData=function(){return this._privateKey&&o.randomBytes(this._privateKey.length).copy(this._privateKey),this._privateKey=null,this},u.prototype.toJSON=function(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}},u.fromMasterSeed=function(e,t){var r=o.createHmac("sha512",s).update(e).digest(),i=r.slice(0,32),n=r.slice(32),a=new u(t);return a.chainCode=n,a.privateKey=i,a},u.fromExtendedKey=function(e,t){var r=new u(t=t||h),n=a.decode(e),o=n.readUInt32BE(0);i(o===t.private||o===t.public,"Version mismatch: does not match private or public"),r.depth=n.readUInt8(4),r.parentFingerprint=n.readUInt32BE(5),r.index=n.readUInt32BE(9),r.chainCode=n.slice(13,45);var c=n.slice(45);return 0===c.readUInt8(0)?(i(o===t.private,"Version mismatch: version does not match private"),r.privateKey=c.slice(1)):(i(o===t.public,"Version mismatch: version does not match public"),r.publicKey=c),r},u.fromJSON=function(e){return u.fromExtendedKey(e.xpriv)},u.HARDENED_OFFSET=p,e.exports=u},81388:()=>{},88941:()=>{},54504:()=>{}}]);
//# sourceMappingURL=7415.js.map