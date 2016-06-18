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
        // $scope.paymentDate=new Date();
        // $scope.paymentTime=new Date();
        $scope.sellerpayment.suborderID=DeliveryService.suborderID; 
       
         $scope.sellerpayment.fully_paid=DeliveryService.fully_paid;
         if(!$scope.sellerpayment.fully_paid){
          $scope.sellerpayment.order_items=DeliveryService.order_items;
        }
        $scope.cancel = function() {
                $mdDialog.cancel();
            }
        function formatedDate(){
                var d=new Date();
                d.setUTCDate($scope.paymentDate.getUTCDate());
                d.getUTCMonth($scope.paymentDate.getUTCMonth());
                d.setUTCFullYear($scope.paymentDate.getUTCFullYear());
                d.setUTCMinutes($scope.paymentTime.getUTCMinutes());
                d.setUTCHours($scope.paymentTime.getUTCHours());
                var str=d.toISOString().substr(0,10)+' '+d.toISOString().substr(11,12)+'000';  
                 
                  return str; 
        }  

         $scope.SellerPaymentMethod = [
                         {'display_value':'NEFT','value':0},
                         {'display_value':'IMPS','value':1},
                         {'display_value':'RTGS','value':2}
                     ];  
       
        $scope.createPayment= function(){
                  $scope.sellerpayment.payment_time=formatedDate();
                  $rootScope.$broadcast('showProgressbar');
                  APIService.apiCall("POST", APIService.getAPIUrl("sellerpayment"), $scope.sellerpayment)
                  .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                               
                            });
                             // $mdDialog.cancel();
                            
                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            $route.reload();
                            alert(error);
                            ToastService.showActionToast("something went wrong! please reload", 0);
                        });

            };  
      
        
        }
    ]);
})();
