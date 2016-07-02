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
            $scope.selectedCategories=[];
            $scope.categoryString=null;
            $scope.selectedSellers=[];
            $scope.sellerString=null;
            $scope.allImages =[];
            $scope.maxPrice=null;
            $scope.minPrice=null;
            $scope.fabric=null;
            $scope.colour=null;
            $scope.settings = {
                enablePagination: false,
                page: UtilService.getPageNumber(),
                noProduct: false,
            };

            $scope.settings.itemsPerPage = 20;
            // $scope.searchTerm;
            // $scope.categoryID = UtilService.categoryID ? UtilService.categoryID : 1;
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

            function getSellers(params) {
                APIService.apiCall("GET", APIService.getAPIUrl("sellers"))
                .then(function(response) {
                    $scope.sellers = response.sellers;
                }, function(error) {
                    $scope.sellers = [];
                });
            }

            getCategory();
            getSellers();

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
                            if(response.total_pages > 1) {
                             $scope.settings.enablePagination = true;
                             $rootScope.$broadcast('setPage', {
                                page: $scope.settings.page,
                                totalPages: Math.ceil(response.total_products/$scope.settings.itemsPerPage)
                            }); 
                         }
                         else{
                            $scope.settings.enablePagination = false;
                        }
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
                        

                    }
                }
                else if($scope.data.productID) {
                    ToastService.showActionToast("No such product exists! GO BACK", 0)
                    .then(function(response) {
                        $location.url('/products');
                    });
                }
                else{
                    $scope.data.products=[];
                    $scope.settings.enablePagination = false;
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
                } 
                else {
                 $scope.categoryString=UtilService.categoryString;
                 $scope.sellerString= UtilService.sellerString;
                 $scope.minPrice= UtilService.minPrice;
                 $scope.maxPrice= UtilService.maxPrice;
                 $scope.fabric= UtilService.fabric;
                 $scope.colour=UtilService.colour;
                 if(UtilService.categoryString){
                    $scope.selectedCategories=UtilService.categoryString.split(',');
                }
                if(UtilService.sellerString){
                    $scope.selectedSellers=UtilService.sellerString.split(',');
                }
                getproducts(
                {
                    categoryID: $scope.categoryString,
                    sellerID:$scope.sellerString,
                    items_per_page:$scope.settings.itemsPerPage,
                    page_number:$scope.settings.page,
                    min_price_per_unit:$scope.minPrice,
                    max_price_per_unit:$scope.maxPrice,
                    fabric:$scope.fabric,
                    colour:$scope.colour
                    
                });
            }
        }


        pageSetting();

        $scope.reset = function() {


            pageSetting();
        };

        $scope.reload=function(){
            UtilService.setCategoryString('');
            UtilService.setSellerString('');
            UtilService.setProp(null,null,null,null);
            $scope.selectedCategories=null;
            $scope.selectedSellers=null;
            $location.url('/products');
        };


        $scope.filterProducts=function(){
         UtilService.setCategoryString($scope.selectedCategories.toString());
         UtilService.setSellerString($scope.selectedSellers.toString());
         UtilService.setProp($scope.minPrice,$scope.maxPrice,$scope.fabric,$scope.colour);
         $scope.settings.page=1;
         $location.search('page', 1);
         pageSetting();
     };

     $scope.downloadFile=function(id){
         $scope.filterProducts();
         var paramsString='';
         if($scope.categoryString.length>0)
            paramsString+='&categoryID='+$scope.categoryString;  
        if($scope.sellerString.length>0)
            paramsString+='&sellerID='+$scope.sellerString;  
        if($scope.minPrice!=null)
            paramsString+='&min_price_per_unit='+$scope.minPrice;  
        if($scope.maxPrice!=null)
            paramsString+='&max_price_per_unit='+$scope.maxPrice;  
        if($scope.fabric!=null)
            paramsString+='&fabric='+$scope.fabric;
        if($scope.colour!=null)
            paramsString+='&colour='+$scope.colour;

   if(id==1){
        window.open(ConstantKeyValueService.apiBaseUrl+'products/generatefile/?'+paramsString);
    }
   else if(id==2){
        window.open(ConstantKeyValueService.apiBaseUrl+'products/generatecatalog/?'+paramsString);
   } 

   }

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

    $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
    };




}
]);
})();
