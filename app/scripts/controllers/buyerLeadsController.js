(function() {
    "use strict";
    adminapp.controller("BuyerLeadsController", [
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
                buyer_leads: [],
                buyerleadID: null,
                buyer_lead: {}
            };

            function getBuyersLeads(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('buyerLeads'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.buyer_leads.length>0) {
                            if($scope.data.buyerleadID) {
                                $scope.data.buyer_lead = response.buyer_leads[0];    
                                
                            } else {
                                $scope.data.buyer_leads = response.buyer_leads;
                            }
                        } else if($scope.data.buyerleadID) {
                            ToastService.showActionToast("No such buyer lead exists! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/buyer-leads');
                                });
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($routeParams.buyerleadID) {
                    $scope.data.buyerleadID = parseInt($routeParams.buyerleadID);
                    getBuyersLeads({
                        buyerleadID: $routeParams.buyerleadID
                    });
                } else {
                    getBuyersLeads();
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changeBuyerLeads = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall(type, APIService.getAPIUrl("buyerLeads"), $scope.data.buyer_lead)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            pageSetting();
                            ToastService.showActionToast("successful", 0).then(function(response) {
                                if(type=="DELETE") {
                                    $location.url('/buyer-leads');
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
