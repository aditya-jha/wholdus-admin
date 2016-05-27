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
        function($scope, $log, APIService, $rootScope, ngProgressBarService, $compile, ToastService, $location) {

            var listeners = [];

            $scope.input = {
                buyerID: '',
            };
            $scope.costs = {
                COD: 50,
                shippingCost: 0,
                subTotal: 0,
                total: 0
            };

            $scope.selectedBuyer = null;

            $scope.selectBuyer = function() {
                if($scope.input.buyerID) {
                    $rootScope.$broadcast('showProgressbar');
                    var params = {
                        buyerID: $scope.input.buyerID
                    };
                    APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                        .then(function(response) {
                            if(response.buyers && response.buyers.length == 1) {
                                $scope.selectedBuyer = response.buyers[0];
                            } else {
                                $scope.selectedBuyer = null;
                            }
                            $rootScope.$broadcast('endProgressbar');
                        }, function(error) {
                            $scope.selectedBuyer = null;
                            $rootScope.$broadcast('endProgressbar');
                        });
                }
            };

            $scope.addProduct = function() {
                var el = $compile("<div layout='row' flex='100' wua-add-product class='new-order-buyer-container' md-whiteframe='4dp' style='margin-top:1em'></div>")($scope);
                angular.element(document.querySelector("#productContainer")).append(el);
            };

            var products = {};

            function setTotals() {
                var weight = 0;
                $scope.costs = {
                    COD: 50,
                    shippingCost: 0,
                    subTotal: 0,
                    total: 0
                };

                angular.forEach(products, function(value, key) {
                    $scope.costs.subTotal += (value.orderDetail.pieces*value.orderDetail.edited_price_per_piece);
                    weight += value.orderDetail.pieces*0.3;
                });
                $scope.costs.shippingCost += (weight*38);
                if(Object.keys(products).length > 0) {
                    if($scope.costs.shippingCost < 55) {
                        $scope.costs.shippingCost = 55;
                    }
                    $scope.costs.shippingCost = Math.ceil($scope.costs.shippingCost);
                    $scope.costs.total = Math.ceil($scope.costs.subTotal + $scope.costs.COD + $scope.costs.shippingCost);
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

            $scope.placeOrder = function() {
                if(Object.keys(products).length > 0 && $scope.input.buyerID) {
                    $rootScope.$broadcast('showProgressbar');
                    var data = parseOrderData();
                    APIService.apiCall("POST", APIService.getAPIUrl('orders'), data)
                        .then(function(response) {
                            ToastService.showActionToast("no products added or buyer selected", 0)
                                .then(function(response) {
                                    $location.url('/');
                                });
                            $rootScope.$broadcast('endProgressbar');
                        }, function(error) {
                            $location.url('/new-order');
                            $rootScope.$broadcast('endProgressbar');
                        });
                } else {
                    ToastService.showSimpleToast("no products added or buyer selected", 3000);
                }
            };

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
