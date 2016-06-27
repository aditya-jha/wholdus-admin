(function() {
    'use strict';

    adminapp.factory('DialogService', [
        '$mdMedia',
        '$mdDialog',
        function($mdMedia, $mdDialog) {
        	var factory = {};

            factory.viewDialog = function(event,controller,templateUrl, va) {
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
                factory.val = va;
            };

            return factory;
        }
    ]);
})();
