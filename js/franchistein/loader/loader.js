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
    this.queue = [ ];
    this.default_options = pObjDefaultOptions;

    // Create the default container element for dropping the loaded elements
    if (this.default_options === undefined) {
        this.containerElement = document.createElement("div");
        this.containerElement.id = "divContainerFSLoader";
        this.containerElement.style.display = "none";
        document.body.appendChild(this.containerElement);
    }
};

window.FSLoaderHelpers = {

    //LOADER TYPES (read-only)
    TYPE_SCRIPT : "script",
    TYPE_CSS : "css",
    TYPE_IMAGE : "image",
    TYPE_SWF : "flash",
    TYPE_AJAX : "ajax",

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
    this.ignoreFailure = true;
};

FSLoaderQueue.prototype = {
    add: function (pFsLoaderItem) {
        "use strict";
    },

    start: function () {

    },

    pause: function () {

    },

    stop: function () {

    },

    dispose: function() {

    }
}

window.FSLoaderItem = function (pEl, pRef, pStrPath, pObjOptions) {
    "use strict";
    //setup
    this.id = "loader-item-" + pRef.items.length; //it the id was not set, generate automatically
    if (pObjOptions.id !== undefined) {
        this.id = pObjOptions.id;
    }

    this.path = pStrPath;
    this.element = pEl;
    this.options = pObjOptions;
    this.source = pRef;
    this.data = undefined;

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
    this.type = undefined;
    this.state = undefined;
    this.queue = undefined;
};

FSLoader.prototype = {

    //PUBLIC METHODS
    loadFSModule: function (pStrID) {
        "use strict";
        //TODO: look for a user-friendly way to load modules from the suite
    },

    load: function (pStrPath, pObjOptions) { //pObjOptions = {container,onstart,onerror,oncomplete,type:swf|img|js|css,preventCache:true|false,onstartparams}
        "use strict";
        var strType = (pObjOptions.type !== undefined) ? pObjOptions.type : this.getFileTypeForLoading(pStrPath);

        //identify type of the file for loading
        switch (strType) {
        case FSLoaderHelpers.TYPE_SCRIPT:
            return this.loadJavascript(pStrPath, pObjOptions);
            break;
        case FSLoaderHelpers.TYPE_CSS:
            return this.loadCss(pStrPath, pObjOptions);
            break;
        case FSLoaderHelpers.TYPE_IMAGE:
            return this.loadImage(pStrPath, pObjOptions);
            break;
        default:
            return this.loadAJAX(pStrPath, pObjOptions);
            break;
        };

    },

    loadAJAX: function (pStrPath, pObjOptions) {
        "use strict";
        /*var elScript = document.createElement("script");

        //setup element
        elScript.type = "text/javascript";
        elScript.src = pStrPath;

        //setup element
        var currentItem = this.configLoad(elScript, pStrPath, pObjOptions);
        currentItem.type = FSLoaderHelpers.TYPE_SCRIPT;

        return currentItem;*/
    },

    loadJavascript: function (pStrPath, pObjOptions) {
        "use strict";
        var elScript = document.createElement("script");

        //setup element
        elScript.type = "text/javascript";
        elScript.src = pStrPath;

        //setup element
        var currentItem = this.configLoad(elScript, pStrPath, pObjOptions);
        currentItem.type = FSLoaderHelpers.TYPE_SCRIPT;

        return currentItem;
    },

    loadCss: function (pStrPath, pObjOptions) {
        "use strict";
        var elScript = document.createElement("link");
        //setup element
        elScript.rel = "stylesheet";
        elScript.type = "text/css";
        elScript.href = pStrPath;

        //setup element
        var currentItem = this.configLoad(elScript, pStrPath, pObjOptions);
        currentItem.type = FSLoaderHelpers.TYPE_CSS;

        return currentItem;
    },

    loadImage: function (pStrPath, pObjOptions) {
        "use strict";
        var elScript = document.createElement("img");
        //setup element
        elScript.src = pStrPath;

        //setup element
        var currentItem = this.configLoad(elScript, pStrPath, pObjOptions);
        currentItem.type = FSLoaderHelpers.TYPE_IMAGE;

        return currentItem;
    },

    //PRIVATE METHODS

    //returns the file type for loading, based on file extension
    getFileTypeForLoading: function (pStrPath) {
        "use strict";
        var strExtension = StringUtils.getFileExtension(pStrPath);

        if (strExtension === "js") {
            return FSLoaderHelpers.TYPE_SCRIPT;
        } else if (strExtension === "jpg" || strExtension === "gif" || strExtension === "png") {
            return FSLoaderHelpers.TYPE_IMAGE;
        } else if (strExtension === "css") {
            return FSLoaderHelpers.TYPE_CSS;
        } else {
            return FSLoaderHelpers.TYPE_AJAX;
        }
    },

    configLoad: function (pEl, pStrPath, pObjOptions) {
        var elScript = pEl,
            onStartCallback;

        if (pObjOptions.onstart !== undefined) {
            onStartCallback = pObjOptions.onstart;
        }

        //assign FSLoaderItem to this element
        var currentItem = this.generateLoaderItem(elScript, pStrPath, pObjOptions);
        currentItem.state = FSLoaderHelpers.STATE_UNLOADED;

        this.lastItem = currentItem;
        this.items.push(currentItem);

        //trigger event callback
        if (onStartCallback !== undefined) {
            if (pObjOptions.onstartparams !== undefined) {
                onStartCallback.apply(currentItem, pObjOptions.onstartparams);
            } else {
                onStartCallback.apply(currentItem);
            }
        }

        //setup event
        if (elScript.readyState){  //IE7+
            elScript.onreadystatechange = function () {
                if (elScript.readyState === "loaded" || elScript.readyState === "complete") {
                    elScript.onreadystatechange = null;
                    //if(onCompleteCallback) onCompleteCallback();
                }
            };
        } else {
            //Others
            elScript.addEventListener("load", this.onLoadComplete.bind(currentItem), false);
            elScript.addEventListener("error", this.onLoadError.bind(currentItem), false);
        }

        try {
            this.containerElement.appendChild(elScript);
        } catch (e) {
            throw new Error("Cannot appendChild script on the given container element.");
        };

        return currentItem;
    },

    //returns a FSLoaderItem configured
    generateLoaderItem: function (pEl, pStrPath, pObjOptions) {
        "use strict";
        var objLoaderItem = new FSLoaderItem(pEl, this, pStrPath, pObjOptions);
        return objLoaderItem;
    },

    //function to remove listeners from the current element
    removeEventsFromElement: function (pEl) {
        "use strict";
        pEl.removeEventListener('load', this.onLoadComplete);
        pEl.removeEventListener('error', this.onLoadError);
    },

    //INTERNAL EVENTS

    //internal event on complete
    onLoadComplete: function () {
        "use strict";
        this.data = this.element.nodeValue;
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
    onLoadError: function () {
        "use strict";
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