(function() {
    'use strict';

    adminapp.factory('DialogService', [
        '$mdMedia',
        '$mdDialog',
        function($mdMedia, $mdDialog) {
        	var factory = {};

            factory.viewDialog = function(event,controller,templateUrl, va, v) {
                var useFullScreen = $mdMedia('xs');
                $mdDialog.show({
                    controller: controller,
                    templateUrl: templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen,
                    locals: {
                        productID: null
                    },

                });
                factory.val1 = va;
                factory.val2 = v;
            };

            return factory;
        }
    ]);
})();
