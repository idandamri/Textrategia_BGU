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

.controller('loginCtrl', function($scope,$http){
    $scope.submit = function(){
        var uname = $scope.username;
        var pass = $scope.password;


        if(uname == '' || password == ''){
            alert('no pass or uname');
        }
        else{
            if(new String(uname).valueOf() == new String('undefined').valueOf()){
                alert('you didn\'t return an email');
            }else
            {
                console.log(typeof (uname) );
                console.log(typeof(pass)+"\n");
                $http({
                method: 'POST', 
                url: 'login',
                data: { 
                        'user': uname, 
                        'password': pass 
                     },
            }).then(function success(res) {
                var json = JSON.parse(JSON.stringify(res));
                console.log(json);
                if(json['data']=='OK'){
                    console.log(JSON.stringify(res));
                    alert('Posted\n' + uname + "\n");
                } else {
                    console.log('bla')
                }

            },function error(data) {
                $scope.data = data || "FALSE";
                $scope.errorMessage = 'Something went wrong';
            });

            /*post("/login",{user: uname,password: pass}, function(data){
                if(data=='OK')
                  {
                    alert("Hi,\nLogin success!");
                  }
                  else {
                    console.log(data);
                    alert("Username or password wrong!");
                    //window.location="http://localhost:8081"+data + "?;"
                  }
            });*/
            }
        }
    }
})

// // not working yet
// .controller('picController', function($scope, $sce) {
//     // var data = "bla " ;
//   $scope.imgUri  = $sce.trustAsResourceUrl("/pic/bottom.png");
// });