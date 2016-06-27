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
        'DialogService',
        '$mdDialog',
        'UtilService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location, $timeout, $compile, $route, DialogService, $mdDialog, UtilService) {

            $scope.data = {
                buyers: [],
                buyerID: null,
                buyer: {}
            };

            $scope.selectedStates = [];

            $scope.addInterestProduct={
                buyerID: null,
                productID : null
            };

            $scope.interest = {
                buyer_products: [],
            };

            $scope.feedStatus={
                buyerproductID:null,
                is_active:0
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

            $scope.getStates = function(event){
                return $timeout(function() {
                    APIService.apiCall("GET", APIService.getAPIUrl('states'))
                    .then(function(response){
                        $scope.states = response.states;
                    },function(error){
                        $scope.states = [];
                        ToastService.showActionToast("Unable to load States! Please reload the page",0);
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
                if(DialogService.val){
                    viewInterestFeed();
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
                });
            };


            $scope.additionalInterest = function(ev){
                DialogService.viewDialog(ev, 'BuyerController', 'views/partials/additional-interest-product.html', null);
            };


            $scope.submitAdditionalInterest=function(){
                    $scope.addInterestProduct.buyerID = $scope.data.buyer.buyerID;
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall('POST', APIService.getAPIUrl("buyerproduct"), $scope.addInterestProduct)
                    .then(function(response){
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showActionToast('Product Added to buyer Interest',0)
                        .then(function(response){
                            $mdDialog.cancel();
                        });
                    }, function(error){
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showActionToast("Something went wrong! Please try again");
                    });
            };

            $scope.interestFeed = function(ev,type){
                DialogService.viewDialog(ev, 'BuyerController', 'views/partials/buyer-interest-feed.html',type);
            };

            function viewInterestFeed(){
                $scope.interestType = DialogService.val;
                var params;
                switch(DialogService.val){
                    case "feed":
                        params = {
                            responded:0,
                            buyerID:$scope.data.buyerID,
                            items_per_page:20,
                        };
                        break;
                    case "like":
                        params = {
                            shortlisted:1,
                            buyerID:$scope.data.buyerID,
                            items_per_page:20
                        };
                        break;
                    case "dislike":
                        params = {
                            disliked:1,
                            buyerID:$scope.data.buyerID,
                            items_per_page:20
                        };
                        break;
                }
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall('GET', APIService.getAPIUrl('buyerproduct'), null, params)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    if(response.buyer_products.length){
                        angular.forEach(response.buyer_products, function(value, key) {
                                value.product.images = UtilService.getImages(value.product);
                                if(value.product.images.length){
                                    value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '200x200');
                                }
                                else{
                                    value.product.imageUrl = 'images/200.png';
                                }
                            });

                        $scope.interest.buyer_products = response.buyer_products;
                    }
                    else{
                        $scope.interest.buyer_products = [];
                    }
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast('Something went wrong! Please reload and try again.',0);
                });
            }

            $scope.changeFeedStatus = function(id, state){
                $scope.feedStatus.buyerproductID = id;
                if(state===true){
                    $scope.feedStatus.is_active = 0;
                }
                else{
                    $scope.feedStatus.is_active = 1;
                }
                APIService.apiCall('PUT', APIService.getAPIUrl('buyerproduct'), $scope.feedStatus)
                .then(function(response){

                },function(error){
                     ToastService.showActionToast('Error: Unable to change Status!',0);
                });
            };

        }
    ]);
})();
