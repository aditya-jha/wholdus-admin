(function() {
    adminapp.directive("wuaAddProduct", function() {
        return {
            restrict: 'AE',
            scope: {},
            templateUrl: "views/directives/wuaAddProduct.html",
            controller: [
                '$scope',
                '$log',
                'APIService',
                'ngProgressBarService',
                '$rootScope',
                '$element',
                function($scope, $log, APIService, ngProgressBarService, $rootScope, $element) {

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
                        $scope.product.orderDetail.edited_price_per_piece = $scope.product.price_to_show;
                    }

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
                                    if(response.products.length) {
                                        $scope.product.item = response.products[0];
                                        $scope.product.item.details.weight_per_unit = parseFloat($scope.product.item.details.weight_per_unit);
                                        calculatePriceFromLot();
                                    }
                                    $rootScope.$broadcast("endProgressbar");
                                }, function(error) {
                                    $rootScope.$broadcast("endProgressbar");
                                });
                        }
                    };

                    $scope.selectProduct = function() {
                        $scope.product.disable = true;
                        $rootScope.$broadcast("addProductChanged", $scope.product);
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

                    $scope.$watch('product.orderDetail.pieces', function() {
                        calculatePriceFromLot();
                    });
                }
            ]
        };
    });
})();
