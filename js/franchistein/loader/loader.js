/**
 * Created with JetBrains WebStorm.
 * Author: caio.franchi
 * Date: 20/09/12
 * Time: 12:45
 * Dependencies: utils/StringUtils, polyfills/function.js
 */
window.FSLoader = function (pObj) {
    // VARS
    this.currentLoading = false;
    this.items = [ ];
    this.queue = [ ];

    // Create the container element for droping the loaded elements
    this.containerElement = document.createElement("div");
    this.containerElement.id = "divContainerFSLoader";
    this.containerElement.style.display = "none";
    document.body.appendChild(this.containerElement);

    //Registered internal modules
    this.MODULE_STRINGUTILS = "js/franchistein/utils/StringUtils.js";

    //LOADER TYPES
    this.TYPE_SCRIPT = "script";
    this.TYPE_CSS = "css";
    this.TYPE_IMAGE = "image";
    this.TYPE_SWF = "flash";
    this.TYPE_AJAX = "ajax";
};

FSLoader.prototype = {

    loadFSModule: function (pStrID) {

    },

    loadQueue: function () {

    },

    load: function (pStrPath, pObjOptions) { //pObjOptions = {container,onstart,onerror,oncomplete,type:swf|img|js|css,preventCache:true|false,onstartparams}
        var strType = pObjOptions["type"] ? pObjOptions["type"] : this.getFileTypeForLoading(pStrPath);

        //identify type of the file for loading
        switch (strType) {
            case this.TYPE_SCRIPT:
                this.loadJavascript(pStrPath,pObjOptions);
            break;
            case this.TYPE_CSS:

            break;
            case this.TYPE_IMAGE:

            break;
        }

    },

    loadJavascript: function (pStrPath, pObjOptions) {
        var elScript = document.createElement("script");
        elScript.type = "text/javascript";
        elScript.src = pStrPath;

        var onStartCallback = pObjOptions["onstart"];

        if(onStartCallback) onStartCallback.apply(this||window,pObjOptions["onstartparams"]);

        if (elScript.readyState){  //IE7+
            elScript.onreadystatechange = function () {
                if (elScript.readyState == "loaded" || elScript.readyState == "complete") {
                    elScript.onreadystatechange = null;
                    if(onCompleteCallback) onCompleteCallback();
                }
            };
        } else {
            //Others
            elScript.addEventListener("load", this.onLoadComplete.bind(this, elScript, pStrPath, pObjOptions), false);
            elScript.addEventListener("error", this.onLoadError.bind(this, elScript, pStrPath, pObjOptions), false);

            /*
             elScript.onload = function () {
                 console.log(this);
            };
             elScript.onerror = function () {
             onErrorCallback();
             }
            */
        }

        try {
            this.containerElement.appendChild(elScript);
        } catch (e) {
            throw new Error("Problemas ao adicionar o JAVASCRIPT na página");
        }

    },

    loadCss: function (pStrPath, pStrID, pObjOptions) {
        /* var fileref=document.createElement("link")
         fileref.setAttribute("rel", "stylesheet")
         fileref.setAttribute("type", "text/css")
         fileref.setAttribute("href", filename)
        */
    },

    loadImage: function (pStrPath, pStrID, pObjOptions) {
        /*var fileref=document.createElement("img")
         fileref.setAttribute("src", filename)
         */
    },

    //PRIVATE METHODS
    getFileTypeForLoading: function (pStrPath){
        var strExtension = StringUtils.getFileExtension(pStrPath);

        if(strExtension == "js") {
            return "script";
        } else if (strExtension == "jpg" || strExtension == "gif" || strExtension == "png"){
            return "image";
        } else if(strExtension == "css") {
            return "css";
        }else {
            return null;
        }
    },

    generateObjectResponse: function (){
        return {};
    },

    onLoadComplete: function (pEl,pStrPath, pObjOptions){
        console.log(this);

        if(pObjOptions["container"]) {
            pObjOptions["container"].appendChild(pEl);
        }
    },

    onLoadError: function (pEl,pStrPath, pObjOptions){
        console.log(pEl);
    }

}