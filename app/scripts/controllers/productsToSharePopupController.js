(function() {
    adminapp.controller('ProductsToSharePopupController', [
        '$scope',
        '$log',
        '$mdDialog',
        'APIService',
        'ToastService',
        function($scope, $log, $mdDialog, APIService, ToastService) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.addProductsToShare = function() {
                $log.log(data);
                var data = $scope.data;
                $scope.apiCall = APIService.apiCall("POST", APIService.getAPIUrl('buyerproduct'), data);
                $scope.apiCall.then(function(response) {
                    $scope.apiCall = null;
                    ToastService.showActionToast("Successfully Saved", 2000, "ok");
                    $mdDialog.hide();
                }, function(error) {
                    $log.log(error);
                    ToastService.showActionToast("Ops! Couldn't update", 0, "ok");
                });
            };

            function init() {
                $scope.productsToShareForm = 'productsToShareForm';
                $scope.apiCall = null;
                $scope.data = {
                    buyerID: '',
                    productID: '',
                    all_buyers: 1
                };
            }
            init();
        }
    ]);
})();
