(function() {
    adminapp.controller('NewOrderController', [
        '$scope',
        '$log',
        'APIService',
        '$rootScope',
        'ngProgressBarService',
        function($scope, $log, APIService, $rootScope, ngProgressBarService) {

            $scope.input = {
                buyerID: '',
                productID: []
            };

            $scope.selectedBuyer = null;

            $scope.selectBuyer = function() {
                if($scope.input.buyerID) {
                    $rootScope.$broadcast('showProgressbar');
                    var params = {
                        buyerID: $scope.input.buyerID
                    };
                    APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                        .then(function(response) {
                            if(response.buyers && response.buyers.length == 1) {
                                $scope.selectedBuyer = response.buyers[0];
                            } else {
                                $scope.selectedBuyer = null;
                            }
                            $rootScope.$broadcast('endProgressbar');
                        }, function(error) {
                            $log.log(error);
                            $scope.selectedBuyer = null;
                            $rootScope.$broadcast('endProgressbar');
                        });
                }
            };
        }
    ]);
})();
