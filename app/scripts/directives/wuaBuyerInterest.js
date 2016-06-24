(function() {
    adminapp.directive("wuaBuyerInterest", function() {
        return {
            restrict: 'AE',
            scope: {
                ID : '@id',
            },
            templateUrl: "views/directives/wuaBuyerInterest.html",
            controller: [
                '$scope',
                '$log',
                'APIService',
                'ngProgressBarService',
                '$rootScope',
                '$element',
                'UtilService',
                'ToastService',
                '$timeout',
                function($scope, $log, APIService, ngProgressBarService, $rootScope, $element, UtilService, ToastService, $timeout) {

                    $scope.interest = {
                        buyerID: $scope.ID,
                        categoryID: null,
                        min_price_per_unit:null,
                        max_price_per_unit:null,
                        fabric_filter_text:null,
                        is_active:0,
                        scale:5,
                    }

                    $scope.getCategory = function(event,params){
                        return $timeout(function() {
                            APIService.apiCall("GET", APIService.getAPIUrl('category'))
                            .then(function(response){
                                $scope.categories = response.categories;
                            },function(error){
                                $scope.categories = [];
                                ToastService.showActionToast("Unable to load Categories! Please reload the page",0)
                            });
                        }, 500);
                    };

                    $scope.saveInterest = function(){
                        $rootScope.$broadcast('showProgressbar');
                        APIService.apiCall("POST", APIService.getAPIUrl('buyerinterest'), $scope.interest)
                        .then(function(response){
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast('Successfull', 0);
                        },function(error){
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showActionToast('Something went wrong! Please try again', 0);
                        })
                    };
                    

                }
            ]
        };
    });
})();
