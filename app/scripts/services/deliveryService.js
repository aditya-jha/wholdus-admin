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
            factory.suborderID=0;
            factory.order_items=[];
            factory.setProp=function(ordershipment){
            factory.suborderID=ordershipment.suborderID;
            factory.order_items=ordershipment.order_items;

            }
            return factory;
        }
    );
})();
