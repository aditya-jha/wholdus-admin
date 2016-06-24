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
        '$timeout',
        '$compile',
        '$route',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location, $timeout, $compile, $route) {

            $scope.data = {
                buyers: [],
                buyerID: null,
                buyer: {}
            };

            $scope.selectedStates = [];
            // $scope.yo = "";
            // $scope.convert = function(){
                
            //     // for(var i=0; i<$scope.selectedStates.length;i++){
            //     //     $scope.yo = $scope.yo +","+ $scope.selectedStates[i];
            //     // }
            //     $scope.yo = JSON.stringify($scope.selectedStates)
            // }

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
            };

            $scope.getStates = function(event){
                return $timeout(function() {
                    APIService.apiCall("GET", APIService.getAPIUrl('states'))
                    .then(function(response){
                        $scope.states = response.states;
                    },function(error){
                        $scope.states = [];
                        ToastService.showActionToast("Unable to load States! Please reload the page",0)
                    });
                }, 500);
            };

            function pageSetting() {
                    if($routeParams.buyerID) {
                        $scope.data.buyerID = parseInt($routeParams.buyerID);
                        getbuyers('GET',{
                            buyerID: $routeParams.buyerID
                        });
                    } else {
                    getbuyers('GET');
                }
            };

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
                    $scope.data.buyer.details.purchasing_states = JSON.stringify($scope.selectedStates);
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

             $scope.addInterest = function(ID) {
                var el = $compile("<div layout='row' flex='100' wua-buyer-interest md-whiteframe='2dp' id="+ID+" style='margin-top:1em' layout-wrap></div>")($scope);
                angular.element(document.querySelector("#interestContainer")).append(el);
            };

            $scope.editInterest = function(type,interestID,index){
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall(type, APIService.getAPIUrl("buyerinterest"), $scope.data.buyer.buyer_interests[index])
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    if(type=="DELETE"){
                        $route.reload();
                        ToastService.showSimpleToast('Interest Removed Successfully',3000);
                        
                    }
                    else{
                    ToastService.showSimpleToast('Changes Saved',3000);
                    }
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast("Something went wrong! Please try again");
                })
            };

        }
    ]);
})();
