var apiKey = "api_key=470e5c51-ccee-4877-a25a-a9e1507151c4";
var apiKeyV = "api_key=470e5c51-ccee-4877-a25a-a9e1507151c4";
var apiServer = "https://na.api.pvp.net/api/lol";
var region = "/na";
var imagePath = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/"
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
    var path = "/na/v2.2/matchhistory/" + id + "?";
    var jsonObj = createRequest(path);
    console.log(jsonObj);
}
var getChampion = function (champId) {
    var path = "/static-data/na/v1.2/champion/" + champId + "?champData=image&";
    var jsonObj = createRequest(path);
    return jsonObj;
}

var getMatch = function (id) {
    var path = "/na/v2.2/match/" + id + "?";
    var jsonObj = createRequest(path);
    console.log(jsonObj);
    return jsonObj;
}

var getMatchList = function () {
    var id = getSummonerByName();
    var path = "/na/v2.2/matchlist/by-summoner/" + id + "?";
    var jsonObj = createRequest(path);
    console.log(jsonObj);
    return jsonObj;
}

var findBiggest = function (winlist, numberlist) {
    var index;
    var biggest = 0;
    for (index = 0; index < winlist.length; index++) {
        //number of games have to be at least "1"
        //set it to bigger number when production key is approved.
        if (numberlist[index] >= 1) {
            //if percentage of win is bigger than the current biggest's percentage
            if ((winlist[index] * 1.0 / numberlist[index]) > winlist[biggest] * 1.0 / numberlist[index]) {
                biggest = index;
            }
        }
    }
    return biggest;
}

var parseMatchList = function () {
    var jsonList = getMatchList();
    var id = getSummonerByName();
    //parse the jsonlist and grab the id;
    //TODO: Remove hard coded bound of 5.
    var index;
    var playerIndex = -1;
    var playerWon = -1;
    var allyWinList = []; //holds number of wins with that champion in your team.
    var enemyWinList = []; //holds number of loses with that champion in the opposing team.
    var inGameList = []; //holds number of games that champion was in your game.
    //populate array
    //each element index equals to championId. for example, to get data about champId 3 go to array3.
    for (index = 0; index < 300; index++) {
        allyWinList[index] = 0;
        enemyWinList[index] = 0;
        inGameList[index] = 0;
    }
    //for each match in matchlist
    //TODO: remove hardbound of <7 when production api key is approved.
    for (index = 0; index < jsonList.endIndex && index < 7; index++) {
        //grab complete match statistics.
        var match = getMatch(jsonList.matches[index].matchId);
        //sanity checks
        console.log(match.participants.length);
        console.log(getChampion(match.participants[0].championId));
        var index2;
        //get champion of each participant
        for (index2 = 0; index2 < match.participants.length; index2++) {
            //find the player
            //console.log("player id is : " + id + "current id is " + match.participantIdentities[index2].participantId);
            if (id === match.participantIdentities[index2].player.summonerId) {
                playerIndex = index2; //save the index of the player
                playerWon = match.participants[index2].stats.winner;
            }
            inGameList[match.participants[index2].championId]++;
        }
        //sanity checks
        if (playerIndex < 0 || playerWon < 0) {
            console.log("error: could not find out the player's index");
            return;
        }
        if (playerWon) {
            console.log("player won the match : " + match);
            var winIndexBeg;
            var winIndexEnd;
            if (playerIndex < 5) {
                winIndexBeg = 0;
                winIndexEnd = 5;
            }
            else {
                winIndexBeg = 5;
                winIndexEnd = 10;
            }
            var winIndex;
            for (winIndex = winIndexBeg; winIndex < winIndexEnd; winIndex++) {
                //don't increment for player's own champion
                if (playerIndex != winIndex) {
                    allyWinList[match.participants[winIndex].championId]++;
                }
            }

        }
        else {
            console.log("player lost the match : " + playerIndex);
            console.log(match);
            var winIndexBeg;
            var winIndexEnd;
            if (playerIndex < 5) {
                winIndexBeg = 0;
                winIndexEnd = 5;
            }
            else {
                winIndexBeg = 5;
                winIndexEnd = 10;
            }
            var winIndex;
            for (winIndex = winIndexBeg; winIndex < winIndexEnd; winIndex++) {
                enemyWinList[match.participants[winIndex].championId]++;
            }
        }
    }
    console.log(enemyWinList);
    //figure out winners
    var nemesisId = findBiggest(enemyWinList,inGameList );
    var angelId = findBiggest(allyWinList,inGameList );

    console.log(nemesisId + " " + angelId);
    var idHolder = [nemesisId, angelId];
    return idHolder;
}

function displayWinners(idHolder) {
    //idHolder in format of [nemesisId, angelId]
    if (idHolder.length != 2){
        //someting went wrong. error
        openErrorPage(12);
    }
    var nemesisId = idHolder[0];
    var angelId = idHolder[1];
    var nemesisObj = getChampion(nemesisId);
    var angelObj = getChampion(nemesisId);

    //display them
    document.getElemenById("output").innerHTML = "Nemesis : " + nemesisObj + "angel " + angelObj;
    //display pictures. (angel left) (summoner icon/name middle) (nemesis right).

    //optional: display win rates and games analyzed for that.
}


function printJson(obj, name) {
    console.log(name);
    var loo = obj[name].name;
    var id = obj[name].id;
    console.log(obj[name].id);
   // document.getElementById("output").innerHTML = " Your name is : " + loo + " your id is : " + id;
}

var getSummonerByName = function () {
    var name = sessionStorage.id;
    var path = "/na/v1.4/summoner/by-name/" + name.toLowerCase() + "?";
    var jsonObj = createRequest(path);
    printJson(jsonObj, name);
    return jsonObj[name].id;
}

function openCallPage() {
    var id = document.getElementById("user-input").value;
    console.log(id);
    sessionStorage.id = id;
    //open callpage
    window.location.assign('../call.html');
}

function createCall(){
    var userid = sessionStorage.id;
    console.log(userid);
    var idHolder = parseMatchList();
    console.log("parsematchlist completed : " + idHolder);
    //idHolder = ["nemesisID", "angelId"]
    var nemesisObj = getChampion(idHolder[0]);
    var angelObj = getChampion(idHolder[1]);
    var nemesisImg = document.getElementById("img1");
    var angelImg = document.getElementById("img2");
    //change url's to correct ones
    nemesisImg.setAttribute("src", imagePath + nemesisObj.name + "_0.jpg");
    nemesisImg.setAttribute("alt", "image");
    angelImg.setAttribute("src", imagePath + angelObj.name + "_0.jpg");
    angelImg.setAttribute("alt", "image");
    var name = document.getElementById("user-name");
    name.innerHTML = userid;
}


var openErrorPage = function (errorId) {
    window.location.assign('../error.html');
    sessionStorage.errorId = errorId;
}
var showImage = function (url) {
    var img = document.createElement("img");
    img.src = url;
    //maybe have to specific width, height.
    document.getElementById('body').appendChild("img");
}
var createRequest = function (path) {

    //busy loop to slow down the thread, ugly solution :(
    var i;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiServer + path + apiKey, false);
    console.log(apiServer + path + apiKey);
    xhr.send();

    //check status
    if (xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        return json;
    }
    else {
        //error status!
        console.log("http request error : " + xhr.status);
        //open up error page!
        openErrorPage(xhr.status);
    }
};

//$(document).ready(tester);