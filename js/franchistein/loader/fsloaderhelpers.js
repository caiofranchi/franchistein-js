/**
 * Created with JetBrains WebStorm.
 * Author: Caio Franchi
 * Date: 02/10/12
 * Time: 11:51
 */

/**

 @author <a href="http://caiofranchi.com.br">Caio Franchi</a>

 @namespace window

 @class FSLoaderHelpers

 */
window.URL = window.URL || window.webkitURL;
window.FSLoaderHelpers = {

    //LOADING TYPES
    LOAD_AS_TAGS : "tag",
    LOAD_AS_XHR : "xhr",
    LOAD_AS_BLOB : "blob",
    LOAD_AS_ARRAY_BUFFER : "arraybuffer",
    DEFAULT_LOAD_TYPE : "tag",

    //LOAD METHODS
    METHOD_GET : "GET",
    METHOD_POST : "POST",

    //LOADER TYPES (read-only)
    TYPE_JAVASCRIPT : "script",
    TYPE_CSS : "css",
    TYPE_IMAGE : "image",
    TYPE_SOUND : "sound",
    TYPE_JSON : "json",
    TYPE_XML : "xml",
    TYPE_SVG : "svg",
    TYPE_TEXT : "text",

    FILE_TYPE_TEXT : "text",
    FILE_TYPE_BINARY : "binary",

    //LOADING STATES (read-only)
    STATE_UNLOADED : "unloaded",
    STATE_STARTED : "started",
    STATE_LOADING : "loading",
    STATE_FINISHED : "complete",
    STATE_ERROR : "error",

    //OPTIONS
    REGISTERED_LOADER_OPTIONS : ["id", "preventCache", "container"],
    REGISTERED_QUEUE_OPTIONS : ["id", "preventCache", "container", "ignoreErrors", "onitemerror", "onitemerrorparams", "onitemcomplete", "onitemcompleteparams", "onitemstart", "onitemstartparams", "onqueueerror", "onqueueerrorparams", "onqueuecomplete", "onqueuecompleteparams", "onqueueprogress", "onqueueprogressparams"],
    REGISTERED_ITEM_OPTIONS : ["id", "preventCache", "method", "type", "onstart", "onstartparams", "onerror", "onerrorparams", "oncomplete", "oncompleteparams"],
    MERGE_OPTIONS : ["preventCache"],

    //Registered internal modules
    MODULE_BASE : "js/franchistein/",

    /**

     @method parseContent
     @description Method for parsing and finding loadable assets on page

     @param {Object} pObjOption The error handler function

     @returns {FSLoaderQueue} returns a configured queue with the founded items

     */
    parseContent : function (pObjOption) { //{images:true|false,css:true|false,scope:document.body|HTMLElement}
        "use strict";
        var identifiedQueue = new FSLoaderQueue();
        return identifiedQueue;
    },

    //method for evaluating item options from father element option (queue or fs loader)
    evaluateOptions : function (pFSLoaderItem, pFather) {

        var curOptions = pFSLoaderItem.options;
        var fatherOptions = pFather.options;

        //merge then together respecting the object hierarchy
        console.log(curOptions);
        console.log(fatherOptions);

        //evaluating son properties
        for (var i in curOptions) {
            if (curOptions.hasOwnProperty(i)) {
                if(i.indexOf)
                    console.log(i + " : " + curOptions[i]);
            }
        }

        return curOptions;
    },

    /**

     @method isBinary
     @description Verify by the file type if its binary or not

     @param {String} pStrType The file type

     @returns {Boolean} returns true if binary and false if not

     */
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

    /**

     @method isBinary
     @description Verify by the file type if its binary or not

     @param {String} pStrType The file type

     @returns {Boolean} returns true if binary and false if not

     */
    isData: function(pStrType) {
        "use strict";
        switch (pStrType) {
            case FSLoaderHelpers.TYPE_JSON:
            case FSLoaderHelpers.TYPE_TEXT:
            case FSLoaderHelpers.TYPE_XML:
                return true;
            default:
                return false;
        };
    },

    getURLByBlob: function (pObjBlob) {
        "use strict";
        return window.URL.createObjectURL(pObjBlob);
    },

    /**

     @method isBinary
     @description Verify if the current browser supports XHR2

     @returns {Boolean} returns true if supports and false if not

     */
    isXHR2Supported: function () {
        var xhr = new XMLHttpRequest;

        return (

            typeof xhr.upload !== "undefined" && (
                // Web worker
                typeof window.postMessage !== "undefined" ||
                    // window
                    (typeof window.FormData !== "undefined" && typeof window.File !== "undefined" && typeof window.Blob !== "undefined")
                )

            );
    }
};