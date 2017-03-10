mainApp.factory('userModel', ['$http', '$cookies', function($http, $cookies) {
    var userModel = {};

    userModel.login = function (username) {
        return $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'login',
            method: "POST",
            data: {
                username: username
            }
        }).then(function successCallback(response) {
            $cookies.put('user_id', response.data.user.id);
            $cookies.put('time', Math.floor(Date.now() / 1000));
            $cookies.put('username', username);
            $cookies.put('record', response.data.user.record);
            $cookies.put('words', JSON.stringify(response.data.words));
            $cookies.put('sk', 0);

            return response;

        }, function errorCallback(response) {
            return response;
        });
    };

    userModel.getUserStatus = function () {
        var status = $cookies.get('user_id');
        var time   = $cookies.get('time');

        if (status && time) {
            if(parseInt(Math.floor(Date.now() / 1000) - time) > 7200){
                return false;
            }else {
                return true;

            }
        } else {
            return false;
        }
    };


    userModel.getUserInfo = function () {
        return {
            username: $cookies.get('username'),
            user_id: $cookies.get('user_id')
        }
    };


    userModel.logout = function () {
        var userId = $cookies.get('user_id');
        return $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'logout',
            method: "POST",
            data: {
                user_id: userId
            }
        }).then(function successCallback(response) {
         //   console.log(response);
            $cookies.remove('user_id');
            $cookies.remove('time');
            $cookies.remove('username');

            /* Game Cookies */
            $cookies.remove('word');
            $cookies.remove('encode_word');
            $cookies.remove('record');
            $cookies.remove('in_row');
            $cookies.remove('guess_letter');
            $cookies.remove('guess_missed');
            $cookies.remove('sk');
        });
    };


    userModel.getUserTop = function (page) {
        return $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'top',
            method: "POST",
            data: {
                page: page
            }
        }).then(function successCallback(response) {
            return response.data;
        });
    };

    return userModel;
}]);


mainApp.factory('gameModel',['$cookies', '$http', '$rootScope', function ($cookies, $http, $rootScope) {
    var gameModel = {};

    gameModel.getGame = function () {

        if(!$cookies.get('word')){
            return false;
        }else {
            return {
                word: $cookies.get('word'),
                encodeWord: $cookies.get('encode_word'),
                inRow: $cookies.get('in_row'),
                guessLetter: $cookies.get('guess_letter'),
                guessMissed: $cookies.get('guess_missed')
            };
        }

    };

    gameModel.getElement = function (element) {
        return $cookies.get(element);
    };

    gameModel.updateElement = function (element, string) {
        return $cookies.put(element, string);
    };

    gameModel.newGame = function (next) {

        word = gameModel.getNewWord();

        var encodingWord = function (word) {
            return word.replace(/[a-z]/gi, '_');
        };

        /* Game Cookies */
        $cookies.put('word', word);
        $cookies.put('encode_word', encodingWord(word));
        if (!next){
            $cookies.put('in_row', 0);
        }
        $cookies.put('guess_letter', '');
        $cookies.put('guess_missed', 10);

        return gameModel.getGame();
    };


    gameModel.getNewWord = function () {
        words = angular.fromJson($cookies.get('words'));
        sk = words.length;
        sk = Math.floor(Math.random() * sk);
        return words[sk].word;
    };

    gameModel.updateGame = function (game) {
        $cookies.put('game', JSON.stringify(game));
    };


    gameModel.recordUpdate = function (record) {
        return $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: baseUrl + 'record',
            method: "POST",
            data: {
                record: record,
                user_id: $cookies.get('user_id')
            }
        }).then(function successCallback(response) {
            return response.data;
        });
    };

    gameModel.updateWordsDb = function () {
        sk = parseInt($cookies.get('sk'));
        if(sk > 30){
            // naujus jamam
            console.log('nauji');
           return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: baseUrl + 'word',
                method: "get"
            }).then(function successCallback(response) {
                 $cookies.put('words', JSON.stringify(response.data));
                 $cookies.put('sk', 0);
            });

        }else {
            $cookies.put('sk', sk+1);
        }
    };


    return gameModel;
}]);