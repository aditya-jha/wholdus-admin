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
        }).when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).when('/users/sellers', {
            templateUrl: 'views/seller.html',
            controller: 'SellerController'
        }).when('/users/sellers/:sellerID', {
            templateUrl: 'views/sellerDetail.html',
            controller: 'SellerController'
        }).when('/new-order', {
            templateUrl: 'views/newOrder.html',
            controller: 'NewOrderController'
        });

        $locationProvider.html5Mode(true);
        $mdThemingProvider.theme('default')
                   .primaryPalette('deep-purple')
                   .accentPalette('deep-orange');

        localStorageServiceProvider.setPrefix('wholdus-admin');
    }
]);
