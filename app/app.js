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
        }).when('/buyer-leads', {
            templateUrl: 'views/buyerLeads.html',
            controller: 'BuyerLeadsController'
        }).when('/buyer-leads/:buyerleadID', {
            templateUrl: 'views/buyerLeadsDetails.html',
            controller: 'BuyerLeadsController'
        }).when('/seller-leads', {
            templateUrl: 'views/sellerLeads.html',
            controller: 'SellerLeadsController'
        }).when('/seller-leads/:sellerleadID', {
            templateUrl: 'views/sellerLeadsDetails.html',
            controller: 'SellerLeadsController'
        }).when('/contactus-leads', {
            templateUrl: 'views/contactusLeads.html',
                controller: 'ContactusLeadsController'
            }).when('/contactus-leads/:contactusleadID', {
            templateUrl: 'views/contactusLeadsDetails.html',
            controller: 'ContactusLeadsController'
        }).when('/allorders', {
            templateUrl: 'views/allOrders.html',
                controller: 'OrderController'
            }).when('/allorders/:orderID', {
            templateUrl: 'views/orderDetails.html',
            controller: 'OrderController'
        });

        $locationProvider.html5Mode(true);
        $mdThemingProvider.theme('default')
                   .primaryPalette('deep-purple')
                   .accentPalette('deep-orange');

        localStorageServiceProvider.setPrefix('wholdus-admin');
    }
]);
