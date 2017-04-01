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
	.when('/history_tasks', {
	templateUrl:'views/history_tasks.html',
	controller :'historyTasksController'
	})
	.when('/one_question', {
	templateUrl:'views/one_question.html',
	controller :'oneQuestionController'
	})


// ~~~~ teacher routs ~~~~~
	.when('/teacher', {
	templateUrl:'views/teacher.html',
	controller :'TeacherController'
	})
		.when('/groupManagement', {
	templateUrl:'views/groupManagement.html',
	controller :'GroupManagementController'
	})
	.otherwise({
		templateUrl:'views/welcome.html'
		//controller :'lalaController'
	});

}); 