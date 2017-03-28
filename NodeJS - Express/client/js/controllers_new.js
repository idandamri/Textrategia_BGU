var _url = "http://localhost:8081";
//var _url = "http://textrategia.com";

//lst of string, all possible answers
var get_answers_lst_from_jason = function(myJason) {
    var ans = [];
    for(i=0 ; i< myJason.length ; i++){

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
function updateAnswer (quesion_id , ans_id){
    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/updateAnswer',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'stud_id='+getUserID()+'&task_id='+getTaskID() + '&quest_id=' + quesion_id + '&ans_id=' + ans_id
    };
    //alert(JSON.stringify(req));


    $http(req)
        .success(function(data,status,headers,config){
        }).error(function(data,status,headers,config){
    });
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
//    $http = angular.injector(["ng"]).get("$http");


textrategiaApp.controller("oneQuestionController", function($scope,$http,$location){

    $scope.finishTask = function () {
        $location.path('student');

    };

    $scope.oneMoreTry = function(){
        $scope.triedOnce = true;

    }

    $scope.start = function(){
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
                $scope.task_name = myJason.question.Q_skill;  // change to task name
                $scope.task_id = getTaskID();                    //change to task is
                $scope.Q_skill = myJason.question.Q_skill;
                $scope.id = 0;
                $scope.quizOver = false;
                $scope.triedOnce = false;
                $scope.inProgress = true;
                $scope.getQuestion();

            }).error(function (data, status, headers, config) {
                if (status = 676){
                    //alert("End Of Task!");
                    $scope.quizOver = true;
                    //$location.path('student');
                }

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


    $scope.nextQuestion = function(question_id){
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/questionDone',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 's_id=' + getUserID() +'&t_id='+getTaskID() + '&q_id=' + $scope.questionID
        };

        $http(req)
            .success(function(data,status,headers,config){

                $scope.start();
            })
            .error(function(data,status,headers,config) {

                // $scope.start();
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