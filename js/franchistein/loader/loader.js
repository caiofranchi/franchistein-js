/**
 * FSLoader - A simple and user-friendly script for lazy loading assets on the fly and also for preloading then.
 * Author: Caio Franchi
 * Date: 20/09/12
 * Last Update: 24/09/2012
 * Time: 12:45
 * Version:  0.1b
 * Dependencies: utils/StringUtils, polyfills/function.js
 * Usage:
 * //generic loading
 * //javascript loading
 * //css loading
 * //image loading
 *
 * //queue loading
 *
 * //using for preloading assets for your sites
 */
/*jslint browser: true*/
/*global document,console,StringUtils*/


//TODO: Transform class into MODULE pattern
window.FSLoader = function (pObjDefaultOptions) {
    "use strict";
    // VARS
    this.lastItem = undefined;
    this.currentLoading = false;
    this.items = [ ];
    this.default_options = pObjDefaultOptions;
    this.currentRequest = undefined;

    //SET DEFAULTS

    //set loading method
    if (window.XMLHttpRequest !== null) {
        //if xhr is available
        this.loading_type = FSLoaderHelpers.LOAD_AS_XHR;
    } else {
        this.loading_type = FSLoaderHelpers.LOAD_AS_TAGS;
    }

    // set the default container
    if (this.default_options !== undefined && this.default_options["container"] !== undefined) {
        this.containerElement = this.default_options.container;
    } else {
        this.containerElement = document.createElement("div");
        this.containerElement.id = "divContainerFSLoader";
        this.containerElement.style.display = "none";
        document.body.appendChild(this.containerElement);
    };
};

window.FSLoaderHelpers = {

    //LOADING TYPES
    LOAD_AS_TAGS : "tag",
    LOAD_AS_XHR : "xhr",

    //LOADER TYPES (read-only)
    TYPE_SCRIPT : "script",
    TYPE_CSS : "css",
    TYPE_IMAGE : "image",
    TYPE_SWF : "flash",
    TYPE_SOUND : "sound",
    TYPE_JSON : "json",
    TYPE_XML : "xml",
    TYPE_SVG : "svg",
    TYPE_TEXT : "text",

    //LOADING STATES (read-only)
    STATE_UNLOADED : "unloaded",
    STATE_STARTED : "started",
    STATE_LOADING : "loading",
    STATE_FINISHED : "complete",
    STATE_ERROR : "error",

    //Registered internal modules
    MODULE_BASE : "js/franchistein/",

    parseContent : function () {
        "use strict";
        var identifiedQueue = new FSLoaderQueue();
        return identifiedQueue;
    }
};

window.FSLoaderQueue = function (pID, pObjDefaultOptions) {  //disposeAfterLoading, preventCache, onQueueLoadStart, onQueueLoadComplete, onQueuelLoadProgress
    "use strict";
    this.items = [ ];
    this.currentIndex = [ ];
    this.ignoreErrors = true;
};

//TODO: Develop the queue controller
FSLoaderQueue.prototype = {
    add: function (pStrPath, pObjOptions) {
        "use strict";

    },

    start: function () {

    },

    pause: function () {

    },

    stop: function () {

    },

    get: function () {

    },

    dispose: function() {

    }
}

window.FSLoaderItem = function (pRef, pStrPath, pObjOptions) {
    "use strict";
    //setup
    this.id = "loader-item-" + pRef.items.length; //it the id was not set, generate automatically
    if (pObjOptions.id !== undefined) {
        this.id = pObjOptions.id;
    }

    this.path = pStrPath;
    this.options = pObjOptions;
    this.source = pRef;
    this.data = undefined;
    this.bytesTotal = 0;
    this.bytesLoaded = 0;
    this.progress = 0;

    //type of file
    if (pObjOptions.type === undefined) {
        this.type = pRef.getFileType(pStrPath);
    } else {
        this.type = pObjOptions.type;
    }

    //preventCache?
    this.preventCache = false;
    if (pObjOptions.preventCache !== undefined) {
        this.preventCache = pObjOptions.preventCache;
    }

    //retries?
    this.retries = 0;
    if (pObjOptions.retries !== undefined) {
        this.retries = pObjOptions.retries;
    }

    //defined by system
    this.element = undefined;
    this.state = FSLoaderHelpers.STATE_UNLOADED;
    this.queue = undefined;
    this.data = undefined;
    this.bytesTotal = 0;
    this.bytesLoaded = 0;
    this.progress = 0;
};

FSLoader.prototype = {

    //PUBLIC METHODS
    loadFSModule: function (pStrID) {
        "use strict";
        //TODO: look for a user-friendly way to load modules from the suite
    },

    load: function (pStrPath, pObjOptions, pAutoLoad) { //pObjOptions = {container,onstart,onerror,oncomplete,type:swf|img|js|css,preventCache:true|false,onstartparams}
        "use strict";
        var strType = (pObjOptions.type !== undefined) ? pObjOptions.type : this.getFileType(pStrPath);

        //create a FS Loader for the request
        var currentItem = this.generateLoaderItem(pStrPath, pObjOptions);

        if (pAutoLoad === undefined || pAutoLoad === true) {
           this.executeLoad(currentItem);
        };

        return currentItem;
    },

    getJavascriptTag: function (pStrPath) {
        "use strict";
        var elScript = document.createElement("script");

        //setup element
        elScript.setAttribute("type", "text/javascript");
        elScript.setAttribute("src", pStrPath);

        return elScript;
    },

    getCssTag: function (pStrPath) {
        "use strict";
        var elScript = document.createElement("link");
        //setup element
        elScript.setAttribute("rel", "stylesheet");
        elScript.setAttribute("type", "text/css");
        elScript.setAttribute("href", pStrPath);

        return elScript;
    },

    getImageTag: function (pStrPath) {
        "use strict";
        var elScript = document.createElement("img");

        //setup element
        elScript.setAttribute("src", pStrPath);

        return elScript;
    },

    generateTagByType: function (pStrType, pStrPath) {
        switch (pStrType) {
            case FSLoaderHelpers.TYPE_CSS:
                return this.getCssTag(pStrPath);
                break;
            case FSLoaderHelpers.TYPE_SCRIPT:
                return this.getJavascriptTag(pStrPath);
                break;
            case FSLoaderHelpers.TYPE_IMAGE:
                return this.getImageTag(pStrPath);
                break;
        };
    },

    //PRIVATE METHODS

    evaluateURL: function (pStrURL, pPreventCache) {
        "use strict";
        if (pPreventCache === true) {
            var newUrl;
            if (pStrURL.indexOf("?") === -1) {
                newUrl = pStrURL + "?cache=" + new Date().getDate();
            } else {
                newUrl = pStrURL + "&cache=" + new Date().getDate();
            }
            return newUrl;
        } else {
            return pStrURL;
        }
    },

    //returns the file type for loading, based on file extension
    getFileType: function (pStrPath) {
        "use strict";
        var strExtension = StringUtils.getFileExtension(pStrPath);

        if (strExtension === "js") {
            return FSLoaderHelpers.TYPE_SCRIPT;
        } else if (strExtension === "jpg" || strExtension === "gif" || strExtension === "png") {
            return FSLoaderHelpers.TYPE_IMAGE;
        } else if (strExtension === "css") {
            return FSLoaderHelpers.TYPE_CSS;
        } else {
            return FSLoaderHelpers.TYPE_JSON;
        }
    },

    //verify by the file type if its binary or not
    isBinary: function(pStrType) {
        switch (pStrType) {
            case FSLoaderHelpers.TYPE_IMAGE:
            case FSLoaderHelpers.TYPE_SOUND:
                return true;
            default:
                return false;
        };
    },

    executeLoad: function (pFSLoaderItem) {
        //LOAD ASSET AS TAG
        if (this.loading_type === FSLoaderHelpers.LOAD_AS_TAGS) {

            //assign on start
            if (pFSLoaderItem.options.onstart !== undefined) {
                onStartCallback = pFSLoaderItem.options.onstart;
            }

            //refresh FSLoaderItemElement
            pFSLoaderItem.state = pFSLoaderItem.STATE_STARTED;

            //load as tags
            var elScript = this.generateTagByType(pFSLoaderItem.type,this.evaluateURL(pFSLoaderItem.path,pFSLoaderItem.preventCache)),
                onStartCallback;

            pFSLoaderItem.element = elScript;

            this.lastItem = pFSLoaderItem;
            this.items.push(pFSLoaderItem);

            //trigger event callback
            if (onStartCallback !== undefined) {
                if (pFSLoaderItem.options.onstartparams !== undefined) {
                    onStartCallback.apply(pFSLoaderItem, pFSLoaderItem.options.onstartparams);
                } else {
                    onStartCallback.apply(pFSLoaderItem);
                }
            }

            //loading
            pFSLoaderItem.state = pFSLoaderItem.STATE_LOADING;

            //setup event
            elScript.addEventListener("load", this.onItemLoadComplete.bind(pFSLoaderItem), false);
            elScript.addEventListener("error", this.onItemLoadError.bind(pFSLoaderItem), false);

            /*if (elScript.readyState){  //IE7+
             elScript.onreadystatechange = function () {
             if (elScript.readyState === "loaded" || elScript.readyState === "complete") {
             elScript.onreadystatechange = null;
             //if(onCompleteCallback) onCompleteCallback();
             }
             };
             } else {

             }*/

            try {
                if (pFSLoaderItem.options.container === undefined) {
                    this.containerElement.appendChild(elScript);
                }else{
                    pFSLoaderItem.options.container.appendChild(elScript);
                }
            } catch (e) {
                throw new Error("Cannot appendChild script on the given container element.");
            };

        } else if (this.loading_type === FSLoaderHelpers.LOAD_AS_XHR) {
            //LOAD ASSET WITH XHR
            var xhrLevel = 1;

            if (window.ArrayBuffer) {
                xhrLevel = 2;
            }

            // Old IE versions use a different approach
            if (window.XMLHttpRequest) {
                this.currentRequest = new XMLHttpRequest();
            } else {
                try {
                    this.currentRequest = new ActiveXObject("MSXML2.XMLHTTP.3.0");
                } catch(ex) {
                    return null;
                }
            }

            //IE9 doesn't support .overrideMimeType(), so we need to check for it.
            if (pFSLoaderItem.type === FSLoaderHelpers.TYPE_TEXT) { // && this._request.overrideMimeType
                currentRequest.overrideMimeType('text/plain; charset=x-user-defined');
            }

            //load the XHR
            this.currentRequest.open('GET', this.evaluateURL(pFSLoaderItem.path,pFSLoaderItem.preventCache), true);
            this.currentRequest.send();

            if (this.isBinary(pFSLoaderItem.type)) {
                this.currentRequest.responseType = 'arraybuffer';
            }

            /*this.currentRequest.onload = this.onItemLoadComplete.bind(pFSLoaderItem);
            this.currentRequest.onerror = this.onItemLoadError.bind(pFSLoaderItem);*/
            this.currentRequest.addEventListener("progress", this.onItemLoadProgress.bind(pFSLoaderItem), false);
            this.currentRequest.addEventListener("load", this.onItemLoadComplete.bind(pFSLoaderItem), false);
            this.currentRequest.addEventListener("error", this.onItemLoadError.bind(pFSLoaderItem), false);

            pFSLoaderItem.element = this.currentRequest;

            return true;
        }

        return false;
    },

    //returns a FSLoaderItem configured
    generateLoaderItem: function (pStrPath, pObjOptions) {
        "use strict";
        var objLoaderItem = new FSLoaderItem(this, pStrPath, pObjOptions);
        return objLoaderItem;
    },

    //function to remove listeners from the current element
    removeEventsFromElement: function (pEl) {
        "use strict";
        pEl.removeEventListener('load', this.onItemLoadComplete);
        pEl.removeEventListener('error', this.onItemLoadError);
        pEl.removeEventListener('progress', this.onItemLoadProgress);
    },

    //INTERNAL EVENTS

    //internal event on complete
    onItemLoadComplete: function (event) {
        "use strict";
        console.log("uhu");
        this.state = FSLoaderHelpers.STATE_FINISHED;
        //this.data = this.element.nodeValue;
        if (this.options.oncomplete !== undefined) {
            if (this.options.oncompleteparams !== undefined) {
                this.options.oncomplete.apply(this, this.options.oncompleteparams);
            } else {
                this.options.oncomplete.apply(this);
            }
        }
        //removing events from the element
        this.source.removeEventsFromElement(this.element);
    },

    //internal event on error
    onItemLoadProgress: function (event) {
        "use strict";

        //assign
        this.state = FSLoaderHelpers.STATE_LOADING;

        if (this.options.onprogress !== undefined) {
            if (this.options.onprogressparams !== undefined) {
                this.options.onprogress.apply(this, this.options.onprogressparams);
            } else {
                this.options.onprogress.apply(this);
            }
        }
    },

    //internal event on error
    onItemLoadError: function (event) {
        "use strict";

        //assign
        this.state = FSLoaderHelpers.STATE_ERROR;

        if (this.options.onerror !== undefined) {
            if (this.options.onerrorparams !== undefined) {
                this.options.onerror.apply(this, this.options.onerrorparams);
            } else {
                this.options.onerror.apply(this);
            }
        }
        //removing events from the element
        this.source.removeEventsFromElement(this.element);
    }
};