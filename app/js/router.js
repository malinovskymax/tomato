'use strict';

window.app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainController'
        });

        $urlRouterProvider.otherwise('/');
    }
]);