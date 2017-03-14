var textrategiaApp = angular.module('textrategiaApp', [
'ngRoute',
//'SomeNameControllers'
]);

textrategiaApp.config(function($routeProvider){
	$routeProvider
	.when('/login', {
		templateUrl:'views/login.html',
		controller :'LoginController'
	})
	.when('/student', {
		templateUrl:'views/student.html',
		controller :'StudentController'
	})
	.otherwise({
		templateUrl:'views/welcome.html'
		//controller :'lalaController'
	});

}); 
