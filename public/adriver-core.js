// @adr/adriver-core v1.1.2
!function(){"use strict";function t(t){var e=function(t,e){if("object"!=typeof t||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==typeof e?e:String(e)}function e(e,r){for(var n=0;n<r.length;n++){var o=r[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,t(o.key),o)}}function r(e,r,n){return(r=t(r))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}var n=function(){return n=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},n.apply(this,arguments)};function o(t,e,r,n){return new(r||(r=Promise))((function(o,i){function a(t){try{u(n.next(t))}catch(t){i(t)}}function c(t){try{u(n.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?o(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(a,c)}u((n=n.apply(t,e||[])).next())}))}function i(t,e){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(u){return function(c){if(r)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(r=1,n&&(o=2&c[0]?n.return:c[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,c[1])).done)return o;switch(n=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,n=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],n=0}finally{r=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,u])}}}function a(t,e,r,n){if("a"===r&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(t):n?n.value:e.get(t)}var c,u,l,s=function(t,e){if(t)for(var r=Object.prototype.toString.call(e.prototype),n=Object.getPrototypeOf(t);n;){if(Object.prototype.toString.call(n)===r)return!0;n=Object.getPrototypeOf(n)}return!1},f=function(t){return"number"==typeof t&&!isNaN(t)&&isFinite(t)},p=function(t){return"string"==typeof t||s(t,String)},h=function(t){return s(t,HTMLElement)||d(t)},d=function(t){return s(t,Document)},y=function(t){if(!p(t))throw new Error("".concat(t," is not a string"));return 0===w(t).length},w=function(t){if(!p(t))throw new Error("".concat(t," is not a string"));return t.replace(/\s/g,"")},v=function(t,e,r){var n;if((h(t)||t instanceof SVGElement)&&(n=e,"[object Object]"===Object.prototype.toString.call(n)))for(var o in e){var i=f(e[o])?String(e[o]):e[o];p(i)&&!y(i)&&r(t,o,i)}},b=function(){function t(e,n,o){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),r(this,"uri",void 0),r(this,"parent",void 0),r(this,"timeOut",void 0),r(this,"scriptElement",void 0),!p(e))throw new Error("ScriptLoader: The url must be a string.");if(y(e))throw new Error("ScriptLoader: The url parameter cannot be an empty string.");this.timeOut=f(o)&&function(t){if(!f(t))throw new Error("".concat(t," is not a number"));return t>=0}(o)?o:5e3,this.scriptElement=document.createElement("script"),this.uri=e,d(n)&&h(n.body)?this.parent=n.body:h(n)&&1===(null==n?void 0:n.nodeType)?this.parent=n:this.parent=document.body}var n,o,i;return n=t,(o=[{key:"removeScriptElement",value:function(){this.scriptElement.remove()}},{key:"load",value:function(){var t=this;return new Promise((function(e,r){t.scriptElement.setAttribute("src",t.uri);var n=setTimeout((function(){t.scriptElement.removeEventListener("load",o),t.scriptElement.removeEventListener("error",o),t.scriptElement.remove(),r(new Error("TimeOut error."))}),t.timeOut),o=function(o){clearTimeout(n),"error"===o.type?(t.scriptElement.remove(),r(new Error("Script error loading."))):e(!0)};t.scriptElement.addEventListener("load",o,{once:!0}),t.scriptElement.addEventListener("error",o,{once:!0}),t.parent.append(t.scriptElement)}))}},{key:"setAttributes",value:function(t){return function(t,e){v(t,e,(function(t,e,r){return t.setAttribute(e,r)}))}(this.scriptElement,t),this}}])&&e(n.prototype,o),i&&e(n,i),Object.defineProperty(n,"prototype",{writable:!1}),t}(),m=function(t){return Object.prototype.hasOwnProperty.call(window,"AAB_PROXY_URL")?"".concat(window.AAB_PROXY_URL,"/?source=").concat(btoa(t)):t},g={writable:!1,enumerable:!1,configurable:!1},E=(c=Object.create(null),Object.setPrototypeOf({get:function(t){return this.has(t)?c[t]:null},set:function(t,e){"string"==typeof t&&""!==t&&!this.has(t)&&e&&Object.defineProperty(c,t,n({value:e},g))},has:function(t){return Object.prototype.hasOwnProperty.call(c,t)}},null)),O=function(){function t(){u.set(this,void 0),l.set(this,{}),function(t,e,r,n,o){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!o)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!o:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");"a"===n?o.call(t,r):o?o.value=r:e.set(t,r)}(this,u,E,"f")}return t.prototype.addToStorage=function(t,e){a(this,u,"f").set(t,e)},t.prototype.load=function(t){return o(this,void 0,void 0,(function(){var e=this;return i(this,(function(r){if("string"!=typeof t||y(t))throw new Error("AdriverCore: incorrect module name.");return a(this,u,"f").has(t)?[2,a(this,u,"f").get(t)]:(Object.prototype.hasOwnProperty.call(a(this,l,"f"),t)||(a(this,l,"f")[t]=new b(m("".concat("http://localhost:1100","/").concat(t,".js")),void 0,1e4).load().then((function(){if(delete a(e,l,"f")[t],!a(e,u,"f").has(t))throw new Error("Error loading ".concat(t),{cause:"When loading, the module was not added to the library"})})).catch((function(t){throw t}))),[2,a(this,l,"f")[t].then((function(){return e.load(t)}))])}))}))},t.prototype.create=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return this.load(t).then((function(t){return"function"==typeof t?t.apply(void 0,e):t}))},t}();u=new WeakMap,l=new WeakMap,Object.setPrototypeOf(O.prototype,null);var j=O;!function(){try{Object.defineProperty(window,"AdR",n({value:new j},g)),Array.isArray(window.adriverCalls)&&window.adriverCalls.forEach((function(t){"function"==typeof t&&t()})),Object.defineProperty(window,"adriverCalls",n({value:{push:function(t){return t()}}},g))}catch(t){throw new Error("Error occurred during the installation of adriver-core, perhaps you are trying to download it again.",{cause:t})}}()}();
