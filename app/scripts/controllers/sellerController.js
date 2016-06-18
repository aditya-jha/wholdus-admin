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

            function getSellers(type, params) {
                $rootScope.$broadcast('showProgressbar');
                if(type == "GET"){
                APIService.apiCall(type, APIService.getAPIUrl('sellers'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.sellers.length) {
                            if($scope.data.sellerID) {
                                $scope.data.seller = response.sellers[0];
                            } else {
                                $scope.data.sellers = response.sellers;
                            }
                        } else if($scope.data.sellerID) {
                            ToastService.showActionToast("No such seller exist!", 0);
                            $location.url('/users/sellers');
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
                }
                else if(type == "POST"){
                    $scope.data.seller.address = $scope.data.seller.address[0];
                    $scope.data.seller.bank_details = $scope.data.seller.bank_details[0];
                    APIService.apiCall(type, APIService.getAPIUrl("sellers"), $scope.data.seller)
                    .then(function(response){
                        $rootScope.$broadcast('endProgressbar');
                        $location.url('/users/sellers');
                        ToastService.showActionToast("New Seller Created", 0);
                    },function(error){
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showActionToast("something went wrong! Reload and try again", 0);
                    });
                }
            }

            function pageSetting() {
                if($routeParams.sellerID) {
                    $scope.data.sellerID = parseInt($routeParams.sellerID);
                    getSellers('GET', {
                        sellerID: $routeParams.sellerID
                    });
                } else {
                    getSellers('GET');
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.create = function(){
                getSellers('POST');
            };

            $scope.changeSeller = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    $scope.data.seller.address = $scope.data.seller.address[0];
                    $scope.data.seller.bank_details = $scope.data.seller.bank_details[0];
                    APIService.apiCall(type, APIService.getAPIUrl("sellers"), $scope.data.seller)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                                if(type=="DELETE") {
                                    $location.url('/users/sellers');
                                    ToastService.showActionToast("Seller Deleted Successfully", 0);
                                }
                                else{
                                    pageSetting();
                                    ToastService.showActionToast("Changes Saved", 0);
                                }

                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! please reload", 0);
                        });
                }
            };

        }
    ]);
})();
