var adminapp = angular.module('adminapp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngProgress',
    'LocalStorageModule',
]);

adminapp.config([
    '$routeProvider',
    '$locationProvider',
    '$mdThemingProvider',
    '$mdIconProvider',
    'localStorageServiceProvider',
    function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, localStorageServiceProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        });

        $locationProvider.html5Mode(true);
        $mdThemingProvider.theme('default')
                   .primaryPalette('deep-purple')
                   .accentPalette('orange');

        localStorageServiceProvider.setPrefix('wholdus-admin');
    }
]);
