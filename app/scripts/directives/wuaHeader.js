(function() {
    'use strict';
    adminapp.directive('wuaHeader', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuaHeader.html',
            link: function($scope, $element, $attributes) {
            },
            controller: [
                '$scope',
                '$location',
                '$rootScope',
                '$log',
                '$mdDialog',
                function($scope, $location, $rootScope, $log, $mdDialog) {
                    $log.log("wuaHeader loaded");

                    $scope.openMenu = function($mdOpenMenu, event) {
                        $mdOpenMenu(event);
                    };
                }
            ]
        };
    });
})();
