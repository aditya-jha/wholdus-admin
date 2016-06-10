(function() {
    "use strict";
    adminapp.controller("LeadsController", [
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
                leads: [],
                leadID: null,
                lead: {}
            };

            function getLeadType(){
                if($location.url().substr(0,12)=='/buyer-leads')
                    $scope.leadType='buyerLeads';
                else if($location.url().substr(0,13)=='/seller-leads')
                    $scope.leadType='sellerLeads';
                else if($location.url().substr(0,16)=='/contactus-leads')
                    $scope.leadType='contactusLeads';

            }
            getLeadType();

            function getLeads(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl($scope.leadType), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if($scope.leadType=='buyerLeads' && response.buyer_leads.length>0) {
                        if($scope.data.leadID) 
                            $scope.data.lead = response.buyer_leads[0];
                        else
                             $scope.data.leads = response.buyer_leads;       
                        }       
                    else if($scope.leadType=='sellerLeads' && response.seller_leads.length>0) {
                        if($scope.data.leadID) 
                            $scope.data.lead = response.seller_leads[0];
                        else
                             $scope.data.leads = response.seller_leads;       
                        }
                        else if($scope.leadType=='contactusLeads' && response.contactus_leads.length>0) {
                        if($scope.data.leadID) 
                            $scope.data.lead = response.contactus_leads[0];
                        else
                             $scope.data.leads = response.contactus_leads;       
                        }       
                        
                     else if($scope.data.leadID) {
                        ToastService.showActionToast("No such lead exists! GO BACK", 0)
                        .then(function(response) {
                            if($scope.leadType=='buyerLeads')
                                $location.url('/buyer-leads');
                            else if($scope.leadType=='sellerLeads')        
                                $location.url('/seller-leads');
                            else if($scope.leadType=='contactusLeads')
                                $location.url('/contactus-leads');

                        });
                    }
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                });
            }

            function pageSetting() {
                if($scope.leadType=='buyerLeads'){
                    if($routeParams.buyerleadID) {
                        $scope.data.leadID = parseInt($routeParams.buyerleadID);
                        getLeads({
                            buyerleadID: $routeParams.buyerleadID
                        });
                    } else {
                        getLeads();
                    }
                } 
                else if($scope.leadType=='sellerLeads'){
                    if($routeParams.sellerleadID) {
                        $scope.data.leadID = parseInt($routeParams.sellerleadID);
                        getLeads({
                            sellerleadID: $routeParams.sellerleadID
                        });
                    } else {
                        getLeads();
                    }
                } if($scope.leadType=='contactusLeads'){
                    if($routeParams.contactusleadID) {
                        $scope.data.leadID = parseInt($routeParams.contactusleadID);
                        getLeads({
                            contactusleadID: $routeParams.contactusleadID
                        });
                    } else {
                        getLeads();
                    }
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changeLeads = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall(type, APIService.getAPIUrl($scope.leadType), $scope.data.lead)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        pageSetting();
                        ToastService.showActionToast("successful", 0).then(function(response) {
                            if(type=="DELETE") {
                                if($scope.leadType=='buyerLeads')
                                    $location.url('/buyer-leads');
                                else if($scope.leadType=='sellerLeads')        
                                    $location.url('/seller-leads');
                                else if($scope.leadType=='contactusLeads')
                                    $location.url('/contactus-leads');
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



// (function() {
//     "use strict";
//     adminapp.controller("BuyerLeadsController", [
//         '$scope',
//         '$log',
//         'APIService',
//         '$routeParams',
//         '$rootScope',
//         'ngProgressBarService',
//         'ToastService',
//         '$location',
//         function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location) {

//             $scope.data = {
//                 buyer_leads: [],
//                 buyerleadID: null,
//                 buyer_lead: {}
//             };

//             function getBuyersLeads(params) {
//                 $rootScope.$broadcast('showProgressbar');
//                 APIService.apiCall("GET", APIService.getAPIUrl('buyerLeads'), null, params)
//                     .then(function(response) {
//                         $rootScope.$broadcast('endProgressbar');
//                         if(response.buyer_leads.length>0) {
//                             if($scope.data.buyerleadID) {
//                                 $scope.data.buyer_lead = response.buyer_leads[0];    

//                             } else {
//                                 $scope.data.buyer_leads = response.buyer_leads;
//                             }
//                         } else if($scope.data.buyerleadID) {
//                             ToastService.showActionToast("No such buyer lead exists! GO BACK", 0)
//                                 .then(function(response) {
//                                     $location.url('/buyer-leads');
//                                 });
//                         }
//                     }, function(error) {
//                         $rootScope.$broadcast('endProgressbar');
//                     });
//             }

//             function pageSetting() {
//                 if($routeParams.buyerleadID) {
//                     $scope.data.buyerleadID = parseInt($routeParams.buyerleadID);
//                     getBuyersLeads({
//                         buyerleadID: $routeParams.buyerleadID
//                     });
//                 } else {
//                     getBuyersLeads();
//                 }
//             }

//             pageSetting();

//             $scope.reset = function() {
//                 pageSetting();
//             };

//             $scope.changeBuyerLeads = function(event, type) {
//                 if(type=="DELETE" || type=="PUT") {
//                     $rootScope.$broadcast('showProgressbar');
//                     APIService.apiCall(type, APIService.getAPIUrl("buyerLeads"), $scope.data.buyer_lead)
//                         .then(function(response) {
//                             $rootScope.$broadcast('endProgressbar');
//                             pageSetting();
//                             ToastService.showActionToast("successful", 0).then(function(response) {
//                                 if(type=="DELETE") {
//                                     $location.url('/buyer-leads');
//                                 }
//                             });
//                         }, function(error) {
//                             $rootScope.$broadcast('endProgressbar');
//                             ToastService.showActionToast("something went wrong! please reload", 0);
//                         });
//                 }
//             };

//         }
//     ]);
// })();
