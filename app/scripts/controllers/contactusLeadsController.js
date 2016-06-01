(function() {
    "use strict";
    adminapp.controller("ContactusLeadsController", [
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
                contactus_leads: [],
                contactusleadID: null,
                contactus_lead: {}
            };

            function getContactusLeads(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('contactusLeads'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.contactus_leads.length) {
                            if($scope.data.contactusleadID) {
                                for(var i=0;i<response.contactus_leads.length;i++)
                                {
                                    if(response.contactus_leads[i].contactusleadID==$scope.data.contactusleadID)
                                        $scope.data.contactus_lead = response.contactus_leads[i];    
                                }
                                
                            } else {
                                $scope.data.contactus_leads = response.contactus_leads;
                            }
                        } else if($scope.data.contactusleadID) {
                            ToastService.showActionToast("No such buyer lead exists! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/contactus-leads');
                                });
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($routeParams.contactusleadID) {
                    $scope.data.contactusleadID = parseInt($routeParams.contactusleadID);
                    getContactusLeads({
                        contactusleadID: $routeParams.contactusleadID
                    });
                } else {
                    getContactusLeads();
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.changeContactusLeads = function(event, type) {
                if(type=="DELETE" || type=="PUT") {
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall(type, APIService.getAPIUrl("contactusLeads"), $scope.data.contactus_lead)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                                if(type=="DELETE") {
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
