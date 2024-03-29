(function () {
    'use strict';

    /**
     * Функция проверяет, является ли переданный объект инстансом переданного класса.
     * @param object - объект.
     * @param someClass - класс.
     * @returns true, если объект является инстансом переданного класса, иначе - false.
     * @remarks
     * Также проверяет, является ли родительский элемент объекта инстансом переданного класса.
     */
    // eslint-disable-next-line max-len
    var instanceOf = function (object, someClass) {
        if (object) {
            var targetProtoString = Object.prototype.toString.call(someClass.prototype);
            var proto = Object.getPrototypeOf(object);
            while (proto) {
                if (Object.prototype.toString.call(proto) === targetProtoString)
                    return true;
                proto = Object.getPrototypeOf(proto);
            }
        }
        return false;
    };

    /**
     * Функция проверяет, является ли переданный параметр строкой.
     * @param something - параметр, который необходимо проверить.
     * @returns true, если переданный параметр является строкой, иначе - false.
     */
    var string = function (something) {
        return typeof something === "string" || instanceOf(something, String);
    };
    /**
     * Функция проверяет, является ли переданный параметр строго объектом.
     * @param something - параметр, который необходимо проверить.
     * @returns true, если переданный параметр является строго объектом, иначе - false.
     * @remarks
     * Под проверкой на строгий объект подрузамевается, что объект создан с только с помощью {} или new Object().
     */
    var strictObject = function (something) {
        return Object.prototype.toString.call(something) === "[object Object]";
    };
    /**
     * Функция проверяет, является ли переданный элемент инстансом класса HTMLElement или Document.
     * @param htmlObj - элемент, который необходимо проверить.
     * @returns true, если переданный элемент является инстансом класса HTMLElement или Document, иначе - false.
     */
    var htmlElement = function (htmlObj) {
        return instanceOf(htmlObj, HTMLElement) || htmlDocumentElement(htmlObj);
    };
    /**
     * Функция проверяет, является ли переданный элемент инстансом класса Document.
     * @param doc - элемент, который необходимо проверить.
     * @returns true, если переданный элемент является инстансом класса Document.
     */
    var htmlDocumentElement = function (doc) {
        return instanceOf(doc, Document);
    };

    /**
     * Проверяет, является ли переданная строка пустой, если удалить из неё все пробельные символы.
     * @param str - строка, который необходимо проверить.
     * @returns true, если переданная строка является пустой, иначе false.
     */
    var isEmptyString = function (str) {
        if (!string(str))
            throw new Error("".concat(str, " is not a string"));
        return removeSpacesFromString(str).length === 0;
    };

    /**
     * Функция предназначена для получения случайного числа заданного порядка (По умолчанию 10).
     * @param len - порядок числа.
     * @returns случайное число заданного порядка.
     */
    var getRandomNumber = function (len) {
        var initialNumber = +"1E".concat(len || 10);
        var min = (initialNumber / 10);
        return Math.floor(min + Math.random() * (initialNumber - min));
    };
    /**
     * Принимает строку и возвращает новую строку, в которой удалены все пробельные символы.
     * @param str - cтрока, из которой удаляются пробельные символы.
     * @returns новую строку, в которой удалены все пробельные символы.
     */
    var removeSpacesFromString = function (str) {
        if (!string(str))
            throw new Error("".concat(str, " is not a string"));
        return str.replace(/\s/g, "");
    };

    var LocationTypes;
    (function (LocationTypes) {
        LocationTypes["OnPage"] = "onpage";
        LocationTypes["SameDomainFrame"] = "samedomainiframe";
        LocationTypes["CrossDomainFrame"] = "crossdomainframe";
    })(LocationTypes || (LocationTypes = {}));

    /**
     * Представляет собой синглтон, который определяет информацию о текущей локации скрипта
     */
    /** @class */ ((function () {
        function MyLocation() {
            if (MyLocation._instance)
                return MyLocation._instance;
            MyLocation._instance = this;
            this.analyzeLocation();
        }
        /**
         * Определяет все свойства класса.
         */
        MyLocation.prototype.analyzeLocation = function () {
            var _a;
            var assumedTopRef = window.location.href;
            if (window.top === window) {
                // такая запись для того чтобы инитить readonly свойства в методе, а не в конструкторе
                this._location = LocationTypes.OnPage;
                this._topWin = window;
            }
            else {
                this._topWin = window.top;
                try {
                    (_a = window.top) === null || _a === void 0 ? void 0 : _a.location.href; // если в кроссдоменном фрейме выбросится ошибка 
                    assumedTopRef = this._topWin.location.href;
                    this._location = LocationTypes.SameDomainFrame;
                }
                catch (_) {
                    this._location = LocationTypes.CrossDomainFrame;
                    assumedTopRef = window.document.referrer || window.location.href;
                }
            }
            if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
                var topAncestorOrigin = window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1];
                if (new URL(topAncestorOrigin).hostname !== new URL(assumedTopRef).hostname)
                    assumedTopRef = topAncestorOrigin;
            }
            this._topRef = assumedTopRef;
        };
        Object.defineProperty(MyLocation.prototype, "topReferrer", {
            /**
             * Возвращает самый верхний href.
             * @returns самый верхний href.
             */
            get: function () {
                return this._topRef;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "topWindow", {
            /**
             * Возвращает cамый верхний window.
             * @returns cамый верхний window.
             */
            get: function () {
                return this._topWin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "onPage", {
            /**
             * Определяет, размещен ли скрипт напрямую на странице.
             * @returns true, если скрипт размещен напрямую на странице, и false - если внутри фрейма.
             */
            get: function () {
                return this._location === LocationTypes.OnPage;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "inCrossDomainFrame", {
            /**
             * Определяет, находится ли скрипт внутри кроссдоменного фрейма.
             * @returns true, если скрипт находится внутри кроссдоменного фрейма, иначе false.
             */
            get: function () {
                return this._location === LocationTypes.CrossDomainFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "inSameDomainFrame", {
            /**
             * Определяет, находится ли скрипт, внутри фрейма на том же домене.
             * @returns true, если скрипт находится внутри фрейма на том же домене, иначе false.
             */
            get: function () {
                return this._location === LocationTypes.SameDomainFrame;
            },
            enumerable: false,
            configurable: true
        });
        return MyLocation;
    })());

    var _a;
    var Vendors;
    (function (Vendors) {
        Vendors["Webkit"] = "webkit";
        Vendors["Moz"] = "moz";
        Vendors["Ms"] = "ms";
        Vendors["Web"] = "web";
        Vendors["DisabledWebkit"] = "webkit_ios";
        Vendors["Unknown"] = "unknown";
    })(Vendors || (Vendors = {}));
    (_a = {},
        _a[Vendors.Webkit] = {
            fullscreenEnabled: "webkitFullscreenEnabled",
            fullscreenElement: "webkitFullscreenElement",
            requestFullscreen: "webkitRequestFullscreen",
            exitFullscreen: "webkitExitFullscreen",
            fullscreenChangeEvent: "webkitfullscreenchange",
            fullscreenErrorEvent: "webkitfullscreenerror",
            pseudoClass: "-webkit-full-screen"
        },
        _a[Vendors.Moz] = {
            fullscreenEnabled: "mozFullScreenEnabled",
            fullscreenElement: "mozFullScreenElement",
            requestFullscreen: "mozRequestFullScreen",
            exitFullscreen: "mozCancelFullScreen",
            fullscreenChangeEvent: "mozfullscreenchange",
            fullscreenErrorEvent: "mozfullscreenerror",
            pseudoClass: "-moz-full-screen"
        },
        _a[Vendors.Ms] = {
            fullscreenEnabled: "msFullscreenEnabled",
            fullscreenElement: "msFullscreenElement",
            requestFullscreen: "msRequestFullscreen",
            exitFullscreen: "msExitFullscreen",
            fullscreenChangeEvent: "MSFullscreenChange",
            fullscreenErrorEvent: "MSFullscreenError",
            pseudoClass: "-ms-fullscreen"
        },
        _a[Vendors.Web] = {
            fullscreenEnabled: "fullscreenEnabled",
            fullscreenElement: "fullscreenElement",
            requestFullscreen: "requestFullscreen",
            exitFullscreen: "exitFullscreen",
            fullscreenChangeEvent: "fullscreenchange",
            fullscreenErrorEvent: "fullscreenerror",
            pseudoClass: "fullscreen",
        },
        _a);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Класс URI расширяет класс URL и добавляет дополнительные функции.
     */
    /** @class */ ((function (_super) {
        __extends(URI, _super);
        /**
         * @param str - cтрока URL. Если протокол не указан, автоматически добавляется «https:».
         */
        function URI(str) {
            var _this = this;
            var url = URI.hasProtocol(str) ? str : "https:" + str;
            _this = _super.call(this, url) || this;
            /**
             * Массив объектов macrosData, каждый из которых содержит значение и шаблон RegExp.
             */
            _this.macrosList = [];
            // safari в iOS 13 и меньше, игнорирует наследование некоторых классов, если посмотреть прототип,
            // то там будут добавлены методы, но у экземпляра этого класса, будут методы только класса от которого наследуемся.
            // чтобы обойти это, явно устанавливаем прототип 
            Object.setPrototypeOf(_this, URI.prototype);
            return _this;
        }
        /**
         * Проверяет, имеет ли данная строка протокол http или https.
         * @param str - строка для проверки протокола.
         * @returns true, если строка имеет протокол http или https, иначе false.
         */
        URI.hasProtocol = function (str) {
            return /^(https|http):\/\/.+/.test(str);
        };
        /**
         * Задает макрос, который можно заменить в строке URL.
         * @param macros - имя макроса.
         * @param value - значение для замены макроса.
         * @returns this.
         */
        URI.prototype.setMacros = function (macros, value) {
            value = value === null || value === void 0 ? void 0 : value.toString();
            if (string(macros) && !isEmptyString(macros) && !isEmptyString(value)) {
                macros = macros.replace(/[^a-zA-Z0-9 ]/g, "");
                var template = new RegExp("\\!\\[".concat(macros, "\\]"));
                var obj = { value: value, template: template };
                this.macrosList.push(obj);
            }
            return this;
        };
        /**
         * Устанавливает макрос "rnd" со случайным числовым значением.
         * @returns this.
         */
        URI.prototype.setRnd = function () {
            this.setMacros("rnd", getRandomNumber(6));
            return this;
        };
        /**
         * Задает параметры запроса в URL.
         * @param params - объект, в котором каждая пара ключ-значение представляет параметр запроса и его значение.
         * @returns this.
         */
        URI.prototype.setParams = function (params) {
            if (strictObject(params))
                for (var param in params)
                    this.searchParams.set(param, params[param].toString());
            return this;
        };
        /**
         * Возвращает строку URL.
         * @returns строку URL.
         */
        URI.prototype.toString = function () {
            var res = decodeURIComponent(_super.prototype.toString.call(this));
            for (var _i = 0, _a = this.macrosList; _i < _a.length; _i++) {
                var _b = _a[_i], value = _b.value, template = _b.template;
                res = res.replace(template, value);
            }
            return new URL(res).toString();
        };
        /**
         * Гарантирует, что URL использует https протокол.
         * @returns this.
         */
        URI.prototype.httpslize = function () {
            if (this.protocol !== "https:")
                this.protocol = "https:";
            return this;
        };
        return URI;
    })(URL));

    /**
     * Copyright 2016 Google Inc. All Rights Reserved.
     *
     * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
     *
     *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     */
    (function() {

    // Exit early if we're not running in a browser.
    if (typeof window !== 'object') {
      return;
    }

    // Exit early if all IntersectionObserver and IntersectionObserverEntry
    // features are natively supported.
    if ('IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

      // Minimal polyfill for Edge 15's lack of `isIntersecting`
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
        Object.defineProperty(window.IntersectionObserverEntry.prototype,
          'isIntersecting', {
          get: function () {
            return this.intersectionRatio > 0;
          }
        });
      }
      return;
    }

    /**
     * Returns the embedding frame element, if any.
     * @param {!Document} doc
     * @return {!Element}
     */
    function getFrameElement(doc) {
      try {
        return doc.defaultView && doc.defaultView.frameElement || null;
      } catch (e) {
        // Ignore the error.
        return null;
      }
    }

    /**
     * A local reference to the root document.
     */
    var document = (function(startDoc) {
      var doc = startDoc;
      var frame = getFrameElement(doc);
      while (frame) {
        doc = frame.ownerDocument;
        frame = getFrameElement(doc);
      }
      return doc;
    })(window.document);

    /**
     * An IntersectionObserver registry. This registry exists to hold a strong
     * reference to IntersectionObserver instances currently observing a target
     * element. Without this registry, instances without another reference may be
     * garbage collected.
     */
    var registry = [];

    /**
     * The signal updater for cross-origin intersection. When not null, it means
     * that the polyfill is configured to work in a cross-origin mode.
     * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
     */
    var crossOriginUpdater = null;

    /**
     * The current cross-origin intersection. Only used in the cross-origin mode.
     * @type {DOMRect|ClientRect}
     */
    var crossOriginRect = null;


    /**
     * Creates the global IntersectionObserverEntry constructor.
     * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
     * @param {Object} entry A dictionary of instance properties.
     * @constructor
     */
    function IntersectionObserverEntry(entry) {
      this.time = entry.time;
      this.target = entry.target;
      this.rootBounds = ensureDOMRect(entry.rootBounds);
      this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
      this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
      this.isIntersecting = !!entry.intersectionRect;

      // Calculates the intersection ratio.
      var targetRect = this.boundingClientRect;
      var targetArea = targetRect.width * targetRect.height;
      var intersectionRect = this.intersectionRect;
      var intersectionArea = intersectionRect.width * intersectionRect.height;

      // Sets intersection ratio.
      if (targetArea) {
        // Round the intersection ratio to avoid floating point math issues:
        // https://github.com/w3c/IntersectionObserver/issues/324
        this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
      } else {
        // If area is zero and is intersecting, sets to 1, otherwise to 0
        this.intersectionRatio = this.isIntersecting ? 1 : 0;
      }
    }


    /**
     * Creates the global IntersectionObserver constructor.
     * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
     * @param {Function} callback The function to be invoked after intersection
     *     changes have queued. The function is not invoked if the queue has
     *     been emptied by calling the `takeRecords` method.
     * @param {Object=} opt_options Optional configuration options.
     * @constructor
     */
    function IntersectionObserver(callback, opt_options) {

      var options = opt_options || {};

      if (typeof callback != 'function') {
        throw new Error('callback must be a function');
      }

      if (
        options.root &&
        options.root.nodeType != 1 &&
        options.root.nodeType != 9
      ) {
        throw new Error('root must be a Document or Element');
      }

      // Binds and throttles `this._checkForIntersections`.
      this._checkForIntersections = throttle(
          this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

      // Private properties.
      this._callback = callback;
      this._observationTargets = [];
      this._queuedEntries = [];
      this._rootMarginValues = this._parseRootMargin(options.rootMargin);

      // Public properties.
      this.thresholds = this._initThresholds(options.threshold);
      this.root = options.root || null;
      this.rootMargin = this._rootMarginValues.map(function(margin) {
        return margin.value + margin.unit;
      }).join(' ');

      /** @private @const {!Array<!Document>} */
      this._monitoringDocuments = [];
      /** @private @const {!Array<function()>} */
      this._monitoringUnsubscribes = [];
    }


    /**
     * The minimum interval within which the document will be checked for
     * intersection changes.
     */
    IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


    /**
     * The frequency in which the polyfill polls for intersection changes.
     * this can be updated on a per instance basis and must be set prior to
     * calling `observe` on the first target.
     */
    IntersectionObserver.prototype.POLL_INTERVAL = null;

    /**
     * Use a mutation observer on the root element
     * to detect intersection changes.
     */
    IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


    /**
     * Sets up the polyfill in the cross-origin mode. The result is the
     * updater function that accepts two arguments: `boundingClientRect` and
     * `intersectionRect` - just as these fields would be available to the
     * parent via `IntersectionObserverEntry`. This function should be called
     * each time the iframe receives intersection information from the parent
     * window, e.g. via messaging.
     * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
     */
    IntersectionObserver._setupCrossOriginUpdater = function() {
      if (!crossOriginUpdater) {
        /**
         * @param {DOMRect|ClientRect} boundingClientRect
         * @param {DOMRect|ClientRect} intersectionRect
         */
        crossOriginUpdater = function(boundingClientRect, intersectionRect) {
          if (!boundingClientRect || !intersectionRect) {
            crossOriginRect = getEmptyRect();
          } else {
            crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
          }
          registry.forEach(function(observer) {
            observer._checkForIntersections();
          });
        };
      }
      return crossOriginUpdater;
    };


    /**
     * Resets the cross-origin mode.
     */
    IntersectionObserver._resetCrossOriginUpdater = function() {
      crossOriginUpdater = null;
      crossOriginRect = null;
    };


    /**
     * Starts observing a target element for intersection changes based on
     * the thresholds values.
     * @param {Element} target The DOM element to observe.
     */
    IntersectionObserver.prototype.observe = function(target) {
      var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
        return item.element == target;
      });

      if (isTargetAlreadyObserved) {
        return;
      }

      if (!(target && target.nodeType == 1)) {
        throw new Error('target must be an Element');
      }

      this._registerInstance();
      this._observationTargets.push({element: target, entry: null});
      this._monitorIntersections(target.ownerDocument);
      this._checkForIntersections();
    };


    /**
     * Stops observing a target element for intersection changes.
     * @param {Element} target The DOM element to observe.
     */
    IntersectionObserver.prototype.unobserve = function(target) {
      this._observationTargets =
          this._observationTargets.filter(function(item) {
            return item.element != target;
          });
      this._unmonitorIntersections(target.ownerDocument);
      if (this._observationTargets.length == 0) {
        this._unregisterInstance();
      }
    };


    /**
     * Stops observing all target elements for intersection changes.
     */
    IntersectionObserver.prototype.disconnect = function() {
      this._observationTargets = [];
      this._unmonitorAllIntersections();
      this._unregisterInstance();
    };


    /**
     * Returns any queue entries that have not yet been reported to the
     * callback and clears the queue. This can be used in conjunction with the
     * callback to obtain the absolute most up-to-date intersection information.
     * @return {Array} The currently queued entries.
     */
    IntersectionObserver.prototype.takeRecords = function() {
      var records = this._queuedEntries.slice();
      this._queuedEntries = [];
      return records;
    };


    /**
     * Accepts the threshold value from the user configuration object and
     * returns a sorted array of unique threshold values. If a value is not
     * between 0 and 1 and error is thrown.
     * @private
     * @param {Array|number=} opt_threshold An optional threshold value or
     *     a list of threshold values, defaulting to [0].
     * @return {Array} A sorted list of unique and valid threshold values.
     */
    IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
      var threshold = opt_threshold || [0];
      if (!Array.isArray(threshold)) threshold = [threshold];

      return threshold.sort().filter(function(t, i, a) {
        if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
          throw new Error('threshold must be a number between 0 and 1 inclusively');
        }
        return t !== a[i - 1];
      });
    };


    /**
     * Accepts the rootMargin value from the user configuration object
     * and returns an array of the four margin values as an object containing
     * the value and unit properties. If any of the values are not properly
     * formatted or use a unit other than px or %, and error is thrown.
     * @private
     * @param {string=} opt_rootMargin An optional rootMargin value,
     *     defaulting to '0px'.
     * @return {Array<Object>} An array of margin objects with the keys
     *     value and unit.
     */
    IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
      var marginString = opt_rootMargin || '0px';
      var margins = marginString.split(/\s+/).map(function(margin) {
        var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
          throw new Error('rootMargin must be specified in pixels or percent');
        }
        return {value: parseFloat(parts[1]), unit: parts[2]};
      });

      // Handles shorthand.
      margins[1] = margins[1] || margins[0];
      margins[2] = margins[2] || margins[0];
      margins[3] = margins[3] || margins[1];

      return margins;
    };


    /**
     * Starts polling for intersection changes if the polling is not already
     * happening, and if the page's visibility state is visible.
     * @param {!Document} doc
     * @private
     */
    IntersectionObserver.prototype._monitorIntersections = function(doc) {
      var win = doc.defaultView;
      if (!win) {
        // Already destroyed.
        return;
      }
      if (this._monitoringDocuments.indexOf(doc) != -1) {
        // Already monitoring.
        return;
      }

      // Private state for monitoring.
      var callback = this._checkForIntersections;
      var monitoringInterval = null;
      var domObserver = null;

      // If a poll interval is set, use polling instead of listening to
      // resize and scroll events or DOM mutations.
      if (this.POLL_INTERVAL) {
        monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
      } else {
        addEvent(win, 'resize', callback, true);
        addEvent(doc, 'scroll', callback, true);
        if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
          domObserver = new win.MutationObserver(callback);
          domObserver.observe(doc, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
      }

      this._monitoringDocuments.push(doc);
      this._monitoringUnsubscribes.push(function() {
        // Get the window object again. When a friendly iframe is destroyed, it
        // will be null.
        var win = doc.defaultView;

        if (win) {
          if (monitoringInterval) {
            win.clearInterval(monitoringInterval);
          }
          removeEvent(win, 'resize', callback, true);
        }

        removeEvent(doc, 'scroll', callback, true);
        if (domObserver) {
          domObserver.disconnect();
        }
      });

      // Also monitor the parent.
      var rootDoc =
        (this.root && (this.root.ownerDocument || this.root)) || document;
      if (doc != rootDoc) {
        var frame = getFrameElement(doc);
        if (frame) {
          this._monitorIntersections(frame.ownerDocument);
        }
      }
    };


    /**
     * Stops polling for intersection changes.
     * @param {!Document} doc
     * @private
     */
    IntersectionObserver.prototype._unmonitorIntersections = function(doc) {
      var index = this._monitoringDocuments.indexOf(doc);
      if (index == -1) {
        return;
      }

      var rootDoc =
        (this.root && (this.root.ownerDocument || this.root)) || document;

      // Check if any dependent targets are still remaining.
      var hasDependentTargets =
          this._observationTargets.some(function(item) {
            var itemDoc = item.element.ownerDocument;
            // Target is in this context.
            if (itemDoc == doc) {
              return true;
            }
            // Target is nested in this context.
            while (itemDoc && itemDoc != rootDoc) {
              var frame = getFrameElement(itemDoc);
              itemDoc = frame && frame.ownerDocument;
              if (itemDoc == doc) {
                return true;
              }
            }
            return false;
          });
      if (hasDependentTargets) {
        return;
      }

      // Unsubscribe.
      var unsubscribe = this._monitoringUnsubscribes[index];
      this._monitoringDocuments.splice(index, 1);
      this._monitoringUnsubscribes.splice(index, 1);
      unsubscribe();

      // Also unmonitor the parent.
      if (doc != rootDoc) {
        var frame = getFrameElement(doc);
        if (frame) {
          this._unmonitorIntersections(frame.ownerDocument);
        }
      }
    };


    /**
     * Stops polling for intersection changes.
     * @param {!Document} doc
     * @private
     */
    IntersectionObserver.prototype._unmonitorAllIntersections = function() {
      var unsubscribes = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0;
      this._monitoringUnsubscribes.length = 0;
      for (var i = 0; i < unsubscribes.length; i++) {
        unsubscribes[i]();
      }
    };


    /**
     * Scans each observation target for intersection changes and adds them
     * to the internal entries queue. If new entries are found, it
     * schedules the callback to be invoked.
     * @private
     */
    IntersectionObserver.prototype._checkForIntersections = function() {
      if (!this.root && crossOriginUpdater && !crossOriginRect) {
        // Cross origin monitoring, but no initial data available yet.
        return;
      }

      var rootIsInDom = this._rootIsInDom();
      var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

      this._observationTargets.forEach(function(item) {
        var target = item.element;
        var targetRect = getBoundingClientRect(target);
        var rootContainsTarget = this._rootContainsTarget(target);
        var oldEntry = item.entry;
        var intersectionRect = rootIsInDom && rootContainsTarget &&
            this._computeTargetAndRootIntersection(target, targetRect, rootRect);

        var rootBounds = null;
        if (!this._rootContainsTarget(target)) {
          rootBounds = getEmptyRect();
        } else if (!crossOriginUpdater || this.root) {
          rootBounds = rootRect;
        }

        var newEntry = item.entry = new IntersectionObserverEntry({
          time: now(),
          target: target,
          boundingClientRect: targetRect,
          rootBounds: rootBounds,
          intersectionRect: intersectionRect
        });

        if (!oldEntry) {
          this._queuedEntries.push(newEntry);
        } else if (rootIsInDom && rootContainsTarget) {
          // If the new entry intersection ratio has crossed any of the
          // thresholds, add a new entry.
          if (this._hasCrossedThreshold(oldEntry, newEntry)) {
            this._queuedEntries.push(newEntry);
          }
        } else {
          // If the root is not in the DOM or target is not contained within
          // root but the previous entry for this target had an intersection,
          // add a new record indicating removal.
          if (oldEntry && oldEntry.isIntersecting) {
            this._queuedEntries.push(newEntry);
          }
        }
      }, this);

      if (this._queuedEntries.length) {
        this._callback(this.takeRecords(), this);
      }
    };


    /**
     * Accepts a target and root rect computes the intersection between then
     * following the algorithm in the spec.
     * TODO(philipwalton): at this time clip-path is not considered.
     * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
     * @param {Element} target The target DOM element
     * @param {Object} targetRect The bounding rect of the target.
     * @param {Object} rootRect The bounding rect of the root after being
     *     expanded by the rootMargin value.
     * @return {?Object} The final intersection rect object or undefined if no
     *     intersection is found.
     * @private
     */
    IntersectionObserver.prototype._computeTargetAndRootIntersection =
        function(target, targetRect, rootRect) {
      // If the element isn't displayed, an intersection can't happen.
      if (window.getComputedStyle(target).display == 'none') return;

      var intersectionRect = targetRect;
      var parent = getParentNode(target);
      var atRoot = false;

      while (!atRoot && parent) {
        var parentRect = null;
        var parentComputedStyle = parent.nodeType == 1 ?
            window.getComputedStyle(parent) : {};

        // If the parent isn't displayed, an intersection can't happen.
        if (parentComputedStyle.display == 'none') return null;

        if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {
          atRoot = true;
          if (parent == this.root || parent == document) {
            if (crossOriginUpdater && !this.root) {
              if (!crossOriginRect ||
                  crossOriginRect.width == 0 && crossOriginRect.height == 0) {
                // A 0-size cross-origin intersection means no-intersection.
                parent = null;
                parentRect = null;
                intersectionRect = null;
              } else {
                parentRect = crossOriginRect;
              }
            } else {
              parentRect = rootRect;
            }
          } else {
            // Check if there's a frame that can be navigated to.
            var frame = getParentNode(parent);
            var frameRect = frame && getBoundingClientRect(frame);
            var frameIntersect =
                frame &&
                this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
            if (frameRect && frameIntersect) {
              parent = frame;
              parentRect = convertFromParentRect(frameRect, frameIntersect);
            } else {
              parent = null;
              intersectionRect = null;
            }
          }
        } else {
          // If the element has a non-visible overflow, and it's not the <body>
          // or <html> element, update the intersection rect.
          // Note: <body> and <html> cannot be clipped to a rect that's not also
          // the document rect, so no need to compute a new intersection.
          var doc = parent.ownerDocument;
          if (parent != doc.body &&
              parent != doc.documentElement &&
              parentComputedStyle.overflow != 'visible') {
            parentRect = getBoundingClientRect(parent);
          }
        }

        // If either of the above conditionals set a new parentRect,
        // calculate new intersection data.
        if (parentRect) {
          intersectionRect = computeRectIntersection(parentRect, intersectionRect);
        }
        if (!intersectionRect) break;
        parent = parent && getParentNode(parent);
      }
      return intersectionRect;
    };


    /**
     * Returns the root rect after being expanded by the rootMargin value.
     * @return {ClientRect} The expanded root rect.
     * @private
     */
    IntersectionObserver.prototype._getRootRect = function() {
      var rootRect;
      if (this.root && !isDoc(this.root)) {
        rootRect = getBoundingClientRect(this.root);
      } else {
        // Use <html>/<body> instead of window since scroll bars affect size.
        var doc = isDoc(this.root) ? this.root : document;
        var html = doc.documentElement;
        var body = doc.body;
        rootRect = {
          top: 0,
          left: 0,
          right: html.clientWidth || body.clientWidth,
          width: html.clientWidth || body.clientWidth,
          bottom: html.clientHeight || body.clientHeight,
          height: html.clientHeight || body.clientHeight
        };
      }
      return this._expandRectByRootMargin(rootRect);
    };


    /**
     * Accepts a rect and expands it by the rootMargin value.
     * @param {DOMRect|ClientRect} rect The rect object to expand.
     * @return {ClientRect} The expanded rect.
     * @private
     */
    IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
      var margins = this._rootMarginValues.map(function(margin, i) {
        return margin.unit == 'px' ? margin.value :
            margin.value * (i % 2 ? rect.width : rect.height) / 100;
      });
      var newRect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3]
      };
      newRect.width = newRect.right - newRect.left;
      newRect.height = newRect.bottom - newRect.top;

      return newRect;
    };


    /**
     * Accepts an old and new entry and returns true if at least one of the
     * threshold values has been crossed.
     * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
     *    particular target element or null if no previous entry exists.
     * @param {IntersectionObserverEntry} newEntry The current entry for a
     *    particular target element.
     * @return {boolean} Returns true if a any threshold has been crossed.
     * @private
     */
    IntersectionObserver.prototype._hasCrossedThreshold =
        function(oldEntry, newEntry) {

      // To make comparing easier, an entry that has a ratio of 0
      // but does not actually intersect is given a value of -1
      var oldRatio = oldEntry && oldEntry.isIntersecting ?
          oldEntry.intersectionRatio || 0 : -1;
      var newRatio = newEntry.isIntersecting ?
          newEntry.intersectionRatio || 0 : -1;

      // Ignore unchanged ratios
      if (oldRatio === newRatio) return;

      for (var i = 0; i < this.thresholds.length; i++) {
        var threshold = this.thresholds[i];

        // Return true if an entry matches a threshold or if the new ratio
        // and the old ratio are on the opposite sides of a threshold.
        if (threshold == oldRatio || threshold == newRatio ||
            threshold < oldRatio !== threshold < newRatio) {
          return true;
        }
      }
    };


    /**
     * Returns whether or not the root element is an element and is in the DOM.
     * @return {boolean} True if the root element is an element and is in the DOM.
     * @private
     */
    IntersectionObserver.prototype._rootIsInDom = function() {
      return !this.root || containsDeep(document, this.root);
    };


    /**
     * Returns whether or not the target element is a child of root.
     * @param {Element} target The target element to check.
     * @return {boolean} True if the target element is a child of root.
     * @private
     */
    IntersectionObserver.prototype._rootContainsTarget = function(target) {
      var rootDoc =
        (this.root && (this.root.ownerDocument || this.root)) || document;
      return (
        containsDeep(rootDoc, target) &&
        (!this.root || rootDoc == target.ownerDocument)
      );
    };


    /**
     * Adds the instance to the global IntersectionObserver registry if it isn't
     * already present.
     * @private
     */
    IntersectionObserver.prototype._registerInstance = function() {
      if (registry.indexOf(this) < 0) {
        registry.push(this);
      }
    };


    /**
     * Removes the instance from the global IntersectionObserver registry.
     * @private
     */
    IntersectionObserver.prototype._unregisterInstance = function() {
      var index = registry.indexOf(this);
      if (index != -1) registry.splice(index, 1);
    };


    /**
     * Returns the result of the performance.now() method or null in browsers
     * that don't support the API.
     * @return {number} The elapsed time since the page was requested.
     */
    function now() {
      return window.performance && performance.now && performance.now();
    }


    /**
     * Throttles a function and delays its execution, so it's only called at most
     * once within a given time period.
     * @param {Function} fn The function to throttle.
     * @param {number} timeout The amount of time that must pass before the
     *     function can be called again.
     * @return {Function} The throttled function.
     */
    function throttle(fn, timeout) {
      var timer = null;
      return function () {
        if (!timer) {
          timer = setTimeout(function() {
            fn();
            timer = null;
          }, timeout);
        }
      };
    }


    /**
     * Adds an event handler to a DOM node ensuring cross-browser compatibility.
     * @param {Node} node The DOM node to add the event handler to.
     * @param {string} event The event name.
     * @param {Function} fn The event handler to add.
     * @param {boolean} opt_useCapture Optionally adds the even to the capture
     *     phase. Note: this only works in modern browsers.
     */
    function addEvent(node, event, fn, opt_useCapture) {
      if (typeof node.addEventListener == 'function') {
        node.addEventListener(event, fn, opt_useCapture || false);
      }
      else if (typeof node.attachEvent == 'function') {
        node.attachEvent('on' + event, fn);
      }
    }


    /**
     * Removes a previously added event handler from a DOM node.
     * @param {Node} node The DOM node to remove the event handler from.
     * @param {string} event The event name.
     * @param {Function} fn The event handler to remove.
     * @param {boolean} opt_useCapture If the event handler was added with this
     *     flag set to true, it should be set to true here in order to remove it.
     */
    function removeEvent(node, event, fn, opt_useCapture) {
      if (typeof node.removeEventListener == 'function') {
        node.removeEventListener(event, fn, opt_useCapture || false);
      }
      else if (typeof node.detachEvent == 'function') {
        node.detachEvent('on' + event, fn);
      }
    }


    /**
     * Returns the intersection between two rect objects.
     * @param {Object} rect1 The first rect.
     * @param {Object} rect2 The second rect.
     * @return {?Object|?ClientRect} The intersection rect or undefined if no
     *     intersection is found.
     */
    function computeRectIntersection(rect1, rect2) {
      var top = Math.max(rect1.top, rect2.top);
      var bottom = Math.min(rect1.bottom, rect2.bottom);
      var left = Math.max(rect1.left, rect2.left);
      var right = Math.min(rect1.right, rect2.right);
      var width = right - left;
      var height = bottom - top;

      return (width >= 0 && height >= 0) && {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        width: width,
        height: height
      } || null;
    }


    /**
     * Shims the native getBoundingClientRect for compatibility with older IE.
     * @param {Element} el The element whose bounding rect to get.
     * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
     */
    function getBoundingClientRect(el) {
      var rect;

      try {
        rect = el.getBoundingClientRect();
      } catch (err) {
        // Ignore Windows 7 IE11 "Unspecified error"
        // https://github.com/w3c/IntersectionObserver/pull/205
      }

      if (!rect) return getEmptyRect();

      // Older IE
      if (!(rect.width && rect.height)) {
        rect = {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };
      }
      return rect;
    }


    /**
     * Returns an empty rect object. An empty rect is returned when an element
     * is not in the DOM.
     * @return {ClientRect} The empty rect.
     */
    function getEmptyRect() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }


    /**
     * Ensure that the result has all of the necessary fields of the DOMRect.
     * Specifically this ensures that `x` and `y` fields are set.
     *
     * @param {?DOMRect|?ClientRect} rect
     * @return {?DOMRect}
     */
    function ensureDOMRect(rect) {
      // A `DOMRect` object has `x` and `y` fields.
      if (!rect || 'x' in rect) {
        return rect;
      }
      // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
      // for internally calculated Rect objects. For the purposes of
      // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
      // for these fields.
      return {
        top: rect.top,
        y: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        x: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
      };
    }


    /**
     * Inverts the intersection and bounding rect from the parent (frame) BCR to
     * the local BCR space.
     * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
     * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
     * @return {ClientRect} The local root bounding rect for the parent's children.
     */
    function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
      var top = parentIntersectionRect.top - parentBoundingRect.top;
      var left = parentIntersectionRect.left - parentBoundingRect.left;
      return {
        top: top,
        left: left,
        height: parentIntersectionRect.height,
        width: parentIntersectionRect.width,
        bottom: top + parentIntersectionRect.height,
        right: left + parentIntersectionRect.width
      };
    }


    /**
     * Checks to see if a parent element contains a child element (including inside
     * shadow DOM).
     * @param {Node} parent The parent element.
     * @param {Node} child The child element.
     * @return {boolean} True if the parent node contains the child node.
     */
    function containsDeep(parent, child) {
      var node = child;
      while (node) {
        if (node == parent) return true;

        node = getParentNode(node);
      }
      return false;
    }


    /**
     * Gets the parent node of an element or its host element if the parent node
     * is a shadow root.
     * @param {Node} node The node whose parent to get.
     * @return {Node|null} The parent node or null if no parent exists.
     */
    function getParentNode(node) {
      var parent = node.parentNode;

      if (node.nodeType == /* DOCUMENT */ 9 && node != document) {
        // If this node is a document node, look for the embedding frame.
        return getFrameElement(node);
      }

      // If the parent has element that is assigned through shadow root slot
      if (parent && parent.assignedSlot) {
        parent = parent.assignedSlot.parentNode;
      }

      if (parent && parent.nodeType == 11 && parent.host) {
        // If the parent is a shadow root, return the host element.
        return parent.host;
      }

      return parent;
    }

    /**
     * Returns true if `node` is a Document.
     * @param {!Node} node
     * @returns {boolean}
     */
    function isDoc(node) {
      return node && node.nodeType === 9;
    }


    // Exposes the constructors globally.
    window.IntersectionObserver = IntersectionObserver;
    window.IntersectionObserverEntry = IntersectionObserverEntry;

    }());

    /// <reference types="@adr/types/declaration" />
    /**
     * Класс Observer расширяет IntersectionObserver и предназначен для наблюдения за элементами на странице.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
     */
    /** @class */ ((function (_super) {
        __extends(Observer, _super);
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver
         */
        function Observer(callback, options) {
            var _this = _super.call(this, callback, options) || this;
            /**
             * Набор целевых элементов, отслеживаемых IntersectionObserver.
             */
            _this.elementsToObserve = [];
            // safari в iOS 13 и меньше, игнорирует наследование некоторых классов, если посмотреть прототип,
            // то там будут добавлены методы, но у экземпляра этого класса, будут методы только класса от которого наследуемся.
            // чтобы обойти это, явно устанавливаем прототип 
            Object.setPrototypeOf(_this, Observer.prototype);
            return _this;
        }
        /**
         * Проверяет, есть ли элемент в наборе целевых элементов, отслеживаемых IntersectionObserver.
         * @param target - элемент, который необходимо проверить.
         * @returns true, если элемент есть в наборе целевых элементов, отслеживаемых IntersectionObserver, иначе false.
         */
        Observer.prototype.isObserved = function (target) {
            if (!htmlElement(target))
                return false;
            for (var _i = 0, _a = this.elementsToObserve; _i < _a.length; _i++) {
                var elem = _a[_i];
                if (elem === target)
                    return true;
            }
            return false;
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect
         */
        Observer.prototype.disconnect = function () {
            this.elementsToObserve.length = 0; // удаляем все элементы 
            _super.prototype.disconnect.call(this);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe
         */
        Observer.prototype.observe = function (target) {
            _super.prototype.observe.call(this, target);
            if (!this.isObserved(target))
                this.elementsToObserve.push(target);
        };
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve
         */
        Observer.prototype.unobserve = function (target) {
            if (!htmlElement(target))
                throw new Error("Target must be an html element");
            _super.prototype.unobserve.call(this, target);
            var index = this.elementsToObserve.findIndex(function (elem) { return elem === target; });
            if (index === -1)
                return;
            this.elementsToObserve[index] = this.elementsToObserve[this.elementsToObserve.length - 1];
            this.elementsToObserve.pop();
        };
        return Observer;
    })(window.IntersectionObserver));

    /**
     * Название тестового куки.
     */
    var TEST_COOKIE_NAME = "adriver-test-cookie";
    /**
     * Значение тестового куки.
     */
    var TEST_COOKIE_VALUE = "adriver-test-value";
    /**
     * Настройки для установки куков.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure
     */
    var COOKIE_OPTIONS = { SameSite: "None", Secure: true };
    /**
     * Класс Cookie предоставляет простой и удобный способ управления файлами cookie браузера.
     * Он включает в себя статические методы получения, настройки и удаления файлов cookie, а также получения всех файлов cookie.
     */
    var Cookie = /** @class */ (function () {
        function Cookie() {
        }
        /**
         * Предназначен для получения cookie с переданным именем.
         * @param name - имя cookie для извлечения.
         * @returns значение cookie с переданным именем.
         */
        Cookie.get = function (name) {
            if (typeof name !== "string" || name === "")
                return;
            return Cookie.getAll()[name];
        };
        /**
         * Предназначен для получения всех файлов cookie.
         * @returns файлы cookie.
         */
        Cookie.getAll = function () {
            return document.cookie.split("; ").reduce(function (res, item) {
                var _a = item.split("="), name = _a[0], value = _a[1];
                if (name && value)
                    res[decodeURIComponent(name)] = decodeURIComponent(value);
                return res;
            }, {});
        };
        /**
         * Устанавливает файл cookie с указанным именем и значением, а также дополнительными параметрами.
         * @param name - название файла cookie, который необходимо установить.
         * @param value -  значение файла cookie для установки.
         * @param options - объект, содержащий дополнительные настройки файла cookie, такие как путь, срок действия,
         * домен, безопасность.
         * @returns файл cookie с указанным именем и значением, а также дополнительными параметрами.
         */
        Cookie.set = function (name, value, options) {
            if (options === void 0) { options = {}; }
            if (typeof name !== "string" || name === "" || typeof value !== "string")
                return;
            options = __assign({ path: "/" }, options);
            if (options.expires instanceof Date)
                options.expires = options.expires.toUTCString();
            var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            for (var optionKey in options) {
                updatedCookie += "; " + optionKey;
                var optionValue = options[optionKey];
                if (optionValue !== true)
                    updatedCookie += "=" + optionValue;
            }
            return document.cookie = updatedCookie;
        };
        /**
         * Удаляет файл cookie с указанным именем.
         * @param name - название файла cookie, который необходимо удалить.
         */
        Cookie.delete = function (name) {
            if (typeof name !== "string" || name === "")
                return;
            Cookie.set(name, "", { "max-age": -1, expires: new Date() });
        };
        /**
         * Проверяет, можно ли установить куки.
         * @returns возвращает `true`, если куки могут быть установлены, иначе возвращает `false`.
         */
        Cookie.canSetCookie = function () {
            if (typeof this.canSetCookieResult === "boolean")
                return this.canSetCookieResult;
            try {
                Cookie.set(TEST_COOKIE_NAME, TEST_COOKIE_VALUE, __assign(__assign({}, COOKIE_OPTIONS), { Domain: ".onrender.com" }));
                var isCookieSet = Cookie.get(TEST_COOKIE_NAME) === TEST_COOKIE_VALUE;
                Cookie.delete(TEST_COOKIE_NAME);
                this.canSetCookieResult = isCookieSet;
            }
            catch (error) {
                this.canSetCookieResult = false;
            }
            return this.canSetCookieResult;
        };
        /**
         * Флаг, указывающий на возможность установки кук.
         * @defaultValue null если результат еще не был вычислен.
         */
        Cookie.canSetCookieResult = null;
        return Cookie;
    }());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    document.addEventListener("DOMContentLoaded", function () {
        console.log(Cookie.canSetCookie());
        console.log(Cookie.canSetCookie());
    });

})();
//# sourceMappingURL=index.js.map
