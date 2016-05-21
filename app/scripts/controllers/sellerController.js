(function() {
    "use strict";
    adminapp.controller("SellerController", [
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
                sellers: [],
                sellerID: null,
                seller: {}
            };

            function getSellers(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('sellers'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.sellers.length) {
                            if($scope.data.sellerID) {
                                $scope.data.seller = response.sellers[0];
                            } else {
                                $scope.data.sellers = response.sellers;
                            }
                        } else if($scope.data.sellerID) {
                            ToastService.showActionToast("No such seller exists! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/users/sellers');
                                });
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($routeParams.sellerID) {
                    $scope.data.sellerID = parseInt($routeParams.sellerID);
                    getSellers({
                        sellerID: $routeParams.sellerID
                    });
                } else {
                    getSellers();
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changeSeller = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    $scope.data.seller.address = $scope.data.seller.address[0];
                    $scope.data.seller.bank_details = $scope.data.seller.bank_details[0];
                    APIService.apiCall(type, APIService.getAPIUrl("sellers"), $scope.data.seller)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                                if(type=="DELETE") {
                                    $location.url('/users/sellers');
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
