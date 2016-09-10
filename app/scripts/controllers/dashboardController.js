(function() {
    "use strict";
    adminapp.controller("DashboardController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        '$mdSidenav',
        '$q',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location, $mdSidenav, $q) {

            $scope.data = {
                buyers: [],
                sellers: [],
                orders: [],
                buyerLeads:[],
                sellerLeads:[],
                contactusLeads:[]
            };

            $scope.items = [
                {
                    name: "Dashboard",
                    url: "/"
                },
                {
                    name: 'Orders',
                    url: '/orders'
                },
                {
                    name: 'Create Order',
                    url: '/new-order'
                },
                {
                    name: "Buyers",
                    url: "/users/buyers"
                },
                {
                    name: 'Products',
                    url: '/products'
                },
                {
                    name: 'Buyer Leads',
                    url: '/leads/buyerLeads'
                },
                {
                    name: 'Sellers',
                    url: '/users/sellers'
                },
                {
                    name: 'Seller Leads',
                    url: '/leads/sellerLeads'
                },
                {
                    name: 'Shipments',
                    url: '/shipments'
                },
                {
                    name: 'Buyer Payments',
                    url: '/payments/buyer-payment'
                },
                {
                    name: 'Seller Payments',
                    url: '/payments/seller-payment'
                },
                {
                    name: 'Contact Us Leads',
                    url: '/leads/contactusLeads'
                },
                {
                    name: 'Manage Blogs',
                    url: '/blogs'
                }
            ];
            $scope.apiCalls=['buyerLeads','contactusLeads','sellerLeads'];

            function getorders(params) {
                var deferred = $q.defer();
                APIService.apiCall('GET', APIService.getAPIUrl('orders'), null, params)
                .then(function(response) {
                    $scope.data.orders = response.orders;
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            }

            function getBuyerLeads(params) {
                var deferred = $q.defer();
                APIService.apiCall('GET', APIService.getAPIUrl('buyerLeads'), null, {status:0})
                .then(function(response) {
                    $scope.data.buyerLeads = response.buyer_leads;
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            }

            function getContactusLeads(params){
                var deferred = $q.defer();
                APIService.apiCall('GET', APIService.getAPIUrl('contactusLeads'), null, {status:0})
                .then(function(response) {
                    $scope.data.contactusLeads = response.contactus_leads;
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            }

            function getSellerLeads(params) {
                var deferred = $q.defer();
                APIService.apiCall('GET', APIService.getAPIUrl('sellerLeads'), null, {status:0})
                .then(function(response) {
                    $scope.data.sellerLeads = response.seller_leads;
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }

            function init() {
                var promises = [];

                $rootScope.$broadcast('showProgressbar');

                promises.push(getSellerLeads());
                promises.push(getContactusLeads());
                promises.push(getBuyerLeads());
                promises.push(getorders());

                $q.all(promises).then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                });
            }
            init();
        }
    ]);
})();
