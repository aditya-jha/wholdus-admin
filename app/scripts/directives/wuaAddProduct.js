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
                function($scope, $log, APIService, ngProgressBarService, $rootScope) {
                    $scope.product = {
                        ID: null,
                        item: null,
                        orderDetail: {
                            pieces: 1,
                            edited_price_per_piece: 0,
                            remarks: null,
                        }
                    };

                    $scope.selectProduct = function() {
                        if($scope.product.ID > 0) {
                            var params = {
                                productID: $scope.product.ID
                            };
                            $rootScope.$broadcast("showProgressbar");
                            APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                                .then(function(response) {
                                    if(response.products.length) {
                                        $scope.product.item = response.products[0];
                                    }
                                    $rootScope.$broadcast("endProgressbar");
                                }, function(error) {
                                    $rootScope.$broadcast("endProgressbar");
                                });
                        }
                    };

                    $scope.$watchCollection('product.orderDetail', function() {
                        $rootScope.$broadcast("addProductChanged", $scope.product);
                    });
                }
            ]
        };
    });
})();
