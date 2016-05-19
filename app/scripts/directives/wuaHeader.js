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
                'LoginService',
                function($scope, $location, $rootScope, $log, $mdDialog, LoginService) {

                    var listeners = [];
                    $scope.loggedIn = false;

                    function loginState() {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loggedIn = true;
                            if($location.url().indexOf('login') >= 0) {
                                $location.url('/');
                            }
                        } else {
                            $scope.loggedIn = false;
                            $location.url('/login');
                        }
                    }
                    loginState();

                    $scope.logout = function() {
                        LoginService.logout();
                        $scope.loggedIn = false;
                        $location.url('/login');
                    };

                    $scope.openMenu = function($mdOpenMenu, event) {
                        $mdOpenMenu(event);
                    };

                    var locationChangeListener = $rootScope.$on('$locationChangeSuccess', function(event, data) {
                       loginState();
                    });
                    listeners.push(locationChangeListener);

                    $scope.$on('$destroy', function() {
                        angular.forEach(listeners, function(value, key) {
                            if(value) value();
                        });
                    });
                }
            ]
        };
    });
})();
