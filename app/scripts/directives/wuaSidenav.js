(function() {
    "use strict";
    adminapp.directive('wuaSidenav', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuaSidenav.html',
            controller: [
                '$scope',
                '$mdSidenav',
                function ($scope, $mdSidenav) {

                    $scope.items = [
                        {
                            name: 'Sellers',
                            url: 'users/sellers'
                        }
                    ];

                    $scope.toggleSidenav = function() {
                        if($mdSidenav('sidenav').isOpen()) {
                            $mdSidenav('sidenav').close();
                        }
                        $mdSidenav('sidenav').toggle();
                    };
                }
            ]
        };
    });
})();
