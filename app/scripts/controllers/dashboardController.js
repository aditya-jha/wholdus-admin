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
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location, $mdSidenav) {

            $scope.data = {
                buyers: [],
                sellers: [],
                orders: []
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

                        }
                    ];
            function getorders(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall('GET', APIService.getAPIUrl('orders'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
 
                                $scope.data.orders = response.orders;
                        
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
                }

            getorders();

            function getbuyers(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
 
                                $scope.data.buyers = response.buyers;
                        
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
                }

            getbuyers();

            function getsellers(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall('GET', APIService.getAPIUrl('sellers'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
 
                                $scope.data.sellers = response.sellers;
                        
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
                }

            getsellers();

            
            

        }
    ]);
})();
