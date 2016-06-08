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
                            name: "Buyer",
                            url: "/users/buyers"
                        },
                        {
                            name: 'Buyer Leads',
                            url: '/buyer-leads'
                        },
                        {
                            name: 'Sellers',
                            url: '/users/sellers'
                        },
                        {
                            name: 'Seller Leads',
                            url: '/seller-leads'
                        },
                        {
                            name: 'Payments Done',
                            url: '/payments-done'
                        },
                        {

                            name: 'Orders',
                            url: '/orders'
                        },  
                        {
                            name: 'Products',
                            url: '/products'

                            name: 'Contact Us Leads',
                            url: '/contactus-leads'

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
