textrategiaApp.controller("StudentController",function($scope){
	$scope.studentname = "שקד";
});

textrategiaApp.controller("LoginController", function($scope, $http) {
	/*
    $scope.loginClick= function(){
    	alert("ERROR!")
    }
    */

    $http({
    method: 'POST',
    url: 'http://localhost:8081/login',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: {'user':'shakedkr@post.bgu.ac.il' , 'password':'123456'}    
	});

  
});