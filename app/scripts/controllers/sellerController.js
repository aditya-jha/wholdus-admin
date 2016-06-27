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
                            ToastService.showActionToast("No such seller exist!", 0);
                            $location.url('/users/sellers');
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

            $scope.create = function(){
                $scope.changeSeller(null,'POST');
            };

            $scope.changeSeller = function(event, type) {
                    if(type == "POST"){
                        $scope.data.seller.address = $scope.data.seller.temp.address[0];
                        if($scope.data.seller.temp.bank_details){
                            $scope.data.seller.bank_details = $scope.data.seller.temp.bank_details[0];
                        }
                    }
                    else{
                        $scope.data.seller.address = $scope.data.seller.address[0];
                        if($scope.data.seller.bank_details){
                            $scope.data.seller.bank_details = $scope.data.seller.bank_details[0];
                        }
                    }
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall(type, APIService.getAPIUrl("sellers"), $scope.data.seller)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(type=="DELETE" || type=="POST") {
                            $location.url('/users/sellers');
                            switch(type){
                                case "DELETE":
                                    ToastService.showActionToast("Seller Deleted Successfully", 0);
                                    break;
                                case "POST":
                                    ToastService.showActionToast("New Seller Created", 0);
                            }
                        }
                        else if(type == "PUT"){
                            pageSetting();
                            ToastService.showActionToast("Changes Saved", 0);
                        }

                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showActionToast("something went wrong! please reload", 0);
                    });

            };

        }
        ]);
})();
