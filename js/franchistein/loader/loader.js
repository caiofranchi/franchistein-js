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

window.FSLoaderHelpers = {

    //LOADING TYPES
    LOAD_AS_TAGS : "tag",
    LOAD_AS_XHR : "xhr",
    DEFAULT_LOAD_TYPE : "tag",

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
    },

    evaluateOptions : function (pObjOptions) {

    }
};
/*
window.FSLoaderQueue = function (pID, pObjDefaultOptions) {  //disposeAfterLoading, preventCache, onQueueLoadStart, onQueueLoadComplete, onQueuelLoadProgress
    "use strict";
    this.items = [ ];
    this.currentIndex = [ ];
    this.currentItem = undefined;
    this.ignoreErrors = true;
};
*/

window.FSLoaderItem = function (pRef, pStrPath, pObjOptions) {
    "use strict";
    //setup
    this.id = "loader-item-" + pRef.items.length; //it the id was not set, generate automatically
    this.path = pStrPath;
    this.options = {};
    this.reference = pRef;
    this.data = undefined;
    this.bytesTotal = 0;
    this.bytesLoaded = 0;
    this.progress = 0;
    this.type = undefined;
    this.retries = 0;
    this.retriesLeft = 0;

    //preventCache?
    this.preventCache = false;

    //defined by system
    this.element = undefined;
    this.state = FSLoaderHelpers.STATE_UNLOADED;
    this.queue = undefined;
    this.data = undefined;
    this.bytesTotal = 0;
    this.bytesLoaded = 0;
    this.progress = 0;

    if (pObjOptions !== undefined) {
        this.options = pObjOptions;
        //id
        if (pObjOptions.id !== undefined) {
            this.id = pObjOptions.id;
        }
        //type of file
        if (pObjOptions.type === undefined) {
            this.type = pRef.getFileType(pStrPath);
        } else {
            this.type = pObjOptions.type;
        }

        //prevent cache
        if (pObjOptions.preventCache !== undefined) {
            this.preventCache = pObjOptions.preventCache;
        }

        //retries?
        if (pObjOptions.retries !== undefined) {
            this.retries = this.retriesLeft = pObjOptions.retries;
        }
    } else {
        //type of file
        this.type = pRef.getFileType(pStrPath);
    }
};

//TODO: Transform class into MODULE pattern
window.FSLoader = function (pLoadingType, pObjDefaultOptions) {
    "use strict";
    // VARS
    this.lastItem = undefined;
    this.currentLoading = false;
    this.items = [ ];
    this.options = { };
    this.currentRequest = undefined;

    //SET DEFAULTS

    //set loading type
    this.loadingType = pLoadingType;
    if (pLoadingType === undefined) {
        this.loadingType = FSLoaderHelpers.DEFAULT_LOAD_TYPE;
    }
    if (this.loadingType === FSLoaderHelpers.LOAD_AS_XHR) {
        //verify if the browser has capabilities
        if (window.XMLHttpRequest === null) {
            //if xhr is available
            this.loadingType = FSLoaderHelpers.LOAD_AS_TAGS;
        }
    }

    if (pObjDefaultOptions !== undefined) this.options = pObjDefaultOptions;

    // set the default container
    if (this.options !== undefined && this.options["container"] !== undefined) {
        this.containerElement = this.options.container;
    } else {
        this.containerElement = document.createElement("div");
        this.containerElement.id = "divContainerFSLoader";
        this.containerElement.style.display = "none";
        document.body.appendChild(this.containerElement);
    };
};

FSLoader.prototype = {

    //PUBLIC METHODS
    loadFSModule: function (pStrID) {
        "use strict";
        //TODO: look for a user-friendly way to load modules from the suite
    },

    load: function (pStrPath, pObjOptions, pAutoLoad) { //pObjOptions = {container,onstart,onerror,oncomplete,type:swf|img|js|css,preventCache:true|false,onstartparams}
        "use strict";
        var strType;

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

    getSVGTag: function (pStrPath) {
        "use strict";
        var elScript = document.createElement("object");

        //setup element
        elScript.setAttribute("type", "image/svg+xml");
        elScript.setAttribute("src", pStrPath);

        return elScript;
    },

    getSoundTag: function (pStrPath) {
        "use strict";
        var elScript = document.createElement("audio");

        //setup element
        elScript.setAttribute("type", "audio/ogg");
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
        "use strict";
        switch (pStrType) {
        case FSLoaderHelpers.TYPE_CSS:
            return this.getCssTag(pStrPath);
        case FSLoaderHelpers.TYPE_SCRIPT:
            return this.getJavascriptTag(pStrPath);
        case FSLoaderHelpers.TYPE_IMAGE:
            return this.getImageTag(pStrPath);
        case FSLoaderHelpers.TYPE_SVG:
            return this.getSVGTag(pStrPath);
        case FSLoaderHelpers.TYPE_SOUND:
            return this.getSoundTag(pStrPath);
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

    //returns the file type for loading, based on file extension and recognized file types for loading
    getFileType: function (pStrPath) {
        "use strict";
        var strExtension = StringUtils.getFileExtension(pStrPath);

        switch (strExtension) {
        case "ogg":
        case "mp3":
        case "wav":
            return FSLoaderHelpers.TYPE_SOUND;
        case "jpeg":
        case "jpg":
        case "gif":
        case "png":
            return FSLoaderHelpers.TYPE_IMAGE;
        case "json":
            return FSLoaderHelpers.TYPE_JSON;
        case "xml":
            return FSLoaderHelpers.TYPE_XML;
        case "css":
            return FSLoaderHelpers.TYPE_CSS;
        case "js":
            return FSLoaderHelpers.TYPE_SCRIPT;
        case 'svg':
            return FSLoaderHelpers.TYPE_SVG;
        default:
            return FSLoaderHelpers.TYPE_TEXT;
        }
    },

    //verify by the file type if its binary or not
    isBinary: function(pStrType) {
        "use strict";
        switch (pStrType) {
        case FSLoaderHelpers.TYPE_IMAGE:
        case FSLoaderHelpers.TYPE_SOUND:
            return true;
        default:
            return false;
        };
    },

    executeLoad: function (pFSLoaderItem) {
        "use strict";
        this.lastItem = pFSLoaderItem;
        this.items.push(pFSLoaderItem);

        //LOAD ASSET AS TAG
        if (pFSLoaderItem.reference.loadingType === FSLoaderHelpers.LOAD_AS_TAGS) {

            //assign on start
            if (pFSLoaderItem.options["onstart"] !== undefined) {
                onStartCallback = pFSLoaderItem.options.onstart;
            }

            //refresh FSLoaderItemElement
            pFSLoaderItem.state = pFSLoaderItem.STATE_STARTED;

            //load as tags
            var elScript = this.generateTagByType(pFSLoaderItem.type, this.evaluateURL(pFSLoaderItem.path, pFSLoaderItem.preventCache)),
                onStartCallback;

            pFSLoaderItem.element = elScript;

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

        } else if (pFSLoaderItem.reference.loadingType === FSLoaderHelpers.LOAD_AS_XHR) {
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
        this.state = FSLoaderHelpers.STATE_FINISHED;
        this.progress = 100;

        //if the item belongs to a queue, exec the callback
        if (this.queue !== undefined) {
            this.queue.onQueueItemComplete(this);
        };

        if (this.reference.loadingType === FSLoaderHelpers.LOAD_AS_TAGS) {
            this.data = this.element;
        }else if (this.reference.loadingType === FSLoaderHelpers.LOAD_AS_XHR) {
            //this.data =
            this.element = event.currentTarget;
        }

        //this.data = this.element.nodeValue;
        if (this.options.oncomplete !== undefined) {
            if (this.options.oncompleteparams !== undefined) {
                this.options.oncomplete.apply(this, this.options.oncompleteparams);
            } else {
                this.options.oncomplete.apply(this);
            }
        }
        //removing events from the element
        this.reference.removeEventsFromElement(this.element);
    },

    //internal event on error
    onItemLoadProgress: function (event) {
        "use strict";
        //prevent blank
        if(event.loaded > 0 && event.total === 0) {
            return;
        }
        //assign
        this.state = FSLoaderHelpers.STATE_LOADING;
        this.bytesLoaded = event.loaded;
        this.bytesTotal =  event.total;
        this.progress = Math.ceil((100 * this.bytesLoaded) / this.bytesTotal);

        //if the item belongs to a queue, exec the callback
        if (this.queue !== undefined) {
            this.queue.onQueueItemProgress(this);
        };

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

        //removing events from the element
        this.reference.removeEventsFromElement(this.element);

        //if the item still retrying to load (with timeout)
        if (this.retriesLeft > 0) {
            //try again
            this.retriesLeft--;
            var ref = this;
            setTimeout(function () {
                ref.reference.executeLoad(ref);
            }, 100);

        } else {
            //retries has ended, consider the error

            //assign
            this.state = FSLoaderHelpers.STATE_ERROR;

            //if the item belongs to a queue, exec the callback
            if (this.queue !== undefined) {
                this.queue.onQueueItemError(this);
            };

            if (this.options.onerror !== undefined) {
                if (this.options.onerrorparams !== undefined) {
                    this.options.onerror.apply(this, this.options.onerrorparams);
                } else {
                    this.options.onerror.apply(this);
                }
            };
        }
    }
};

/*
* Object for controlling a queue of loadable items
* */
window.FSLoaderQueue = function (pLoadingType, pObjDefaultOptions) {
    "use strict";
    this.reference = new FSLoader(pLoadingType, pObjDefaultOptions);
    this.items = [ ];
    this.currentIndex = 0;
    this.currentItem = undefined;
    this.ignoreErrors = true;
    this.isPaused = false;
    //
    this.total = 0;
    this.totalLoaded = 0;
    this.progress = 0;
    //
    /*this.loadingType = pLoadingType;
    if (this.loadingType === undefined) {
        this.loadingType = FSLoaderHelpers.DEFAULT_LOAD_TYPE;
    }*/

    this.options = {};

    if (pObjDefaultOptions !== undefined) this.options = pObjDefaultOptions;

    if (this.options !== undefined) {
        if (this.options.ignoreErrors !== undefined) {
            this.ignoreErrors = this.options.ignoreErrors;
        };

       if (this.options.ignoreErrors !== undefined) {
           this.ignoreErrors = this.options.ignoreErrors;
       };
    }
};

FSLoaderQueue.prototype = new FSLoader;
FSLoaderQueue.prototype.constructor = window.FSLoaderQueue;

FSLoaderQueue.prototype.add = function (pStrPath, pObjOptions) { //onqueueerror,onqueuecomplete,onqueueprogress
    "use strict";
    var currentItem = this.load(pStrPath, pObjOptions,false);
    currentItem.queue = this;
    currentItem.reference = this.reference;
    this.items.push(currentItem);
    this.total = this.items.length;
};

FSLoaderQueue.prototype.start = function () {
    "use strict";
    this.triggerCallbackEvent("onqueuestart");
    this.currentItem = this.executeLoad(this.items[this.currentIndex]);
};

FSLoaderQueue.prototype.pause = function () {
    "use strict";
    //this.currentItem.stop();
};

FSLoaderQueue.prototype.next = function () {
    this.currentIndex++;
    this.start();
}

FSLoaderQueue.prototype.previous = function () {
    this.currentIndex--;
    this.start();
}

FSLoaderQueue.prototype.verifyQueueEnd = function () {
    if (this.currentIndex < (this.total)) {
        return true;
    } else {
        return false;
    }
}

FSLoaderQueue.prototype.onQueueItemComplete = function (pItem) {
    if(this.verifyQueueEnd()) {
        this.next();
        //
        this.triggerCallbackEvent("onqueueprogress");
    } else {
        //queue complete
        this.triggerCallbackEvent("onqueuecomplete");
    }
};

FSLoaderQueue.prototype.onQueueItemError = function (pItem) {
    if (this.ignoreErrors) {
        if(this.verifyQueueEnd()) {
            this.next();
            this.triggerCallbackEvent("onqueueprogress");
        } else {
            //queue complete
            this.triggerCallbackEvent("onqueuecomplete");
        }
    }else {
        //trigger on queue error
        this.triggerCallbackEvent("onqueueerror");
    }
};

FSLoaderQueue.prototype.onQueueItemProgress = function (pItem) {
    this.triggerCallbackEvent("onqueueprogress");
};

FSLoaderQueue.prototype.onQueueItemStart = function (pItem) {
    //this.triggerCallbackEvent("onitemstart",pItem);
};

FSLoaderQueue.prototype.triggerCallbackEvent = function (pStrEventID, pDefinedSource) {
    var ref = this;
    if (pDefinedSource !== undefined) {
        //exec on base of other reference
        ref = pDefinedSource
    }

    if (ref.options === undefined) return;
    if (ref.options[pStrEventID] !== undefined) {
        if (ref.options[pStrEventID + "params"] !== undefined) {
            ref.options[pStrEventID].apply(ref, ref.options[pStrEventID + "params"]);
        } else {
            ref.options[pStrEventID].apply(ref);
        }
    };
};