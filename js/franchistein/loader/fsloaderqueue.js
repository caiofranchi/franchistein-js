/**
 * Created with JetBrains WebStorm.
 * Author: Caio Franchi
 * Date: 01/10/12
 * Time: 17:32
 */

/*
 * Object for controlling a queue of loadable items
 * */
window.FSLoaderQueue = function (pLoadingType, pObjDefaultOptions) {
    "use strict";

    this.reference = new window.FSLoader(pLoadingType, pObjDefaultOptions);

    this.items = [ ];
    this.currentIndex = 0;
    this.currentItem = undefined;
    this.ignoreErrors = true;
    this.isPaused = false;
    this.firstStart = true;
    //
    this.total = 0;
    this.totalLoaded = 0;
    this.progress = 0;
    //

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

//Inherits
if (window.FSLoader !== undefined) {
    FSLoaderQueue.prototype = new window.FSLoader;
    FSLoaderQueue.prototype.constructor = window.FSLoaderQueue;
} else {
    window.FSLoaderQueue = undefined;
    throw new Error("FSLoaderQueue needs FSLoader for work.");
}

FSLoaderQueue.prototype.add = function (pStrPath, pObjOptions) { //onqueueerror,onqueuecomplete,onqueueprogress
    "use strict";
    var currentItem = this.load(pStrPath, pObjOptions, false);
    currentItem.queue = this;
    currentItem.reference = this.reference;

    //merge object and queue options
    currentItem.options = FSLoaderHelpers.evaluateOptions(currentItem, this);

    this.items.push(currentItem);
    this.total = this.items.length;
};

FSLoaderQueue.prototype.start = function () {
    "use strict";
    if (this.firstStart === true) {
        this.triggerCallbackEvent("onqueuestart");

        //trigger the single item event
        this.updateQueueProgress();
    }
    this.currentItem = this.items[this.currentIndex];
    this.executeLoad(this.currentItem);

    this.firstStart = false;
};

FSLoaderQueue.prototype.pause = function () {
    "use strict";
    this.isPaused = true;
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
    if (this.currentIndex < (this.total - 1)) {
        return true;
    } else {
        return false;
    }
}

FSLoaderQueue.prototype.onQueueItemComplete = function (pItem) {

    //trigger the single item event
    this.triggerCallbackEvent("onitemcomplete");
    //
    this.updateQueueProgress();

    if(this.verifyQueueEnd()) {
        this.next();
    } else {
        //queue complete
        this.triggerCallbackEvent("onqueuecomplete");
    }
};

FSLoaderQueue.prototype.onQueueItemError = function (pItem) {

    //trigger the single item event
    this.triggerCallbackEvent("onitemerror");

    if (this.ignoreErrors === true) {
        //to not distort current queue progress we set the progress of this item with 100
        pItem.progress = 100;

        //trigger the single item event
        this.updateQueueProgress();

        if(this.verifyQueueEnd()) {
            this.next();
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
    //trigger the single item event
    this.updateQueueProgress();
};

FSLoaderQueue.prototype.onQueueItemStart = function (pItem) {
    this.triggerCallbackEvent("onitemstart", pItem);
};

FSLoaderQueue.prototype.updateQueueProgress = function () {
    var numTotalProgress = 0;

    for (var i = 0; i < this.items.length; i++) {
        numTotalProgress += this.items[i].progress;
    }

    this.progress = Math.round((numTotalProgress*100) / (100*this.items.length)); //calculate progress based on loaded items progress
    //item and queue both progress on the same time
    this.triggerCallbackEvent("onitemprogress");
    this.triggerCallbackEvent("onqueueprogress");
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