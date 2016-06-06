(function() {
    "use strict";
    adminapp.controller("DeliveryController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        '$mdMedia',
        '$mdDialog',
        'DeliveryService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService,
         ToastService, $location, $mdMedia, $mdDialog, DeliveryService){

        $scope.ordershipment={
            tracking_url:"",
        };
        $scope.ordershipment.suborderID=DeliveryService.suborderID; 
        $scope.ordershipment.order_items=DeliveryService.order_items;
        $scope.cancel = function() {
                $mdDialog.cancel();
            }
        $scope.sendDelivery= function(){
                 $scope.ordershipment.suborderID=DeliveryService.suborderID; 
                 $scope.ordershipment.order_items=DeliveryService.order_items; 
                 console.log($scope.ordershipment);
                 $rootScope.$broadcast('showProgressbar');
                  APIService.apiCall("POST", APIService.getAPIUrl("ordershipment"), $scope.ordershipment)
                  .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                             $mdDialog.cancel();
                            ToastService.showActionToast("successful", 0).then(function(response) {
                               
                            });
                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! please reload", 0);
                        });

            };  
      
        
        }
    ]);
})();
