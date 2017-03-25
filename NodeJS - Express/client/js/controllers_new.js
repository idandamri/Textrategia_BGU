var _url = "http://localhost:8081";
//var _url = "http://textrategia.com";

//lst of string, all possible answers
var get_answers_lst_from_jason = function(myJason) {
    var ans = [];
    for(i=0 ; i< myJason.length ; i++){
        //alert(myJason[i].answer);
        ans.push(myJason[i].answer);
    }
    return ans;
};

var get_answer_index = function(myJason) {
    var ans;
    for (i=0 ; i< myJason.length ; i++){
        if (myJason[i].isCorrect == 1){
            ans = i;
            break;
        }
    }
    return ans;
};

/*TO-DO*/
function updateAnswer (student_id , task_id, quesion_id){

};

/*TO-DO*/
function removeQuestionFromInstances (student_id , task_id, quesion_id){

};


textrategiaApp.controller("StudentController",function($scope){
    $scope.studentName = getUserName();
});



textrategiaApp.controller("TasksController",function($scope,$http,$location){
    //$scope.tasks = tasks_parsed_jason_lst;
          
        var req = {
                method: 'POST',
                cache: false,
                url: _url +'/getListOfTasks',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'user_id=' + getUserID() /*CHANGE TO COOKIE*/
        };  

        $http(req)
        .success(function(data,status,headers,config){
            $scope.tasks  = data;
        }).error(function(data,status,headers,config){
            $scope.tasks  = data;
        });


    $scope.questionSum = 4; //remove in future. should be a query or calculation
    $scope.studentName = getUserName();

    $scope.navigateToOneQuestion = function(t_id){
        setTaskID(t_id);
        $location.path('one_question');
    };

});

/*not in use*/
function extracted() {
    var myJason;
    $http = angular.injector(["ng"]).get("$http");

    var req = {
        method: 'POST',
        cache: false,
        url: _url + '/getQuestion',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'user_id=' + getUserID() + '&t_id=1' /*CHANGE TO COOKIE*/
    };

    // return function() {
            $http(req)
            .success(function (data, status, headers, config) {
                myJason = data;

            }).error(function (data, status, headers, config) {
            myJason = "";
        });
    // }
}

textrategiaApp.controller("oneQuestionController", function($scope,$http,$location){

    $scope.start = function(){
        //var myJason  = extracted();
        var req = {
            method: 'POST',
            cache: false,
            url: _url + '/getQuestion',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'user_id=' + getUserID() + '&t_id=' + getTaskID() /*CHANGE TO COOKIE*/
        };
        $http(req)
            .success(function (data, status, headers, config) {
                myJason = data;
                alert(JSON.stringify(myJason));
                $scope.task_name = myJason.question.Q_skill;  // change to task name
                $scope.task_id = getTaskID();                    //change to task is
                $scope.Q_skill = myJason.question.Q_skill;
                $scope.id = 0;
                $scope.quizOver = false;
                $scope.inProgress = true;
                $scope.getQuestion();

            }).error(function (data, status, headers, config) {
                 myJason = "";
        });


    };

    $scope.reset = function() {
        $scope.inProgress = false;
        $scope.score = 0;
    };

    $scope.getQuestion = function(){
        $scope.question =  myJason.question.Q_qeustion;
        $scope.options = get_answers_lst_from_jason(myJason.answers);
        $scope.answer = get_answer_index(myJason.answers);
        $scope.answerMode = true;
        $scope.questionID = myJason.question.Q_id;
    };

    //This is function for submit
    $scope.checkAnswer = function(){
        var ans = $('input[name=answer]:checked').val();
        if(ans == $scope.options[$scope.answer]) {
            $scope.score++;
            $scope.feedback = myJason.answers.Q_correctFB;
            $scope.correctAns = true;
            /*need to add update ans & remove from instances*/ 
        } else {
            $scope.feedback = myJason.answers.Q_notCorrectFB;
            $scope.correctAns = false;
            /*need to add update ans*/
        }
        $scope.answerMode = false;
    };


    $scope.nextQuestion = function(){
        var req = {
            method: 'POST',
            cache: false,
            url: _url + '/questionDone',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 's_id=' + getUserID() + '&t_id=1' + "&q_id=" + $scope.questionID /*CHANGE TO COOKIE*/
        };
        $http(req)
            .success(function (data, status, headers, config) {
                 /*load new question deatils*/
                alert("status for next question:" + status);
                $scope.start();
            }).error(function (data, status, headers, config) {
                alert(status);
        });


    };

    $scope.reset();

});

textrategiaApp.controller("LoginController", function($scope, $http,$location) {

    
    $scope.showError = false; // set Error flag
    $scope.showSuccess = false; // set Success Flag

    //------- Authenticate function
    $scope.authenticate = function (){
        var user = $scope.user.username;
        var password = $scope.user.password;
        var flag= false;
        
        var req = {
                method: 'POST',
                cache: false,
                url: _url +'/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'user='+user+'&password='+password
        };  
        //alert(JSON.stringify(req));

          
        $http(req)
        .success(function(data,status,headers,config){
            setUserName(data[0].FirstName);
            setUserID(data[0].PersonalID);
            $scope.showError = false;
            $scope.showSuccess = true;
            $location.path('student');


        }).error(function(data,status,headers,config){
            $scope.showError = true;
            $scope.showSuccess = false;

        });


    }


});