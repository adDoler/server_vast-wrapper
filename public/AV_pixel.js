/* AdriverViewabilityPixel 1.5.8.5 "pixel". Developed by Alexander Nikolaev */
function AdriverViewabilityPixel(a, b, c, d, e) {
    this.browser = checkBrowser();
    this.win = window;
    this.pixelLink = a.indexOf("/rle.cgi") !== -1 ? a.split("rle").join("json") : a;
    this.rnd = Math.round(1e8 * Math.random());

    this.isFrame = isIframe();
    this.topURL = this.parseURL();
    this.eventLink = createEventLink(a, this.rnd, this.topURL);
    this.zeroEvent = true;
    this.viewabilityEvent = true;
    this.isPermanent = false;
    if (typeof b !== "undefined") {
        if (b !== 0) {
            this.isPermanent = true;
        }
        if (b === 3) {
            this.viewabilityEvent = false;
            this.zeroEvent = false;
        } else if (b === 2) {
            this.zeroEvent = false;
        }
    }
    this.delay = d || 1000;
    this.startTime = (new Date).getTime();
    this.zeroEventTime = 0;
    this.viewEventTime = 0;
    this.dataNum = 1;
    if (typeof e !== "undefined") {
        if (this.isNumeric(e)) {
            this.dataNum = e;
        }
    }
    this.isStarted = false;
    this.requestDone = false;

    this.platform = checkPlatform();
    this.inApp = checkInApp(this.platform);
    this.mraid_env = 0;
    this.mraidVersion = -1;
    this.sdkName = 0;
    this.sdkVersion = 0;
    this.appID = 0;
    this.advID = 0;
    this.firstStart = true;
    this.startTime = (new Date).getTime();
    this.measurable = 1;
    this.viewState = 0;
    this.viewabilityWay = 0;
    
    this.xpidReturned = false;
    this.zeroEventWaiting = false;
    this.viewEventWaiting = false;
    this.secondaryEventWaiting = false;

    this.element = undefined;
    this.elementPar = undefined;
    if (typeof c !== "undefined") {
        if (this.isFrame.frame === 3) {
            var arrFrames = this.isFrame.topFrame.parent.document.getElementsByTagName("IFRAME"),
                foundFrame;
            for (var i = 0; i < arrFrames.length; i++) {
                if (arrFrames[i].contentWindow === this.isFrame.topFrame) foundFrame = arrFrames[i];
            }
            if (typeof foundFrame !== "undefined") {
                this.element = foundFrame;
                this.win = this.isFrame.topFrame.parent.window;
            } else {
                this.isFrame.frame = 2;
                this.isFrame.topFrame = null;
            }
        } else if (typeof c == 'string') {
            this.elementPar = c;
            !document.getElementById(c) ? this.element = undefined : this.element = document.getElementById(c);
        } else if (c !== 0) {
            this.element = c;
        }
    }
    if (this.isFrame.frame == 2 && this.isFrame.topFrame) {
        this.win = this.isFrame.topFrame;
    }
    this.isZeroSend = false;
    this.isViewable = false;
    this.eventsCallbacks = {};
    this.measurable = 1;
    if (this.isFrame.frame === 2 && this.browser == 'IE') {
        this.measurable = 0;
    }
    this.tabVisible = this.isTabVisible();
    this.ancestorLength = getAncestorLength();
    this.historyLength = typeof(history) !== 'undefined' ? history.length : '';
    this.lostPlacementChecked = false;

    this.jsTrackers = [];
    this.jsTrackersNotLoaded = false;
    this.imgTrackers = [];
    this.viewabilityTrackers = [];

    this.secondaryViewability = undefined;
    this.secondaryViewabilityTimeout = undefined;
    this.secondaryViewabilitySend = false;
    this.isSecondaryVisible = false;

    this.makeOtherParams = makeOtherParams;
    
    /*  this.secondsInterval;
    this.tabActiveOnSecond = true;
    this.secondsCounter = 0; */ 

    function makeOtherParams(a) {
        var fStr = '';
        
        for (var k in a) {
            if (typeof a[k] !== 'undefined' && a[k] !== '') {
                fStr += '&' + k + '=' + a[k];
            }
        }
        return fStr;
    }

    function checkInApp (platform) {
        if (platform === 'desktop') return 1;
        if (platform === 'mobile') {
    
            var ua = window.navigator.userAgent,
                standalone = window.navigator.standalone,
                safari = /safari/.test(ua),
                ios = /iphone|ipod|ipad/.test(ua),
                wv = ua.includes('wv'),
                AWV = !!ua.match(/(WebView|Android.*(wv|.0.0.0)|Linux; U; Android)/ig);
    
            return ((ios && !standalone && !safari) || wv || AWV) ? 3 : 2;   
        }
    
        return 0; // if undefined or another value
    }

    function createEventLink(a, rnd, topURL) {
        var p = a.substring(a.indexOf("?") + 1).split("&"),
            x = [];
        for (var i = 0; i < p.length; i++) {
            var v = p[i].split("=");
            if (v.length > 1) {
                x[v[0]] = v[1];
            }
        }
        var bt = x.bt || 21,
            bid = x.bid || 0,
            ad = x.ad || 0,
            pid = x.pid || 0,
            rand = x.rnd || rnd;

        return '//ev.adriver.ru/cgi-bin/event.cgi?sid=1&ad=' + ad + '&pid=' + pid + '&bid=' + bid + '&bt=' + bt + '&loc=' + topURL + '&rnd=' + rand + '&tuid=-1&type=';
    }

    function isIframe() {
        var v = {
                OnPage: 1,
                Iframe: 2,
                SameDomainIframe: 3
            },
            count = 0,
            curWin,
            pastWin;
        try {
            if (window.top == window) {
                return {
                    frame: v.OnPage,
                    topFrame: null,
                    topFrameRef: window.document.referrer
                };
            }
            curWin = window;
            while (curWin.parent != curWin && count < 1000) {
                pastWin = curWin;
                if (curWin.parent.document.domain != curWin.document.domain) {
                    return {
                        frame: v.Iframe,
                        topFrame: pastWin,
                        topFrameRef: pastWin.document.referrer
                    };
                }
                curWin = curWin.parent;
                count++;
            }
            return {
                frame: v.SameDomainIframe,
                topFrame: pastWin,
                topFrameRef: curWin.location.href
            };
        } catch (e) {}
        if (pastWin) {
            return {
                frame: v.Iframe,
                topFrame: pastWin,
                topFrameRef: pastWin.document.referrer
            };
        } else {
            return {
                frame: v.Iframe,
                topFrame: curWin,
                topFrameRef: curWin.document.referrer
            };
        }
    };

    function getAncestorLength() {
        try {
            var aO = window.location.ancestorOrigins;
            return typeof(aO) !== 'undefined' ? aO.length : '';
        } catch (e) {return '';}
    };

    function checkPlatform() {
        try {
            var check = 'desktop';
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = 'mobile';})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        } catch (e) {
            return 'undefined';
        }
    }

    function checkBrowser() {
        var ua = navigator.userAgent;
        if ((/trident/gi).test(ua) || (/msie/gi).test(ua)) return 'IE';
        if (ua.search(/Firefox/) > 0) return 'Firefox';
        if (ua.search(/Opera/) > 0) return 'Opera';
        if (ua.search(/Chrome/) > 0) return 'Chrome';
        if (ua.search(/Safari/) > 0) return 'Safari';
        if (ua.search(/Konqueror/) > 0) return 'Konqueror';
        if (ua.search(/Iceweasel/) > 0) return 'Iceweasel';
        if (ua.search(/SeaMonkey/) > 0) return 'SeaMonkey';
        if (ua.search(/Gecko/) > 0) return 'Gecko';
        return 'Search Bot';
    };
    this.startAFV();
}

AdriverViewabilityPixel.prototype.startAFV = function () {
    if (!this.isStarted) {
        
        if (!this.requestDone) {
            this.requestDone = true;
            this.makeParamsRequest();
        }
        this.sendZeroEvent();
        
        if(this.platform === 'mobile' && window.mraid) {
            this.mraidVersion = parseInt(window.mraid.getVersion(), 10);
        }

        if(this.mraidVersion === 2 || this.mraidVersion === 3) {
            this.viewabilityWay = this.mraidVersion === 2? 4 : 5;
            this.startMraidCheck();
        }
        else {
            if (/in/.test(document.readyState) && this.isFrame.frame === 1 && typeof this.element == "undefined") {
                this.onLoadF(this.startAFV.bind(this));
                return;
            }
            if (this.isFrame.frame === 2 && this.isFrame.topFrame) {
                if (/in/.test(this.isFrame.topFrame.document.readyState)) {
                    this.onLoadF(this.startAFV.bind(this), this.isFrame.topFrame);
                    return;
                }
            }
            if (this.isFrame.frame === 1 && typeof this.element == "undefined" && typeof this.elementPar !== "undefined") {
                !document.getElementById(this.elementPar) ? this.element = undefined : this.element = document.getElementById(this.elementPar);
            }
            if ('IntersectionObserver' in window) {
                this.viewabilityWay = 1;
                this.startIOCheck();
            } else if (this.isFrame.frame == 2 && this.browser !== 'IE') {
                this.viewabilityWay = 2;
                this.startFrameCheck();
            } else if (this.isFrame.frame !== 2 && typeof this.element !== "undefined") {
                this.viewabilityWay = 3;
                this.startLocalCheck();
            } else if (this.isFrame.frame !== 2 && typeof this.element == "undefined" && !this.lostPlacementChecked) {
                this.lostPlacementChecked = true;
                this.lostPlacementFinder();
                return;
            }
            if (this.jsTrackersNotLoaded) {
                this.loadJSTrackers();
            }
            this.isStarted = true;
        }
        /* this.secondsInterval = setInterval(this.everySecondActivity.bind(this), 1000); */
    }
};

AdriverViewabilityPixel.prototype.startMraidCheck = function () {
    function getMraidEnvParams () {
        try {
            if (this.mraid_env) {
                this.sdkName = MRAID_ENV.sdk || 0;
                this.sdkVersion = MRAID_ENV.sdkVersion || 0;
                this.appID = MRAID_ENV.appId || 0;
                this.advID = MRAID_ENV.ifa || 0;
            }
        } catch (e) {
            this.sdkName = 0;
            this.sdkVersion = 0;
            this.appID = 0;
            this.advID = 0;
        }
    }

    function getCustoms (a) {
        var customs = arguments,
            finStr = '';
        for (var i = 0; i < customs.length; i++) {
            switch (customs[i]) {
                case 115:
                    finStr += '115=' + this.viewabilityWay + ';';
                    break;
                case 116:
                    finStr += '116=' + this.appID + ';';
                    break;
                case 117:
                    finStr += '117=' + this.advID + ';';
                    break;
                case 118:
                    finStr += '118=' + this.sdkVersion + ';';
                    break;
                case 119:
                    finStr += '119=' + this.sdkName + ';';
                    break;
                case 161:
                    finStr += '161=' + Math.round(mraid.getSize().width) + ';';
                    break;
                case 162:
                    finStr += '162=' + Math.round(mraid.getSize().height) + ';';
                    break;
                case 165:
                    finStr += '165=' + this.getViewableProcWrapper() + ';';
                    break;
                case 176:
                    finStr += '176=' + ((new Date).getTime() - this.startTime) + ';';
                    break;
                case 177:
                    finStr += '177=' + this.measurable + ';';
                    break;
                case 216:
                    finStr += '216=' + window.screen.width + ';';
                    break;
                case 217:
                    finStr += '217=' + window.screen.height + ';';
                    break;
                case 226:
                    finStr += '226=' + this.inApp + ';';
                    break;
            }
        }
        return finStr;
    }

    function onViewabilityChange (a) {
        var oldViewableState = this.viewState;
        this.viewState = a;
        if (oldViewableState < 50 && this.viewState >= 50) {
            changeViewabilityStatus(true);
        } else if (oldViewableState >= 50 && this.viewState < 50) {
            changeViewabilityStatus(false);
        }
    }

    function changeViewabilityStatus (status) {
        if (!status) {
            this.viewTime = undefined;
            if (typeof this.viewTimer !== "undefined") {
                clearTimeout(this.viewTimer);
            }
        } else {
            this.viewTimer = setTimeout(function (){
                if(this.viewState >= 50) {
                    var cus = getCustoms.call(this, 115, 116, 117, 118, 119, 161, 162, 176, 177, 216, 217, 165, 226);
                    this.sendEvent(this.eventLink, 53, cus);
                    mraid.removeEventListener("exposureChange", arguments.callee);
                }
            }.bind(this), 1000);
        }
    }
    
    if (typeof MRAID_ENV !== "undefined") {
        this.mraid_env = true;
        getMraidEnvParams();
    }
    if (mraid.getState() === 'loading') {
        mraid.addEventListener('ready', checkMraidViewability);
        return;
    }

    switch (this.mraidVersion) {
        case 2:
            if (mraid.isViewable()) {

                    setTimeout(function (){
                        if(mraid.isViewable() && this.firstStart) {
                            var cus = getCustoms.call(this, 115, 116, 117, 118, 119, 161, 162, 176, 177, 216, 217, 165, 226);
                            this.sendEvent(this.eventLink, 53, cus);
                            this.firstStart = false;
                        }
                    }.bind(this), 1000);

            } else {
                
                mraid.addEventListener("viewableChange", function (viewable) {
                    if (viewable) {

                        setTimeout(function () {
                            if(mraid.isViewable() && this.firstStart) {
                                var cus = getCustoms.call(this, 115, 116, 117, 118, 119, 161, 162, 176, 177, 216, 217, 165, 226);
                                this.sendEvent(this.eventLink, 53, cus);
                                mraid.removeEventListener("viewableChange", arguments.callee);
                                this.firstStart = false;
                            }
                        }.bind(this), 1000);

                    }    
                }.bind(this));
            }
            break;
        case 3:
            mraid.addEventListener('exposureChange', function (proc) {
                if (proc >= 50) {
                    onViewabilityChange();
                }
            });
            break;
    }
}

AdriverViewabilityPixel.prototype.startIOCheck = function () {
    this.isStarted = true;
    this.ioOptions = {
        rootMargin: '0px',
        threshold: [0, 0.12, 0.25, 0.37, 0.5, 0.75, 1]
    };
    this.ioElement;
    this.ioViewableProc = 0;
    this.checkTab = function () {
        var tabNow = this.isTabVisible();
        if (this.tabVisible !== tabNow) {
            if (!tabNow && typeof this.ioElement.visibleTimeout !== "undefined") {
                clearTimeout(this.ioElement.visibleTimeout);
                this.ioElement.visibleTimeout = undefined;
            } else if (tabNow && this.ioViewableProc >= 50 && typeof this.ioElement.visibleTimeout == "undefined" && !this.isViewable && typeof this.handler !== "undefined") {
                this.ioElement.visibleTimeout = setTimeout(this.handler, this.delay);
            }
        }
        this.tabVisible = tabNow;
    };
    this.addEvent(this.win, 'visibilitychange', this.checkTab.bind(this));
    this.isIOVisible = function (intersectionRatio, visibilityProc) {
        //return ((intersectionRect.width * intersectionRect.height) / (boundingClientRect.width * boundingClientRect.height) >= 0.5);
        return intersectionRatio >= visibilityProc;
    };
    this.visibleTimerCallback = function () {
        clearTimeout(this.ioElement.visibleTimeout);
        this.ioElement.visibleTimeout = undefined;
        this.processChanges(this.observer.takeRecords());
        if (this.ioElement.isVisible && !this.isViewable && this.isTabVisible()) {
            this.sendViewEvent(53);
            this.stopObserving();
        }
    };
    this.secondaryTimerCallback = function () {
        clearTimeout(this.secondaryViewabilityTimeout);
        this.secondaryViewabilityTimeout = undefined;
        this.processChanges(this.observer.takeRecords());
        if (this.isSecondaryVisible && !this.secondaryViewabilitySend && this.isTabVisible()) {
            this.secondaryViewabilitySend = true;
            this.sendViewEvent(69);
            this.stopObserving();
        }
    };
    this.processChanges = function (changes) {
        changes.forEach(function (changeRecord) {
            this.ioElement = changeRecord.target;
            //this.ioElement.isVisible = this.isIOVisible(changeRecord.boundingClientRect, changeRecord.intersectionRect);
            this.ioElement.isVisible = this.isIOVisible(changeRecord.intersectionRatio, 0.5);
            
            this.ioViewableProc = Math.round(changeRecord.intersectionRatio * 100);
            if (this.ioElement.isVisible && typeof this.ioElement.visibleTimeout == "undefined" && !this.isViewable) {
                this.ioElement.visibleTimeout = setTimeout(this.handler, this.delay);
            }
            if (typeof this.ioElement.visibleTimeout !== "undefined" && !this.ioElement.isVisible) {
                clearTimeout(this.ioElement.visibleTimeout);
                this.ioElement.visibleTimeout = undefined;
            }
            if (typeof this.secondaryViewability !== "undefined") {
                this.isSecondaryVisible = this.isIOVisible(changeRecord.intersectionRatio, this.secondaryViewability.area/100);
                if (this.isSecondaryVisible && typeof this.secondaryViewabilityTimeout == "undefined" && !this.secondaryViewabilitySend && this.isTabVisible()) { 
                    this.secondaryViewabilityTimeout = setTimeout(this.handlerSecond, this.secondaryViewability.time*1000);
                }
                if (typeof this.secondaryViewabilityTimeout !== "undefined" && (!this.isSecondaryVisible || !this.isTabVisible())) {
                    clearTimeout(this.secondaryViewabilityTimeout);
                    this.secondaryViewabilityTimeout = undefined;
                }
            }
        }.bind(this));
    };
    this.clearViewabilityTimeout = function (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    };
    this.stopObserving = function () {
        if (!this.isPermanent && this.xpidReturned && this.isViewable && (typeof this.secondaryViewability === "undefined" || this.secondaryViewabilitySend)) {
            this.removeEvent(this.win, 'visibilitychange', this.checkTab.bind(this));
            this.observer.unobserve(this.ioElement);
        }
    };
    this.handler = this.bind(this.visibleTimerCallback, this);
    this.handlerSecond = this.bind(this.secondaryTimerCallback, this);
    this.pCHandler = this.bind(this.processChanges, this);
    this.observer = new IntersectionObserver(this.pCHandler, this.ioOptions);
    var el;

    if (typeof this.element !== "undefined") {
        el = this.element;
    } else if (this.isFrame.frame !== 1) {
        if (this.win.document.documentElement.offsetHeight === 0) {
            const width = this.win.innerWidth;
            const height = this.win.innerHeight;

            const div = this.win.document.createElement("div");

            div.style.width = width + "px";
            div.style.height = height + "px";
            div.style.position = "absolute";
            div.style.opacity = 0;
            div.style.zIndex = -999999999;
            div.style.backgroundColor = "transparent";
            div.style.top = "0";
            div.style.left = "0";

            const onResize = (event) => {
                div.style.width = event.target.innerWidth + "px";
                div.style.height = event.target.innerHeight + "px";
            }

            this.win.addEventListener('resize', onResize)
            this.win.document.documentElement.append(div);
            el = div;
        } else {
            el = this.win.document.documentElement;
        }

    }

    if (typeof el !== "undefined") this.observer.observe(el);

};

AdriverViewabilityPixel.prototype.startFrameCheck = function () {
    this.isStarted = true;
    this.viewableCount = 0;
    this.isCenterVisible = false;
    var allStyle = 'position:absolute;width:1px;height:1px;';
    if (this.browser === 'Firefox') {
        allStyle = allStyle + 'opacity:0.01;';
    } else {
        allStyle = allStyle + 'visibility:hidden;';
    }
    this.frameInfo = {
        topLeft: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:0;left:0',
            timer: 0
        },
        topRight: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:0;right:0',
            timer: 0
        },
        bottomLeft: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'bottom:0;left:0',
            timer: 0
        },
        bottomRight: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'bottom:0;right:0',
            timer: 0
        },
        centerTop: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:25%;left:50%',
            timer: 0
        },
        centerLeft: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:50%;left:25%',
            timer: 0
        },
        centerRight: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:50%;left:75%',
            timer: 0
        },
        centerBottom: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:75%;left:50%',
            timer: 0
        },
        center: {
            isDrawn: false,
            isVisible: false,
            style: allStyle + 'top:50%;left:50%',
            timer: 0
        }
    };
    this.collectInfo = function (e) {
        try {
            var d = JSON.parse(e.data);
            if (d.AFV !== undefined) {
                if (this.isCenterVisible === false && d.frame === 'center' && d.state === 'viewable') {
                    this.isCenterVisible = true;
                    this.checkViwability();
                }
                if (this.isCenterVisible === true && d.state === 'viewable') {
                    this.frameInfo[d.frame].isVisible = true;
                    this.frameInfo[d.frame].timer = (new Date()).getTime();
                }
            }
        } catch (e) {}
    };

    this.checkViwability = function () {
        var counter = 0;
        for (var key in this.frameInfo) {
            var timeNow = (new Date()).getTime();
            if (this.frameInfo[key].isVisible === true) {
                if ((timeNow - this.frameInfo[key].timer) > 300) {
                    this.frameInfo[key].isVisible = false;
                    if (key === 'center') {
                        this.isCenterVisible = false;
                    }
                } else {
                    counter++
                }
            }
        }
        this.viewableCount = counter;
        if (this.isStarted === true && this.isCenterVisible === true && !this.isViewable) {
            if (counter >= 6 && this.isTabVisible()) {
                this.sendViewEvent(53);
                this.stopAFV();
            } else {
                setTimeout(this.checkViwability.bind(this), 100);
            }
        }
        if (typeof this.secondaryViewability !== "undefined") {
            var procNow = this.getViewableProc();
            if (procNow >= this.secondaryViewability.area/100 && typeof this.secondaryViewabilityTimeout == "undefined" && !this.secondaryViewabilitySend && this.isTabVisible()) { 
                this.secondaryViewabilityTimeout = setTimeout(this.frameViwabilityComplete.bind(this), this.secondaryViewability.time*1000, false);
            }
            if (typeof this.secondaryViewabilityTimeout !== "undefined" && (procNow < this.secondaryViewability.area/100 || !this.isTabVisible())) {
                onsole.info("secondaryViewability clearTimeout");
                clearTimeout(this.secondaryViewabilityTimeout);
                this.secondaryViewabilityTimeout = undefined;
            }
        }
    };

    this.stopAFV = function () {

        if (this.isStarted && !this.isPermanent && this.isViewable && (typeof this.secondaryViewability === "undefined" || this.secondaryViewabilitySend)) {
            deleteFrames(this.frameInfo, this.win);
            this.removeEvent(this.win, 'message', this.collectInfo.bind(this));
            this.isStarted = false;
        }

        function deleteFrames(i, w) {
            for (var key in i) {
                var frame = w.document.getElementById('AdriverFrameViewability_' + key);
                if (frame !== undefined) {
                    frame.parentNode.removeChild(frame);
                }
                i[key].isDrawn = false;
                i[key].isVisible = false;
            }
        }

    };

    this.drawFrames = function (i) {
        for (var key in i) {
            var frame = this.win.document.createElement("iframe");
            frame.id = 'AdriverFrameViewability_' + key;
            frame.style.cssText = i[key].style;
            this.win.document.body.appendChild(frame);
            i[key].isDrawn = true;
            this.setFrameCode(key);
        }
    };

    this.setFrameCode = function (id) {
        var doc_frame = d(this.win.document.getElementById('AdriverFrameViewability_' + id));
        if (doc_frame !== undefined) {
            doc_frame.write('<sc' + 'ript>function tick(e){var t=(new Date).getTime();0!=tick0&&(delay=t-tick0,delay<=100?(viewcount++,count>0&&count--,viewcount>=61&&0===count&&(parent.postMessage&&parent.postMessage(\'{"state": "viewable","AFV": "true","frame": "' + id + '"}\',"*"),count=6)):viewcount=0),tick0=t}function ticker(){requestAnimFrame(function(){ticker(),tick()})}window.requestAnimFrame=function(e){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();var tick0=0,viewcount=0,count=0;ticker()<\/script>');
            doc_frame.close();
        }
    };

    this.frameViwabilityComplete = function () {
        var procNow = this.getViewableProc();
        if (!this.secondaryViewabilitySend && procNow >= this.secondaryViewability.area/100) {
            this.secondaryViewabilitySend = true;
            var lifeTime = (new Date).getTime() - this.startTime;
            this.sendViewEvent(69);
        }
        this.stopAFV();
    };

    this.drawFrames(this.frameInfo);
    this.addEvent(this.win, 'message', this.collectInfo.bind(this));

    function d(e) {
        return e.contentWindow ? e.contentWindow.document : e.contentDocument;
    }

};

AdriverViewabilityPixel.prototype.startLocalCheck = function () {
    this.isStarted = true;
    this.sendZeroEvent();
    this.localTimer = null;

    this.controlLocalViewability = function () {
        if (this.isStarted) {
            var procNow = this.checkLocalViewability(this.element, this.win);
            if (!this.isViewable) {
                if (procNow >= 0.5 && this.isTabVisible()) {
                    if (!this.localTimer) {
                        this.localTimer = setTimeout(this.localViwabilityComplete.bind(this), this.delay, true);
                    }
                } else {
                    clearTimeout(this.localTimer);
                    this.localTimer = null;
                }
            }
            if (typeof this.secondaryViewability !== "undefined") {
                if (procNow >= this.secondaryViewability.area/100 && typeof this.secondaryViewabilityTimeout == "undefined" && !this.secondaryViewabilitySend && this.isTabVisible()) { 
                    this.secondaryViewabilityTimeout = setTimeout(this.localViwabilityComplete.bind(this), this.secondaryViewability.time*1000, false);
                }
                if (typeof this.secondaryViewabilityTimeout !== "undefined" && (procNow < this.secondaryViewability.area/100 || !this.isTabVisible())) {
                    clearTimeout(this.secondaryViewabilityTimeout);
                    this.secondaryViewabilityTimeout = undefined;
                }
            }
        }
    };

    this.checkLocalViewability = function (e, w) {
        if (typeof e !== "undefined") {
            var calc = calculate(e);
            return calc.curS / calc.S;
        }

        function calculate(el) {
            var place = getDimsPlace(el),
                pos = getPosition(el, 1, w),
                sg = getScreenGeometry(w),
                wVis = getVis('h', place, pos, sg),
                hVis = getVis('v', place, pos, sg);

            return {
                S: place.w * place.h,
                curS: wVis * hVis
            };
        }

        function getDimsPlace(p) {
            return {
                w: p.clientWidth,
                h: p.clientHeight
            };
        }

        function getVis(type, place, pos, sg) {
            var isV = type === 'v',
                typePlace = isV ? 'h' : 'w',
                typePos = isV ? 'top' : 'left',
                typePage = isV ? 'ch' : 'cw',
                typeScroll = isV ? 'st' : 'sl',
                r = 0;

            if (pos[typePos] < sg[typeScroll]) {
                if (pos[typePos] + place[typePlace] > sg[typeScroll]) {
                    r = pos[typePos] + place[typePlace] - sg[typeScroll];
                    if (r > sg[typePage]) {
                        r = sg[typePage];
                    }
                }
            } else if (pos[typePos] < sg[typeScroll] + sg[typePage]) {
                if (pos[typePos] + place[typePlace] <= sg[typeScroll] + sg[typePage]) {
                    r = place[typePlace];
                } else {
                    r = sg[typeScroll] + sg[typePage] - pos[typePos];
                }
            }

            return r;
        }

        function getScreenGeometry(win) {
            var g = {},
                d = win.document,
                db = d.body,
                de = d.documentElement,
                cm = d.compatMode == 'CSS1Compat';
            g.cw = cm && de.clientWidth || win.innerWidth || db.clientWidth;
            g.ch = cm && de.clientHeight || win.innerHeight || db.clientHeight;
            g.sl = win.pageXOffset || cm && de.scrollLeft || db.scrollLeft;
            g.st = win.pageYOffset || cm && de.scrollTop || db.scrollTop;
            return g;
        }

        function getStyle(e, s, win) {
            if (e.currentStyle) {
                return e.currentStyle[s] || '';
            } else if (win.getComputedStyle) {
                return win.getComputedStyle(e, null)[s] || '';
            }
        }

        function getCoords(e, scroll, win) {
            var box = e.getBoundingClientRect();

            if (scroll) {
                var sg = getScreenGeometry(win);
                return {
                    left: box.left + sg.sl,
                    top: box.top + sg.st
                };
            }

            return box;
        }

        function getOffsetSum(e, scroll, win) {
            var top = 0,
                left = 0,
                fixed = false,
                sg;

            while (e) {
                if (getStyle(e, 'position', win) === 'fixed') fixed = true;
                top += e.offsetTop;
                left += e.offsetLeft;
                e = e.offsetParent;
            }

            if (scroll && fixed) {
                sg = getScreenGeometry(win);
                return {
                    left: left + sg.sl,
                    top: top + sg.st
                };
            }

            if (!scroll && !fixed) {
                sg = getScreenGeometry(win);
                return {
                    left: left - sg.sl,
                    top: top - sg.st
                };
            }

            return {
                left: left,
                top: top
            };
        }

        function getPosition(e, scroll, win) {
            var box = e.getBoundingClientRect ? getCoords(e, scroll, win) : getOffsetSum(e, scroll, win);
            return {
                left: Math.round(box.left),
                top: Math.round(box.top)
            };
        }
    };

    this.localViwabilityComplete = function (mainEvent) {
        var procNow = this.checkLocalViewability(this.element, this.win);
        if (mainEvent) {
            if (!this.isViewable && procNow >= 0.5) {
                this.sendViewEvent(53);
            }
        } else {
            if (!this.secondaryViewabilitySend && procNow >= this.secondaryViewability.area/100) {
                this.secondaryViewabilitySend = true;
                this.sendViewEvent(69);
            }
        }
        this.stopLocalListen();
    };

    this.handler = this.bind(this.controlLocalViewability, this);

    this.startLocalListen = function () {
        this.addEvent(this.win, 'scroll', this.handler);
        this.addEvent(this.win, 'resize', this.handler);
        this.addEvent(this.win, 'visibilitychange', this.handler);
    };

    this.stopLocalListen = function () {
        if (!this.isPermanent && this.xpidReturned && this.isViewable && (typeof this.secondaryViewability === "undefined" || this.secondaryViewabilitySend)) {
            this.removeEvent(this.win, 'scroll', this.handler);
            this.removeEvent(this.win, 'resize', this.handler);
            this.removeEvent(this.win, 'visibilitychange', this.handler);
        }
    };

    this.startLocalListen();
    this.controlLocalViewability();
    setTimeout(this.handler, 1000);
};

AdriverViewabilityPixel.prototype.onLoadF = function (a, b) {
    var winCheck = b || window;
    if (winCheck.addEventListener) {
        this.addEvent(winCheck, 'load', a);
    } else {
        winCheck.attachEvent('onload', a);
    }
};

AdriverViewabilityPixel.prototype.sendPixel = function (a) {
    a = this.httplize(a).split("![rnd]").join(this.rnd);
    if (document.createElement && document.body) {
        var b = document.createElement("img");
        b.style.position = "absolute";
        b.style.display = "none";
        b.style.width = b.style.height = "0px";
        b.style.display = "none";
        b.setAttribute('referrerpolicy','no-referrer-when-downgrade');
        b.src = a;
        document.body.appendChild(b)
    } else {
        var i = new Image();
		    i.setAttribute('referrerpolicy','no-referrer-when-downgrade');
		    i.src = a;
    }
};

AdriverViewabilityPixel.prototype.httplize = function (a) {
    a = a.indexOf("http:") == 0 ? a.split("http:").join("https:") : a;
    return (/^\/\//.test(a) ? 'https:' : "") + a;
};

AdriverViewabilityPixel.prototype.sendEvent = function (a, b, c) {

    if (typeof (a) !== "undefined" && typeof (b) !== "undefined") {
        if (a.indexOf('&type=') == -1) {
            a = a + "&type=";
        }
        if (c && a.indexOf('&custom=') == -1) {
            a = a + "&custom=";
        }
        return a = a.split("&type=").join("&type=" + b), c && (a = a.split("&custom=").join("&custom=" + c)), this.sendPixel(a), this;
    }
};

AdriverViewabilityPixel.prototype.sendZeroEvent = function () {
    this.zeroEventTime = this.zeroEventTime == 0 ? (new Date).getTime() - this.startTime : this.zeroEventTime;
    if (!this.xpidReturned) {
        this.zeroEventWaiting = true;
        return;
    }

    if (this.zeroEvent && !this.isZeroSend) {

        if (this.isFrame.frame === 2 || this.isFrame.frame === 3 || (this.isFrame.frame === 1 && typeof this.element !== "undefined")) {
            this.sendEvent(this.eventLink, 0, '113=' + ((typeof this.secondaryViewability !== "undefined") ? "1" : "0") + ';161=' + this.getBannerWidth() + ';162=' + this.getBannerHeight() + ';168=' + this.isFrame.frame + ';176=' + this.zeroEventTime + ';177=' + this.isMeasurable() + ';213=' + this.ancestorLength + ';214=' + this.historyLength + ';163=' + this.topURL + ';216=' + window.screen.width + ';217=' + window.screen.height + ';165=' + this.getViewableProcWrapper() + ';226=' + this.inApp);
            this.isZeroSend = true;
            this.loadImgPixels(this.imgTrackers);
        }
    }
    if (this.isFrame.frame === 2 || this.isFrame.frame === 3 || (this.isFrame.frame === 1 && typeof this.element !== "undefined")) {
        this.callEvent('ZeroEvent');
        this.isZeroSend = true;
    }
};

AdriverViewabilityPixel.prototype.sendViewEvent = function (type) {
    this.isViewable = true;
    this.viewEventTime = this.viewEventTime == 0 ? (new Date).getTime() - this.startTime : this.viewEventTime;
    if (!this.xpidReturned) {
        if (type === 53) {
            this.viewEventWaiting = true;
        } else if (type === 69) {
            this.secondaryEventWaiting = true;
        }
        return;
    }
    if (this.viewabilityEvent && type === 53) {
        this.sendEvent(this.eventLink, 53, '115=' + this.viewabilityWay + ';161=' + this.getBannerWidth() + ';162=' + this.getBannerHeight() + ';176=' + this.viewEventTime + ';216=' + window.screen.width + ';217=' + window.screen.height + ';165=' + this.getViewableProcWrapper() + ';226=' + this.inApp);
        this.loadImgPixels(this.viewabilityTrackers);
        /* this.isFullscreenMode(); */
            /* clearInterval(this.secondsInterval);  */
    } else if (type === 69) {
        this.sendEvent(this.eventLink, 69, '161=' + this.getBannerWidth() + ';162=' + this.getBannerHeight() + ';176=' + this.viewEventTime + ';216=' + window.screen.width + ';217=' + window.screen.height + ';165=' + this.getViewableProcWrapper() + ';226=' + this.inApp);
    }
    this.callEvent('ViewabilityEvent');
};

AdriverViewabilityPixel.prototype.addEvent = function (e, t, f) {
    if (e.addEventListener) e.addEventListener(t, f, false);
    else if (e.attachEvent) e.attachEvent('on' + t, f)
};

AdriverViewabilityPixel.prototype.removeEvent = function (e, t, f) {
    if (e.removeEventListener) e.removeEventListener(t, f, false);
    else if (e.detachEvent) e.detachEvent('on' + t, f)
};

AdriverViewabilityPixel.prototype.bind = function (func, context) {
    return function () {
        return func.apply(context, arguments);
    };
};

AdriverViewabilityPixel.prototype.getViewableProcWrapper = function () {
    const res = this.getViewableProc();
    return isNaN(res) ? "-1" : res;
}

AdriverViewabilityPixel.prototype.getViewableProc = function () {
    if (typeof this.ioViewableProc !== 'undefined') {
        return this.ioViewableProc;
    } else if ((this.isFrame.frame === 1 || this.isFrame.frame === 3) && typeof this.checkLocalViewability !== 'undefined') {
        return Math.round(this.checkLocalViewability(this.element, this.win) * 100);
    } else if (typeof this.viewableCount !== 'undefined') {
        if (this.viewableCount < 2) {
            return 0;
        } else if (this.viewableCount < 3) {
            return 12.5;
        } else if (this.viewableCount < 5) {
            return 25;
        } else if (this.viewableCount < 6) {
            return 37.5;
        } else if (this.viewableCount < 7) {
            return 50;
        } else if (this.viewableCount < 8) {
            return 75;
        } else {
            return 100;
        }
    } else {
        return 0;
    }
};

AdriverViewabilityPixel.prototype.getViewability = function () {
    var proc = this.getViewableProc();
    if (this.isFrame.frame === 2 && this.browser === 'IE') {
        return 'unmeasurable';
    }
    if (!this.isTabVisible()) {
        return 'unviewable';
    }
    return proc >= 50 ? 'viewable' : 'unviewable';
};

AdriverViewabilityPixel.prototype.isTabVisible = function () {
    return !this.win.document.hidden;
};

AdriverViewabilityPixel.prototype.isMeasurable = function () {
    return this.measurable;
};

AdriverViewabilityPixel.prototype.parseURL = function () {
    var banTopLoc;
    this.isFrame.frame == 1 ? banTopLoc = window.location.href : banTopLoc = this.isFrame.topFrameRef;
    if (banTopLoc.indexOf('doubleclick') !== -1 && banTopLoc.indexOf('betweendigital') !== -1) {
        var param, paramName, newURL;
        if (banTopLoc.indexOf('doubleclick') !== -1) {
            paramName = 'url';
        } else if (banTopLoc.indexOf('betweendigital') !== -1) {
            paramName = 'ref';
        }
        newURL = banTopLoc.split('&');
        for (var i in newURL) {
            if(typeof newURL[i] === "string"){
                param = newURL[i].split('=');
                if (typeof (param[1]) !== 'undefined' && param[1] !== "" && param[0] == paramName) {
                    banTopLoc = param[1];
                }
            }
        }
    }
    try {
        var aO = window.location.ancestorOrigins;
        if (typeof(aO) !== 'undefined') {
            aO = aO.length > 0 ? aO[aO.length-1] : undefined;
        } else {
            return encodeURIComponent(banTopLoc);
        }
        var aOsplt = aO.split('/')[2];
        if (banTopLoc.split('/')[2] !== aOsplt && aOsplt !== "") {
            return encodeURIComponent(aO);
        } else {
            return encodeURIComponent(banTopLoc);
        }
    } catch (e) {return encodeURIComponent(banTopLoc);}
};

AdriverViewabilityPixel.prototype.subscribe = function (a, b, c) {
    a = a.bind(c);
    this.eventsCallbacks[b] = a
};

AdriverViewabilityPixel.prototype.unsubscribe = function (a) {
    this.eventsCallbacks[a] = null
};

AdriverViewabilityPixel.prototype.callEvent = function (a) {
    a in this.eventsCallbacks && this.eventsCallbacks[a]();
};

AdriverViewabilityPixel.prototype.callbackInit = function (e) {
    try {
        this.eventLink = this.eventLink.split("&bt=").join("&xpid=" + e.xpid + "&bt=") + this.makeOtherParams(e.extstr)
    } catch (e) {}
    try {
        this.jsTrackers = e.jstracker;
    } catch (e) {
        this.jsTrackers = [];
    }
    try {
        this.imgTrackers = e.imgtracker;
    } catch (e) {
        this.imgTrackers = [];
    }
    try {
        this.viewabilityTrackers = e.viewtracker;
    } catch (e) {
        this.viewabilityTrackers = [];
    }
    try {
        if (this.isNumeric(e.cv.time) && this.isNumeric(e.cv.area)) {
            this.secondaryViewability = e.cv;
        }
    } catch (e) {
        this.secondaryViewability = undefined;
    }

    this.xpidReturned = true;
    if (this.zeroEventWaiting) {
        this.sendZeroEvent();
    }
    if (this.viewEventWaiting) {
        this.sendViewEvent(53);
    }
    if (this.secondaryEventWaiting) {
        this.sendViewEvent(69);
    }
    this.loadJSTrackers();
    if ('IntersectionObserver' in window && this.isFrame.frame == 2 && typeof(this.observer) !== "undefined") {
        this.processChanges(this.observer.takeRecords());
    }
    //this.startAFV();
};

AdriverViewabilityPixel.prototype.makeParamsRequest = function () {
    try {
        var customs = [], locHtml = window.location.search.substring(1).split('&'), htmlParam, locXpid = '';
        for(var i in locHtml){
            if(typeof locHtml[i] === "number" || typeof locHtml[i] === "string"){
                htmlParam = locHtml[i].split('=');
                if(typeof(htmlParam[1]) != 'undefined' && (htmlParam[0] == 'html_params')){
                    locXpid = decodeURIComponent(htmlParam[1]).indexOf('xpid=') == -1 ? '' : "212=" + decodeURIComponent(htmlParam[1]).split('xpid=')[1].split('&')[0];
                    customs.push(locXpid);
                } else if (typeof(htmlParam[1]) != 'undefined' && (htmlParam[0] == 'seanceId' || htmlParam[0] == 'rclid')) {
                    locXpid = "212=" + decodeURIComponent(htmlParam[1]);
                    customs.push(locXpid);
                }
            }
        }
        var wNow = this.getBannerWidth(),
            hNow = this.getBannerHeight(),
            whStr = "", customStr = "";
        if (wNow !== 0 && wNow !== 'undefined' && hNow !== 0 && hNow !== 'undefined') {
            whStr = "&w=" + wNow + "&h=" + hNow;
            customs.push("161=" + wNow + ";162=" + hNow);
        }
        try {
            var usA = "215=" + encodeURIComponent(encodeURIComponent(window.navigator.userAgent));
            customs.push(usA);
        } catch (e) {}
        if (customs.length > 0) {
            customStr = "custom=";
            for (var i = 0; i < customs.length; i++) {
                customStr += customs[i];
                if (i !== customs.length - 1) {customStr += ";"}
            }
            if (this.pixelLink.indexOf('custom=') !== -1) {
                this.pixelLink = this.pixelLink.split('custom=').join(customStr+';')
            } else {
                this.pixelLink += '&'+customStr;
            }
        }
        if (this.pixelLink.indexOf('&tuid=') == -1) {
            this.pixelLink += '&tuid=1';
        }
        var linkToRequest = this.httplize(this.pixelLink.split('![rnd]').join(this.rnd) + whStr + "&tail256=" + this.topURL);

        if ('fetch' in window) {
            fetch(linkToRequest, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    referrerPolicy: 'no-referrer-when-downgrade'
                })
                .then(function (response) {
                    var contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        return response.json();
                    }
                    throw new TypeError("Not json returned");
                })
                .then(function (json) {
                    this.callbackInit(json);
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            var x, useXDomainRequest = false,
                method = 'GET',
                XHR_DONE = 4;

            if (!window.XMLHttpRequest) {
                useXDomainRequest = true;
            } else {
                x = new window.XMLHttpRequest();
                if (x.responseType === undefined) {
                    useXDomainRequest = true;
                }
            }

            if (useXDomainRequest) {
                x = new window.XDomainRequest();
                x.onload = function () {
                    this.callbackInit(JSON.parse(x.responseText), x);
                }.bind(this);
            } else {
                x.onreadystatechange = function () {
                    if (x.readyState === XHR_DONE) {
                        this.callbackInit(JSON.parse(x.responseText), x);
                    }
                }.bind(this);
            }
            x.open(method, linkToRequest, true);
            x.withCredentials = true;
            if (!useXDomainRequest) {
                x.setRequestHeader('Content-Type', 'text/plain');
            }

            x.send();
        }
    } catch (error) {
        console.log('xhr construction', error);
    }
};

AdriverViewabilityPixel.prototype.getBannerWidth = function () {
    try {
        if (this.isFrame.frame === 1) {
            if (typeof this.element === "undefined") {
                if (typeof this.elementPar === "undefined") {
                    return "undefined";
                } else {
                    !document.getElementById(this.elementPar) ? this.element = undefined : this.element = document.getElementById(this.elementPar);
                }
            }
            if (typeof this.element === "undefined") {
                return "undefined";
            } else {
                return Math.round(this.element.getBoundingClientRect().width);
            }
        } else {
            return Math.round(window.innerWidth);
        }
    } catch (e) {}
    return "undefined";
};

AdriverViewabilityPixel.prototype.getBannerHeight = function () {
    try {
        if (this.isFrame.frame === 1) {
            if (typeof this.element === "undefined") {
                if (typeof this.elementPar === "undefined") {
                    return "undefined";
                } else {
                    !document.getElementById(this.elementPar) ? this.element = undefined : this.element = document.getElementById(this.elementPar);
                }
            }
            if (typeof this.element === "undefined") {
                return "undefined";
            } else {
                return Math.round(this.element.getBoundingClientRect().height);
            }
        } else {
            return Math.round(window.innerHeight);
        }
    } catch (e) {}
    return "undefined";
};
 /* AdriverViewabilityPixel.prototype.isFullscreenMode = function () {
    try {
        // for test start
        function sendPixel(a) {
            function httplize(a) {
                if (location.protocol == 'http:' || location.protocol == 'https:') {
                    return (/^\/\//.test(a) ? location.protocol : "") + a;
                } else {
                    return (/^\/\//.test(a) ? 'https:' : "") + a;
                }
            };
            a = httplize(a).split("![rnd]").join(~~(1E6 * Math.random()));
            if (document.createElement && document.body) {
                var b = document.createElement("img");
                b.style.position = "absolute";
                b.style.display = "none";
                b.style.width = b.style.height = "0px";
                b.style.display = "none";
                b.src = a;
                document.body.appendChild(b)
            } else {
                (new Image).src = a
            }
        };
        function checkBrowser() {
            var ua = window.navigator.userAgent;
            if ((/trident/gi).test(ua) || (/msie/gi).test(ua)) return 'IE';
            if (ua.search(/Firefox/) >= 0) return 'Firefox';
            if (ua.search(/Opera/) >= 0 || ua.search(/Chrome/) >= 0) return 'ChromeBased';
            if (ua.search(/Safari/) > 0) return 'Safari';
            return 'Other';
        };
        function checkPlatform() {
            try {
                var check = 'desktop';
                (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = 'mobile';})(navigator.userAgent||navigator.vendor||window.opera);
                return check;
            } catch (e) {
                return 'undefined';
            }
        }
		
            var stateNum = 0, methodNum = 0,
                //fullNum = this.viewMode == "fullscreen" ? 1 : 0,
                fri = this.isFrame,
                brow = checkBrowser(),
                plat = checkPlatform(),
                //pW = this.getPlayerWidth(),
                //pH = this.getPlayerHeight(),
                usA = encodeURIComponent(window.navigator.userAgent);

                var banTopLoc, finalO = undefined;
                this.isFrame.frame == 1 ? banTopLoc = window.location.href : banTopLoc = this.isFrame.topFrameRef;

                try {
                    var aO = window.location.ancestorOrigins;
                    if (typeof(aO) !== 'undefined') {
                        aO = aO.length > 0 ? aO[aO.length-1] : undefined;
                    } else {
                        finalO =  encodeURIComponent(banTopLoc);
                    }
                    var aOsplt = aO.split('/')[2];
                    if (banTopLoc.split('/')[2] !== aOsplt && aOsplt !== "") {
                        finalO =  encodeURIComponent(aO);
                    } else {
                        finalO =  encodeURIComponent(banTopLoc);
                    }
                } catch (e) {finalO =  encodeURIComponent(banTopLoc);}
            
            if (window.fullScreen) {
                stateNum = 1;
                methodNum = 1;
            } else if (document.mozFullScreen || document.webkitIsFullScreen) {
                stateNum = 1;
                methodNum = 2;
            } else if (window.navigator.standalone) {
                stateNum = 1;
                methodNum = 3;
            } else if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                stateNum = 1;
                methodNum = 4;
            } else if (window.screenTop > 0 && window.screenLeft > 0 && (screen.height-window.outerHeight < 30) && (screen.height-window.outerHeight == window.screenTop*2) && (screen.width-window.outerWidth < 30)) {
                stateNum = 1;
                methodNum = 5;
            }
        
            sendPixel('https://ev.adriver.ru/cgi-bin/rle.cgi?sid=1&ad=681463&bt=21&pid=2920389&bid=6202941&bn=6202941&rnd=![rnd]&custom=1='+stateNum+';2='+brow+';3='+plat+';4='+window.screenTop+';5='+window.screenY+';6='+screen.height+';7='+window.outerHeight+';8='+screen.width+';9='+window.outerWidth+';10='+window.fullScreen+';11='+window.navigator.standalone+';12='+this.isFrame.frame+';18='+methodNum+';23='+usA+';163='+finalO);
            
        var ttt = document.getElementById('view');
        if (ttt) {
            ttt.innerHTML = ('custom=1='+stateNum+'; '+this.browser+'; '+this.platform+'; '+window.screenTop+'; '+window.screenLeft+'; '+screen.height+'; '+window.outerHeight+'; '+screen.width+'; '+window.outerWidth+'; '+window.fullScreen+'; '+navigator.standalone+'; '+this.isFrame.frame+'; '+methodNum+'; standalone='+window.navigator.standalone+'; webkitDF='+document.webkitDisplayingFullscreen)
        }
    } catch (e) {}
}; */

AdriverViewabilityPixel.prototype.isFullscreenMode = function () {
    try {
        if (window.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (window.screenTop > 0 && window.screenLeft > 0 && (screen.height-window.outerHeight < 30) && (screen.height-window.outerHeight == window.screenTop*2) && (screen.width-window.outerWidth < 30)) || (window.navigator.platform.toUpperCase().indexOf('MAC')>=0 && window.screenTop == 0 && window.screenLeft == 0)) {
            return true;
        } else {
            return false;
        }
    } catch (e) {}
    return false;
};

AdriverViewabilityPixel.prototype.setUnloadEvent = function () {
    try {
        this.sendEvent(this.eventLink, 68, '161=' + this.getBannerWidth() + ';162=' + this.getBannerHeight() + ';168=' + this.isFrame.frame + ';176=' + lifeTime + ';177=' + this.isMeasurable() + ';163=' + this.topURL);
                
    } catch (e) {}
}

AdriverViewabilityPixel.prototype.lostPlacementFinder = function () {
    try {
        var sList = document.getElementsByTagName("script"), newElement;
        for (var i = 0; i < sList.length; i++) {
            if (sList[i].src.indexOf("AV_pixel.js") != -1 && sList[i].getAttribute('data-num') == this.dataNum) {
                newElement = sList[i].parentElement;
                if (newElement instanceof HTMLBodyElement || newElement instanceof HTMLHeadElement) {
                    newElement = null;
                }
            }
        }
        if (newElement != null) {
            this.element = newElement;
            this.startAFV();
        }
    } catch (e) {}
}

AdriverViewabilityPixel.prototype.loadJSTrackers = function () {
	try {
        this.jsTrackersNotLoaded = false;
		if (this.jsTrackers.length > 0) {
			for (var i = 0; i < this.jsTrackers.length; i++) {
				var s = this.win.document.createElement('script');
					s.setAttribute('type', 'text/javascript');
					s.setAttribute('charset', 'windows-1251');
					s.setAttribute('src', this.httplize(this.jsTrackers[i].split('![rnd]').join(Math.round(Math.random()*9999999))));
                if (this.isFrame.frame !== 1) {
                    this.win.document.documentElement.appendChild(s);
                } else if (this.isFrame.frame == 1 && typeof this.element !== "undefined") {
                    this.element.appendChild(s);
                } else {
                    this.jsTrackersNotLoaded = true;
                }
			}
		}
	}catch(e){}
}

AdriverViewabilityPixel.prototype.loadImgPixels = function (pixelsArray) {
    for (var i = 0; i < pixelsArray.length; i++) {
        this.sendPixel(pixelsArray[i].split('![rnd]').join(Math.round(Math.random()*9999999)));
    }
}

AdriverViewabilityPixel.prototype.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/* 50 event every 5 seconds */
 /* AdriverViewabilityPixel.prototype.everySecondActivity = function () {
    var lifeTime = (new Date).getTime() - this.startTime;
    this.secondsCounter++;
    
    if ((this.secondsCounter >= 5 && this.isTabVisible()) || this.tabActiveOnSecond !== this.isTabVisible()) {
        this.secondsCounter = 0;
        this.sendEvent(this.eventLink, 50, '161=' + this.getBannerWidth() + ';162=' + this.getBannerHeight() + ';164=' + this.getViewability() + '165=' + this.getViewableProc() + ';166=' + this.isTabVisible() + ';176=' + lifeTime)
    }
    this.tabActiveOnSecond = this.isTabVisible()
    if (lifeTime >= 1000*60*5 || this.isViewable == true) {
        clearInterval(this.secondsInterval);
    }
} */ 


var adriverviewabilitypixel = adriverviewabilitypixel || {};
adriverviewabilitypixel.v = adriverviewabilitypixel.v || [];

adriverviewabilitypixel.v.push = function (cmd) {
    try {
        cmd.call();
    } catch (e) {}
};

adriverviewabilitypixel.checkCalls = function () {
    for (var i = 0; i < adriverviewabilitypixel.v.length; i++) {
        if (typeof adriverviewabilitypixel.v[i].called === "undefined") {
            try {
                adriverviewabilitypixel.v[i].call();
                adriverviewabilitypixel.v[i].called = true;
            } catch (e) {}
        }
    }
};

adriverviewabilitypixel.checkCalls();

adriverviewabilitypixel.getParametersAndStart = function () {
    var sList = document.getElementsByTagName("script"),
        sParams = [], numOfScripts = 0;
    
    for (var i = 0; i < sList.length; i++) {

        var foundParams = {};
        if (sList[i].src.indexOf("AV_pixel.js") != -1) {
            numOfScripts++;
            if (!sList[i].getAttribute('data-num')) {
                sList[i].setAttribute('data-num', numOfScripts);

                foundParams.sPixel = sList[i].getAttribute('data-pixel');
                foundParams.sPlacement = sList[i].getAttribute('data-placement');
                foundParams.numberOfScripts = numOfScripts;

                if (!foundParams.sPixel || !foundParams.sPlacement) {
                    var p = sList[i].src.split('?')[1];
                    if (p) {
                        p = p.split('&');
                        for (var i in p) {
                            if (typeof p[i] === "string") {
                                var param = p[i].split('=');
                                if (typeof (v = param[1]) != 'undefined') {
                                    switch (param[0]) {
                                        case 'pixel':
                                            if (!foundParams.sPixel) {
                                                foundParams.sPixel = decodeURIComponent(v)
                                            };
                                            break;
                                        case 'placement':
                                            if (!foundParams.sPlacement) {
                                                foundParams.sPlacement = decodeURIComponent(v)
                                            };
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (!foundParams.sPlacement) {
                    foundParams.sPlacement = sList[i].parentElement;
                    if (foundParams.sPlacement instanceof HTMLBodyElement || foundParams.sPlacement instanceof HTMLHeadElement) {
                        foundParams.sPlacement = null;
                    }
                }
                if (typeof foundParams.sPlacement === 'string' && typeof foundParams.sPixel === 'string') {
                    foundParams.sPlacement = foundParams.sPlacement.split(', ');
                    foundParams.sPixel = foundParams.sPixel.split(', ');
                    for (var i = 0; i < foundParams.sPlacement.length; i++) {
                        if (typeof foundParams.sPixel[i] !== "undefined") {
                            sParams.push({
                                sPixel: foundParams.sPixel[i],
                                sPlacement: foundParams.sPlacement[i],
                                numberOfScripts: foundParams.numOfScripts
                            });
                        }
                    }
                } else {
                    sParams.push(foundParams);
                }
            }
        }
    }

    for (var i = 0; i < sParams.length; i++) {
        if (typeof sParams[i].sPixel !== "undefined") {
            if (!sParams[i].sPlacement) {
                new AdriverViewabilityPixel(sParams[i].sPixel, 0, 0, 1000, sParams[i].numberOfScripts);
            } else {
                new AdriverViewabilityPixel(sParams[i].sPixel, 0, sParams[i].sPlacement, 1000, sParams[i].numberOfScripts);
            }
        }
    }
}
adriverviewabilitypixel.getParametersAndStart();