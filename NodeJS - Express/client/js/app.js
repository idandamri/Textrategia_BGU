var textrategiaApp = angular.module('textrategiaApp', [
'ngRoute'
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
	.when('/tasks', {
	templateUrl:'views/tasks.html',
	controller :'TasksController'
	})
	.when('/one_question', {
	templateUrl:'views/one_question.html',
	controller :'oneQuestionController'
	})
	.otherwise({
		templateUrl:'views/welcome.html'
		//controller :'lalaController'
	});

}); 