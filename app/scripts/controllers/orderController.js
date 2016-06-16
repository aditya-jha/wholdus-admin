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
        'DialogService',
        'UtilService',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService, 
            ToastService, $location, $mdMedia, $mdDialog, DeliveryService, DialogService, UtilService) {
            $scope.none='None';
            $scope.ordershipment= {
                suborderID:0,
                order_items:[],
            };
            $scope.data={
                orders:[],
                order:{},
                orderID:null,
                orderitem:{}
            }
            $scope.styles={
                toBeShippedItem:{
                    'border-left':'5px solid blue',
                    'border-right':'5px solid blue',
                    'background-color':'#e6f0ff'
                },
                canceledItem:{
                    'border-left':'5px solid red',
                    'border-right':'5px solid red',
                    'background-color':'#fff0e6'
                },
                shippedItem:{
                    'border-left':'5px solid #009900',
                    'border-right':'5px solid #009900',
                    'background-color':'#ccffcc'
                }
            }

            function getOrders(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('orders'), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if(response.orders.length) {
                        if($scope.data.orderID) {
                            $scope.data.order = response.orders[0];
                            for (var i = 0; i < $scope.data.order.sub_orders.length; i++) {
                               var sub_order=$scope.data.order.sub_orders[i];
                               sub_order.allItems=1;
                               for(var j=0;j<sub_order.order_items.length;j++)
                               {
                                sub_order.order_items[j].addForDelivery=1;
                            }
                        }
                    } else {
                        $scope.data.orders = response.orders;
                    }
                } 
                else if($scope.data.orderID) {
                    ToastService.showActionToast("No such order exists! GO BACK", 0)
                    .then(function(response) {
                        $location.url('/orders');
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
                 pageSetting();
                ToastService.showActionToast("successful", 0).then(function(response) {

                });
            }, function(error) {
                $rootScope.$broadcast('endProgressbar');
                ToastService.showActionToast("something went wrong! please reload", 0);
            });
         }; 
         
         $scope.sub_total=0;    
         $scope.calcAmount=function(index){
            var amount=0;
            var sub_order=$scope.data.order.sub_orders[index];
            for (var i = 0; i < sub_order.order_items.length; i++) {
                if(sub_order.order_items[i].addForDelivery){
                    amount=(parseFloat(amount)+parseFloat(sub_order.order_items[i].final_price)).toFixed(2);
                }
            }
            return amount;
        };

        $scope.calcSubTotal=function(){
            var amount=0;
            for (var j = 0; j < $scope.data.order.sub_orders.length; j++)
            {
                var sub_order=$scope.data.order.sub_orders[j];
                for (var i = 0; i < sub_order.order_items.length; i++) {
                    if(sub_order.order_items[i].addForDelivery)    
                        amount=(parseFloat(amount)+parseFloat(sub_order.order_items[i].final_price)).toFixed(2);
                }
            }    
            return amount;
        };
        $scope.showPrompt = function(ev,orderitemID) {
                var confirm = $mdDialog.prompt()
                .title('Are you sure to delete this product?')
                .textContent('Reason for deleting the product')
                .placeholder('Reason')
                .ariaLabel('Reason')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');
                $mdDialog.show(confirm).then(function(result) {
                    $scope.data.orderitem.cancellation_remarks=result;
                    $scope.data.orderitem.orderitemID=orderitemID;
                    $scope.deleteOrderItem();
                }, function() {
                    $mdDialog.cancel();
                });
            };
            
        $scope.productImage=function(productID){
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, {productID:productID})
                .then(function(response) {
                   var product=response;
                   var images= UtilService.getImages(response);
                   var img= UtilService.getImageUrl(images[0], '200x200');
                   return img;
               },
                    function(error) {
                        return 'images/400.png';
                         });
            }
            $scope.confirmDelivery = function(ev, index) {
             $scope.ordershipment.suborderID=$scope.data.order.sub_orders[index].suborderID;
             $scope.ordershipment.order_items=[];
             $scope.ordershipment.all_items=$scope.data.order.sub_orders[index].allItems;
             if(!$scope.ordershipment.all_items){
                 for(var i=0;i<$scope.data.order.sub_orders[index].order_items.length;i++)
                {
                    var order_item=$scope.data.order.sub_orders[index].order_items[i];
                    if(order_item.addForDelivery && order_item.status.value <= 2){   
                    $scope.ordershipment.order_items.push({orderitemID : order_item.orderitemID});    
                    }

                }
            }
                if($scope.ordershipment.order_items.length>0)
                {
                    DeliveryService.setProp($scope.ordershipment);
                    DialogService.viewDialog(ev,'DeliveryController','views/partials/confirmDelivery.html');    
                }
                else{
                 ToastService.showActionToast("Add items to the cart to send for delivery!", 0);
             }

         };

         $scope.changeItemsSelected=function(index){

            var sub_order=$scope.data.order.sub_orders[index];
            for (var i = 0; i < sub_order.order_items.length; i++) {
               sub_order.order_items[i].addForDelivery=sub_order.allItems;
           }

       };






   }
   ]);



})();


