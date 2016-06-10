(function() {
    "use strict";
    adminapp.controller("UsersController", [
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

            $scope.person;
            if($location.path().substr(0,13) == '/users/buyers'){
                    $scope.person= 'buyers';   
                }
                else if ($location.path().substr(0,14) == '/users/sellers') {
                    $scope.person= 'sellers';
                }
                 
            function getusers(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl($scope.person), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if($scope.person == 'buyers'){
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
                        }
                        else if ($scope.person == 'sellers') {
                            if(response.sellers.length) {
                                if($scope.data.sellerID) {
                                    $scope.data.seller = response.sellers[0];
                                } else {
                                    $scope.data.sellers = response.sellers;
                                }
                            } 
                            else if($scope.data.sellerID) {
                                ToastService.showActionToast("No such seller exists! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/users/sellers');
                                });
                        }
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($scope.person == 'buyers'){
                    if($routeParams.buyerID) {
                        $scope.data.buyerID = parseInt($routeParams.buyerID);
                        getusers({
                            buyerID: $routeParams.buyerID
                        });
                    } else {
                        getusers();
                    }
                }
                else if($scope.person == 'sellers'){
                    if($routeParams.sellerID) {
                        $scope.data.sellerID = parseInt($routeParams.sellerID);
                        getusers({
                            sellerID: $routeParams.sellerID
                        });
                    } else {
                        getusers();
                    }
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changedetails = function(event, type) {
                    $rootScope.$broadcast('showProgressbar');
                    if($scope.person == 'buyers'){
                        $scope.data.buyer.address = $scope.data.buyer.address[0];
                        APIService.apiCall(type, APIService.getAPIUrl($scope.person), $scope.data.buyer)
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
                       else if($scope.person == 'sellers'){
                    $scope.data.seller.address = $scope.data.seller.address[0];
                    $scope.data.seller.bank_details = $scope.data.seller.bank_details[0];
                    APIService.apiCall(type, APIService.getAPIUrl($scope.person), $scope.data.seller)
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
