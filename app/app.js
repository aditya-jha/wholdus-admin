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
            controller: 'NewOrderController',
            reloadOnSearch: false
        }).when('/leads/:leadType', {
            templateUrl: function(params){ return 'views/'+params.leadType +'.html'},
            controller: 'LeadsController'
        }).when('/leads/:leadType/:leadID', {
            templateUrl:  function(params){ return 'views/'+params.leadType +'Details.html'},
            controller: 'LeadsController'
        }).when('/payments/:paymentType',{
            templateUrl: function(params){if(params.paymentType == 'seller-payment'){return 'views/sellerPayment.html'} else if(params.paymentType == 'buyer-payment') {return 'views/buyerPayment.html'}},
            controller: 'PaymentController'
        }).when('/payments/:paymentType/:paymentID',{
            templateUrl: function(params){if(params.paymentType == 'seller-payment'){return 'views/sellerPaymentDetails.html'}},
            controller: 'PaymentController'
        }).when('/orders', {
            templateUrl: 'views/orders.html',
            controller: 'OrderController'
        }).when('/orders/:orderID', {
            templateUrl: 'views/orderDetails.html',
            controller: 'OrderController'
        }).when('/products', {
            templateUrl: 'views/products.html',
                controller: 'ProductController'
        }).when('/products/:productID', {
            templateUrl: 'views/productDetails.html',
            controller: 'ProductController'
        }).when('/users/buyers',{
            templateUrl: 'views/buyer.html',
            controller: 'BuyerController'
        }).when('/users/buyers/:buyerID',{
            templateUrl: 'views/buyerDetail.html',
            controller: 'BuyerController'
        }).when('/users/new-buyer',{
            templateUrl: 'views/newBuyer.html',
            controller: 'BuyerController'
        }).when('/users/new-seller',{
            templateUrl: 'views/newSeller.html',
            controller: 'SellerController'
        }).when('/shipments',{
            templateUrl: 'views/shipments.html',
            controller: 'ShipmentController'
        }).when('/shipments/:shipmentID', {
            templateUrl: 'views/shipmentDetails.html',
            controller: 'ShipmentController'
        }).when('/blogs', {
            templateUrl: 'views/blog/blogPage.html',
            controller: 'BlogController'
        }).otherwise({
            redirectTo: "/"
        });

        $locationProvider.html5Mode(true);
        $mdThemingProvider.theme('default')
                   .primaryPalette('deep-purple')
                   .accentPalette('deep-orange');
             

        localStorageServiceProvider.setPrefix('wholdus-admin');
    }
]);
