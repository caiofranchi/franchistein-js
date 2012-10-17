/**
 * Created with JetBrains WebStorm.
 * Author: Caio Franchi
 * Date: 01/10/12
 * Time: 17:32
 */

//Inherits
if (window.FSLoaderQueue !== undefined) {
    FSPreloader.prototype = new window.FSLoaderQueue;
    FSPreloader.prototype.constructor = window.FSLoaderQueue;
} else {
    window.FSPreloader = undefined;
    throw new Error("FSPreloader needs FSLoaderQueue to work.");
}

FSPreloader.prototype.parse = function (pObjOptions) { //containers: document.body , document.head, css:true|false, images:true|false

};