/**
 * Class for lazy loading assets on the fly and also ready for preloading elements.
 * Author: caio.franchi
 * Date: 20/09/12
 * Time: 12:45
 * Dependencies: utils/StringUtils, polyfills/function.js
 * Usage:
 * //generic loading
 * //javascript loading
 * //css loading
 * //image loading
 *
 * //queue loading
 */
/*jslint browser: true*/
/*global document,console,StringUtils*/

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
    MODULE_STRINGUTILS : "js/franchistein/utils/StringUtils.js"
};

window.FSLoader = function (pObjDefaultOptions) {
    "use strict";
    // VARS
    this.lastItem = undefined;
    this.currentLoading = false;
    this.items = [ ];
    this.queue = [ ];
    this.default_options = pObjDefaultOptions;

    // Create the container element for droping the loaded elements
    this.containerElement = document.createElement("div");
    this.containerElement.id = "divContainerFSLoader";
    this.containerElement.style.display = "none";
    document.body.appendChild(this.containerElement);
};

window.FSLoaderItem = function (pEl, pRef, pStrPath, pObjOptions) {
    "use strict";
    //setup
    this.id = "loader-item-"+pRef.items.length; //it the id was not set, generate automatically
    if  (pObjOptions.id !== undefined) {
        this.id = pObjOptions.id;
    }

    this.path = pStrPath;
    this.element = pEl;
    this.options = pObjOptions;
    this.source = pRef;
    this.data = undefined;

    //preventCache?
    this.preventCache = false;
    if(pObjOptions.preventCache !== undefined) {
        this.preventCache = pObjOptions.preventCache;
    }

    //retries?
    this.retries = 0;
    if(pObjOptions.retries !== undefined) {
        this.retries = pObjOptions.retries;
    }

    //defined by system
    this.type = undefined;
    this.state = undefined;
    this.queue = undefined;
};

FSLoader.prototype = {

    loadFSModule: function (pStrID) {
        "use strict";
    },

    loadQueue: function () {
        "use strict";
    },

    load: function (pStrPath, pObjOptions) { //pObjOptions = {container,onstart,onerror,oncomplete,type:swf|img|js|css,preventCache:true|false,onstartparams}
        "use strict";
        var strType = (pObjOptions.type !== undefined) ? pObjOptions.type : this.getFileTypeForLoading(pStrPath);

        //identify type of the file for loading
        switch (strType) {
        case FSLoaderHelpers.TYPE_SCRIPT:
            this.loadJavascript(pStrPath, pObjOptions);
            break;
        case FSLoaderHelpers.TYPE_CSS:
            this.loadCss(pStrPath, pObjOptions);
            break;
        case FSLoaderHelpers.TYPE_IMAGE:
            this.loadImage(pStrPath, pObjOptions);
            break;
        };

    },

    loadJavascript: function (pStrPath, pObjOptions) {
        "use strict";
        var elScript = document.createElement("script"),
            onStartCallback;
        if (pObjOptions.onstart !== undefined) {
            onStartCallback = pObjOptions.onstart;
        }

        //setup element
        elScript.type = "text/javascript";
        elScript.src = pStrPath;

        //assign FSLoaderItem to this element
        var currentItem = this.generateLoaderItem(elScript, pStrPath, pObjOptions);
        currentItem.type = FSLoaderHelpers.TYPE_SCRIPT;
        currentItem.state = FSLoaderHelpers.STATE_UNLOADED;
        this.lastItem = currentItem;
        this.items.push(currentItem);

        //trigger event callback
        if (onStartCallback !== undefined) {
            if(pObjOptions.onstartparams !== undefined) {
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
            elScript.addEventListener("error", this.onLoadError.bind(currentItem, elScript, pStrPath, pObjOptions), false);
        }

        try {
            this.containerElement.appendChild(elScript);
        } catch (e) {
            throw new Error("Cannot appendChild script on the given container element.");
        };

    },

    loadCss: function (pStrPath, pObjOptions) {
        "use strict";
        /* var fileref=document.createElement("link")
         fileref.setAttribute("rel", "stylesheet")
         fileref.setAttribute("type", "text/css")
         fileref.setAttribute("href", filename)
        */
    },

    loadImage: function (pStrPath, pObjOptions) {
        "use strict";
        /*var fileref=document.createElement("img")
         fileref.setAttribute("src", filename)
         */
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

    //returns a FSLoaderItem configured
    generateLoaderItem: function (pEl, pStrPath, pObjOptions) {
        "use strict";
        var objLoaderItem = new FSLoaderItem(pEl, this, pStrPath, pObjOptions);
        return objLoaderItem;
    },

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
    }
};