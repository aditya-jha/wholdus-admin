(function() {
    adminapp.directive("wuaAddProduct", function() {
        return {
            restrict: 'AE',
            scope: {
                state: '@cond',
                ind: '@ind'
            },
            link: function($scope, $element, $attributes) {},
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
                '$q',
                function($scope, $log, APIService, ngProgressBarService, $rootScope, $element, UtilService, ToastService, $location, $routeParams, $q) {

                    var allProducts = [], watchCount = 0, listeners = [];

                    function initProductData(id) {
                         return {
                            ID: id ? id : null,
                            item: null,
                            price_to_show: 0,
                            disable: false,
                            orderDetail: {
                                pieces: 0,
                                edited_price_per_piece: 0,
                                remarks: null,
                            }
                        };
                    }

                    function checkIfProductExistsInUrl() {
                        if($routeParams.product) {
                            var allProducts = JSON.parse($routeParams.product);
                            if($scope.state == 'reload') {
                                var index = parseInt($scope.ind);
                                var product = allProducts[index];
                                checkIfValidProductID(product.ID).then(function(response) {
                                    validProductResponse(response);
                                    $scope.product.ID = product.ID;
                                    if(product.orderDetail) {
                                        $scope.product.orderDetail = product.orderDetail;
                                    }
                                }, function(error) {
                                    allProducts.splice(index, 1);
                                    if(allProducts.length > 0) {
                                        $location.search("product", JSON.stringify(allProducts));
                                    } else {
                                        $location.search("product", null);
                                    }
                                    $scope.$destroy();
                                    $element.remove();
                                });
                            }
                        }
                    }

                    function calculatePriceFromLot() {
                        if (!$scope.product.item) {
                            return;
                        }
                        var productLots = $scope.product.item.product_lot;
                        var requiredLots = Math.floor(parseInt($scope.product.orderDetail.pieces) / $scope.product.item.lot_size);
                        var index = -1;

                        for (var i = 0; i < productLots.length; i++) {
                            if (requiredLots >= productLots[i].lot_size_from && requiredLots <= productLots[i].lot_size_to) {
                                index = i;
                                break;
                            }
                        }

                        if (index == -1 && requiredLots > 0) {
                            if (i === productLots.length && productLots.length > 0) {
                                index = productLots.length - 1;
                                $scope.product.price_to_show = productLots[index].price_per_unit;
                            } else if (i === 0) {
                                $scope.product.price_to_show = $scope.product.item.price_per_unit;
                            }
                        } else {
                            if (requiredLots > 0) {
                                $scope.product.price_to_show = productLots[index].price_per_unit;
                            } else {
                                $scope.product.price_to_show = $scope.product.item.price_per_unit;
                            }
                        }
                        if (watchCount > 0) {
                            $scope.product.orderDetail.edited_price_per_piece = $scope.product.price_to_show;
                        }
                        watchCount++;
                    }

                    function getIndexInUrl(products, productID) {
                        var index = -1;
                        for(var i=0; i<allProducts.length; i++) {
                            if(allProducts[i].ID == productID) {
                                index = i;
                                break;
                            }
                        }
                        return index;
                    }

                    function addProductToUrl(product) {
                        if($routeParams.product) {
                            allProducts = JSON.parse($routeParams.product);
                            var index = getIndexInUrl(allProducts, product.ID);
                            if(index > -1) {
                                allProducts[index] = product;
                            } else {
                                allProducts.push(product);
                            }
                        } else {
                            allProducts = [];
                            allProducts.push(product);
                        }
                        $location.search("product", JSON.stringify(allProducts));
                    }

                    function removeProductFromAllUrl(allProducts, productID) {
                        var index = getIndexInUrl(allProducts, productID);
                        if(index > -1) {
                            allProducts.splice(index, 1);
                            if(allProducts.length > 0) {
                                $location.search("product", JSON.stringify(allProducts));
                            } else {
                                $location.search("product", null);
                            }
                        }
                    }

                    function validProductResponse(response) {
                        $scope.product.item = response;
                        $scope.product.item.details.weight_per_unit = parseFloat(response.details.weight_per_unit);
                        $scope.product.item.imageUrl = UtilService.getImageUrl(UtilService.getImages(response)[0], '200x200');
                        calculatePriceFromLot();
                    }

                    function checkIfValidProductID(productID) {
                        var deferred = $q.defer();
                        var params = {
                            productID: productID
                        };

                        $rootScope.$broadcast("showProgressbar");
                        APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                        .then(function(response) {
                            $rootScope.$broadcast("endProgressbar");
                            if(response.products.length) {
                                if(response.products[0].show_online && response.products[0].verification) {
                                    deferred.resolve(response.products[0]);
                                } else {
                                    ToastService.showActionToast("Product hidden or unverfied!", 3000);
                                    deferred.reject();
                                }
                            } else {
                                ToastService.showActionToast("Invalid Product ID", 0);
                                deferred.reject();
                            }
                        }, function(error) {
                            $rootScope.$broadcast("endProgressbar");
                            ToastService.showActionToast("Something went wrong", 0);
                            deferred.reject();
                        });

                        return deferred.promise;
                    }

                    $scope.selectProduct = function() {
                        if($scope.product.disable) return;

                        var pieces = parseInt($scope.product.orderDetail.pieces);
                        if (isNaN(pieces) || pieces <= 0) {
                            ToastService.showActionToast("Number of Pieces cannot be 0", 0);
                            return;
                        }

                        addProductToUrl({
                            ID: $scope.product.ID,
                            orderDetail: $scope.product.orderDetail
                        });

                        $scope.product.disable = true;
                        $rootScope.$broadcast("addProductChanged", $scope.product);
                    };

                    $scope.searchProduct = function() {
                        if($scope.product.ID) {
                            checkIfValidProductID($scope.product.ID).then(function(response) {
                                validProductResponse(response);
                            });
                        }
                    };

                    $scope.editProduct = function(index) {
                        if(index == -1) {
                            $scope.product = initProductData($scope.product.ID);
                            $rootScope.$broadcast("addProductChanged", $scope.product);
                            removeProductFromAllUrl(allProducts, $scope.product.ID);
                            $scope.$destroy();
                            $element.remove();
                        } else {
                            $scope.product.disable = false;
                        }
                    };

                    function init() {
                        $scope.product = initProductData();
                        checkIfProductExistsInUrl();
                    }
                    init();

                    var piecesChangeListener = $scope.$watch('product.orderDetail.pieces', function(newVal, oldVal) {
                        if (newVal === '' || !newVal) {
                            $scope.product.orderDetail.pieces = 0;
                        }
                        calculatePriceFromLot();
                    });
                    listeners.push(piecesChangeListener);

                    var destroyListener = $scope.$on('$destroy', function() {
                        angular.forEach(listeners, function(watch, key) {
                            if(watch) watch();
                        });
                    });
                }
            ]
        };
    });
})();
