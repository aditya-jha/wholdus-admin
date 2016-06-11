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

            function getbuyers(type, params) {
                $rootScope.$broadcast('showProgressbar');
                if(type=="GET"){
                APIService.apiCall(type, APIService.getAPIUrl('buyers'), null, params)
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
                            ToastService.showActionToast("No such buyer exist!", 0);
                            $location.url('/users/buyers');
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
                }
                else if(type == "POST"){
                    $scope.data.buyer.address = $scope.data.buyer.address[0];
                    APIService.apiCall(type, APIService.getAPIUrl("buyers"), $scope.data.buyer)
                    .then(function(response){
                        $rootScope.$broadcast('endProgressbar');
                        $location.url('/users/buyers');
                        ToastService.showActionToast("New Buyer Created", 0);
                    },function(error){
                        $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! Reload and try again", 0);
                    });
                }
            }

            function pageSetting() {
                    if($routeParams.buyerID) {
                        $scope.data.buyerID = parseInt($routeParams.buyerID);
                        getbuyers('GET',{
                            buyerID: $routeParams.buyerID
                        });
                    } else {
                    getbuyers('GET');
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.create = function(){
                getbuyers('POST');
            }

            $scope.changebuyer = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    $scope.data.buyer.address = $scope.data.buyer.address[0];
                    APIService.apiCall(type, APIService.getAPIUrl("buyers"), $scope.data.buyer)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            if(type=="DELETE") {
                                    $location.url('/users/buyers');
                                    ToastService.showActionToast("Buyer Deleted Successfully", 0);
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
