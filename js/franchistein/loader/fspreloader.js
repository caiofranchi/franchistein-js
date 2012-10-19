/**
 * Created with JetBrains WebStorm.
 * Author: Caio Franchi
 * Date: 01/10/12
 * Time: 17:32
 */

//Inherits
window.FSPreloader = function (pObjDefaultOptions) {
    this.container = document;
    this.stylesheets = undefined;
    this.images = undefined;
    this.elements = undefined;
}

if (window.FSLoaderQueue !== undefined) {
    FSPreloader.prototype = new window.FSLoaderQueue;
    FSPreloader.prototype.constructor = window.FSLoaderQueue;
} else {
    window.FSPreloader = undefined;
    throw new Error("FSPreloader needs FSLoaderQueue to work.");
}

FSPreloader.prototype.parse = function (pObjOptions) { //containers: document.body , document.head, css:true|false, images:true|false

    //IMGS
    var imageList = document.getElementsByTagName("img");
    //console.log(imageList[0].dataset["preload"]);
     //CSS
    //console.log(document.styleSheets);
    console.log(document.querySelectorAll('[data-preload="true"]'));
    if (document.styleSheets) {

        this.stylesheets = document.styleSheets;

        //passing trough stylesheets

        //DOM stylesheets are available
        var list = null;

        if (typeof document.styleSheets[0].cssRules !== "undefined") {
            list = document.styleSheets[0].cssRules;
        } else if (typeof document.styleSheets[0].rules !== "undefined") {
            list = document.styleSheets[0].rules;
        }

        console.log(list);
        console.log(list.length);
    }
}