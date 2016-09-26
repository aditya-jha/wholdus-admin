(function() {
    adminapp.controller('NewOrderController', [
        '$scope',
        '$log',
        'APIService',
        '$rootScope',
        'ngProgressBarService',
        '$compile',
        'ToastService',
        '$location',
        '$routeParams',
        function($scope, $log, APIService, $rootScope, ngProgressBarService, $compile, ToastService, $location, $routeParams) {

            var listeners = [], products = {};

            function initCosts() {
                return {
                    COD: 0,
                    shippingCost: 0,
                    subTotal: 0,
                    total: 0
                };
            }

            function getBuyerFromUrl() {
                if($routeParams.buyerID){
                    var buyerID = parseInt($routeParams.buyerID);
                    if(isNaN(buyerID)) {
                        return '';
                    } else {
                        return buyerID;
                    }
                }
                return '';
            }

            function setBuyerInUrl(buyerID) {
                $location.search("buyerID", buyerID);
            }

            function productOrder() {
                var totalProducts = JSON.parse($routeParams.product).length;
                for(var i=0; i<totalProducts; i++) {
                    $scope.addProduct('reload', i);
                }
            }

            $scope.searchBuyer = function() {
                if($scope.input.buyerID) {
                    $rootScope.$broadcast('showProgressbar');
                    var params = {
                        buyerID: $scope.input.buyerID
                    };
                    APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.buyers && response.buyers.length == 1) {
                                setBuyerInUrl($scope.input.buyerID);
                                $scope.selectedBuyer = response.buyers[0];
                            } else {
                                $scope.selectedBuyer = null;
                                ToastService.showActionToast("Invalid Buyer ID", 0);
                            }

                        }, function(error) {
                            $scope.selectedBuyer = null;
                            $rootScope.$broadcast('endProgressbar');
                        }
                    );
                }
            };

            $scope.selectBuyer = function() {
                $scope.input.disableBuyerID = true;
            };

            $scope.cancelBuyer = function() {
                $scope.input.disableBuyerID = false;
                $scope.input.buyerID = '';
                $scope.selectedBuyer = null;
                $location.search("buyerID", null);
            };

            $scope.addProduct = function(con, i) {
                var el = $compile("<div layout='row' flex='100' wua-add-product cond="+con+" ind="+i+" class='new-order-buyer-container' md-whiteframe='4dp' style='margin-top:1em' ng-cloak layout-wrap></div>")($scope);
                angular.element(document.querySelector("#productContainer")).append(el);
            };

            function setSummaryTotals(obj) {
                var merchants = {}, pieces = 0;

                $scope.totals.products = Object.keys(obj).length;

                angular.forEach(obj, function(value, key) {
                    if(!merchants[value.item.seller.sellerID]) {
                        merchants[value.item.seller.sellerID] = 1;
                    }
                    pieces += parseInt(value.orderDetail.pieces);
                });

                $scope.totals.merchants =  Object.keys(merchants).length;
                $scope.totals.pieces = pieces;
            }

            function setTotals() {
                var weight = 0;

                $scope.costs = initCosts();
                setSummaryTotals(products);

                angular.forEach(products, function(value, key) {
                    $scope.costs.subTotal += (value.orderDetail.pieces*value.orderDetail.edited_price_per_piece);
                    weight += parseInt(value.orderDetail.pieces)*(parseInt(value.item.details.weight_per_unit)+50);
                });

                $scope.costs.subTotal = Math.ceil($scope.costs.subTotal);
                //$scope.costs.shippingCost += (weight*38)/1000;
                $scope.costs.shippingCost = 150*$scope.totals.merchants;

                if(Object.keys(products).length > 0) {
                    if($scope.costs.shippingCost < 150) {
                        $scope.costs.shippingCost = 150;
                    }
                    $scope.costs.shippingCost = Math.ceil($scope.costs.shippingCost);
                    $scope.costs.COD = Math.ceil(0.02*$scope.costs.subTotal);
                    $scope.costs.total = Math.ceil($scope.costs.subTotal + $scope.costs.COD + $scope.costs.shippingCost);
                } else {
                    $scope.costs = initCosts();
                }
            }

            function parseOrderData() {
                var data = {
                    buyerID: $scope.input.buyerID,
                    products: []
                };
                angular.forEach(products, function(value, key) {
                    data.products.push({
                        productID: value.ID,
                        pieces: value.orderDetail.pieces,
                        edited_price_per_piece: value.orderDetail.edited_price_per_piece,
                        remarks: value.orderDetail.remarks
                    });
                });
                return data;
            }

            $scope.place = false;

            $scope.placeOrder = function() {
                $scope.place =true;
                if(Object.keys(products).length > 0 && $scope.input.buyerID) {
                    $rootScope.$broadcast('showProgressbar');
                    var data = parseOrderData();
                    APIService.apiCall("POST", APIService.getAPIUrl('orders'), data)
                        .then(function(response) {
                            ToastService.showActionToast("Order Successfully placed!", 0)
                                .then(function(response) {
                                    $location.url('/');
                                });
                            $rootScope.$broadcast('endProgressbar');
                        }, function(error) {
                            $location.url('/new-order');
                            $rootScope.$broadcast('endProgressbar');
                            $scope.place = false;
                        });
                } else {
                    ToastService.showSimpleToast("no products added or buyer selected", 3000);
                }
            };

            function init() {
                $scope.input = {
                    buyerID: getBuyerFromUrl(),
                    disableBuyerID: false
                };

                $scope.selectedBuyer = null;

                $scope.totals = {
                    merchants: 0,
                    products: 0,
                    pieces: 0,
                };

                $scope.costs = initCosts();

                if($scope.input.buyerID) {
                    $scope.searchBuyer();
                }

                if($routeParams.product) {
                    productOrder();
                }
            }
            init();

            var addProductChangedListener = $rootScope.$on("addProductChanged", function(event, data) {
                if(data.ID) {
                    if(data.orderDetail.pieces <= 0 || data.orderDetail.edited_price_per_piece <= 0) {
                        if(products[data.ID]) {
                            delete products[data.ID];
                        }
                    } else {
                        products[data.ID] = data;
                    }
                    setTotals();
                }
            });
            listeners.push(addProductChangedListener);

            $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
            });
        }
    ]);
})();
