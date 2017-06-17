/**
 * Created by krigel on 5/9/2017.
 */
//lst of string, all possible answers
var get_answers_lst_from_jason = function(myJason) {
    var ans = [];
    var ans_id =[];
    shuffle(myJason);
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


var  get_answer_multi_index = function(ans_lst, ans_id_lst,answers ) {
    var index_id=[];
    var index=[];
    for (i=0 ; i< ans_lst.length ; i++){
        for (j=0 ; j< answers.length ; j++){
            if (ans_lst[i] == answers[j]){
                index_id.push(ans_id_lst[i]);
                index.push(i);
            }
        }
    }

    return {
        index_id :index_id,
        index : index
    };
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

var get_correct_answer_multi_index = function(myJason) {
    var ans=[];
    for (i=0 ; i< myJason.length ; i++){
        if (myJason[i].isCorrect == 1){
            ans.push(i);
        }
    }
    return ans;
};



function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}


/*TO-DO*/
function updateAnswer (quest_id , ans_id){
    $http = angular.injector(["ng"]).get("$http");
    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/updateAnswer',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'user_id='+getUserID()+'&task_id='+getTaskID() + '&quest_id=' + quest_id + '&ans_id=' + ans_id
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

textrategiaApp.controller("autodidactController",function($scope,$http,$location){
    $scope.getUserName = getUserName();
    
    // ####################################################
    // get skills list from server
    // ####################################################

    // $scope.skills = [
    // {"q_skill": "בלימפים"},
    // {"q_skill": "דוליז"},
    // {"q_skill": "בובים"}
    // ];


    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/getAllSkills',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: ''
    };

    $http(req)
        .success(function(data,status,headers,config){
            if (status==200) {
                $scope.skills = data;
            }
        }).error(function(data,status,headers,config){
            $scope.skills =[];
    });


    $scope.selectedMedia = [];              // Arg1
    $scope.checkdMediaSelected = function (checkStatus,element){
        if(checkStatus)        {
            $scope.selectedMedia.push(element);
        }
        else{
            const index = $scope.selectedMedia.indexOf(element);
            if (index !== -1){
               $scope.selectedMedia.splice(index, 1);
            }
        }
    };

    $scope.selectedDiff = [];           // Arg2
    $scope.checkDiffSelected = function (checkStatus,element){
        if(checkStatus){
            $scope.selectedDiff.push(element);
        }
        else{
            const index = $scope.selectedDiff.indexOf(element);
            if (index !== -1){
               $scope.selectedDiff.splice(index, 1);
            }
        }
    };

    
    $scope.selectedSkill = [];          // Arg3
    $scope.checkSkillSelected = function (checkStatus,element){
        if(checkStatus){
            $scope.selectedSkill.push(element);
        }
        else{
            const index = $scope.selectedSkill.indexOf(element);
            if (index !== -1){
               $scope.selectedSkill.splice(index, 1);
            }
        }
    };


    $scope.goToTasks = function () {
        $location.path('tasks');
    };

    $scope.generateTask = function(){
        // alert("selectedMedia: " + $scope.selectedMedia +
        //     " | selectedDiff: " + $scope.selectedDiff +
        //     " | selectedSkill: " + $scope.selectedSkill
        //     );

        $scope.feedback = "";
        $scope.generate_task= false;

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/generateRandTask',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'media_types='+$scope.selectedMedia
                    +'&skills='+$scope.selectedSkill
                    +'&rand_num= 5'
                    +'&difficulties='+$scope.selectedDiff
                    +'&student_id='+getUserID()
        };

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                // if (status==200){
                    //go to task
                    // $location.path('tasks');
                    $scope.feedback = "המטלה נוספה בהצלחה";
                    $scope.generate_task =true;
//                }
            }).error(function(data,status,headers,config){
                if (status==415){
                    $scope.feedback = "אין מספיק שאלות. נסה להוסיף התמקצעויות נוספות";
                    // alert("אין מספיק שאלות מתאימות. אנא הרחב את הבחירה.");
                }
                else{
                    // alert("בעיה ביצירת מטלה");
                    $scope.feedback = "שגיאה ביצירת מטלה";
                }
        });
    };


    // ####################################################
    // send the list: selectedMedia, selectedDiff, selectedSkill 
    //  get task and go to task page
    // ####################################################


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

    $scope.navigateToOneQuestion = function(t_id,t_name){
        setTaskID(t_id);
        setTaskName(t_name);
        $location.path('one_question');
    };

});
//    $http = angular.injector(["ng"]).get("$http");


textrategiaApp.controller("oneQuestionController", function($scope,$http,$location ,$sce){

    $scope.numberOfQuestions = 0;
    $scope.triedOnce = false;
    $scope.sendFeedbackMode = false;
    $scope.lastQuestionReported = "blimp";
    $scope.isMultipleAnswers = true;

    $scope.finishTask = function () {
        $location.path('tasks');

    };

    $scope.oneMoreTry = function(){
        $scope.triedOnce = true;
        $scope.start();
    }

    $scope.selectedAnswers = [];          // Arg3

    $scope.checkSelectedAnswers= function (checkStatus,element){
        if(checkStatus ){
            if ($scope.selectedAnswers.indexOf(element) == -1 ){
                $scope.selectedAnswers.push(element);
            }
        }
        else{
            const index = $scope.selectedAnswers.indexOf(element);
            if (index !== -1){
                $scope.selectedAnswers.splice(index, 1);
            }
        }
        // alert("checkStatus: " + checkStatus);
        // alert("element: " + element);
        // alert("$scope.selectedAnswers: " + $scope.selectedAnswers);

    };

    $scope.start = function(){
        $scope.selectedAnswers = [];
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
                $scope.isMultipleAnswers = data.question.isMultipuleAns;

                $scope.showText= false;
                $scope.showImg= false;
                $scope.showVoice = false;
                $scope.showVideo = false;

                $scope.task_name = getTaskName();  // change to task name
                $scope.task_id = getTaskID();                    //change to task is
                $scope.Q_skill = myJason.question.Q_skill;
                $scope.id = 0;
                $scope.quizOver = false;
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
                    $scope.imgURL = "views/" +data.question.Q_media ;
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
        // alert("$scope.options : " + $scope.options );
        $scope.options_id =  answers_lst.ans_id_lst;
        // $scope.answer = get_correct_answer_index(myJason.answers);

        // alert(JSON.stringify(myJason.question.isMultipuleAns));
        // alert(JSON.stringify(myJason.question));
        if(myJason.question.isMultipuleAns == 0){
            // alert("is not multi");
            $scope.answer = get_correct_answer_index(myJason.answers);
            // alert($scope.answer);
        }
        else {
            // alert("is multi");
            $scope.answers = get_correct_answer_multi_index(myJason.answers); /*Those are the right answers (thier index)*/
            // alert("get_correct_answer_multi_index: " + $scope.answers);
        }


        $scope.answerMode = true;
        $scope.questionID = myJason.question.Q_id;
        $scope.correctFB = myJason.question.Q_correctFB;
        $scope.wrongFB = myJason.question.Q_notCorrectFB;
    };


    //This is function for submit
    $scope.checkAnswer = function(){
        if ($scope.isMultipleAnswers){
            // alert("ismULTI");

            var ans  = $scope.selectedAnswers; /*ans = all index of selected ans id*/
            // alert("selected ans id: " + ans);
            // var ans_id = get_answer_multi_index($scope.options, $scope.options_id, ans); /*ans_id = all selected ans id (by user)*/
            var ans_id = get_answer_multi_index($scope.options, $scope.options_id, ans); /*ans_id = all selected ans id (by user)*/
            var index = ans_id.index;
            var index_id = ans_id.index_id;

            // alert("index_id : " + index_id);
            // alert("index:" + index);
            // alert("ans: " + ans);
            // alert("get_correct_answer_multi_index: " + $scope.answers);
            // alert(JSON.stringify($scope.answers.sort()));
            // alert(JSON.stringify(index.sort()));
            var lala = JSON.stringify(index.sort())==JSON.stringify($scope.answers.sort());
            updateAnswer($scope.questionID, index_id);

            if (lala) {
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

        }
        else {
            // alert("ISnOT");
            var ans = $('input[name=answer]:checked').val();
            // var ans = $scope.selected_singleAns;
            // alert("$scope.selected_singleAns:" + $scope.selected_singleAns);
            var ans_id = get_answer_index($scope.options, $scope.options_id, ans);
            updateAnswer($scope.questionID, ans_id);
            if (ans == $scope.options[$scope.answer]) {
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
        }

    };

    $scope.nextQuestion = function(quest_id){
        $scope.triedOnce = false;
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/questionDone',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'user_id=' + getUserID() +'&task_id='+getTaskID() + '&quest_id=' + $scope.questionID
        };

        $http(req)
            .success(function(data,status,headers,config){
                $scope.start();
            })
            .error(function(data,status,headers,config) {

                // $scope.start();
            });
    };


    $scope.wanaReport = function(){

        $scope.sendFeedbackMode = true;
        $scope.feedback = "האם ברצונך לדווח על שאלה זו כבעיתית?"


    };


    $scope.report_offensive = function () {
        $scope.report(0,0,1);
    };

    $scope.report_question = function () {
        $scope.report(1,0,0);
    };

    $scope.report_answer= function () {
        $scope.report(0,1,0);
    };

    $scope.report = function (r_question,r_answer,r_offensive) {
        if ( $scope.questionID== $scope.lastQuestionReported ){
            //// DONT REPORT
        } else {
            //########################## SEND REPORT HERE ##########################
            var req = {
                method: 'POST',
                cache: false,
                url: _url +'/reportQuestion',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'q_id=' + $scope.questionID +'&report_answer='+r_answer+ '&report_offensive=' + r_offensive
                + '&report_question=' + r_question
            };

            $http(req)
                .success(function(data,status,headers,config){
                })
                .error(function(data,status,headers,config) {
                });
        }

        $scope.lastQuestionReported = $scope.questionID;
        $scope.sendFeedbackMode = false;
    };




    $scope.reportQuestion = function(q){
        alert("q?: " + q + "scope: " + $scope.lastQuestionReported);
        if ( q == $scope.lastQuestionReported ){
            //// DONT REPORT
        } else {
            //########################## SEND REPORT HERE ##########################
            //alert("report send.");
        }

        $scope.lastQuestionReported = q;
        $scope.sendFeedbackMode = false;
    };

    $scope.dontReportQuestion = function(){

        $scope.feedback = "";
        $scope.sendFeedbackMode = false;

    };


    $scope.reset();

});
