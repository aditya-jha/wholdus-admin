(function() {
    "use strict";
    adminapp.controller("ShipmentDeliveredController", [
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

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            var changeDateFormat = function(date){
                var newDate=new Date(date);
                var finalDate=newDate.toISOString().substr(0,10);
                return finalDate;
            };

            $scope.change={};
            $scope.change.status=DeliveryService.shipment.change.status;
            $scope.change.ordershipmentID=DeliveryService.shipment.change.ordershipmentID;
            $scope.delivery_time=new Date();

            $scope.putStatus = function() {
                $scope.change.delivery_time=changeDateFormat($scope.delivery_time);
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("PUT", APIService.getAPIUrl("ordershipment"), $scope.change)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showSimpleToast("Status Changed", 2000);
                    $mdDialog.cancel();
                    $route.reload();
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showSimpleToast("Something went wrong. Try again", 3000);
                    $mdDialog.cancel();
                });
            };
        }
    ]);
})();
