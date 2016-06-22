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
        '$mdDialog',
        'DialogService',
        'DeliveryService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, ToastService, 
            $location, UtilService,$mdDialog,DialogService,DeliveryService){

            $scope.data = {
                shipments: [],
                shipmentID: null,
                shipment: {}
            };

            function statusAvailable(shipment){
                shipment.state = [
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
                    display_value: "3PL Stuck In Transit",
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

                for (var i = 0; i <7 ; i++) {
                    shipment.state[i].active =true;
                }

                switch(shipment.order_shipment_status.value){
                    case 3:
                    shipment.state[1].active = false;
                    break;
                    case 4:
                    shipment.state[2].active = false;
                    shipment.state[3].active = false;
                    shipment.state[4].active = false;
                    shipment.state[6].active = false;
                    break;
                    case 5:
                    shipment.state[1].active = false;
                    shipment.state[3].active = false;
                    shipment.state[4].active = false;
                    shipment.state[6].active = false;
                    break;
                    case 6:
                    break;
                    case 7:
                    shipment.state[1].active = false;
                    shipment.state[5].active = false;
                    shipment.state[6].active = false;
                    break;
                    case 8:
                    break;
                    case 9:
                    break;
                }
            }


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
            

            function getShipments(params){
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('ordershipment'), null, params)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    if(response.order_shipments.length){
                        if($scope.data.shipmentID){
                            $scope.data.shipment = response.order_shipments[0];
                            statusAvailable( $scope.data.shipment);
                            $scope.data.shipment.change={};
                            $scope.data.shipment.change.ordershipmentID=$scope.data.shipmentID;
                            $scope.data.shipment.change.status = $scope.data.shipment.order_shipment_status.value;
                            for(var i=0; i<$scope.data.shipment.order_items.length;i++){
                                praseProductDetails($scope.data.shipment.order_items[i].product);
                            }
                        }
                        else{

                            $scope.data.shipments = response.order_shipments;
                            for(var i=0;i<$scope.data.shipments.length;i++) {
                                var shipment=$scope.data.shipments[i];
                                statusAvailable(shipment);
                                shipment.change={};
                                shipment.change.ordershipmentID=shipment.ordershipmentID;
                                shipment.change.status = shipment.order_shipment_status.value;

                            }
                        }
                    }
                    else if($scope.data.shipmentID){
                        $location.url('/shipments');
                        ToastService.showSimpleToast("No such Shipment exist", 3000);

                    }
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showSimpleToast("Something went wrong. Try again", 3000);
                });


            }

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
                if($scope.data.shipment.order_items!=null){
                    for(var i = 0 ;i < $scope.data.shipment.order_items.length; i++){
                        total += parseInt($scope.data.shipment.order_items[i].final_price);
                    }
                }
                return total;
            };

            $scope.changeStatus= function(event, index, shipment){

                shipment.change.status= shipment.state[index].value;
               
                if(index==3){
                    DeliveryService.setShipment(shipment);
                    DialogService.viewDialog(event,'ShipmentDeliveredController','views/partials/shipmentDelivered.html');

               }
               else{
                 $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("PUT", APIService.getAPIUrl("ordershipment"), shipment.change)
                .then(function(response) {
                 shipment.order_shipment_status.display_value = shipment.state[index].display_value;
                 shipment.order_shipment_status.value = shipment.state[index].value;
                 $rootScope.$broadcast('endProgressbar');
                 ToastService.showSimpleToast("Status Changed", 2000);
                 statusAvailable(shipment);
             },function(error){
                $rootScope.$broadcast('endProgressbar');
                ToastService.showSimpleToast("Something went wrong. Try again", 3000);
            });
            }

        };


    }
    ]);
})();
