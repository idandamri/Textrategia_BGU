var textrategiaApp = angular.module('textrategiaApp', [
'ngRoute'
//'SomeNameControllers'
]);

textrategiaApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


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
	.when('/autodidact', {
		templateUrl:'views/autodidact.html',
		controller :'autodidactController'
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
    .when('/questionManagment', {
        templateUrl:'views/questionManagment.html',
        controller :'QuestionManagmentController'
    })
    .when('/superUserGroupManagment', {
        templateUrl:'views/superUserGroupManagment.html',
        controller :'superUserGroupManagmentController'
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