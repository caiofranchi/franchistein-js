//FS.callMe("a","c","d");

var MainLoader = new FSLoader();
//MainLoader.load("//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",{id:"jQuery",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
//MainLoader.load("http://caiofranchi.com.br/clientes/silika/pernambucanas/img/logo.png",{id:"LOGO",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
MainLoader.load("js/libs/jquery-1.8.0.min.js",{retries:1,id:"jQueryLocal",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
MainLoader.load("img/logo.png",{id:"LOGO-LOCAL",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
MainLoader.load("proxy.php",{id:"xmlMano",type:FSLoaderHelpers.TYPE_XML, oncomplete:onCompleteLoadingXML});

//console.log(MainLoader.get("LOGO-LOCAL"));

//console.log("XHR2 Supported:"+FSLoaderHelpers.isXHR2Supported());

function onCompleteLoadingXML() {
    console.log("XML:");
    //console.log(this.data);
}

function onCompletejQuery () {
    console.log("Complete external jQuery");
}

function onCompleteItem ()  {
    console.log("COMPLETE ITEM" + this.currentItem.id);
}

function onCompleteManolo () {
    console.log("COMPLETE MANOLOS");
    console.log(this.data);
    //document.getElementById("main-content").appendChild(this.element);
}

function onQueueProgress () {
    console.log("progress: " + this.progress);
    document.getElementById("porc").innerHTML = this.progress;
}

function onStartManolo () {
    //console.log("START");
    //console.log(this);
}

function onErrorManolo () {
    console.log("ERROR");
    //console.log(this);
}


function onErrorQueue () {
    console.log("ERROR");
   //console.log(this);
}

function onCompleteQueue () {
    console.log("COMPLETE QUEU");
}

/*
var queue  = new FSLoaderQueue({ignoreErrors:true, onqueueerror:onErrorQueue, onqueuecomplete:onCompleteQueue, onitemcomplete:onCompleteItem, onqueueprogress:onQueueProgress});
queue.add("img/logo.png");
queue.add("//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js", {id:"jquery-external",oncomplete:onCompletejQuery});
queue.add("js/libs/jquery-1.8.0.min.js");
queue.add("http://caiofranchi.com.br/clientes/silika/pernambucanas/img/logo.png");
queue.start();*/