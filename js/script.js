//FS.callMe("a","c","d");

var MainLoader = new FSLoader();
MainLoader.load("//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",{id:"jQuery",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],

function onStartManolo(){
    console.log("start");
    console.log(this);
}

function onCompleteManolo (){
    console.log("COMPLETE");
    console.log(this);
}

function onErrorManolo (){
    console.log("ERROR");
    console.log(this);
}