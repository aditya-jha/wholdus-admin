(function() {
    "use strict";
    adminapp.controller("DeliveryController", [
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

        $scope.ordershipment={
            tracking_url:null,
            logistics_partner:"Fedex"
        };
        $scope.ordershipment.suborderID=DeliveryService.suborderID; 
       
         $scope.ordershipment.all_items=DeliveryService.all_items;
         if(!$scope.ordershipment.all_items){
          $scope.ordershipment.order_items=DeliveryService.order_items;
        }
        $scope.invoice_date=new Date();
        $scope.cancel = function() {
                $mdDialog.cancel();
            }
        var changeDateFormat=function(date){
            var newDate=date.getFullYear()+'-'+date.getMonth()+'-'+date.getDay();
            return newDate;
                 
        }    
        $scope.sendDelivery= function(){
                  
                 $scope.ordershipment.invoice_date=changeDateFormat( $scope.invoice_date);
                 
                 $rootScope.$broadcast('showProgressbar');
                  APIService.apiCall("POST", APIService.getAPIUrl("ordershipment"), $scope.ordershipment)
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
