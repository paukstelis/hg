mainApp.controller('gameController', ['$scope', 'userModel', 'gameModel', 'cfpLoadingBar', '$timeout', '$cookies',
    function ($scope, userModel, gameModel, cfpLoadingBar, $timeout, $cookies) {
        $scope.letterDisable = [];

        $scope.record = gameModel.getElement('record');
        if($scope.record === '' || $scope.record === undefined){
            $scope.record = 0;
        }

       // console.log($scope.record);

        $scope.checkGame = function () {
            var game = angular.fromJson(gameModel.getGame());
            if(game.encodeWord === '' || game.encodeWord === undefined){
                game = startGame();
            }
            disableLetter(game.guessLetter);
            return $scope.game = game;
        };

        var startGame = function (type) {
            $scope.infoMessage = '';
            $scope.gameOver = false;
            $scope.win = false;
            disableLetter();
            var db = gameModel.newGame(type);

            if(type){
                $scope.checkGame();
            }

            gameModel.updateWordsDb();

            return db;
        };

        $scope.restartGame = function (type) {
            $scope.winWord = false;
            return $scope.game = startGame(type);
        };



        $scope.checkLetter = function (guessLetter) {
            //cfpLoadingBar.start();
            var game   = $scope.checkGame();
            var found  = false;

            game.guessLetter += guessLetter;
            gameModel.updateElement('guess_letter', game.guessLetter);

            _.each(game.word,
                function(letter) {
                    if(guessLetter == letter){
                        found = true;
                        refreshEncodeWord (letter, game);
                 }
                });

            if(!found){
                var count = parseInt(game.guessMissed - 1);
                circleError ();
                if(count == 0){
                    return gameOver(game.word);
                }
                gameModel.updateElement('guess_missed', count);
                $scope.checkGame();
            }

            $scope.checkGame();
           // cfpLoadingBar.complete();
        };


        var gameOver = function (word) {
            reportMessage('Game Over:/ Word is '+word);
            // $scope.restartGame();
            gameModel.updateElement('encode_word', '');
            $scope.gameOver = true;
        };

        var winGame = function (word) {
            reportMessage ('You Win!');
           // $scope.restartGame(true);
            $scope.win = true;
        };

        var reportMessage = function (message) {
            return $scope.infoMessage = message;
        };

        var circleError = function () {
            $scope.personColour = {background: '#FF9494'};
            $timeout(function() {
                $scope.personColour = {background: 'aliceblue'};
            }, 300);
        };

        var refreshEncodeWord = function (refreshLetter, game) {
            var encodeWordLetter = game.encodeWord.split('');
            var out = '';
            var sk = 0;
            var win = true;
            _.each(game.word,
                function(letter) {
                    if(refreshLetter == letter){
                        out += letter;
                    }else {
                        if(encodeWordLetter[sk] !== '_'){
                            out += encodeWordLetter[sk];
                        }else {
                            out += '_';
                            win = false;
                        }
                    }
                    sk++;
                });

            if(win){
                var newInRow = parseInt(game.inRow)+1;
                gameModel.updateElement('in_row', newInRow);

                if(newInRow > $scope.record){
                 //   console.log('rekordas!');
                    $scope.record = newInRow;
                    gameModel.updateElement('record', newInRow);
                    gameModel.recordUpdate(newInRow);
                }

                $scope.winWord = out;
                startGame(true);
                winGame (out);
            }else {
                gameModel.updateElement('encode_word', out);
            }
            return out;

        };


        var disableLetter = function(letters){
            if(letters) {
                _.each(letters, function (letter) {
                    $scope.letterDisable[letter] = true;
                });
            }else {
                _.each('abcdefghijklmnopqrstuvwxyz', function (letter) {
                    $scope.letterDisable[letter] = false;
                });
            }
        };

        var makeLetters = function(word) {
            return _.map(word.split(''), function(character) {
                return { name: character, chosen: false };
            });
        };

        $scope.letters = makeLetters("abcdefghijklmnopqrstuvwxyz");

}]);


mainApp.controller('mainController', ['$scope', 'userModel', '$location', 'cfpLoadingBar',
    function ($scope, userModel, $location, cfpLoadingBar) {
    $scope.userAuth = function () {
        return userModel.getUserStatus();
    };

    $scope.userLogout = function () {
        userModel.logout().then(function () {
            $location.path('/');
        });
    };

    $scope.$on('$viewContentLoaded', function(){
        $scope.user = userModel.getUserInfo();
    });


    $scope.randomStringFactory = function (w) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var Math = w.Math;

        return function randomString(length) {
            length = length || 10;
            var string = '', rnd;
            while (length > 0) {
                rnd = Math.floor(Math.random() * chars.length);
                string += chars.charAt(rnd);
                length--;
            }
            return string;
        };
    }
}]);

mainApp.controller('userController', ['$scope', 'userModel', '$location', 'cfpLoadingBar',
    function ($scope, userModel, $location, cfpLoadingBar) {
    $scope.userLogin = function (loginForm) {

        var username = $scope.login.username;

        if(username.length < 3 || username.length > 30){
            return  $scope.usernameError = 'Invalid Username!';
        }else {
            userModel.login(username).then(function (data) {
               if(data.status == 200){
                   $location.path('/game');
               }else {
                   return $scope.usernameError = 'Invalid Username!';
               }
            });
        }
    };

    $scope.userLoginIpnutFocus = function () {
        return $scope.usernameError = false;
    };


    var page = 0;
    $scope.userTop = function () {
        page++;
        userModel.getUserTop(page).then(function (d) {
            $scope.userTopas = d;

        });

    };

}]);