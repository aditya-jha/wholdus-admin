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
            $scope.settings = {
                enablePagination: false,
                page: UtilService.getPageNumber(),
                noProduct: false,
            };

            $scope.settings.itemsPerPage = 40;
            $scope.categoryID = UtilService.categoryID ? UtilService.categoryID : 1;
            $scope.genders=["male", "female"];

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

            function getCategory(params) {
                APIService.apiCall("GET", APIService.getAPIUrl("category"))
                .then(function(response) {
                    $scope.categories = response.categories;
                }, function(error) {
                    $scope.categories = [];
                });
            }

            getCategory();

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
                        } 
                        else {
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
                        productID: $routeParams.productID,
                    });
                } else {
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
         }


         pageSetting();


         $scope.categoryChanged=function(){
           UtilService.setCategory($scope.categoryID);
           $scope.settings.page=1;
           $location.search('page', 1);
           pageSetting();
       };

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
            pageSetting();
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
