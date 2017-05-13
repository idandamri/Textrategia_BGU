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
	.when('/register', {
		templateUrl:'views/register.html',
		controller :'RegisterController'
	})

// ~~~~~~~~~~~~ Student routs ~~~~~~~~~~~~~
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

    // ~~~~~~~~~~~~ SuperUser routs ~~~~~~~~~~~~~
    .when('/superUser', {
        templateUrl:'views/superUser.html',
        controller :'SuperUserController'
    })
    .when('/addSchoolInCity', {
        templateUrl:'views/addSchoolInCity.html',
        controller :'AddSchoolInCityController'
    })
    .when('/creatTask', {
        templateUrl:'views/creatTask.html',
        controller :'CreatTaskController'
    })

// ~~~~~~~~~~~~ Teacher routs ~~~~~~~~~~~~~
	.when('/teacher', {
		templateUrl:'views/teacher.html',
		controller :'TeacherController'
	})
		.when('/groupManagement', {
		templateUrl:'views/groupManagement.html',
		controller :'GroupManagementController'
	})
		.when('/createGroup', {
		templateUrl:'views/createGroup.html',
		controller :'CreateGroupController'
	})
		.when('/createQuestion', {
		templateUrl:'views/createQuestion.html',
		controller :'CreateQuestionController'
	})
		.otherwise({
		templateUrl:'views/welcome.html'
		//controller :'lalaController'
	});

}); 