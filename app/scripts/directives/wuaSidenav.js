(function() {
    "use strict";
    adminapp.directive('wuaSidenav', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuaSidenav.html',
            controller: [
                '$scope',
                '$mdSidenav',
                '$timeout',
                function ($scope, $mdSidenav, $timeout) {

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
                            url: 'leads/sellerLeads'
                        },
                        {
                            name: 'Payments Done',
                            url: '/payments-done'
                        },
                        {
                            name: 'Contact Us Leads',
                            url: '/leads/contactusLeads'

                        }
                    ];
                    function closeSidenav() {
                        $mdSidenav('sidenav').close();
                    }

                    $scope.toggleSidenav = function() {
                        if($mdSidenav('sidenav').isOpen()) {
                            closeSidenav();
                        }
                        $mdSidenav('sidenav').toggle();
                    };

                    $scope.sidenavClicked = function() {
                        $timeout(function() {
                            closeSidenav();
                        }, 500);
                    };
                }
            ]
        };
    });
})();
