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
              $scope.settings = {
                enablePagination: false,
                page: UtilService.getPageNumber(),
                itemsPerPage:10
            };


              $scope.time={
             minutes:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
             '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33',
             '34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52',
             '53','54','55','56','57','58','59'],
             hours:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16',
             '17','18','19','20','21','22','23']
                };

                $scope.paymentDate=new Date();
               $scope.paymenttime={
                   minutes:'00',
                   hours:'00'
               };
        function formatedDate(){
              var d=new Date();
               d.setDate($scope.paymentDate.getDate());
               d.getMonth($scope.paymentDate.getMonth());
               d.setFullYear($scope.paymentDate.getFullYear());
               d.setMinutes($scope.paymenttime.minutes);
               d.setHours($scope.paymenttime.hours);
               var str=d.toISOString().substr(0,10)+' '+d.toISOString().substr(11,12)+'000';

                 return str;
             }

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
                                    if(response.total_pages > 1) {
                                 $scope.settings.enablePagination = true;
                                 $rootScope.$broadcast('setPage', {
                                    page: $scope.settings.page,
                                    totalPages: Math.ceil(response.total_items/$scope.settings.itemsPerPage)
                                }); 
                             }
                                }
                            }
                        }

                        if(person == 'buyerpayment'){
                            if(response.buyer_payments.length>0) {
                                    $scope.payments = response.buyer_payments;
                                    if(response.total_pages > 1) {
                                 $scope.settings.enablePagination = true;
                                 $rootScope.$broadcast('setPage', {
                                    page: $scope.settings.page,
                                    totalPages: Math.ceil(response.total_items/$scope.settings.itemsPerPage)
                                }); 
                             }
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
                    viewPayment({
                                    items_per_page:$scope.settings.itemsPerPage,
                                    page_number:$scope.settings.page});
                    }
                }
                else if($routeParams.paymentType == 'buyer-payment'){
                    person = 'buyerpayment';
                    viewPayment({
                                    items_per_page:$scope.settings.itemsPerPage,
                                    page_number:$scope.settings.page});
                }
            }
            identify();

            $scope.paymentData = {
                orderID: DialogService.val,
                payment_method: null,
                ordershipmentID: null,
                reference_number: null,
                payment_time: null,
                details: null,
                payment_value: null,
                fully_paid: 0
            };

            $scope.paymentOptions = [
            {
                display_value: 'COD',
                value: 0
            },
            {
                display_value: 'NEFT',
                value: 1
            },
            {
                display_value: 'Demand Draft',
                value: 2
            },
            {
                display_value: 'Cash Deposit',
                value: 3
            },
            {
                display_value: 'Cheque',
                value: 4
            },
            {
                display_value: 'Debit Card',
                value: 5
            },
            {
                display_value: 'Credit Card',
                value: 6
            },
            {
                display_value: 'Net Banking',
                value: 7
            },
            {
                display_value: 'Wallet',
                value: 8
            }
            ];

            $scope.cancel = function(){
                $mdDialog.cancel();
            };

            $scope.postPayment = function(){
                $scope.paymentData.payment_time = formatedDate();
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("POST", APIService.getAPIUrl('buyerpayment'), $scope.paymentData)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    $mdDialog.cancel();
                    ToastService.showActionToast("Payment Successful", 0);
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    if($scope.paymentOptions.value=="0"){
                        ToastService.showActionToast("Something went wrong! Please check the Order Shipment ID and try again", 0);
                    }
                    else{
                    ToastService.showActionToast("Something went wrong! Please try again", 0);
                }
                });
            };

        }

    ]);
})();
