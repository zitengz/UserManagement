(function(){
    angular.module('myApp', ['ngRoute'])
        //3 views routing
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/user_list', {
                    templateUrl : 'templates/user_list.html',
                    controller : 'userCtrl'
                })
                .when('/edit_user/:param', {
                    templateUrl : 'templates/edit_user.html',
                    controller:'EdituserController'
                })
                .when('/new_user', {
                    templateUrl :'templates/new_user.html',
                    controller : 'NewuserController'
                })
                .otherwise({
                    redirectTo :  'user_list'
                });
        }])
    //user data factory
    .factory('userFactory', ['$http',function($http) {
        //get data from json file and save it
        var users = [];
        users = $http.get('/users').success(function(data){
            users = data;
        });
        //provide data access to all controllers
        return {
            getUsers : function() {
                return users;
            }
        };
    }])
    //User list controller
    .controller('userCtrl', function($scope,userFactory) {
        $scope.users = userFactory.getUsers();
        $scope.deleteUser = function(item) {
            var index = $scope.users.indexOf(item);
            $scope.users.splice(index,1);
            $scope.pagedItems[$scope.currentPage].splice(index % $scope.itemsPerPage,1);
        };
        $scope.orderByMe = function(x) {
            $scope.myOrderBy = x;
        };
        //Pagination
        $scope.itemsPerPage = 5;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        $scope.pageNum = 0;
        $scope.pageNums = [];
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.users.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.users[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.users[i]);
                }
                $scope.pageNum = $scope.pagedItems.length;
            }
        };
        $scope.initPageNums = function() {
            for(var i = 0; i < $scope.pageNum; i++) $scope.pageNums.push(i);
        };
        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function(n) {
            $scope.currentPage = n;
        };

        //initialize
        $scope.groupToPages();
        $scope.initPageNums();

    })
    //Edit User View Controller
    .controller('EdituserController', function($scope,$location,$routeParams,userFactory) {
        $scope.id = $routeParams.param;
        $scope.users = userFactory.getUsers();
        var index = 0;
        for(index; index < $scope.users.length; index++) {
            if($scope.id == $scope.users[index].id) break;
        }
        $scope.fName = $scope.users[index].fName;
        $scope.lName = $scope.users[index].lName;
        $scope.passw1 = $scope.users[index].passw1;
        $scope.passw2 = $scope.users[index].passw2;
        $scope.title = $scope.users[index].title;
        $scope.sex = $scope.users[index].sex;
        $scope.age = $scope.users[index].age;

        $scope.updateUser = function() {
            $scope.users[index].fName = $scope.fName;
            $scope.users[index].lName = $scope.lName;
            $scope.users[index].passw1 = $scope.passw1;
            $scope.users[index].passw2 = $scope.passw2;
            $scope.users[index].title = $scope.title;
            $scope.users[index].sex = $scope.sex;
            $scope.users[index].age = $scope.age;
            $location.path("#/user_list");
        };
    })
    //New User View Controller
    .controller('NewuserController', function($scope,$location,userFactory) {
        $scope.fName = '';
        $scope.lName = '';
        $scope.passw1 = '';
        $scope.passw2 = '';
        $scope.title = '';
        $scope.sex = '';
        $scope.age = '';
        $scope.error = false;
        $scope.incomplete = false;
        $scope.users = userFactory.getUsers();
        var userId = 1;
        if($scope.users.length > 0) userId = $scope.users[$scope.users.length - 1].id + 1;
        $scope.addUser = function() {
            $scope.users.push({ id:userId,fName:$scope.fName, lName: $scope.lName,
                title:$scope.title, sex : $scope.sex, age:$scope.age});
            $location.path("#/user_list");
        };
        $scope.$watch('passw1',function() {$scope.test();});
        $scope.$watch('passw2',function() {$scope.test();});
        $scope.$watch('fName', function() {$scope.test();});
        $scope.$watch('lName', function() {$scope.test();});
        $scope.$watch('title', function() {$scope.test();});
        $scope.$watch('sex', function() {$scope.test();});
        $scope.$watch('age', function() {$scope.test();});
        $scope.test = function() {
            if ($scope.passw1 !== $scope.passw2) {
                $scope.error = true;
            } else {
                $scope.error = false;
            }
            $scope.incomplete = false;
            if  (!$scope.fName.length ||
                !$scope.lName.length ||
                !$scope.passw1.length || !$scope.passw2.length
                ||!$scope.title.length||!$scope.sex.length||!$scope.age.length) {
                $scope.incomplete = true;
            }
        };
    });
})();
