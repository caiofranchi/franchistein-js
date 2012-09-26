//FS.callMe("a","c","d");

var MainLoader = new FSLoader(FSLoaderHelpers.LOAD_AS_XHR);
//MainLoader.load("//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",{id:"jQuery",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
//MainLoader.load("http://caiofranchi.com.br/clientes/silika/pernambucanas/img/logo.png",{id:"LOGO",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
//MainLoader.load("js/libs/jquery-1.8.0.min.js",{id:"jQueryLocal",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],
MainLoader.load("img/logo.png",{id:"LOGO-LOCAL",onstart:onStartManolo,onstartparams:["piru","piruDouble"],onerror:onErrorManolo,oncomplete:onCompleteManolo}); //container:document.getElementsByTagName("head")[0],

function onCompleteManolo () {
    console.log("COMPLETE");
    console.log(this);
    //document.getElementById("main-content").appendChild(this.element);
}

function onStartManolo() {
    //console.log("START");
    //console.log(this);
}

function onErrorManolo () {
    console.log("ERROR");
   //console.log(this);
}