(function() {
    "use strict";
    adminapp.factory('LoginService', [
        'ConstantKeyValueService',
        '$rootScope',
        'APIService',
        '$q',
        'localStorageService',
        function(ConstantKeyValueService, $rootScope, APIService, $q, localStorageService) {
            var factory = {};

            factory.loginStatus = false;

            function loginSuccess(response) {
                factory.loginStatus = true;

                ConstantKeyValueService.token = response.token;
                ConstantKeyValueService.loggedInUser = response.internaluser;

                localStorageService.set(ConstantKeyValueService.accessTokenKey, response.token);
                localStorageService.set(ConstantKeyValueService.loggedInUserKey, response.internaluser);
            }

            factory.checkLoggedIn = function() {
                var token = localStorageService.get(ConstantKeyValueService.accessTokenKey);
                if(token) {
                    factory.loginStatus = true;
                    ConstantKeyValueService.token = token;
                    ConstantKeyValueService.loggedInUser = localStorageService.get(ConstantKeyValueService.loggedInUserKey);
                } else {
                    factory.loginStatus = false;
                }
                return factory.loginStatus;
            };

            factory.logout = function() {
                factory.loginStatus = false;
                ConstantKeyValueService.token = null;
                ConstantKeyValueService.loggedInUser = {};
                factory.seller = {};

                localStorageService.remove(ConstantKeyValueService.accessTokenKey);
                localStorageService.remove(ConstantKeyValueService.loggedInUserKey);
            };

            factory.login = function(email, password) {
                var deferred = $q.defer();
                var data = {
                    email: email,
                    password: password
                };
                var apicall = APIService.apiCall("POST", APIService.getAPIUrl('internalUserLogin'), data, null, true, false, true);
                apicall.then(function(response) {
                    loginSuccess(response);
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            return factory;
        }
    ]);
})();
