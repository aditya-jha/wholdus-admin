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
        'ToastService',
        'UtilService',
        '$mdDialog',
        'DialogService',
        function($scope, $rootScope, $log, ngProgressBarService, APIService, ConstantKeyValueService, $routeParams, ToastService, UtilService, $mdDialog, DialogService) {

             $scope.payments = [];
             $scope.paymentID =null;
             $scope.payment ={};

             var person='';

             $scope.allImages = [];
            function praseProductDetails(p) {
                p.images = UtilService.getImages(p);
                if(p.images.length) {
                        $scope.allImages.push(UtilService.getImageUrl(p.images[0], '200x200'));
                }
                else{
                    $scope.allImages.push('images/200.png');
                }
            }


            function viewPayment(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl(person), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(person == 'sellerpayment'){
                            if(response.seller_payments.length>0) {
                                if($routeParams.paymentID){
                                    $scope.payment = response.seller_payments[0];
                                    for(var i=0; i<$scope.payment.order_items.length;i++){
                                        praseProductDetails($scope.payment.order_items[i].product);
                                    }
                                }
                                else{
                                    $scope.payments = response.seller_payments;
                                }
                            }
                        }

                        if(person == 'buyerpayment'){
                            if(response.buyer_payments.length>0) {
                                    $scope.payments = response.buyer_payments;
                            }
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showActionToast("Something went wrong! Please try again",0);
                    });
            }

            function identify(){
                if($routeParams.paymentType == 'seller-payment'){
                    person = 'sellerpayment';
                    if($routeParams.paymentID){
                        viewPayment({sellerpaymentID: $routeParams.paymentID});
                    }
                    else{
                    viewPayment();
                    }
                }
                else if($routeParams.paymentType == 'buyer-payment'){
                    person = 'buyerpayment';
                    viewPayment();
                }
            }
            identify();

            $scope.paymentData = {
                orderID: DialogService.ID,
                payment_method: null,
                orderShipmentID: 26,
                reference_number: null,
                // payment_time: null,
                details: null,
                payment_value: null,
                fully_paid: 0
            }

            $scope.cancel = function(){
                $mdDialog.cancel();
            }

            $scope.postPayment = function(){
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("POST", APIService.getAPIUrl('buyerpayment'), $scope.paymentData)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    $mdDialog.cancel();
                    ToastService.showActionToast("Payment Successful", 0);
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast("Something went wrong! Please try again", 0);
                });
            };

        }

    ]);
})();


