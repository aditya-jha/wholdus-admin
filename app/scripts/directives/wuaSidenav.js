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
                            name: 'Sellers',
                            url: '/users/sellers'
                        },
                        {
                            name: 'Create Order',
                            url: '/new-order'
                        },
                        {
                            name: 'Buyer Leads',
                            url: '/buyer-leads'
                        },
                         {
                            name: 'Contact Us Leads',
                            url: '/contactus-leads'
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
