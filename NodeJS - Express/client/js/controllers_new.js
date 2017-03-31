var _url = "http://localhost:8081";
//var _url = "http://textrategia.com";


//* TEACHER CONTROLLERS*//

textrategiaApp.controller("TeacherController",function($scope){
    $scope.teacherName = getUserName();
    
});

var groups_mock = [
 {
    "GroupId": 1,
    "GroupName": "זברות צבעוניות",
    "teacherID": 5,
    "isMasterGroup": 1,
    "GroupeCode": 01234
  },
   {
    "GroupId": 2,
    "GroupName": "קואלות ירוקות",
    "teacherID": 5,
    "isMasterGroup": 1,
    "GroupeCode": 25
  }
];


textrategiaApp.controller("GroupManagementController",function($scope){
    $scope.teacherName = getUserName();
    $scope.groups = groups_mock;
    $scope.numberOfStudents = function(GroupID){
        return 12;
    }

});









//* STUDENTS CONTROLLERS*//

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


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ~~ SHAKED TO-DO ~~ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

/* I need: 
1. the question itself
2. the task name it came from
2. what is the right answer
3. what was marked. ( CAN ALSO BE INSIDE OF JASON)
*/
/*Note: if you change tags name, let Hadas know */
var history_list_mock = [

{
  "question": {
    "Q_id": 1,
    "Q_qeustion": "האזן לשיחה המוקלטת. לשם מה החליטו במפעל הפיס להקליט שיחות של אנשים עם אראלה?",
    "Q_taskName": "מטלת דוגמא",
    "wasMarked": 0
  },
  "answers": [
    {
        "A_id": 1,
        "answer": "כדי לשכנע אנשים שהזכייה בפיס אפשרית",
        "isCorrect": 1,

    },
    {
        "A_id": 2,
        "answer": "כדי לגרום לאנשים להתרגש",
        "isCorrect": 0,

    },
    {
        "A_id": 3,
        "answer": "כדי שאנשים ירגישו הזדהות עם הזוכים",
        "isCorrect": 0,

    },
    {
        "A_id": 4,
        "answer": "כדי שאנשים יחשבו כיצד הם היו מגיבים לשיחה",
        "isCorrect": 0,

    }
  ]
}

];


textrategiaApp.controller("historyTasksController",function($scope){
    $scope.studentName = getUserName();
    $scope.history_list = history_list_mock;
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



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


textrategiaApp.controller("oneQuestionController", function($scope,$http,$location ,$sce){

    $scope.numberOfQuestions = 0;


    $scope.finishTask = function () {
        $location.path('student');

    };

    $scope.oneMoreTry = function(){
        if ($scope.triedOnce == false){
    // ?!?!?!?!?!?!?
        }

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
                $scope.numberOfQuestions += 1 ;
                if (data.question.Q_mediaType == "youtube" ){
                    $scope.videoURL = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + data.question.Q_media + '?rel=0'); //data.question.Q_media;
                    $scope.showVideo = true;
                    $scope.showVoice = false;
                    $scope.showImg= false;
                }
                else if (data.question.Q_mediaType == "page" ){
                    //$scope.videoURL = 'https://www.youtube.com/embed/crs0TiiYE4I?rel=0'; //data.question.Q_media;
                    $scope.voiceURL = $sce.trustAsResourceUrl(data.question.Q_media);
                    $scope.showVoice = true;
                    $scope.showVideo = false;
                    $scope.showImg= false;
                }
                else if (data.question.Q_mediaType == "img" ){
                    $scope.imgURL = "views/pic/simp1.jpg";
                    $scope.showImg= true;
                    $scope.showVoice = false;
                    $scope.showVideo = false;
                }
                else {
                    $scope.showVideo = false;
                    $scope.showVoice = false;
                }
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