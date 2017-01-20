'use strict';

// textrategia is my angular application name (OFF ALL THE MODUL)
// [] : all the injections. the libraries I might use
var textrategia = 
angular.module('textrategia', ['ui.router', 'snap', 'ngAnimate'])
.config(function($stateProvider, $urlRouterProvider) {


	$urlRouterProvider.otherwise('/welcome');

	$stateProvider
    .state('base', {
        abstract: true,
        url: ''
    })
    .state('welcome', {
    	url: '/welcome',
    	// parent: 'base',
    	template: '<welcome-component></welcome-component>'
	})     // remove: ;)
    .state('login', {
    	url: '/login',
    	// parent: 'base',
    	template:'<login-component></login-component>'

    });
})
.controller('buttonController', function($scope) {
  
$scope.redirect = function(path){
  window.location = path;
}
  })

.controller('loginCtrl', function($scope){
    $scope.submit = function(){
        var uname = $scope.username;
        var pass = $scope.password;
        if(uname == '' || password == ''){
            alert('no pass or uname');
        }
        else{
            alert('Welcome');
        }
    }
})

// not working yet
.controller('picController', function($scope, $sce) {
    // var data = "bla " ;
  $scope.imgUri  = $sce.trustAsResourceUrl("/pic/bottom.png");
});