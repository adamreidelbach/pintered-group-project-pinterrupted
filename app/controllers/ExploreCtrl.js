"use strict";

app.controller('ExploreCtrl', function(DataFactory, $scope, AuthFactory, $route, SearchTermData) {


    $scope.searchText = SearchTermData;
    let user = AuthFactory.getUser();

    $scope.busy = true;
    $scope.allData = [];
    $scope.allPins = [];
    var page = 0;
    var step = 6;


    $scope.getPins = () => {
        DataFactory.getAllPins()
        .then((response) => {
            console.log("response", response);
            // $scope.allPins = response;
            $scope.allData = response;
            $scope.nextPage();
            $scope.busy = false;
        });
    };

    $scope.nextPage = function(){
        var pinLength = $scope.allPins.length;
        if($scope.busy){
            return;
        }
        $scope.busy = true;
        $scope.allPins = $scope.allPins.concat($scope.allData.splice(page * step, step));
        page++;
        $scope.busy = false;
        console.log("allPins Array", $scope.allPins);
        if($scope.allPins.length === 0){
            $scope.noMoreData = true;
        }
    };


    $scope.getPins();

    $scope.newBoardObject = {};
    $scope.newPinObject = {
        url: "",
        title: "",
        description: "",
        uid: user
    };

    $scope.addNewPin = () => {
        $scope.boardArray.forEach( (element) => {
            if (element.title === $scope.boardArray.id) {
                $scope.newPinObject.board_id = element.id;
            }
        });
        console.log("newPinObject", $scope.newPinObject);
        DataFactory.addPin($scope.newPinObject)
        .then( (addedPin) => {
            console.log("addedPin", addedPin);
            $scope.addedPin = addedPin;
            $("#addPinModal").modal('close');
            $route.reload();
        });
    };

        // pass into function input value from board-detail.html, push to boards collection in firebase and creates new custom key
    $scope.addNew = function (someText) {
        $scope.newBoardObject.title = someText;
        $scope.newBoardObject.uid = user;
        DataFactory.addBoard($scope.newBoardObject)
        .then((newBoardSucces)=>{
            $("#addBoardModal").modal('close');
            $route.reload();
        });
    };

    // sending userboards uid to get back board title and pass into board-detail.html
    // use Object.keys to return custom key from Firebase, use this key to pass in a unique ID for
    // each modal that is created for each card in the ng-repeat
    let userBoards = function () {
        $scope.boardArray = [];
        DataFactory.getUserBoards(user)
        .then((boardObj)=>{
            Object.keys(boardObj).forEach( (key)=>{
                boardObj[key].id = key;
                $scope.boardArray.push(boardObj[key]);
            });
            console.log("boardArray", $scope.boardArray);
        });
    };

    userBoards();



// getPins()
// getBoard()
// addBoard()
// addPin()


});
