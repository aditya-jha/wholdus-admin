(function() {
    'use strict';

    adminapp.factory('APIService', [
        '$http',
        'ConstantKeyValueService',
        '$location',
        '$q',
        function($http, ConstantKeyValueService, $location, $q) {
            var factory = {};

            function transform(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }

            factory.apiCall = function(method, url, data, params, headers, cache, transformRequest, timeout) {
                var deferred = $q.defer();

                if(!transformRequest) {
                    data = JSON.stringify(data);
                }
                if(!params) {
                    params = {};
                }
                params.access_token = ConstantKeyValueService.token;

                var apiPromise = $http({
                    method: method,
                    params: params,
                    url: url,
                    headers: headers ? {'Content-Type': 'application/x-www-form-urlencoded'} : undefined,
                    transformRequest: transformRequest ? transform : transformRequest,
                    data: data,
                    cache: cache ? cache : false,
                    timeout: timeout
                });
                apiPromise.then(function(response) {
                    deferred.resolve(response.data);
                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            factory.promiseReturnHelper = function(promiseObj, deferred) {
                promiseObj.then(function(response) {
                    deferred.resolve(response.data);
                }, function(error) {
                    $location.url('/404');
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            factory.getAPIUrl = function(type) {
                return ConstantKeyValueService.apiBaseUrl + ConstantKeyValueService.apiUrl[type] + '/';
            };

            return factory;
        }
    ]);
})();
