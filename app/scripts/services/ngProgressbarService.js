(function() {
    "use strict";

    adminapp.factory("ngProgressBarService", [
        '$rootScope',
        'ngProgressFactory',
        function($rootScope, ngProgressFactory) {
            var factory = {};

            var settings = {
                color: '#FF5722',
                height: '4px',
            };
            var progressbar;

            var init = function() {
                progressbar = ngProgressFactory.createInstance();
                progressbar.setColor(settings.color);
                progressbar.setHeight(settings.height);
                progressbar.setParent(document.getElementById("progressBar"));
            };
            init();

            $rootScope.$on('showProgressbar', function(event) {
                progressbar.start();
            });

            $rootScope.$on('endProgressbar', function(event) {
                progressbar.complete();
            });

            return factory;
        }
    ]);
})();
