<!DOCTYPE html>
<html ng-app="mainApp" ng-controller="mainController">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HangMan app</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="bower_components/angular-loading-bar/build/loading-bar.css">
    <link rel="stylesheet" type="text/css" href="app/app.css">
    <script>
        var baseUrl = "{{ url('/') }}/api/";
    </script>
</head>
<body>
<div id="loading-bar-container"></div>
<div ng-if="userAuth()" ng-include="'app/views/layouts/nav.html'"></div>
<div class="container">
    <div ng-view></div>
</div>
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.20/angular-animate.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
<script type="text/javascript" src="bower_components/angular-cookies/angular-cookies.min.js"></script>
<script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
<script type="text/javascript" src="bower_components/angular-random-string/src/angular-random-string.js"></script>
<script type="text/javascript" src="bower_components/angular-loading-bar/build/loading-bar.js"></script>
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
<script type="text/javascript" src="app/app.js"></script>
<script type="text/javascript" src="app/models.js"></script>
<script type="text/javascript" src="app/controllers.js"></script>
</body>
</html>