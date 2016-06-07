(function() {
    "use strict";
    adminapp.controller("ProductController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        '$location',
        'ngProgressBarService',
        'ToastService',
        'UtilService',
        'ConstantKeyValueService',
        function($scope, $log, APIService, $routeParams, $rootScope,$location, ngProgressBarService,
           ToastService, UtilService, ConstantKeyValueService) {
            $scope.data = {
                products: [],
                productID: null,
                product: {},
            };
            $scope.data.images=[];
            $scope.allImages =[];
            function praseProductDetails(p) {
                if($scope.data.images.length>0)
                {
                    for(var i=0; i<$scope.data.images.length && i<10; i++) {
                        $scope.allImages.push(UtilService.getImageUrl($scope.data.images[i], '400x400'));
                    }
                }
                else
                {
                    $scope.allImages[0]='images/400.png';
                }
            }

            $scope.genders=["male", "female"];
            function getproducts(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if(response.products.length) {
                        if($scope.data.productID) {
                            $scope.data.product = response.products[0];
                            $scope.data.images= UtilService.getImages($scope.data.product);
                            praseProductDetails(response.products[0]);
                        } else {
                            $scope.data.products = response.products;
                        }
                    } 
                    else if($scope.data.productID) {
                        ToastService.showActionToast("No such product exists! GO BACK", 0)
                        .then(function(response) {
                            $location.url('/products');
                        });
                    }
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                });
            }

            function pageSetting() {
                if($routeParams.productID) {
                    $scope.data.productID = parseInt($routeParams.productID);
                    getproducts({
                        productID: $routeParams.productID
                    });
                } else {
                    getproducts();
                }
            }

            pageSetting();
            
            $scope.reset = function() {
                pageSetting();
            };

            $scope.changeProduct = function(type,hide) {
               $rootScope.$broadcast('showProgressbar');
               if(hide){
                $scope.data.product.show_online=false;}
                APIService.apiCall(type, APIService.getAPIUrl("products"), $scope.data.product)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast("successful", 0).then(function(response) {
                       if(type=="DELETE"){   
                        $location.url('/products');
                    }
                });
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast("something went wrong! please reload", 0);
                });
            };


        }
        ]);
})();
