(function() {
    "use strict";
    adminapp.controller("SellerController", [
        '$scope',
        '$log',
        'APIService',
        function($scope, $log, APIService) {

            $scope.data = {
                sellers: null
            };

            function getSellers(params) {
                APIService.apiCall("GET", APIService.getAPIUrl('sellers'), null, params)
                    .then(function(response) {
                        $scope.data.sellers = response.sellers;
                    }, function(error) {

                    });
            }
            getSellers();
        }
    ]);
})();
