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

            var listeners = [];

            $scope.input = {
                buyerID: '',
                disableBuyerID: false
            };

            $scope.selectedBuyer = null;

            function initCosts() {
                $scope.costs = {
                    COD: 0,
                    shippingCost: 0,
                    subTotal: 0,
                    total: 0
                };
            }
            initCosts();

            $scope.totals = {
                merchants: 0,
                products: 0,
                pieces: 0,
            };

            $scope.searchBuyer = function() {
                if($scope.input.buyerID) {
                    $rootScope.$broadcast('showProgressbar');
                    var params = {
                        buyerID: $scope.input.buyerID
                    };
                    APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                        .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            $location.search("buyerID",$scope.input.buyerID);
                            if(response.buyers && response.buyers.length == 1) {
                                $scope.selectedBuyer = response.buyers[0];
                            } else {
                                $scope.selectedBuyer = null;
                                ToastService.showActionToast("Invalid Buyer ID", 0);
                            }

                        }, function(error) {
                            $scope.selectedBuyer = null;
                            $rootScope.$broadcast('endProgressbar');
                        });
                }
            };

            function buyerOrder() {
                if($routeParams.buyerID){
                    $scope.input.buyerID = parseInt($routeParams.buyerID);
                    $scope.searchBuyer();
                }
            }
            buyerOrder();



            $scope.selectBuyer = function() {
                $scope.input.disableBuyerID = true;
            };

            $scope.cancelBuyer = function() {
                $scope.input.disableBuyerID = false;
                $scope.input.buyerID = '';
                $scope.selectedBuyer = null;
                $location.search("buyerID", null);
            };

            $scope.addProduct = function() {
                var el = $compile("<div layout='row' flex='100' wua-add-product class='new-order-buyer-container' md-whiteframe='4dp' style='margin-top:1em' layout-wrap></div>")($scope);
                angular.element(document.querySelector("#productContainer")).append(el);
            };



        //     function productOrder() {
        //     if($routeParams.product){
        //         // for(var i=0;i<pro.length;i++){
        //             var prods = [];
        //             prods = JSON.parse($routeParams.product);
        //         $scope.addProduct('reload');
        //         // };
        //     };
        // };
        //     //productOrder();

            var products = {};

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

                initCosts();
                setSummaryTotals(products);

                angular.forEach(products, function(value, key) {
                    $scope.costs.subTotal += (value.orderDetail.pieces*value.orderDetail.edited_price_per_piece);
                    weight += parseInt(value.orderDetail.pieces)*(parseInt(value.item.details.weight_per_unit)+50);
                });
                $scope.costs.shippingCost += (weight*38)/1000;
                if(Object.keys(products).length > 0) {
                    if($scope.costs.shippingCost < 55) {
                        $scope.costs.shippingCost = 55;
                    }
                    $scope.costs.shippingCost = Math.ceil($scope.costs.shippingCost);
                    $scope.costs.COD = 50*$scope.totals.merchants;
                    $scope.costs.total = Math.ceil($scope.costs.subTotal + $scope.costs.COD + $scope.costs.shippingCost);
                } else {
                    initCosts();
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
