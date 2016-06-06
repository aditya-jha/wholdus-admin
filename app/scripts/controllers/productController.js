(function() {
    "use strict";
    adminapp.controller("ProductController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService) {
            $scope.data = {
                products: [],
                productID: null,
                product: {},
            };

            $scope.productshipment= {
                subproductID:0,
                product_items:[],
            };
            $scope.date = new Date();

            function getproducts(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if(response.products.length) {
                        if($scope.data.productID) {
                            $scope.data.product = response.products[0];
                        } else {
                            $scope.data.products = response.products;
                        }
                    } 
                    else if($scope.data.productID) {
                        ToastService.showActionToast("No such product exists! GO BACK", 0)
                        .then(function(response) {
                            $location.url('/allproducts');
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


            $scope.deleteproductItem=function(){
             $rootScope.$broadcast('showProgressbar');
             APIService.apiCall("DELETE", APIService.getAPIUrl("productitem"), $scope.data.productitem)
             .then(function(response) {
                $rootScope.$broadcast('endProgressbar');
                ToastService.showActionToast("successful", 0).then(function(response) {

                });
            }, function(error) {
                $rootScope.$broadcast('endProgressbar');
                ToastService.showActionToast("something went wrong! please reload", 0);
            });
         }; 

         $scope.notifyMerchant=function(subproductID){
             $rootScope.$broadcast('showProgressbar');
             $scope.data.subproduct.status=2;
             $scope.data.subproduct.subproductID=subproductID;
             APIService.apiCall("PUT", APIService.getAPIUrl("subproduct"), $scope.data.subproduct)
             .then(function(response) {
                $rootScope.$broadcast('endProgressbar');
                ToastService.showActionToast("successful", 0).then(function(response) {

                });
            }, function(error) {
                $rootScope.$broadcast('endProgressbar');
                ToastService.showActionToast("something went wrong! please reload", 0);
            });
         }; 
         $scope.sub_total=0;    
         $scope.calcAmount=function(index){
            var amount=0;
            for (var i = 0; i < $scope.data.product.sub_products[index].product_items.length; i++) {
                amount=(parseFloat(amount)+parseFloat($scope.data.product.sub_products[index].product_items[i].final_price)).toFixed(2);

            }
            return amount;
        };

        $scope.calcSubTotal=function(){
            var amount=0;
            for (var j = 0; j < $scope.data.product.sub_products.length; j++)
            {
                for (var i = 0; i < $scope.data.product.sub_products[j].product_items.length; i++) {
                    amount=(parseFloat(amount)+parseFloat($scope.data.product.sub_products[j].product_items[i].final_price)).toFixed(2);
                }
            }    
            return amount;
        };
        $scope.showPrompt = function(ev,productitemID) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                .title('Are you sure to delete this product?')
                .textContent('Reason for deleting the product')
                .placeholder('Reason')
                .ariaLabel('Reason')
                .targetEvent(ev)
                .ok('Conform')
                .cancel('Cancel');
                $mdDialog.show(confirm).then(function(result) {
                    $scope.data.productitem.cancellation_remarks=result;
                    $scope.data.productitem.productitemID=productitemID;
                    $scope.deleteproductItem();
                }, function() {
                    $mdDialog.cancel();
                });
            };

            $scope.confirmDelivery = function(ev, index) {
             $scope.productshipment.subproductID=$scope.data.product.sub_products[index].subproductID;
             $scope.productshipment.product_items=[];
             for(var i=0;i<$scope.data.product.sub_products[index].product_items.length;i++)
             {
                var product_item=$scope.data.product.sub_products[index].product_items[i];
                if(product_item.addForDelivery){   
                    $scope.productshipment.product_items.push({productitemID : product_item.productitemID});    
                }

            }
                // var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                // $mdDialog.show({
                //   controller:  'DeliveryController',
                //   templateUrl: 'views/partials/confirmDelivery.html',
                //   parent: angular.element(document.body),
                //   targetEvent: ev,
                //   clickOutsideToClose:true,
                //   fullscreen: useFullScreen
                // });
                if($scope.productshipment.product_items.length>0)
                {
                    DeliveryService.setProp($scope.productshipment);
                    DialogService.viewDialog(ev,'DeliveryController','views/partials/confirmDelivery.html');    
                }
                else{
                 ToastService.showActionToast("Add items to the cart to send for delivery!", 0);
             }

         };




     }
     ]);
})();
