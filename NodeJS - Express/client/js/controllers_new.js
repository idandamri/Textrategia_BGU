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




textrategiaApp.controller("oneQuestionController", function($scope,$http){

   var myJason;

    var req = {
                method: 'POST',
                cache: false,
                url: _url +'/getQuestion',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'user_id='+getUserID()+'&t_id=1' /*CHANGE TO COOKIE*/
    };  

    $http(req)
        .success(function(data,status,headers,config){
            alert("status: "+status + "data: "+JSON.stringify(data));
            myJason = data;
            $scope.task_name = myJason[0].Q_skill;  // change to task name
            $scope.task_id = 1;                     //change to task is
        $scope.Q_skill = myJason[0].Q_skill;
        }).error(function(data,status,headers,config){
            //alert("status: "+status + "data: "+JSON.stringify(data));
            myJason = "";
    });
   
    $scope.start = function(){
        $scope.id = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        $scope.getQuestion();
    };

    $scope.reset = function() {
        $scope.inProgress = false;
        $scope.score = 0;
    };

    $scope.getQuestion = function(){
        $scope.question =  myJason[0].Q_qeustion;
        $scope.options = get_answers_lst_from_jason(myJason);
        $scope.answer = 0;
        $scope.answerMode = true;
    };

    //This is function for submit
    $scope.checkAnswer = function(){
        var ans = $('input[name=answer]:checked').val();
        if(ans == $scope.options[$scope.answer]) {
            $scope.score++;
            $scope.feedback = myJason[0].Q_correctFB;
            $scope.correctAns = true;
            /*need to add update ans & remove from instances*/ 
        } else {
            $scope.feedback = myJason[0].Q_notCorrectFB;
            $scope.correctAns = false;
            /*need to add update ans*/
        }
        $scope.answerMode = false;
    };


    $scope.nextQuestion = function(){
        // HERE WE NEED TO ASK FOR NEXT QUESTION. how???
        // solution : just re-load the question anagin
        $location.path('one_question');
        // for now, infint loop on same question
        //$scope.getQuestion();
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
