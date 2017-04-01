var _url = "http://localhost:8081";
//var _url = "http://textrategia.com";


//* TEACHER CONTROLLERS*//



// ########################### TEACHER CONTROLLERS ###########################//

textrategiaApp.controller("TeacherController",function($scope){
    $scope.teacherName = getUserName();

});

var groups_and_tasks_mock =
    {
        "groups": [
            {
                "GroupId": 1111,
                "GroupName": "זברות צבעוניות",
                "teacherID": "1",
                "IsMasterGroup": 1,
                "GroupeCode": "1"
            },
            {
                "GroupId": 1234567,
                "GroupName": "כוכבים נופלים",
                "teacherID": "1",
                "IsMasterGroup": 0,
                "GroupeCode": "2"
            },
            {
                "GroupId": 1234567,
                "GroupName": "כיתה ה' 3",
                "teacherID": "1",
                "IsMasterGroup": 0,
                "GroupeCode": "3"
            }
        ],
        "tasks": [
            {
                "T_id": 1,
                "T_title": "נסיכות דיסני ובני זוגם",
                "T_description": "מטלת ניסוי לבסיס הנתונים"
            },
            {
                "T_id": 2,
                "T_title": "המדריך המהיר לזיהוי מיניונים",
                "T_description": "מטלת ניסוי לבסיס הנתונים"
            },
            {
                "T_id": 3,
                "T_title": "ביב בופ ורוקסטדי, הסיפור האמיתי",
                "T_description": "מטלת ניסוי לבסיס הנתונים"
            }
        ]
    };

var empty = {"groups":[],"tasks":[{"T_id":1,"T_title":"מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"},{"T_id":2,"T_title":"2מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"}]};


textrategiaApp.controller("GroupManagementController",function($scope){
    $scope.teacherName = getUserName();
    // $scope.info = empty;
    $scope.info = groups_and_tasks_mock;
    $scope.numberOfStudents = function(thisGroupID){
        return 12;
    }

    $scope.showError = false; // set Error flag


// these function alert the choise the user made.
    $scope.sendTaskToGroup = function(){
        //get group selection
        var sel1 = document.getElementById("expertise1");

        var opt1;
        for (i = 0 ; i < sel1.options.length ; i++){
            opt1 = sel1.options[i];
            if (opt1.selected == true){
                alert(opt1.value);              // this is GroupName
                break;
            }
        }
        //get tasks selection
        var sel2 = document.getElementById("expertise2");

        var opt2;
        for (i = 0 ; i < sel2.options.length ; i++){
            opt2 = sel2.options[i];
            if (opt2.selected == true){
                alert(opt2.value);              // this is T_title
                break;
            }
        }




    }

});

//  #################################################################################








//* STUDENTS CONTROLLERS*//

//lst of string, all possible answers
var get_answers_lst_from_jason = function(myJason) {
    var ans = [];
    var ans_id =[];
    for(i=0 ; i< myJason.length ; i++){
        ans.push(myJason[i].answer);
        ans_id.push(myJason[i].A_id);
    }
    return {
        ans_lst : ans,
        ans_id_lst : ans_id
    };
};


var get_answer_index = function(ans_lst, ans_id_lst,ans ) {
    var index;
    for (i=0 ; i< ans_lst.length ; i++){
        if (ans_lst[i] == ans){
            index= ans_id_lst[i];
            break;
        }
    }
    return index;
};



var get_correct_answer_index = function(myJason) {
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
function updateAnswer (question_id , ans_id){
    $http = angular.injector(["ng"]).get("$http");
    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/updateAnswer',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'stud_id='+getUserID()+'&task_id='+getTaskID() + '&quest_id=' + question_id + '&ans_id=' + ans_id
    };
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

    $scope.navigateToOneQuestion = function(t_id,t_name){
        setTaskID(t_id);
        setTaskName(t_name);
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
                /*flags*/
                $scope.showText= false;
                $scope.showImg= false;
                $scope.showVoice = false;
                $scope.showVideo = false;

                $scope.task_name = getTaskName();  // change to task name
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
                }
                else if (data.question.Q_mediaType == "img" ){
                    $scope.imgURL = "views/pic/simp1.jpg";
                    $scope.showImg= true;
                }
                else if (data.question.Q_mediaType == "text" ){
                    $scope.textData= data.question.Q_media;
                    $scope.showText= true;
                }

            }).error(function (data, status, headers, config) {
                if (status == "676"){
                    $scope.quizOver = true;
                    $scope.answerMode = true;
                    //$location.path('student');
                }

        });
    };

    $scope.reset = function() {
        $scope.inProgress = false;
        $scope.quizOver = false;
        $scope.score = 0;
        $scope.start();
    };

    $scope.getQuestion = function(){
        $scope.question =  myJason.question.Q_qeustion;
        var answers_lst = get_answers_lst_from_jason(myJason.answers);
        $scope.options =  answers_lst.ans_lst;
        $scope.options_id =  answers_lst.ans_id_lst;
        $scope.answer = get_correct_answer_index(myJason.answers);
        $scope.answerMode = true;
        $scope.questionID = myJason.question.Q_id;
        $scope.correctFB = myJason.question.Q_correctFB;
        $scope.wrongFB = myJason.question.Q_notCorrectFB;
    };

    //This is function for submit
    $scope.checkAnswer = function(){
        var ans = $('input[name=answer]:checked').val();
        var ans_id = get_answer_index($scope.options, $scope.options_id,ans);
        updateAnswer($scope.questionID,ans_id);
        if(ans == $scope.options[$scope.answer]) {
            $scope.score++;
            $scope.feedback = $scope.correctFB;
            $scope.correctAns = true;
            // $scope.AnsID = getAnsID($scope.answer)
            /*need to add update ans & remove from instances*/

        } else {
            $scope.feedback = $scope.wrongFB;
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
            if (data[0].PersonalID == "1"){
                $location.path('student');
            }
            else if (data[0].PersonalID == "2") {
                $location.path('teacher');
            }
        }).error(function(data,status,headers,config){
            $scope.showError = true;
            $scope.showSuccess = false;

        });


    }


});