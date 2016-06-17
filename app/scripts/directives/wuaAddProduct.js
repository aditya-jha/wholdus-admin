(function() {
    adminapp.directive("wuaAddProduct", function() {
        return {
            restrict: 'AE',
            scope: {
               // state: '=state'
            },
            templateUrl: "views/directives/wuaAddProduct.html",
            controller: [
                '$scope',
                '$log',
                'APIService',
                'ngProgressBarService',
                '$rootScope',
                '$element',
                'UtilService',
                'ToastService',
                '$location',
                '$routeParams',
                function($scope, $log, APIService, ngProgressBarService, $rootScope, $element, UtilService, ToastService, $location, $routeParams) {

                    function initProductData(id) {
                        $scope.product = {
                            ID: id ? id : null,
                            item: null,
                            price_to_show: 0,
                            disable: false,
                            orderDetail: {
                                pieces: 1,
                                edited_price_per_piece: 0,
                                remarks: null,
                            }
                        };
                    }

                    initProductData();

                    function calculatePriceFromLot() {
                        if(!$scope.product.item) {
                            return;
                        }
                        var productLots = $scope.product.item.product_lot;
                        var requiredLots = Math.floor(parseInt($scope.product.orderDetail.pieces)/$scope.product.item.lot_size);
                        var index = -1;

                        for(var i=0; i<productLots.length; i++) {
                            if(requiredLots >= productLots[i].lot_size_from && requiredLots <= productLots[i].lot_size_to) {
                                index = i;
                                break;
                            }
                        }

                        if(index == -1 && requiredLots > 0) {
                            if(i === productLots.length && productLots.length > 0) {
                                index = productLots.length-1;
                                $scope.product.price_to_show = productLots[index].price_per_unit;
                            } else if(i === 0){
                                $scope.product.price_to_show = $scope.product.item.price_per_unit;
                            }
                        } else {
                            if(requiredLots > 0) {
                                $scope.product.price_to_show = productLots[index].price_per_unit;
                            } else {
                                $scope.product.price_to_show = $scope.product.item.price_per_unit;
                            }
                        }
                    }

                    //var prods = [];

                    $scope.searchProduct = function() {
                        if($scope.product.ID > 0) {
                            $scope.product.orderDetail.pieces = 0;
                            $rootScope.$broadcast("addProductChanged", $scope.product);
                            var params = {
                                productID: $scope.product.ID
                            };
                            $rootScope.$broadcast("showProgressbar");
                            APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                                .then(function(response) {
                                   // prods.push(response.products[0]);
                                    //  $location.search("product", JSON.stringify(prods));
                                    if(response.products.length) {
                                        if(response.products[0].show_online && response.products[0].verification) {
                                            $scope.product.item = response.products[0];
                                             $scope.product.orderDetail.pieces=1;
                                            $scope.product.item.details.weight_per_unit = parseFloat($scope.product.item.details.weight_per_unit);
                                            $scope.product.orderDetail.edited_price_per_piece = $scope.product.item.min_price_per_unit;
                                            $scope.product.item.imageUrl = UtilService.getImageUrl(UtilService.getImages($scope.product.item)[0], '200x200');
                                            calculatePriceFromLot();
                                        } else {
                                            ToastService.showActionToast("Product hidden or unverfied!", 3000);
                                        }
                                    }
                                    else{
                                        ToastService.showActionToast("Invalid Product ID", 0)
                                    }
                                    $rootScope.$broadcast("endProgressbar");
                                }, function(error) {
                                    $rootScope.$broadcast("endProgressbar");
                                    ToastService.showActionToast("Something went wrong", 0)
                                });
                        }
                    };

                    //$scope.searchProduct();

                    $scope.selectProduct = function() {
                        var pieces = parseInt($scope.product.orderDetail.pieces);
                        //$location.search(JSON.stringify($scope.product.orderDetail));
                        if(isNaN(pieces) || pieces <= 0) {
                            ToastService.showActionToast("Number of Pieces cannot be 0", 0);
                        } else {
                            $scope.product.disable = true;
                            $rootScope.$broadcast("addProductChanged", $scope.product);
                        }
                    };

                    $scope.editProduct = function(index) {
                        $scope.product.disable = false;
                        if(index == -1) {
                            $scope.product.item = null;
                            initProductData($scope.product.ID);
                            $rootScope.$broadcast("addProductChanged", $scope.product);
                            $scope.$destroy();
                            $element.remove();
                        }
                    };

                    $scope.$watch('product.orderDetail.pieces', function(newVal, oldVal) {
                        if(newVal === '' || !newVal) {
                            $scope.product.orderDetail.pieces = 0;
                        }
                        calculatePriceFromLot();
                    });
                }
            ]
        };
    });
})();
