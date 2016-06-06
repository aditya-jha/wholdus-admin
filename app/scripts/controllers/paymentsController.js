(function() {
    'use strict';
    adminapp.controller('PaymentController', [
        '$scope',
        '$rootScope',
        '$log',
        'ngProgressBarService',
        'APIService',
        'ConstantKeyValueService',
        '$routeParams',
        function($scope, $rootScope, $log, ngProgressBarService, APIService, ConstantKeyValueService, $routeParams) {

             $scope.payment = [];

            function sellerPayment(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl("sellerpayment"), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.seller_payments.length>0) {
                                $scope.payment = response.seller_payments;
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            sellerPayment();
        }

    ]);
})();


