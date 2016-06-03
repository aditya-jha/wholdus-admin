(function() {
    "use strict";
    adminapp.controller("OrderController", [
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
            ToastService, $location, $mdMedia, $mdDialog, DeliveryService) {
            $scope.currIndex=0;
            $scope.data = {
                orders: [],
                orderID: null,
                order: {},
                orderitem:{},
                suborder:{},
            };

            $scope.ordershipment= {
                suborderID:0,
                order_items:[],
            };
             $scope.date = new Date();
            function getOrders(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('orders'), null, params)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        if(response.orders.length>0) {
                            if($scope.data.orderID) {
                                for(var i=0;i<response.orders.length;i++)
                                {
                                    if(response.orders[i].orderID==$scope.data.orderID)
                                        $scope.data.order = response.orders[i];    
                                }
                                
                            } else {
                                $scope.data.orders = response.orders;
                            }
                        } else if($scope.data.orderID) {
                            ToastService.showActionToast("No such buyer lead exists! GO BACK", 0)
                                .then(function(response) {
                                    $location.url('/buyer-leads');
                                });
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                    });
            }

            function pageSetting() {
                if($routeParams.orderID) {
                    $scope.data.orderID = parseInt($routeParams.orderID);
                    getOrders({
                        orderID: $routeParams.orderID
                    });
                } else {
                    getOrders();
                }
            }

            pageSetting();

            $scope.reset = function() {
                pageSetting();
            };

            $scope.deleteOrderItem=function(){
                 $rootScope.$broadcast('showProgressbar');
                  APIService.apiCall("DELETE", APIService.getAPIUrl("orderitem"), $scope.data.orderitem)
                  .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                               
                            });
                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! please reload", 0);
                        });
                }; 

            $scope.notifyMerchant=function(suborderID){
                 $rootScope.$broadcast('showProgressbar');
                 $scope.data.suborder.status=2;
                 $scope.data.suborder.suborderID=suborderID;
                  APIService.apiCall("PUT", APIService.getAPIUrl("suborder"), $scope.data.suborder)
                  .then(function(response) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("successful", 0).then(function(response) {
                               
                            });
                        }, function(error) {
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast("something went wrong! please reload", 0);
                        });
                }; 

            $scope.calcAmount=function(index){
                var amount=0;
                for (var i = 0; i < $scope.data.order.sub_orders[index].order_items.length; i++) {
                    amount=(parseFloat(amount)+parseFloat($scope.data.order.sub_orders[index].order_items[i].final_price)).toFixed(2);
                    }
                    return amount;
            };
            $scope.showPrompt = function(ev,orderitemID) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                      .title('Are you sure to delete this product?')
                      .textContent('Reason for deleting the product')
                      .placeholder('Reason')
                      .ariaLabel('Reason')
                      .targetEvent(ev)
                      .ok('Conform')
                      .cancel('Cancel');
                $mdDialog.show(confirm).then(function(result) {
                    $scope.data.orderitem.cancellation_remarks=result;
                    $scope.data.orderitem.orderitemID=orderitemID;
                    $scope.deleteOrderItem();
                }, function() {
                    $mdDialog.cancel();
                });
            };

             $scope.conformDelivery = function(ev, index) {
                 $scope.ordershipment.suborderID=$scope.data.order.sub_orders[index].suborderID;
                  $scope.ordershipment.order_items=[];
                  for(var i=0;i<$scope.data.order.sub_orders[index].order_items.length;i++)
                {
                    var order_item=$scope.data.order.sub_orders[index].order_items[i];
                    if(order_item.addForDelivery){   
                        $scope.ordershipment.order_items.push({orderitemID : order_item.orderitemID});    
                    }
                    
                }
                DeliveryService.setProp($scope.ordershipment);
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                  controller:  'DeliveryController',
                  templateUrl: 'views/partials/conformDelivery.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  fullscreen: useFullScreen
                });
              };




        }
    ]);
})();
