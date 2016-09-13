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
        '$route',
        function($scope, $log, APIService, $routeParams, $rootScope, ngProgressBarService,
            ToastService, $location, $mdMedia, $mdDialog, DeliveryService, DialogService, UtilService, $route) {
            $scope.none='None';
            $scope.ordershipment= {
                suborderID:null,
                order_items:[],
            };
            $scope.sellerpayment= {
                suborderID:null,
                order_items:[],
            };
            $scope.data={
                orders:[],
                order:{},
                orderID:null,
                orderitem:{}
            };

            $scope.settings = {
                enablePagination: false,
                page: UtilService.getPageNumber(),
                itemsPerPage:10
            };
            $scope.styles = {
                toBeShippedItem:{
                    'border-left':'10px solid blue'
                },
                canceledItem: {
                    'border-left':'10px solid red'
                },
                shippedItem: {
                    'border-left':'10px solid #009900'
                }
            };

            function getOrders(params) {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('orders'), null, params)
                .then(function(response) {
                $rootScope.$broadcast('endProgressbar');
                    if(response.orders.length) {
                        if($scope.data.orderID) {
                            $scope.data.order = response.orders[0];
                            for (var i = 0; i < $scope.data.order.sub_orders.length; i++) {
                                var sub_order = $scope.data.order.sub_orders[i];
                                sub_order.allItems = 1;
                                sub_order.fullyPaid = 1;
                                sub_order.isShipable = 0;
                                sub_order.isPayable = 0;

                                for(var j=0;j<sub_order.order_items.length;j++) {
                                    sub_order.order_items[j].addForDelivery = 1;
                                    var product = sub_order.order_items[j].product;
                                    product.images=UtilService.getImages(product);
                                    if(product.images.length) {
                                        product.imageUrl = UtilService.getImageUrl(product.images[0], '200x200');
                                    } else {
                                        product.imageUrl = 'images/200.png';
                                    }
                                    if(!sub_order.isShipable && sub_order.order_items[j].order_item_status.value <= 2) {
                                        sub_order.isShipable=1;
                                    }
                                    if(!sub_order.isPayable && sub_order.order_items[j].order_item_status.value >= 5) {
                                        sub_order.isPayable=1;
                                    }
                                }
                            }
                        } else {
                            $scope.data.orders = response.orders;
                            $scope.total_items=response.total_items;
                            if(response.total_pages > 1) {
                                $scope.settings.enablePagination = true;
                                $rootScope.$broadcast('setPage', {
                                    page: $scope.settings.page,
                                    totalPages: Math.ceil(response.total_items/$scope.settings.itemsPerPage)
                                });
                            }
                        }
                    } else if($scope.data.orderID) {
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
                    getOrders({
                        items_per_page:$scope.settings.itemsPerPage,
                        page_number:$scope.settings.page});
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
                   var order_item=sub_order.order_items[i];
                   if((order_item.addForDelivery | sub_order.allItems) && order_item.order_item_status.value<=2){
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

            $scope.productImage = function(productID){
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, {productID:productID})
                .then(function(response) {
                    // alert("Hello");
                    var product=response.products[0];
                    var images= UtilService.getImages(product);
                    var img= UtilService.getImageUrl(images[0], '200x200');
                    $scope.img=img;
                }, function(error) {
                });
            };

            $scope.confirmDelivery = function(ev, index) {
                $scope.ordershipment.suborderID=$scope.data.order.sub_orders[index].suborderID;
                $scope.ordershipment.order_items=[];
                $scope.ordershipment.all_items=$scope.data.order.sub_orders[index].allItems;

                if(!$scope.ordershipment.all_items) {
                    for(var i=0;i<$scope.data.order.sub_orders[index].order_items.length;i++) {
                        var order_item=$scope.data.order.sub_orders[index].order_items[i];
                        if(order_item.addForDelivery && order_item.order_item_status.value <= 2){
                            $scope.ordershipment.order_items.push({orderitemID : order_item.orderitemID});
                        }
                    }
                }

                if($scope.ordershipment.order_items.length>0 || $scope.ordershipment.all_items) {
                    DeliveryService.setProp($scope.ordershipment);
                    DialogService.viewDialog(ev,'DeliveryController','views/partials/confirmDelivery.html');
                } else{
                     ToastService.showActionToast("Add items to send for the Shipment", 0);
                }
             };

             $scope.paySeller = function(ev, index) {
                 $scope.sellerpayment.suborderID=$scope.data.order.sub_orders[index].suborderID;
                 $scope.sellerpayment.order_items=[];
                 $scope.sellerpayment.fully_paid=$scope.data.order.sub_orders[index].fullyPaid;
                 if(!$scope.sellerpayment.fully_paid){
                     for(var i=0;i<$scope.data.order.sub_orders[index].order_items.length;i++)
                     {
                        var order_item = $scope.data.order.sub_orders[index].order_items[i];
                        if(order_item.addForPayment && order_item.order_item_status.value >=5){
                            $scope.sellerpayment.order_items.push({orderitemID : order_item.orderitemID});
                        }

                    }
                }
                if($scope.sellerpayment.order_items.length>0 || $scope.sellerpayment.fully_paid)
                {
                    DeliveryService.setProp($scope.sellerpayment);
                    DialogService.viewDialog(ev,'CreateSellerPaymentController','views/partials/createSellerPayment.html');
                }
                else{
                 ToastService.showActionToast("Add items for the Payment", 0);
             }

         };

         $scope.changeItemsSelected=function(index){
            var sub_order=$scope.data.order.sub_orders[index];
            for (var i = 0; i < sub_order.order_items.length; i++) {
               sub_order.order_items[i].addForDelivery=sub_order.allItems;
           }
        };

       $scope.buyerPayment = function(event, va){
           DialogService.viewDialog(event, 'PaymentController','views/partials/create-buyer-payment.html', va);
       };

       function confirmOrderHelper() {
           $rootScope.$broadcast('showProgressbar');
           var data = {
               orderID: $scope.data.order.orderID,
               order_status: 1
           };
           $scope.confirmOrderAPICall = APIService.apiCall('PUT', APIService.getAPIUrl('orders'), data);
           $scope.confirmOrderAPICall.then(function(response) {
               $scope.confirmOrderAPICall = null;
               $rootScope.$broadcast('endProgressbar');
               $log.log(response);
               ToastService.showActionToast("Sucess, Order Confirmed!", 0, "ok").then(
                   function() {
                       $route.reload();
                   }
               );
           }, function(error) {
               $rootScope.$broadcast('endProgressbar');
               $scope.confirmOrderAPICall = null;
               $log.log(error);
               ToastService.showActionToast("Sorry! Couldn't confirm order!", 0, "ok");
           });
       }

       $scope.confirmOrder = function(event) {
           if($scope.data.order.order_status.value > 0) return;
           var confirm = $mdDialog.confirm()
                            .title('Confirm this order?')
                            .ariaLabel('confirm order')
                            .targetEvent(event)
                            .ok('Confirm')
                            .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                confirmOrderHelper();
            }, function() {
            });
       };
   }]);
})();
