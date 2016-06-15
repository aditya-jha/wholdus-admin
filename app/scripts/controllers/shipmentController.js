(function() {
    "use strict";
    adminapp.controller("ShipmentController", [
        '$scope',
        '$log',
        'APIService',
        '$routeParams',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        '$location',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location){

            $scope.data = {
                shipments: [],
                shipmentID: null,
                shipment: {}
            };

            function getShipments(params){
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('ordershipment'), null, params)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    if(response.order_shipments.length){
                        if($scope.data.shipmentID){
                            $scope.data.shipment = response.order_shipments[0];
                        }
                        else{
                            $scope.data.shipments = response.order_shipments;
                        }    
                        }
                    else if($scope.data.shipmentID){
                        $location.url('/shipments');
                        ToastService.showSimpleToast("No such Shipment exist", 3000);
                    
                    }
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showSimpleToast("Something went wrong. Try again", 3000);
                })
            };

            function pagesetting(){
                if($routeParams.shipmentID){
                    $scope.data.shipmentID = parseInt($routeParams.shipmentID);
                    getShipments({
                        ordershipmentID: $routeParams.shipmentID
                    });
                }
                else{
                    getShipments();
                }
            }

            pagesetting();

            $scope.totalAmount=function(){
                var total = 0;
                for(var i = 0 ;i < $scope.data.shipment.order_items.length; i++){
                    total += parseInt($scope.data.shipment.order_items[i].final_price);
                }
                return total;
            }

        }
        ]);
})();