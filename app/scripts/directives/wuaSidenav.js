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
