(function() {
    "use strict";
    adminapp.controller("BuyerController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location) {

            $scope.data = {
                buyers: [],
                buyerID: null,
                buyer: {}
            };

            function getbuyers(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('buyers'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.buyers.length) {
                            if($scope.data.buyerID) {
                                $scope.data.buyer = response.buyers[0];
                            } else {
                                $scope.data.buyers = response.buyers;
                            }
                        }
                         else if($scope.data.buyerID) {
                            ToastService.showActionToast("No such buyer exist! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/users/buyers');
                                });
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($routeParams.buyerID) {
                    $scope.data.buyerID = parseInt($routeParams.buyerID);
                    getbuyers({
                        buyerID: $routeParams.buyerID
                    });
                } else {
                    getbuyers();
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changebuyer = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    $scope.data.buyer.address = $scope.data.buyer.address[0];
                    APIService.apiCall(type, APIService.getAPIUrl("buyers"), $scope.data.buyer)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                                if(type=="DELETE") {
                                    $location.url('/users/buyers');
                                }
                            });
                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! please reload", 0);
                        });
                }
            };

        }
    ]);
})();
