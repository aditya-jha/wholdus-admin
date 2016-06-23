(function() {
    "use strict";
    adminapp.controller("BuyerInterestController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        'UtilService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location,UtilService) {

            $scope.data = {
                buyer_interests: [],
                buyerinterestID: null,
                buyer_interest: {},
                products:[]
            };
            $scope.settings = {
                enablePagination: false,
                page: UtilService.getPageNumber(),
                noProduct: false,
            };

            $scope.settings.itemsPerPage = 20;
            $scope.categoryID = UtilService.categoryID ? UtilService.categoryID : 1;
            function getbuyerInterest(params) {
                $rootScope.$broadcast('showProgressbar');
                
                APIService.apiCall('GET', APIService.getAPIUrl('buyerInterest'),null,  params)
                .then(function(response) {
                        // $rootScope.$broadcast('endProgressbar');
                        if(response.buyer_interests.length) {
                            if($scope.data.buyerinterestID) {
                                $scope.data.buyer_interest = response.buyer_interests[0];
                                UtilService.setCategory($scope.data.buyer_interest.category.categoryID);
                                pageSetting2();
                            } else {
                                $scope.data.buyer_interests = response.buyer_interests;
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

            function getproducts(params) {
                // $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if(response.products.length) {
                        angular.forEach(response.products, function(value, key) {
                            value.images = UtilService.getImages(value);
                            if(value.images.length){
                                value.imageUrl = UtilService.getImageUrl(value.images[0], '200x200');
                            }
                            else{
                                value.imageUrl = 'images/200.png';
                            }
                        });
                        $scope.data.products = response.products;
                        if(response.total_pages > 1) {
                           $scope.settings.enablePagination = true;
                           $rootScope.$broadcast('setPage', {
                            page: $scope.settings.page,
                            totalPages: Math.ceil(response.total_products/$scope.settings.itemsPerPage)
                        }); 
                       }
                       
                   }
                   
               }, function(error) {
                $rootScope.$broadcast('endProgressbar');
            });
            }

            function pageSetting() {
                if($routeParams.buyerinterestID) {
                    $scope.data.buyerinterestID = parseInt($routeParams.buyerinterestID);
                    getbuyerInterest({
                     buyerinterestID: $routeParams.buyerinterestID
                 });
                } else {
                    getbuyerInterest();
                }
            }


            function pageSetting2() {
               
                if(!UtilService.categoryID){
                 UtilService.setCategory(1);
             }
             getproducts(
             {
                categoryID: UtilService.categoryID,
                items_per_page:$scope.settings.itemsPerPage,
                page_number:$scope.settings.page
            });
             
         }

         pageSetting();

         $scope.reset = function() {
            pageSetting();
        };

        $scope.create = function(){
            getbuyers('POST');
        };

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
