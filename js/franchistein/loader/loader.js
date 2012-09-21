/**
 * Created with JetBrains WebStorm.
 * Author: caio.franchi
 * Date: 20/09/12
 * Time: 12:45
 */
window.FSLoader = function(pObj){
    // VARS
    this.currentLoading = false;
    this.items = [ ];
    this.queue = [ ];

    // Create the container element for droping the loaded elements
    this.containerElement = document.createElement("div");
    this.containerElement.id = "divContainerFSLoader";
    this.containerElement.style.display = "none";
    document.getElementsByTagName("body")[0].appendChild(this.containerElement);

    //LOADER TYPES
    this.SCRIPT = "script";
    this.CSS = "css";
    this.IMAGE = "image";
    this.SWF = "flash";
    this.AJAX = "ajax";
};

FSLoader.prototype = {

    loadFSModule: function () {

    },

    loadQueue: function () {

    },

    load: function (pStrPath, pObjOptions) {
        var strType = pObjOptions["type"] ? pObjOptions["type"] : this.getFileTypeForLoading(pStrPath);

        //identify type of the file for loading
        switch (strType) {
            case this.SCRIPT:
                this.loadJavascript(pStrPath,pObjOptions);
            break;
            case this.CSS:

            break;
            case this.IMAGE:

            break;
        }

    },

    loadJavascript: function (pStrPath, pObjOptions) { //pObjOptions = {container,onstart,onerror,oncomplete,type:swf|img|js|css,preventCache:true|false}
        var elScript = document.createElement("script");
        elScript.type = "text/javascript";
        elScript.src = pStrPath;

        var onStartCallback = pObjOptions["onstart"];

        if(onStartCallback) onStartCallback();

        if (elScript.readyState){  //IE7+
            elScript.onreadystatechange = function () {
                if (elScript.readyState == "loaded" || elScript.readyState == "complete") {
                    elScript.onreadystatechange = null;
                    if(onCompleteCallback) onCompleteCallback();
                }
            };
        } else {
            //Others
            elScript.addEventListener("load",this.onLoadComplete.bind(this,elScript,pStrPath,pObjOptions),false);
            elScript.addEventListener("error",this.onLoadError.bind(this,elScript,pStrPath,pObjOptions),false);

            /* elScript.onload = function () {
                onCompleteCallback();
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

    onLoadComplete: function (pEl,pStrPath, pObjOptions){
        //console.log(pEl);

        if(pObjOptions["container"]) {
            console.log(pEl);
            pObjOptions["container"].appendChild(pEl);
        }
    },

    onLoadError: function (pEl,pStrPath, pObjOptions){
        console.log(pEl);
    }

}