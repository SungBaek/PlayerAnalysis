var apiKey = "?api_key=470e5c51-ccee-4877-a25a-a9e1507151c4";
var apiServer = "https://na.api.pvp.net/api/lol";
var region = "/na";

var tester = function () {
    prompt("hello governor!");
    document.getElementById("nuo").innerHTML = "noo";
};

var dataEchoer = function () {
    var inputText = document.getElementById("text1").value;
    alert("you typed " + inputText);
};

var getMatchHistory = function () {
    var id = getSummonerByName();
    var path = "/na/v2.2/matchhistory/" + id;
    var jsonObj = createRequest(path);
    console.log(jsonObj);
}

var getMatch = function (id) {
    var path = "/na/v2.2/match/" + id;
    var jsonObj = createRequest(path);
    console.log(jsonObj);
}

var getMatchList = function () {
    var id = getSummonerByName();
    var path = "/na/v2.2/matchlist/by-summoner/" + id;
    var jsonObj = createRequest(path);
    console.log(jsonObj);
    return jsonObj;
}

var parseMatchList = function () {
    var jsonList = getMatchList();
    //for each element in list get the json object of them and store
    var listHolder = [];
    //parse the jsonlist and grab the id;
    var index;
    for (index = 0; index < jsonList.endIndex && index < 5; index++) {
        getMatch(jsonList.matches[index].matchId);
    }
    console.log(listHolder);
}

function printJson(obj, name) {
    console.log(name);
    var loo = obj[name].name;
    var id = obj[name].id;
    console.log(obj[name].id);
    document.getElementById("output").innerHTML = " Your name is : " + loo + " your id is : " + id;
}

var getSummonerByName = function () {
    var name = document.getElementById("text1").value;
    var path = "/na/v1.4/summoner/by-name/" + name.toLowerCase();
    var jsonObj = createRequest(path);
    printJson(jsonObj, name);
    return jsonObj[name].id;
}

var createRequest = function (path) 
    {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiServer + path + apiKey, false);
    console.log(apiServer + path + apiKey);
    xhr.send();

    var json = JSON.parse(xhr.responseText);
    return json;
    //  var json2 = JSON.parse(json);
    //  console.log(json2);
};

var makeRequest = function ( ) {

};

var text = function() {
    var hi = {}

}
//$(document).ready(tester);