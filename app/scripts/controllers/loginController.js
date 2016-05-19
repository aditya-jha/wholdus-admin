(function() {
    'use strict';
    adminapp.controller('LoginController', [
        '$scope',
        '$log',
        'ToastService',
        'LoginService',
        '$location',
        function($scope, $log, ToastService, LoginService, $location) {

            $scope.login = function() {
                if($scope.email && $scope.password) {
                    LoginService.login($scope.email, $scope.password)
                    .then(function() {
                        $location.url('/');
                        ToastService.showSimpleToast($scope.email,2000);
                    }, function() {
                        ToastService.showSimpleToast("invalid credentials",2000);
                    });
                } else {
                    ToastService.showSimpleToast("Please fill required detial",2000);
                }
            };
        }
    ]);
})();
