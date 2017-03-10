var mainApp = angular.module('mainApp', ['ngRoute', 'ngCookies', 'angularRandomString', 'angular-loading-bar'])
.config(function(cfpLoadingBarProvider) {
    // true is the default, but I left this here as an example:
    cfpLoadingBarProvider.includeSpinner = true;
});

mainApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    // $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/', {
            templateUrl: 'app/views/login.html',
            controller: 'userController'
        })
        .when('/logout', {
            templateUrl: 'app/views/logout.html'

        })
        .when('/game', {
            templateUrl: 'app/views/game.html',
            authenticated: true
        })
        .when('/game/top', {
            templateUrl: 'app/views/top.html',
            controller: 'userController',
            authenticated: true
        })
        .otherwise('/');
}]);



mainApp.run(["$rootScope", "$location", 'userModel', function($rootScope, $location, userModel) {
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            if (next.$$route.authenticated) {
                if (!userModel.getUserStatus()) {
                    $location.path('/');
                }
            }

            if (next.$$route.originalPath == '/') {
                if (userModel.getUserStatus()) {
                    $location.path('/game');
                }
            }
        });
    }
]);