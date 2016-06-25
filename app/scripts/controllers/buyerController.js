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
                $scope.changebuyer(null,'POST');
            };

            $scope.changebuyer = function(event, type) {
            
                    $rootScope.$broadcast('showProgressbar');
                    if(type=="POST"){
                        $scope.data.buyer.address  = $scope.data.buyer.temp.address[0];
                    }
                    else{
                        $scope.data.buyer.address = $scope.data.buyer.address[0];
                    }
                    APIService.apiCall(type, APIService.getAPIUrl("buyers"), $scope.data.buyer)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            if(type=="DELETE" || type=="POST") {
                                    $location.url('/users/buyers');
                                    switch(type){
                                        case "DELETE" :
                                            ToastService.showActionToast("Buyer Deleted Successfully", 0);
                                            break;
                                        case "POST":
                                             ToastService.showActionToast("New Buyer Created", 0);   
                                    }
                                }
                             else if(type=="PUT"){
                                pageSetting();
                                ToastService.showActionToast("Changes Saved", 0);
                             }
                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! Please reload and try again", 0);
                        });
                
            };

        }
    ]);
})();
