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
        'UtilService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, $location, UtilService){

            $scope.data = {
                shipments: [],
                shipmentID: null,
                shipment: {}
            };

            $scope.state = [
            {
                display_value: "3PL manifested",
                value: 3,
                active : false
            },
            {
                display_value: "3PL In Transit",
                value: 4,
                active : false
            },
            {
                display_value: "Stuck In Transit",
                value: 5,
                active : false
            },
            {
                display_value: "Delivered",
                value: 6,
                active : false
            },
            {
                display_value: "RTO In Transit",
                value: 7,
                active : false
            },
            {
                display_value: "RTO Delivered",
                value: 8,
                active : false
            },
            {
                display_value: "Lost",
                value: 9,
                active : false

            }
            ];

            $scope.change ={
                status: 3,
                ordershipmentID: null
            };

            function getShipments(params){
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('ordershipment'), null, params)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    if(response.order_shipments.length){
                        if($scope.data.shipmentID){
                            $scope.data.shipment = response.order_shipments[0];
                            $scope.change.status = $scope.data.shipment.status.value;
                            $scope.change.ordershipmentID = $scope.data.shipmentID;
                            statusAvailable();
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

            function statusAvailable(){
                for (var i = 0; i <7 ; i++) {
                    $scope.state[i].active =true;
                    }

                switch($scope.data.shipment.status.value){
                    case 3:
                        $scope.state[1].active = false;
                        break;
                    case 4:
                        $scope.state[2].active = false;
                        $scope.state[3].active = false;
                        $scope.state[4].active = false;
                        $scope.state[6].active = false;
                        break;
                    case 5:
                        $scope.state[1].active = false;
                        $scope.state[3].active = false;
                        $scope.state[4].active = false;
                        $scope.state[6].active = false;
                        break;
                    case 6:
                        break;
                    case 7:
                        $scope.state[1].active = false;
                        $scope.state[5].active = false;
                        $scope.state[6].active = false;
                        break;
                    case 8:
                        break;
                    case 9:
                        break;                        
                }
            }

            $scope.totalAmount=function(){
                var total = 0;
                for(var i = 0 ;i < $scope.data.shipment.order_items.length; i++){
                    total += parseInt($scope.data.shipment.order_items[i].final_price);
                }
                return total;
            }

            $scope.changeStatus = function(event, index){
                var temp = $scope.data.shipment.status.display_value;
                $scope.change.status = $scope.state[index].value;
                  $rootScope.$broadcast('showProgressbar');
                    APIService.apiCall("PUT", APIService.getAPIUrl("ordershipment"), $scope.change)
                        .then(function(response) {
                            $scope.data.shipment.status.display_value = $scope.state[index].display_value;
                            $scope.data.shipment.status.value = $scope.state[index].value;
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showSimpleToast("Status Changed", 2000);
                            statusAvailable();
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showSimpleToast("Something went wrong. Try again", 3000);
                    $scope.data.shipment.status.display_value = temp;
                })

             };

        }
        ]);
})();