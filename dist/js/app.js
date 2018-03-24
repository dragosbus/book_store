"use strict";!function(){function u(n){return new Promise(function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function i(n,o,r){var i,e=new Promise(function(e,t){u(i=n[o].apply(n,r)).then(e,t)});return e.request=i,e}function e(e,n,t){t.forEach(function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[n][t]},set:function(e){this[n][t]=e}})})}function t(t,n,o,e){e.forEach(function(e){e in o.prototype&&(t.prototype[e]=function(){return i(this[n],e,arguments)})})}function n(t,n,o,e){e.forEach(function(e){e in o.prototype&&(t.prototype[e]=function(){return this[n][e].apply(this[n],arguments)})})}function o(e,o,t,n){n.forEach(function(n){n in t.prototype&&(e.prototype[n]=function(){return e=this[o],(t=i(e,n,arguments)).then(function(e){if(e)return new c(e,t.request)});var e,t})})}function r(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function a(e){this._store=e}function s(n){this._tx=n,this.complete=new Promise(function(e,t){n.oncomplete=function(){e()},n.onerror=function(){t(n.error)},n.onabort=function(){t(n.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new s(n)}function f(e){this._db=e}e(r,"_index",["name","keyPath","multiEntry","unique"]),t(r,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),o(r,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(c,"_cursor",["direction","key","primaryKey","value"]),t(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(n){n in IDBCursor.prototype&&(c.prototype[n]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[n].apply(t._cursor,e),u(t._request).then(function(e){if(e)return new c(e,t._request)})})})}),a.prototype.createIndex=function(){return new r(this._store.createIndex.apply(this._store,arguments))},a.prototype.index=function(){return new r(this._store.index.apply(this._store,arguments))},e(a,"_store",["name","keyPath","indexNames","autoIncrement"]),t(a,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),o(a,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),n(a,"_store",IDBObjectStore,["deleteIndex"]),s.prototype.objectStore=function(){return new a(this._tx.objectStore.apply(this._tx,arguments))},e(s,"_tx",["objectStoreNames","mode"]),n(s,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new a(this._db.createObjectStore.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),n(l,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new s(this._db.transaction.apply(this._db,arguments))},e(f,"_db",["name","version","objectStoreNames"]),n(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(i){[a,r].forEach(function(e){e.prototype[i.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),n=t[t.length-1],o=this._store||this._index,r=o[i].apply(o,t.slice(0,-1));r.onsuccess=function(){n(r.result)}}})}),[r,a].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var o=this,r=[];return new Promise(function(t){o.iterateCursor(e,function(e){e?(r.push(e.value),void 0===n||r.length!=n?e.continue():t(r)):t(r)})})})});var p={open:function(e,t,n){var o=i(indexedDB,"open",[e,t]),r=o.request;return r.onupgradeneeded=function(e){n&&n(new l(r.result,e.oldVersion,r.transaction))},o.then(function(e){return new f(e)})},delete:function(e){return i(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=p,module.exports.default=module.exports):self.idb=p}();var value=void 0,version=1,data=function(){var e;return{dbPromiseHandler:e=function(t){return idb.open(value+"-"+version,version,function(e){e.createObjectStore(t,{keyPath:"volumeInfo.publishedDate"})})},saveData:function(o){return e(value).then(function(e){var t=e.transaction(value,"readwrite"),n=t.objectStore(value);return o.forEach(function(e){return n.put(e)}),t.complete})},version:version,value:value,getData:function(){e(value).then(function(e){return e.transaction(value).objectStore(value).getAll()})}}}(),view=function(){var e=document.querySelector(".search"),t=document.querySelector(".text"),n=document.querySelector(".books");return{form:e,input:t,showForm:function(){e.classList.toggle("show-form")},makeLi:function(e,t,n){var o=document.createElement("li"),r=document.createElement("h2"),i=document.createElement("a"),u=document.createElement("img");return u.src=n,r.textContent=e,i.setAttribute("href",t),i.textContent="Buy",o.appendChild(u),o.appendChild(r),o.appendChild(i),o},booksUl:n,errorHandler:function(e){var t=document.createElement("p");t.classList.add("error-msg"),t.textContent=e,n.innerHTML+=t}}}();document.querySelector(".fa").addEventListener("click",view.showForm),view.form.addEventListener("submit",function(e){e.preventDefault();var n="https://www.googleapis.com/books/v1/volumes?q="+view.input.value;return value=view.input.value,view.booksUl.innerHTML="",new Promise(function(e,t){view.input.value?e(n):t("Invalid Url")}).then(function(e){return fetch(e).then(function(e){return e.json()}).then(function(e){return e.items}).then(data.saveData).catch(function(e){view.errorHandler("The book is not avaible")})}).then(function(e){data.dbPromiseHandler().then(function(e){return e.transaction(value).objectStore(value).getAll()}).then(function(e){console.log(e),e.forEach(function(e){var t=e.saleInfo.buyLink,n=e.volumeInfo,o=n.title,r=(n.categories,n.authors,n.imageLinks.thumbnail),i=view.makeLi(o,t,r);view.booksUl.appendChild(i)})})}).then(function(){view.input.value="",version+=1}).catch(function(e){view.errorHandler("The book is not avaible or the value entered is invalid.Please type a valid value")})});