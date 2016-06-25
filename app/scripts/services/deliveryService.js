(function() {
    "use strict";
    adminapp.factory('DeliveryService',
        function() {
            // var ordershipment = {
            //     order_items:[],
            //     suborderID:0,
            // };
            // return ordershipment;
            var factory={};
            factory.suborderID=null;

            factory.order_items=[];
            factory.shipment={

            };

            factory.setProp = function(property) {
                factory.suborderID=property.suborderID;
                factory.order_items=property.order_items;
                factory.all_items=property.all_items;
                
                if(property.fully_paid!=null){
                    factory.fully_paid=property.fully_paid;
                }
            };
            
            factory.setShipment=function(shipment){
                factory.shipment=shipment;
            };
            return factory;
        }
    );
})();
