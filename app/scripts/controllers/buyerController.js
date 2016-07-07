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

            $scope.buyer_shared_product = {
                ids: [],
                id: {}
            };

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

            var selectProduct = [];
        

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
                    $scope.data.buyer.details.purchasing_states = JSON.stringify($scope.data.buyer.details.purchasing_states);
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

           

            $scope.editInterest = function(type,index){
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

            $scope.updateBuyerInterest=function(){
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall('POST', APIService.getAPIUrl("masterupdate"), $scope.data.buyer)
                     .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast('Updated Successfully!',0);
                    
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast("Something went wrong! Please try again",0);
                });
            } 


            $scope.additionalInterest = function(ev){
                DialogService.viewDialog(ev, 'BuyerController', 'views/partials/additional-interest-product.html', null);
            };

             function getAdditionalProduct(params){
                APIService.apiCall('GET', APIService.getAPIUrl('buyersharedproduct'),null, params)
                .then(function(response){
                    if(response.buyer_shared_product_id){
                        if(params){
                            $scope.buyer_shared_product.id = response.buyer_shared_product_id[0];
                        }
                        else{
                            $scope.buyer_shared_product.ids = response.buyer_shared_product_id;
                        }
                    }
                    else{
                        $scope.buyer_shared_product.ids = [];
                    }
                },function(error){
                    ToastService.showActionToast('Unable to load buyer shared product', 0);
                });
            }

            $scope.submitAdditionalInterest=function(){
                    $scope.addInterestProduct.buyerID = $scope.data.buyer.buyerID;
                    $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall('POST', APIService.getAPIUrl("buyerproduct"), $scope.addInterestProduct)
                    .then(function(response){
                        $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast('Product Added to buyer Interest',0)
                            .then(function(response){
                                $mdDialog.cancel();
                                // getAdditionalProduct();
                                $route.reload();
                            });
                    }, function(error){
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showActionToast("Something went wrong! Please try again");
                    });
            };

            $scope.deleteAdditionalInterest = function(id){
                APIService.apiCall('DELETE', APIService.getAPIUrl("buyersharedproduct"), {buyersharedproductID:id});
                getAdditionalProduct();
            };

            $scope.interestFeed = function(ev,type,id){
               
                DialogService.viewDialog(ev, 'BuyerController', 'views/partials/buyer-interest-feed.html',type, id);
            
            };

            var page=0;
            $scope.viewInterestFeed = function(pag,id){
                $scope.interestType = DialogService.val1;
                
                if (pag === undefined) {
                        page = 1;
                    }
                else{
                    page +=pag;
                }
                var params;
                switch(DialogService.val1){
                    case "feed":
                        params = {
                            responded:0,
                            buyerID:$scope.data.buyerID,
                            items_per_page:20,
                            page_number:page
                        };
                        break;
                    case "like":
                        params = {
                            responded:1,
                            buyerID:$scope.data.buyerID,
                            items_per_page:10,
                            page_number:page
                        };
                        break;
                    case "dislike":
                        params = {
                            responded:2,
                            buyerID:$scope.data.buyerID,
                            items_per_page:10,
                            page_number:page
                        };
                        break;
                    case "interest":
                        params = {
                            buyerinterestID:id,
                            responded:0,
                            buyerID:$scope.data.buyerID,
                            items_per_page:20,
                            page_number:page
                        };
                        break;
                    case "added":
                        params = {
                            responded:0,
                            buyersharedproductID:id,
                            buyerID:$scope.data.buyerID,
                            items_per_page:20,
                            page_number:page
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
                        $scope.interest = response;
                        // $scope.interest.buyer_products = response.buyer_products;
                    }
                    else{
                        $scope.interest.buyer_products = [];
                    }
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast('Something went wrong! Please reload and try again.',0);
                });
            };

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

            $scope.selectProduct = function(va, id){
                var temp={
                    ID: id,
                    active: va,
                };
                if(selectProduct.length){
                    var count=0;
                    for(var i=0;i<selectProduct.length;i++){
                        if(selectProduct[i].ID == id){
                            selectProduct[i].active = va;
                            count++;
                            break;
                        }
                    }
                    if(count===0){
                        selectProduct.push(temp);
                    }
                }
                else {
                    selectProduct.push(temp);
                }
            };

            $scope.placeOrder = function(){
                var prods= [];
                for(var i=0; i<selectProduct.length;i++){
                    if(selectProduct[i].active===true){
                        prods.push(selectProduct[i]);
                    }
                }
                    var temp='';
                    temp=temp+JSON.stringify(prods);
                    $mdDialog.cancel();
                    $location.url('new-order?buyerID='+$scope.data.buyerID+'&product='+temp);
                
            };

            function pageSetting() {
                    if($routeParams.buyerID) {
                        $scope.data.buyerID = parseInt($routeParams.buyerID);
                        getbuyers('GET',{
                            buyerID: $routeParams.buyerID
                        });
                        getAdditionalProduct();
                    } else {
                    getbuyers('GET');
                }
                if(DialogService.val1 == 'feed' || DialogService.val1 == 'dislike' || DialogService.val1== 'like' || DialogService.val1 == 'interest' || DialogService.val1 == 'added'){
                    $scope.viewInterestFeed(undefined, DialogService.val2);
                    if(DialogService.val1 == 'added'){
                        getAdditionalProduct({
                            buyersharedproductID:DialogService.val2});
                    }
                }
            }

            pageSetting();

        }
    ]);
})();
