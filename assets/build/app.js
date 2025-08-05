/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/file-saver/dist/FileSaver.min.js":
/*!*******************************************************!*\
  !*** ./node_modules/file-saver/dist/FileSaver.min.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else // removed by dead control flow
{}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof __webpack_require__.g&&__webpack_require__.g.global===__webpack_require__.g?__webpack_require__.g:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g, true&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map

/***/ }),

/***/ "./node_modules/papaparse/papaparse.min.js":
/*!*************************************************!*\
  !*** ./node_modules/papaparse/papaparse.min.js ***!
  \*************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* @license
Papa Parse
v5.5.3
https://github.com/mholt/PapaParse
License: MIT
*/
((e,t)=>{ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0})(this,function r(){var n="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==n?n:{};var d,s=!n.document&&!!n.postMessage,a=n.IS_PAPA_WORKER||!1,o={},h=0,v={};function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=b(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(t,e){var i=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<i){let e=this._config.newline;e||(r=this._config.quoteChar||'"',e=this._handle.guessLineEndings(t,r)),t=[...t.split(e).slice(i)].join(e)}this.isFirstChunk&&U(this._config.beforeFirstChunk)&&void 0!==(r=this._config.beforeFirstChunk(t))&&(t=r),this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+t,r=(this._partialLine="",this._handle.parse(i,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){t=r.meta.cursor,i=(this._finished||(this._partialLine=i.substring(t-this._baseIndex),this._baseIndex=t),r&&r.data&&(this._rowCount+=r.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview);if(a)n.postMessage({results:r,workerId:v.WORKER_ID,finished:i});else if(U(this._config.chunk)&&!e){if(this._config.chunk(r,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=r=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(r.data),this._completeResults.errors=this._completeResults.errors.concat(r.errors),this._completeResults.meta=r.meta),this._completed||!i||!U(this._config.complete)||r&&r.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),i||r&&r.meta.paused||this._nextChunk(),r}this._halted=!0},this._sendError=function(e){U(this._config.error)?this._config.error(e):a&&this._config.error&&n.postMessage({workerId:v.WORKER_ID,error:e,finished:!1})}}function f(e){var r;(e=e||{}).chunkSize||(e.chunkSize=v.RemoteChunkSize),u.call(this,e),this._nextChunk=s?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),s||(r.onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!s),this._config.downloadRequestHeaders){var e,t=this._config.downloadRequestHeaders;for(e in t)r.setRequestHeader(e,t[e])}var i;this._config.chunkSize&&(i=this._start+this._config.chunkSize-1,r.setRequestHeader("Range","bytes="+this._start+"-"+i));try{r.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}s&&0===r.status&&this._chunkError()}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize||r.responseText.length,this._finished=!this._config.chunkSize||this._start>=(e=>null!==(e=e.getResponseHeader("Content-Range"))?parseInt(e.substring(e.lastIndexOf("/")+1)):-1)(r),this.parseChunk(r.responseText)))},this._chunkError=function(e){e=r.statusText||e;this._sendError(new Error(e))}}function l(e){(e=e||{}).chunkSize||(e.chunkSize=v.LocalChunkSize),u.call(this,e);var i,r,n="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,n?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input,t=(this._config.chunkSize&&(t=Math.min(this._start+this._config.chunkSize,this._input.size),e=r.call(e,this._start,t)),i.readAsText(e,this._config.encoding));n||this._chunkLoaded({target:{result:t}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(i.error)}}function c(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){var e,t;if(!this._finished)return e=this._config.chunkSize,i=e?(t=i.substring(0,e),i.substring(e)):(t=i,""),this._finished=!i,this.parseChunk(t)}}function p(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=y(function(){this._streamCleanUp(),r=!0,this._streamData("")},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function i(m){var n,s,a,t,o=Math.pow(2,53),h=-o,u=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,d=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,i=this,r=0,f=0,l=!1,e=!1,c=[],p={data:[],errors:[],meta:{}};function y(e){return"greedy"===m.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){if(p&&a&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+v.DefaultDelimiter+"'"),a=!1),m.skipEmptyLines&&(p.data=p.data.filter(function(e){return!y(e)})),_()){if(p)if(Array.isArray(p.data[0])){for(var e=0;_()&&e<p.data.length;e++)p.data[e].forEach(t);p.data.splice(0,1)}else p.data.forEach(t);function t(e,t){U(m.transformHeader)&&(e=m.transformHeader(e,t)),c.push(e)}}function i(e,t){for(var i=m.header?{}:[],r=0;r<e.length;r++){var n=r,s=e[r],s=((e,t)=>(e=>(m.dynamicTypingFunction&&void 0===m.dynamicTyping[e]&&(m.dynamicTyping[e]=m.dynamicTypingFunction(e)),!0===(m.dynamicTyping[e]||m.dynamicTyping)))(e)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&((e=>{if(u.test(e)){e=parseFloat(e);if(h<e&&e<o)return 1}})(t)?parseFloat(t):d.test(t)?new Date(t):""===t?null:t):t)(n=m.header?r>=c.length?"__parsed_extra":c[r]:n,s=m.transform?m.transform(s,n):s);"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s}return m.header&&(r>c.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+c.length+" fields but parsed "+r,f+t):r<c.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+c.length+" fields but parsed "+r,f+t)),i}var r;p&&(m.header||m.dynamicTyping||m.transform)&&(r=1,!p.data.length||Array.isArray(p.data[0])?(p.data=p.data.map(i),r=p.data.length):p.data=i(p.data,0),m.header&&p.meta&&(p.meta.fields=c),f+=r)}function _(){return m.header&&0===c.length}function k(e,t,i,r){e={type:e,code:t,message:i};void 0!==r&&(e.row=r),p.errors.push(e)}U(m.step)&&(t=m.step,m.step=function(e){p=e,_()?g():(g(),0!==p.data.length&&(r+=e.data.length,m.preview&&r>m.preview?s.abort():(p.data=p.data[0],t(p,i))))}),this.parse=function(e,t,i){var r=m.quoteChar||'"',r=(m.newline||(m.newline=this.guessLineEndings(e,r)),a=!1,m.delimiter?U(m.delimiter)&&(m.delimiter=m.delimiter(e),p.meta.delimiter=m.delimiter):((r=((e,t,i,r,n)=>{var s,a,o,h;n=n||[",","\t","|",";",v.RECORD_SEP,v.UNIT_SEP];for(var u=0;u<n.length;u++){for(var d,f=n[u],l=0,c=0,p=0,g=(o=void 0,new E({comments:r,delimiter:f,newline:t,preview:10}).parse(e)),_=0;_<g.data.length;_++)i&&y(g.data[_])?p++:(d=g.data[_].length,c+=d,void 0===o?o=d:0<d&&(l+=Math.abs(d-o),o=d));0<g.data.length&&(c/=g.data.length-p),(void 0===a||l<=a)&&(void 0===h||h<c)&&1.99<c&&(a=l,s=f,h=c)}return{successful:!!(m.delimiter=s),bestDelimiter:s}})(e,m.newline,m.skipEmptyLines,m.comments,m.delimitersToGuess)).successful?m.delimiter=r.bestDelimiter:(a=!0,m.delimiter=v.DefaultDelimiter),p.meta.delimiter=m.delimiter),b(m));return m.preview&&m.header&&r.preview++,n=e,s=new E(r),p=s.parse(n,t,i),g(),l?{meta:{paused:!0}}:p||{meta:{paused:!1}}},this.paused=function(){return l},this.pause=function(){l=!0,s.abort(),n=U(m.chunk)?"":n.substring(s.getCharIndex())},this.resume=function(){i.streamer._halted?(l=!1,i.streamer.parseChunk(n,!0)):setTimeout(i.resume,3)},this.aborted=function(){return e},this.abort=function(){e=!0,s.abort(),p.meta.aborted=!0,U(m.complete)&&m.complete(p),n=""},this.guessLineEndings=function(e,t){e=e.substring(0,1048576);var t=new RegExp(P(t)+"([^]*?)"+P(t),"gm"),i=(e=e.replace(t,"")).split("\r"),t=e.split("\n"),e=1<t.length&&t[0].length<i[0].length;if(1===i.length||e)return"\n";for(var r=0,n=0;n<i.length;n++)"\n"===i[n][0]&&r++;return r>=i.length/2?"\r\n":"\r"}}function P(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(C){var S=(C=C||{}).delimiter,O=C.newline,x=C.comments,I=C.step,A=C.preview,T=C.fastMode,D=null,L=!1,F=null==C.quoteChar?'"':C.quoteChar,j=F;if(void 0!==C.escapeChar&&(j=C.escapeChar),("string"!=typeof S||-1<v.BAD_DELIMITERS.indexOf(S))&&(S=","),x===S)throw new Error("Comment character same as delimiter");!0===x?x="#":("string"!=typeof x||-1<v.BAD_DELIMITERS.indexOf(x))&&(x=!1),"\n"!==O&&"\r"!==O&&"\r\n"!==O&&(O="\n");var z=0,M=!1;this.parse=function(i,t,r){if("string"!=typeof i)throw new Error("Input must be a string");var n=i.length,e=S.length,s=O.length,a=x.length,o=U(I),h=[],u=[],d=[],f=z=0;if(!i)return w();if(T||!1!==T&&-1===i.indexOf(F)){for(var l=i.split(O),c=0;c<l.length;c++){if(d=l[c],z+=d.length,c!==l.length-1)z+=O.length;else if(r)return w();if(!x||d.substring(0,a)!==x){if(o){if(h=[],k(d.split(S)),R(),M)return w()}else k(d.split(S));if(A&&A<=c)return h=h.slice(0,A),w(!0)}}return w()}for(var p=i.indexOf(S,z),g=i.indexOf(O,z),_=new RegExp(P(j)+P(F),"g"),m=i.indexOf(F,z);;)if(i[z]===F)for(m=z,z++;;){if(-1===(m=i.indexOf(F,m+1)))return r||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:z}),E();if(m===n-1)return E(i.substring(z,m).replace(_,F));if(F===j&&i[m+1]===j)m++;else if(F===j||0===m||i[m-1]!==j){-1!==p&&p<m+1&&(p=i.indexOf(S,m+1));var y=v(-1===(g=-1!==g&&g<m+1?i.indexOf(O,m+1):g)?p:Math.min(p,g));if(i.substr(m+1+y,e)===S){d.push(i.substring(z,m).replace(_,F)),i[z=m+1+y+e]!==F&&(m=i.indexOf(F,z)),p=i.indexOf(S,z),g=i.indexOf(O,z);break}y=v(g);if(i.substring(m+1+y,m+1+y+s)===O){if(d.push(i.substring(z,m).replace(_,F)),b(m+1+y+s),p=i.indexOf(S,z),m=i.indexOf(F,z),o&&(R(),M))return w();if(A&&h.length>=A)return w(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:z}),m++}}else if(x&&0===d.length&&i.substring(z,z+a)===x){if(-1===g)return w();z=g+s,g=i.indexOf(O,z),p=i.indexOf(S,z)}else if(-1!==p&&(p<g||-1===g))d.push(i.substring(z,p)),z=p+e,p=i.indexOf(S,z);else{if(-1===g)break;if(d.push(i.substring(z,g)),b(g+s),o&&(R(),M))return w();if(A&&h.length>=A)return w(!0)}return E();function k(e){h.push(e),f=z}function v(e){var t=0;return t=-1!==e&&(e=i.substring(m+1,e))&&""===e.trim()?e.length:t}function E(e){return r||(void 0===e&&(e=i.substring(z)),d.push(e),z=n,k(d),o&&R()),w()}function b(e){z=e,k(d),d=[],g=i.indexOf(O,z)}function w(e){if(C.header&&!t&&h.length&&!L){var s=h[0],a=Object.create(null),o=new Set(s);let n=!1;for(let r=0;r<s.length;r++){let i=s[r];if(a[i=U(C.transformHeader)?C.transformHeader(i,r):i]){let e,t=a[i];for(;e=i+"_"+t,t++,o.has(e););o.add(e),s[r]=e,a[i]++,n=!0,(D=null===D?{}:D)[e]=i}else a[i]=1,s[r]=i;o.add(i)}n&&console.warn("Duplicate headers found and renamed."),L=!0}return{data:h,errors:u,meta:{delimiter:S,linebreak:O,aborted:M,truncated:!!e,cursor:f+(t||0),renamedHeaders:D}}}function R(){I(w()),h=[],u=[]}},this.abort=function(){M=!0},this.getCharIndex=function(){return z}}function g(e){var t=e.data,i=o[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,_(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:m,resume:m};if(U(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results}else U(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!r&&_(t.workerId,t.results)}function _(e,t){var i=o[e];U(i.userComplete)&&i.userComplete(t),i.terminate(),delete o[e]}function m(){throw new Error("Not implemented.")}function b(e){if("object"!=typeof e||null===e)return e;var t,i=Array.isArray(e)?[]:{};for(t in e)i[t]=b(e[t]);return i}function y(e,t){return function(){e.apply(t,arguments)}}function U(e){return"function"==typeof e}return v.parse=function(e,t){var i=(t=t||{}).dynamicTyping||!1;U(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!U(t.transform)&&t.transform,!t.worker||!v.WORKERS_SUPPORTED)return i=null,v.NODE_STREAM_INPUT,"string"==typeof e?(e=(e=>65279!==e.charCodeAt(0)?e:e.slice(1))(e),i=new(t.download?f:c)(t)):!0===e.readable&&U(e.read)&&U(e.on)?i=new p(t):(n.File&&e instanceof File||e instanceof Object)&&(i=new l(t)),i.stream(e);(i=(()=>{var e;return!!v.WORKERS_SUPPORTED&&(e=(()=>{var e=n.URL||n.webkitURL||null,t=r.toString();return v.BLOB_URL||(v.BLOB_URL=e.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",t,")();"],{type:"text/javascript"})))})(),(e=new n.Worker(e)).onmessage=g,e.id=h++,o[e.id]=e)})()).userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=U(t.step),t.chunk=U(t.chunk),t.complete=U(t.complete),t.error=U(t.error),delete t.worker,i.postMessage({input:e,config:t,workerId:i.id})},v.unparse=function(e,t){var n=!1,_=!0,m=",",y="\r\n",s='"',a=s+s,i=!1,r=null,o=!1,h=((()=>{if("object"==typeof t){if("string"!=typeof t.delimiter||v.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter),"boolean"!=typeof t.quotes&&"function"!=typeof t.quotes&&!Array.isArray(t.quotes)||(n=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines),"string"==typeof t.newline&&(y=t.newline),"string"==typeof t.quoteChar&&(s=t.quoteChar),"boolean"==typeof t.header&&(_=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns}void 0!==t.escapeChar&&(a=t.escapeChar+s),t.escapeFormulae instanceof RegExp?o=t.escapeFormulae:"boolean"==typeof t.escapeFormulae&&t.escapeFormulae&&(o=/^[=+\-@\t\r].*$/)}})(),new RegExp(P(s),"g"));"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,i);if("object"==typeof e[0])return u(r||Object.keys(e[0]),e,i)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||r),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e,t,i){var r="",n=("string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t)),Array.isArray(e)&&0<e.length),s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(r+=m),r+=k(e[a],a);0<t.length&&(r+=y)}for(var o=0;o<t.length;o++){var h=(n?e:t[o]).length,u=!1,d=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var f=[],l=0;l<h;l++){var c=s?e[l]:l;f.push(t[o][c])}u=""===f.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!d&&(r+=m);var g=n&&s?e[p]:p;r+=k(t[o][g],p)}o<t.length-1&&(!i||0<h&&!d)&&(r+=y)}}return r}function k(e,t){var i,r;return null==e?"":e.constructor===Date?JSON.stringify(e).slice(1,25):(r=!1,o&&"string"==typeof e&&o.test(e)&&(e="'"+e,r=!0),i=e.toString().replace(h,a),(r=r||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||((e,t)=>{for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return!0;return!1})(i,v.BAD_DELIMITERS)||-1<i.indexOf(m)||" "===i.charAt(0)||" "===i.charAt(i.length-1))?s+i+s:i)}},v.RECORD_SEP=String.fromCharCode(30),v.UNIT_SEP=String.fromCharCode(31),v.BYTE_ORDER_MARK="\ufeff",v.BAD_DELIMITERS=["\r","\n",'"',v.BYTE_ORDER_MARK],v.WORKERS_SUPPORTED=!s&&!!n.Worker,v.NODE_STREAM_INPUT=1,v.LocalChunkSize=10485760,v.RemoteChunkSize=5242880,v.DefaultDelimiter=",",v.Parser=E,v.ParserHandle=i,v.NetworkStreamer=f,v.FileStreamer=l,v.StringStreamer=c,v.ReadableStreamStreamer=p,n.jQuery&&((d=n.jQuery).fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&n.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)})}),e(),this;function e(){if(0===h.length)U(o.complete)&&o.complete();else{var e,t,i,r,n=h[0];if(U(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(U(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){U(a)&&a(e,n.file,n.inputElem),u()},v.parse(n.file,n.instanceConfig)}}function u(){h.splice(0,1),e()}}),a&&(n.onmessage=function(e){e=e.data;void 0===v.WORKER_ID&&e&&(v.WORKER_ID=e.workerId);"string"==typeof e.input?n.postMessage({workerId:v.WORKER_ID,results:v.parse(e.input,e.config),finished:!0}):(n.File&&e.input instanceof File||e.input instanceof Object)&&(e=v.parse(e.input,e.config))&&n.postMessage({workerId:v.WORKER_ID,results:e,finished:!0})}),(f.prototype=Object.create(u.prototype)).constructor=f,(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(c.prototype)).constructor=c,(p.prototype=Object.create(u.prototype)).constructor=p,v});

/***/ }),

/***/ "./src/components/DeleteListings.jsx":
/*!*******************************************!*\
  !*** ./src/components/DeleteListings.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const DeleteListings = ({
  isActive
}) => {
  const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isActive) {
      // generate or fetch data again
      setData('This is newly generated data ' + new Date().toISOString());
    }
  }, [isActive]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    children: data
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeleteListings);

/***/ }),

/***/ "./src/components/ExportTaxonomies.jsx":
/*!*********************************************!*\
  !*** ./src/components/ExportTaxonomies.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * Component: ExportTaxonomies
 * Allows exporting taxonomy terms as a CSV file via a REST API call.
 */

const ExportTaxonomies = () => {
  /**
   * Exports the given taxonomy terms by calling the custom REST API
   * and generating a downloadable CSV file.
   *
   * @param {string} taxonomy - The taxonomy slug to export (e.g., 'category', 'location').
   */
  const exportTaxonomies = async (taxonomy = 'category') => {
    try {
      // Send request to the backend REST API endpoint
      const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: `${window.dba_data.restUrl}/export/taxonomies`,
        method: 'POST',
        data: {
          taxonomy
        }
      });
      console.log(response);
      if (response.status !== 'success') {
        throw new Error('Failed to fetch taxonomy terms');
      }
      const categories = response.terms || [];

      // Define CSV headers
      const headers = ['id', 'name', 'slug', 'description', 'parent', 'category_icon', 'directory_type', 'image'];

      // Generate CSV content rows
      const csvRows = [headers.join(','), ...categories.map(cat => headers.map(h => {
        const value = cat[h];
        return `"${String(value !== null && value !== void 0 ? value : '').replace(/"/g, '""')}"`;
      }).join(','))];

      // Create a Blob and trigger download
      const blob = new Blob([csvRows.join('\n')], {
        type: 'text/csv;charset=utf-8;'
      });
      (0,file_saver__WEBPACK_IMPORTED_MODULE_1__.saveAs)(blob, `${taxonomy}.csv`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "export-taxonomy-wrapper",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
      children: "Export Taxonomies"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "note",
      children: "Please click the button below to export the CSV file for the selected taxonomy."
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
      onClick: () => exportTaxonomies('category'),
      children: "Export Categories"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
      onClick: () => exportTaxonomies('location'),
      children: "Export Locations"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExportTaxonomies);

/***/ }),

/***/ "./src/components/ImportTaxonomies.jsx":
/*!*********************************************!*\
  !*** ./src/components/ImportTaxonomies.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! papaparse */ "./node_modules/papaparse/papaparse.min.js");
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(papaparse__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const ImportTaxonomies = () => {
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [file, setFile] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [taxonomy, setTaxonomy] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('category');
  const [totalUpdated, setTotalUpdated] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalAdded, setTotalAdded] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalFailed, setTotalFailed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [progress, setProgress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [log, setLog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const handleCSVChange = e => {
    try {
      const csvfile = e.target.files[0];
      if (csvfile) setFile(csvfile);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCSVUpload = () => {
    if (!file) return;
    setLoading(true);
    setTotalUpdated(0);
    setTotalAdded(0);
    setTotalFailed(0);
    setLog([]);
    papaparse__WEBPACK_IMPORTED_MODULE_1___default().parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const rows = results.data;
        processBatches(rows);
      }
    });
  };
  const processBatches = async rows => {
    let updated = 0,
      added = 0,
      failed = 0;
    const batchSize = 10;
    const total = rows.length;
    for (let i = 0; i < total; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      try {
        const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: `${window.dba_data.restUrl}/import/taxonomies`,
          method: 'POST',
          data: {
            taxonomy,
            items: batch
          }
        });
        response.results?.forEach((result, index) => {
          const row = batch[index];
          if (result.status === 'updated') {
            updated++;
            setTotalUpdated(updated);
            setLog(prev => [...prev, `✅ Updated: ${row.name}`]);
          } else if (result.status === 'added') {
            added++;
            setTotalAdded(added);
            setLog(prev => [...prev, `🆕 Added: ${row.name}`]);
          } else {
            failed++;
            setTotalFailed(failed);
            setLog(prev => [...prev, `❌ Failed: ${row.name}`]);
          }
        });
      } catch (err) {
        batch.forEach(row => {
          failed++;
          setLog(prev => [...prev, `❌ Failed: ${row.name}`]);
        });
      }
      setProgress(Math.round((i + batchSize) / total * 100));
    }
    setTotalUpdated(updated);
    setTotalAdded(added);
    setTotalFailed(failed);
    setLoading(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "csv-import-container",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "import-card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Import Taxonomy"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        children: "Select the taxonomy you want to import and upload the CSV file"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "note",
        children: "Terms will be updated if they match either the term ID or the term slug."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
        value: taxonomy,
        onChange: e => setTaxonomy(e.target.value),
        className: "taxonomy-select",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "category",
          children: "Categories"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "location",
          children: "Locations"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
        type: "file",
        accept: ".csv",
        onChange: handleCSVChange
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        className: "import-taxonomies",
        onClick: handleCSVUpload,
        disabled: loading,
        children: loading ? 'Importing...' : 'Start Import'
      }), progress > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "progress-bar",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "progress-bar-fill",
          style: {
            width: `${progress}%`
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "coordinator-status",
        children: [totalUpdated > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: ["Total Updated: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: totalUpdated
          })]
        }), totalAdded > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: ["Total Added: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: totalAdded
          })]
        }), totalFailed > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: ["Total Failed: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: totalFailed
          })]
        })]
      }), log.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "coordinator-log",
        children: [...log].reverse().map((entry, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          children: ["- ", entry]
        }, index))
      }), loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "spinner"
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImportTaxonomies);

/***/ }),

/***/ "./src/components/RunListingUpdate.jsx":
/*!*********************************************!*\
  !*** ./src/components/RunListingUpdate.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const RunListingUpdate = () => {
  const [offset, setOffset] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalUpdated, setTotalUpdated] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [missingAddress, setMissingAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [updating, setUpdating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [progress, setProgress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [completed, setCompleted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showError, setShowError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [log, setLog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const limit = 5;
  const progressNumber = 5 / dba_data.totalListings * 100;
  const updateCoordinates = () => {
    setUpdating(true);
    setCompleted(false);
    setTotalUpdated(0);
    setMissingAddress(0);
    setOffset(0);
    setProgress(0);
    setLog([]);
    setShowError('');
    let currentOffset = 0;
    let allUpdated = 0;
    const runBatch = async () => {
      try {
        const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
          path: `${window.dba_data.restUrl}/run/update`,
          method: 'POST',
          data: {
            offset: currentOffset,
            limit: limit
          }
        });
        console.log(response);
        if (response.status == 'error') {
          setShowError(response.message);
          setUpdating(false);
          return;
        }
        const postsCount = response.posts?.length || 0;
        const updatedCount = response.updated?.length || 0;
        const curMissAdrs = postsCount - updatedCount;
        setLog(prev => [...prev, `Batch ${currentOffset / limit}: ${updatedCount}/${postsCount} updated.`]);
        if (postsCount === 0) {
          setCompleted(true);
          setUpdating(false);
          return;
        }
        allUpdated += updatedCount;
        setTotalUpdated(allUpdated);
        currentOffset += limit;
        setOffset(prev => prev + limit);
        setProgress(prev => prev + progressNumber);
        setMissingAddress(prev => prev + curMissAdrs);

        // Continue to next batch
        runBatch();
      } catch (error) {
        console.error('API Error:', error);
        setLog(prev => [...prev, `Error at offset ${currentOffset}`]);
        setUpdating(false);
      }
    };
    runBatch();
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "coordinators-wrapper",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
      children: "Update Listings Infomation"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "note",
      children: ["You can update listing information by using this method. Please use the following action hook to update the listings.", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br", {}), "\"directorist_bulk_actions_run_update_loop\"", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br", {}), "only parameter is $listing_id"]
    }), showError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "error",
      children: showError
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
      className: "update-coordinates",
      onClick: updateCoordinates,
      disabled: updating,
      children: updating ? 'Updating...' : 'Run Update'
    }), progress > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "progress-bar",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "progress-bar-fill",
        style: {
          width: `${progress}%`
        }
      })
    }), totalUpdated > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "coordinator-status",
      children: ["Total Updated: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("strong", {
        children: totalUpdated
      })]
    }), missingAddress > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "coordinator-status",
      children: ["Total Missing: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("strong", {
        children: missingAddress
      })]
    }), completed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "coordinator-status",
      style: {
        color: 'green'
      },
      children: "\u2705 All listings processed!"
    }), log.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "coordinator-log",
      children: [...log].reverse().map((entry, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        children: ["- ", entry]
      }, i))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RunListingUpdate);

/***/ }),

/***/ "./src/components/SetCoordinates.jsx":
/*!*******************************************!*\
  !*** ./src/components/SetCoordinates.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const SetCoordinates = () => {
  const [offset, setOffset] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalUpdated, setTotalUpdated] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [missingAddress, setMissingAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [updating, setUpdating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [progress, setProgress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [completed, setCompleted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showError, setShowError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [log, setLog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const limit = 5;
  const progressNumber = 5 / dba_data.totalListings * 100;
  const updateCoordinates = () => {
    setUpdating(true);
    setCompleted(false);
    setTotalUpdated(0);
    setMissingAddress(0);
    setOffset(0);
    setProgress(0);
    setLog([]);
    setShowError('');
    let currentOffset = 0;
    let allUpdated = 0;
    const runBatch = async () => {
      try {
        const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
          path: `${window.dba_data.restUrl}/update/coordinates`,
          method: 'POST',
          data: {
            offset: currentOffset,
            limit: limit
          }
        });
        if (response.status == 'error') {
          setShowError(response.message);
          setUpdating(false);
          return;
        }
        const postsCount = response.posts?.length || 0;
        const updatedCount = response.updated?.length || 0;
        const curMissAdrs = postsCount - updatedCount;
        setLog(prev => [...prev, `Batch ${currentOffset / limit}: ${updatedCount}/${postsCount} updated.`]);
        if (postsCount === 0) {
          setCompleted(true);
          setUpdating(false);
          return;
        }
        allUpdated += updatedCount;
        setTotalUpdated(allUpdated);
        currentOffset += limit;
        setOffset(prev => prev + limit);
        setProgress(prev => prev + progressNumber);
        setMissingAddress(prev => prev + curMissAdrs);

        // Continue to next batch
        runBatch();
      } catch (error) {
        console.error('API Error:', error);
        setLog(prev => [...prev, `Error at offset ${currentOffset}`]);
        setUpdating(false);
      }
    };
    runBatch();
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "coordinators-wrapper",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
      children: "Update Listing Coordinates"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "note",
      children: "Coordinates will not be updated if the address field is empty or the Google Maps API is not configured correctly in the Directorist Settings."
    }), showError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "error",
      children: showError
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
      className: "update-coordinates",
      onClick: updateCoordinates,
      disabled: updating,
      children: updating ? 'Updating...' : 'Start Update'
    }), progress > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "progress-bar",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "progress-bar-fill",
        style: {
          width: `${progress}%`
        }
      })
    }), totalUpdated > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "coordinator-status",
      children: ["Total Updated: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("strong", {
        children: totalUpdated
      })]
    }), missingAddress > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "coordinator-status",
      children: ["Total Missing Address: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("strong", {
        children: missingAddress
      })]
    }), completed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "coordinator-status",
      style: {
        color: 'green'
      },
      children: "\u2705 All listings processed!"
    }), log.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "coordinator-log",
      children: [...log].reverse().map((entry, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        children: ["- ", entry]
      }, i))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetCoordinates);

/***/ }),

/***/ "./src/components/index.jsx":
/*!**********************************!*\
  !*** ./src/components/index.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ExportTaxonomies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExportTaxonomies */ "./src/components/ExportTaxonomies.jsx");
/* harmony import */ var _ImportTaxonomies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImportTaxonomies */ "./src/components/ImportTaxonomies.jsx");
/* harmony import */ var _updateListings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./updateListings */ "./src/components/updateListings.jsx");
/* harmony import */ var _DeleteListings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DeleteListings */ "./src/components/DeleteListings.jsx");
/* harmony import */ var _SetCoordinates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SetCoordinates */ "./src/components/SetCoordinates.jsx");
/* harmony import */ var _RunListingUpdate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./RunListingUpdate */ "./src/components/RunListingUpdate.jsx");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ExportTaxonomies: _ExportTaxonomies__WEBPACK_IMPORTED_MODULE_0__["default"],
  ImportTaxonomies: _ImportTaxonomies__WEBPACK_IMPORTED_MODULE_1__["default"],
  UpdateListings: _updateListings__WEBPACK_IMPORTED_MODULE_2__["default"],
  DeleteListings: _DeleteListings__WEBPACK_IMPORTED_MODULE_3__["default"],
  SetCoordinates: _SetCoordinates__WEBPACK_IMPORTED_MODULE_4__["default"],
  RunListingUpdate: _RunListingUpdate__WEBPACK_IMPORTED_MODULE_5__["default"]
});

/***/ }),

/***/ "./src/components/updateListings.jsx":
/*!*******************************************!*\
  !*** ./src/components/updateListings.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! papaparse */ "./node_modules/papaparse/papaparse.min.js");
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(papaparse__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const UpdateListings = () => {
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [file, setFile] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [directory, setDirectory] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalUpdated, setTotalUpdated] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalAdded, setTotalAdded] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalFailed, setTotalFailed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [progress, setProgress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [log, setLog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const handleCSVChange = e => {
    try {
      const csvfile = e.target.files[0];
      if (csvfile) setFile(csvfile);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCSVUpload = () => {
    if (!file) return;
    if (!directory) return;
    setLoading(true);
    setTotalUpdated(0);
    setTotalAdded(0);
    setTotalFailed(0);
    setLog([]);
    papaparse__WEBPACK_IMPORTED_MODULE_1___default().parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const rows = results.data;
        processBatches(rows);
      }
    });
  };
  const processBatches = async rows => {
    let updated = 0,
      added = 0,
      failed = 0;
    const batchSize = 10;
    const total = rows.length;
    for (let i = 0; i < total; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      try {
        const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: `${window.dba_data.restUrl}/update/listings`,
          method: 'POST',
          data: {
            directory,
            items: batch
          }
        });
        response.results?.forEach((result, index) => {
          const row = batch[index];
          if (result.status === 'success') {
            updated++;
            setTotalUpdated(updated);
            setLog(prev => [...prev, `✅ Updated: ${row.listing_title} - ${result.message}`]);
          } else {
            failed++;
            setTotalFailed(failed);
            setLog(prev => [...prev, `❌ Failed: ${row.listing_title} - ${result.message}`]);
          }
        });
      } catch (err) {
        console.log(err);
        batch.forEach(row => {
          failed++;
          setLog(prev => [...prev, `❌ Failed: ${row.name}`]);
        });
      }
      setProgress(Math.round((i + batchSize) / total * 100));
    }
    setTotalUpdated(updated);
    setTotalAdded(added);
    setTotalFailed(failed);
    setLoading(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "csv-import-container",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "import-card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: "Update Listings"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        children: "Select the directory type you want to upload the listings with CSV file"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "note",
        children: "Listings will be updated if they match either the listings ID only."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
        value: directory,
        onChange: e => setDirectory(e.target.value),
        className: "directory-select",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "",
          children: "Directory type"
        }), window.dba_data.directoryTypes && Object.entries(window.dba_data.directoryTypes).map(([key, label]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: key,
          children: label
        }, key))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
        type: "file",
        accept: ".csv",
        onChange: handleCSVChange
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        className: "import-taxonomies",
        onClick: handleCSVUpload,
        disabled: loading,
        children: loading ? 'Updating...' : 'Start Update'
      }), progress > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "progress-bar",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "progress-bar-fill",
          style: {
            width: `${progress}%`
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "coordinator-status",
        children: [totalUpdated > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: ["Total Updated: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: totalUpdated
          })]
        }), totalFailed > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: ["Total Failed: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: totalFailed
          })]
        })]
      }), log.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "coordinator-log",
        children: [...log].reverse().map((entry, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          children: ["- ", entry]
        }, index))
      }), loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "spinner"
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UpdateListings);

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/app.jsx ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components */ "./src/components/index.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const App = () => {
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('run_update');
  const tabs = [{
    key: 'export_taxonomies',
    label: 'Export Taxonomies'
  }, {
    key: 'import_taxonomies',
    label: 'Import Taxonomies'
  }, {
    key: 'update_listings',
    label: 'Update Listings'
  }, {
    key: 'delete_listings',
    label: 'Delete Listings'
  }, {
    key: 'set_coordinates',
    label: 'Set Coordinates'
  }, {
    key: 'run_update',
    label: 'Run Update'
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "wrap",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h1", {
      className: "wp-heading-inline",
      children: "Directorist - Bulk Actions"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "tab-wrapper",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "tab-buttons",
        children: tabs.map(tab => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: activeTab === tab.key ? 'active' : '',
          onClick: () => setActiveTab(tab.key),
          children: tab.label
        }, tab.key))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "tab-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "warning",
          children: "Warning: Please do not change the tabs while importing, exporting or updating data."
        }), activeTab === 'set_coordinates' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components__WEBPACK_IMPORTED_MODULE_1__["default"].SetCoordinates, {
          isActive: true
        }), activeTab === 'import_taxonomies' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components__WEBPACK_IMPORTED_MODULE_1__["default"].ImportTaxonomies, {
          isActive: true
        }), activeTab === 'export_taxonomies' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components__WEBPACK_IMPORTED_MODULE_1__["default"].ExportTaxonomies, {
          isActive: true
        }), activeTab === 'delete_listings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components__WEBPACK_IMPORTED_MODULE_1__["default"].DeleteListings, {
          isActive: true
        }), activeTab === 'update_listings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components__WEBPACK_IMPORTED_MODULE_1__["default"].UpdateListings, {
          isActive: true
        }), activeTab === 'run_update' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components__WEBPACK_IMPORTED_MODULE_1__["default"].RunListingUpdate, {
          isActive: true
        })]
      })]
    })]
  });
};
document.addEventListener('DOMContentLoaded', () => {
  // Mount only if the target element exists
  const container = document.getElementById('my-react-app');
  if (container) {
    const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(container);
    root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(App, {}));
  }
});
})();

/******/ })()
;
//# sourceMappingURL=app.js.map