(function() {
    "use strict";
    adminapp.controller("CreateSellerPaymentController", [
        '$scope',
        '$log',
        '$route',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        '$mdMedia',
        '$mdDialog',
        'DeliveryService',
        function($scope, $log,$route, APIService, $routeParams, $rootScope, ngProgressBarService,
         ToastService, $location, $mdMedia, $mdDialog, DeliveryService){

        $scope.sellerpayment={
            details:null

        };
        $scope.paymentDate=new Date();
        $scope.paymenttime={
            minutes:'00',
            hours:'00'
        };
        // $scope.paymentDate=new Date();
        // $scope.paymentTime=new Date();
        $scope.sellerpayment.suborderID=DeliveryService.suborderID;

         $scope.sellerpayment.fully_paid=DeliveryService.fully_paid;
         if(!$scope.sellerpayment.fully_paid){
          $scope.sellerpayment.order_items=DeliveryService.order_items;
        }
        $scope.cancel = function() {
                $mdDialog.cancel();
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

         $scope.SellerPaymentMethod = [
                         {display_value:'NEFT',value:0},
                         {display_value:'IMPS',value:1},
                         {display_value:'RTGS',value:2}
                     ];
        $scope.time={
              minutes:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
              '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33',
              '34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52',
              '53','54','55','56','57','58','59'],
              hours:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16',
              '17','18','19','20','21','22','23']
        };


        $scope.createPayment= function(){
                  $scope.sellerpayment.payment_time=formatedDate();
                  $rootScope.$broadcast('showProgressbar');
                  APIService.apiCall("POST", APIService.getAPIUrl("sellerpayment"), $scope.sellerpayment)
                  .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("Payment Successful", 0).then(function(response) {

                            });
                             $mdDialog.cancel();

                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            $route.reload();
                            // alert(error);
                            ToastService.showActionToast("something went wrong! please reload", 0);
                            $mdDialog.cancel();
                        });

            };


        }
    ]);
})();
