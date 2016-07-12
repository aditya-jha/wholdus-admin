(function() {
    "use strict";
    adminapp.controller('BlogController', [
        '$scope',
        '$log',
        '$routeParams',
        '$sce',
        'APIService',
        'UtilService',
        '$location',
        '$rootScope',
        'ngProgressBarService',
        'ToastService',
        'DialogService',
        '$mdDialog',
        function($scope, $log, $routeParams, $sce, APIService, UtilService, $location, $rootScope, ngProgressBarService, ToastService,DialogService, $mdDialog) {

            // function init() {
            //     if($routeParams.article && $routeParams.article == 'home') {
                    
            //     }
            // }

            $scope.data = {
                articles : [
                // {
                //     title:'asdasdasd',
                //     author : {
                //         name: 'addasd'
                //     }
                // },
                // {
                //     title:'asdasdasd',
                //     author : {
                //         name: 'addasd'
                //     }
                // },
                // {
                //     title:'asdasdasd',
                //     author : {
                //         name: 'addasd'
                //     }
                // },
                // {
                //     title:'asdasdasd',
                //     author : {
                //         name: 'addasd'
                //     }
                // },
                // {
                //     title:'asdasdasd',
                //     author : {
                //         name: 'addasd'
                //     }
                // }
                ],
                total_items:null
            };

            $scope.internaluser = {};

            

            $scope.detail = [];
            var temp=null;

            $scope.getBlogs = function(params,i){
                        $rootScope.$broadcast('showProgressbar');
                        APIService.apiCall('GET', APIService.getAPIUrl('blogarticle'),null, params).
                        then(function(response){
                            $rootScope.$broadcast('endProgressbar');
                            if(params){
                                $scope.data.articles[i].content = $sce.trustAsHtml(response.articles[0].content);
                            }
                            else{
                                $scope.data.articles = response.articles;
                                $scope.data.total_items = response.total_items;
                                $scope.detail.length= response.articles.length;
                            }
                            // $scope.data.articles[0].cover_image_link= 'https://media.licdn.com/mpr/mpr/jc/AAEAAQAAAAAAAAdZAAAAJDE1YmU1NDRkLWI2ZGMtNGU4MC1hN2EyLWNhNDM4MTg2YzA0OA.jpg';
                        },function(error){
                            $rootScope.$broadcast('endProgressbar');
                            ToastService.showSimpleToast('unable to load blog content', 3000);
                        });
                    };

            $scope.getBlogs();

            $scope.selectBlog = function(i,id){
                $scope.detail[i] = true;
                if($scope.data.articles[i].content == undefined){
                    $scope.getBlogs({
                        article_details:1,
                        articleID:id
                    }, i)
                }
                if(temp!=null && temp!=i){
                    $scope.detail[temp] = false;

                }
                temp = i;
            };

            $scope.createBlog = function(ev){
                DialogService.viewDialog(ev, 'BlogController', 'views/blog/newBlog.html', $scope.internaluser, 'POST');
            }
            $scope.editBlog = function(ev, i){
                DialogService.viewDialog(ev, 'BlogController', 'views/blog/newBlog.html', $scope.data.articles[i], 'PUT');
            }

            $scope.postBlog = function(){
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall($scope.blogType, APIService.getAPIUrl('blogarticle'), $scope.newArticle)
                .then(function(response){
                    $rootScope.$broadcast('endProgressbar');
                    if($scope.blogType == 'POST'){ToastService.showActionToast('New Blog Created', 0)   
                    .then(function(response){
                        
                        $mdDialog.cancel();
                        getBlogs();
                    });}
                    else{ToastService.showActionToast('Blog Updated', 0)   
                    .then(function(response){
                        
                        $mdDialog.cancel();
                        getBlogs();
                    });} 
                },function(error){
                    $rootScope.$broadcast('endProgressbar');
                    ToastService.showActionToast('Something went wrong! Please try again', 0);
                });
            };

            function getInternalUser(params){
                APIService.apiCall('GET', APIService.getAPIUrl('internaluser'), null, params)
                .then(function(response){
                    $scope.internaluser = response.internal_users[0];
                },function(error){
                    ToastService.showActionToast('unable to load author' , 0)
                });
            };

            getInternalUser();

            function blogSetting(){
                $scope.blogType = DialogService.val2;
                if(DialogService.val2){
                    if(DialogService.val2 == 'POST'){
                        $scope.newArticle = {
                            authorname : DialogService.val1.name,
                            title:null,
                            content:null,
                            internaluserID:DialogService.val1.internaluserID
                        };
                    }
                    else if(DialogService.val2 == 'PUT'){
                        $scope.newArticle = {
                            authorname : DialogService.val1.author.name,
                            title:DialogService.val1.title,
                            content:DialogService.val1.content,
                            internaluserID:DialogService.val1.author.internaluserID,
                            articleID:DialogService.val1.articleID
                        };
                    }
                }
            }

            blogSetting();
            
        }
    ]);
})();
