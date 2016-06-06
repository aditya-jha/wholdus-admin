(function() {   
    "use strict";
    adminapp.controller("SellerLeadsController", [
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
                seller_leads: [],
                sellerleadID: null,
                seller_lead: {}
            };

            function getsellersLeads(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('sellerLeads'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.seller_leads.length>0) {
                            if($scope.data.sellerleadID) {
                                $scope.data.seller_lead = response.seller_leads[0];    
                                
                            } else {
                                $scope.data.seller_leads = response.seller_leads;
                            }
                        } else if($scope.data.sellerleadID) {
                            ToastService.showActionToast("No such seller lead exists! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/seller-leads');
                                });
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($routeParams.sellerleadID) {
                    $scope.data.sellerleadID = parseInt($routeParams.sellerleadID);
                    getsellersLeads({
                        sellerleadID: $routeParams.sellerleadID
                    });
                } else {
                    getsellersLeads();
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changesellerLeads = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall(type, APIService.getAPIUrl("sellerLeads"), $scope.data.seller_lead)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                                if(type=="DELETE") {
                                    $location.url('/seller-leads');
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
