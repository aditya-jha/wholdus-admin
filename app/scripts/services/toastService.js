(function() {
    'use strict';

    adminapp.factory('ToastService', [
        '$rootScope',
        '$mdToast',
        function($rootScope, $mdToast) {
            var factory = {};

            factory.showSimpleToast = function(content, delay) {
                $mdToast.show($mdToast
                    .simple()
                    .textContent(content)
                    .hideDelay(delay)
                );
            };

            return factory;
        }
    ]);
})();
