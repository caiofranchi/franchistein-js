/**
 * Created with JetBrains WebStorm.
 * Author: Caio Franchi
 * Date: 01/10/12
 * Time: 17:32
 */

//Inherits
window.FSPreloader = function (pObjDefaultOptions) {
    this.container = document;
    this.elements = undefined;

    FSLoaderQueue.call(this, pObjDefaultOptions);
};

if (window.FSLoaderQueue !== undefined) {
    FSPreloader.prototype = new window.FSLoaderQueue;
    FSPreloader.prototype.constructor = window.FSLoaderQueue;
} else {
    window.FSPreloader = undefined;
    throw new Error("FSPreloader needs FSLoaderQueue to work.");
}

FSPreloader.prototype.parseCss = function (pCssElements) {
    if (pCssElements !== undefined) {

        //DOM stylesheets are available
        var list = [],
            foundedPaths = [],
            totalStylesheets = pCssElements.length,
            i;

        //parse stylesheets to search for images and other loadable items
        for (i = 0; i < totalStylesheets; i++) {
            if (typeof pCssElements[i].cssRules !== "undefined") {
                list = pCssElements[i].cssRules;
            } else if (typeof pCssElements[i].rules !== "undefined") {
                list = pCssElements[i].rules;
            }

            //add the founded background images
            this.add(FSLoaderHelpers.findRule(list, "backgroundImage"));
        }
    }
}

FSPreloader.prototype.parseDocument = function (pObjOptions) { //containers: document.body , document.head, css:true|false

    console.log("STARTANDO O PRELOADING");
    //IMGS
    //var imageList = document.getElementsByTagName("img");

    //CSS
    this.elements = document.querySelectorAll('[data-preload="true"]');
    var total = this.elements.length;
    var cssElements = [],
        currentEl,
        i;

    //add loadable identified elements
    for (i = 0; i < total; i++) {
        currentEl = FSLoaderHelpers.identifyTagType(this.elements[i]);

        if (currentEl.type === FSLoaderHelpers.TYPE_CSS) {
            cssElements.push(currentEl.tag.sheet);
        }

        this.add(currentEl.path);
    }


    if (pObjOptions !== undefined) {

        //parse elements inside css
        if (pObjOptions.css === "true" || pObjOptions.css === true) {
            this.parseCss(cssElements);
        }

    }

}