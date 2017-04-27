var _url = "http://localhost:8081";
//var _url = "http://textrategia.com";


//* TEACHER CONTROLLERS*//

// ########################### GENERAL CONTROLLERS ###########################//


textrategiaApp.controller("RegisterController",function($scope,$http ,$location){

    $scope.doneRegister = false;
    $scope.checkedCode = false ;            // init to false
    $scope.userCode = "";                   // must be kept as global

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip()  ;
    });

    $scope.goToLogin = function () {
        $location.path('login');
    };

    // validate user code with server, and set feedback
    $scope.checkUserCode  = function(){

        var badFeedback = "הקוד לא תקין, אנא פנה לרכז טקסטרטגיה";
        var goodFeedback = "הקוד נקלט, הנך מוזמן להמשיך בתהליך הרישום";


        $scope.userCode  = $scope.user.userCode;
        setGroupCode($scope.userCode);
        // alert($scope.userCode);

        // ################################################
        // ######### send userCode to server here ######### 
        // ################################################

        $scope.isUserTeacher = false; // this get set by server response
        
        // if 200 then good feedback + change flag.
        $scope.serverFeedback = goodFeedback;
        $scope.checkedCode = true; // flag, change after server 'OK' response only.        
        
        // else bad feedback + DONT CHANGE FLAG
        // $scope.serverFeedback = badFeedback;
    }


    // send information to server + $scope.userCode must be also sent.
    $scope.registerUser = function(){
        $scope.registerMod = true;

        var userFirstName = $scope.user.userFirstName;
        var userLastName = $scope.user.userLastName;
        var userEmail1 = $scope.user.userEmail1;
        var userPassword1 = $scope.user.userPassword1;
        var userIdNumber = $scope.user.userIdNumber;

        var userEmail2 = $scope.user.userEmail2;
        var userPassword2 = $scope.user.userPassword2;

        // temporry, will pretty it up later.
        if (userEmail1 != userEmail2){
        $scope.serverFeedback = "email must be the same!";
        }
        
        // temporry, will pretty it up later.
        if (userPassword1 != userPassword2){
        $scope.serverFeedback = "password must be the same";
        }

        if (userEmail1 == userEmail2 && userPassword1 == userPassword2 ){
            //contact server
            var req = {
                method: 'POST',
                cache: false,
                url: _url +'/registerUser',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'personal_id='+ userIdNumber +'&group_code='+getGroupCode()
                + '&last_name=' + userLastName + '&first_name=' + userFirstName +
                '&user_type=' + '2' + '&email=' + userEmail1 + '&password=' + userPassword1
            };


            $http(req)
                .success(function(data,status,headers,config){
                    $scope.serverFeedback = "הרישום התבצע בהצלחה!"
                    $scope.doneRegister = true;
                }).error(function(data,status,headers,config){
                    if (status==401){
                        $scope.serverFeedback = "כתובת מייל כבר קיימת במערכת";
                    }
                    else {
                        $scope.serverFeedback = "שגיאה ברישום";
                    }
            });
        }


    }

});


// ########################### TEACHER CONTROLLERS ###########################//

textrategiaApp.controller("TeacherController",function($scope, $http,$location){
    $scope.teacherName = getUserName();

});



textrategiaApp.controller("CreateQuestionController",function($scope,$location,$http){
    $scope.teacherName = getUserName();
    $scope.insertPossibleAnswersMode = false;
    $scope.doneRegisterQuestion = false;

    $scope.goToTeacher = function () {
        $location.path('teacher');
    };

    $scope.editQuestionMode = function(){
        $scope.insertPossibleAnswersMode = false;
    }


    $scope.possibleAnswersMode = function(){
        $scope.insertPossibleAnswersMode = true;

    }



    $scope.sendNewQuestion = function (){
        // question_title is argument 1
        var question_title = $scope.question.question_title;

        // (IS MULTIPLE ANS QUESTION) opt1.value is argument 2
        var is_multiple;
        var sel1 = document.getElementById("is_multiple_ans");
        for (i = 0 ; i < sel1.options.length ; i++){
            is_multiple = sel1.options[i];
            if (is_multiple.selected == true){
                // alert(is_multiple.value);              // 1 means yes, 0 means no
                break;
            }
        }
        
        // (MEDIA TYPE) opt2.value is argument 3  
        var media_type;
        var sel2 = document.getElementById("media_type");
        for (i = 0 ; i < sel2.options.length ; i++){
            media_type = sel2.options[i];
            if (media_type.selected == true){
                // alert(media_type.value);              // 0 is no media.... @SHAKED - CHANGE AS YOU WISH
                break;
            }
        }

        var quest_difficulty;
        var sel_quest_difficulty = document.getElementById("quest_difficulty");
        for (i = 0 ; i < sel_quest_difficulty.options.length ; i++){
            quest_difficulty = sel_quest_difficulty.options[i];
            if (media_type.selected == true){
                // alert(quest_difficulty.value);              // 0 is no media.... @SHAKED - CHANGE AS YOU WISH
                break;
            }
        }


        // arguments 4 - 8
        var question_media = $scope.question.question_media;
        var quest_correct_fb = $scope.question.quest_correct_fb;
        var quest_incorrect_fb = $scope.question.quest_incorrect_fb;
        var quest_skill = $scope.question.quest_skill
        // var quest_difficulty = $scope.question.quest_difficulty


        // the information: 
        // quest_proffesion /// quest_is_approved //// who_created /// quest_disabled
        // is not user inserted



        // get possible answers infomation!
        var possible_ans_1 = $scope.question.possible_ans_1;
        var possible_ans_2 = $scope.question.possible_ans_2;
        var possible_ans_3 = $scope.question.possible_ans_3;
        var possible_ans_4 = $scope.question.possible_ans_4;

        // (CORRECT ANS) opt3.value is argument   
        var opt3;
        var sel3 = document.getElementById("correct_ans");
        for (i = 0 ; i < sel3.options.length ; i++){
            opt3 = sel3.options[i];
            if (opt3.selected == true){
                // alert(opt3.value);              // 0 is ans1 , 1 is ans2 ...
                break;
            }
        }

        // alert("title: " + question_title + " op1: " + opt1.value + " op2: " + opt2.value + " question_media :" + question_media);
        // alert("y: " + quest_correct_fb + " n: " + quest_incorrect_fb + " skill: " + quest_skill +" diff: " + quest_difficulty);
        // alert("1: " + possible_ans_1 + " 2: " + possible_ans_2 + " 3: " +  possible_ans_3 + " 4: " + possible_ans_4)

        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################


        // change server feedback acording to succuss or failure!


        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addQuestion',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'question_title='+ question_title
            +'&is_multiple_ans='+ is_multiple.value
            + '&question_media_type=' + media_type.value
            + '&question_media=' + question_media
            + '&quest_correct_fb=' + quest_correct_fb
            +'&quest_incorrect_fb=' + quest_incorrect_fb
            +'&quest_skill=' +  quest_skill
            + '&quest_difficulty=' +   quest_difficulty.value
            + '&quest_proffesion=' + 'הבעה'
            + '&quest_is_approved=' + '1'
            + '&quest_disabled=' + '0'
            + '&who_created=' + '1'
        };

        alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                $scope.serverFeedback = "השאלה נשלחה בהצלחה!"
                $scope.doneRegisterQuestion = true;
            }).error(function(data,status,headers,config){
                $scope.serverFeedback = "שגיאה בהכנסת שאלה";

        });



        // $scope.serverFeedback = "השאלה נשלחה בהצלחה!"




    }

});




textrategiaApp.controller("CreateGroupController",function($scope){
    $scope.teacherName = getUserName();

    // Only 2 arguments. name & is_master_group
    $scope.createGroup = function (){
        
        // groupName is argument 1
        var groupName = $scope.group.groupName;


        // opt1.value is argument 2
        var opt1;
        var sel1 = document.getElementById("group_master");
        for (i = 0 ; i < sel1.options.length ; i++){
            opt1 = sel1.options[i];
            if (opt1.selected == true){
                //alert(opt1.value);              // 1 means yes, 0 means no
                break;
            }
        }



        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################



        // change server feedback acording to succuss or failure!
        $scope.serverFeedback = "הקבוצה נוצר בהצלחה, קוד הקבוצה הוא: "
        $scope.output_groupCode = "1234"; // this will be provided to the user, so he will know the code.
    }

});



textrategiaApp.controller("GroupManagementController",function($scope,$http,$location){
    $scope.teacherName = getUserName();
    // $scope.info = empty;
    $scope.doneSendTask =false;
    $scope.messageSent = false; // set Error flag
    $scope.serverFeedback = "אופס... אין תשובה מהשרת.";

    $scope.goToTeacher = function () {
        $location.path('teacher');
    };

    // $scope.info = groups_and_tasks_mock;
    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/getGroupByUser',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'teacher_id='+getUserID()
    };


    $http(req)
        .success(function(data,status,headers,config){
            $scope.info = data;
        }).error(function(data,status,headers,config){
    });


    // these function alert the choise the user made.
    // $scope.sendTaskToGroup = function(){
    //     //get group selection
    //
    //     var sel1 = document.getElementById("available_group");
    //
    //     var opt1;
    //     for (i = 0 ; i < sel1.options.length ; i++){
    //         opt1 = sel1.options[i];
    //         if (opt1.selected == true){
    //              alert(opt1.value);              // this is GroupID
    //             break;
    //         }
    //     }
    //     //get tasks selection
    //     var sel2 = document.getElementById("available_task");
    //
    //     var opt2;
    //     for (i = 0 ; i < sel2.options.length ; i++){
    //         opt2 = sel2.options[i];
    //         if (opt2.selected == true){
    //              alert(opt2.value);              // this is T_id
    //             break;
    //         }
    //     }
    //
    //
    // }


    $scope.sendTaskToGroup = function(){
        //get group and task selection

        var groups = document.getElementById("available_group");
        var tasks = document.getElementById("available_task");
        var group;
        var task;

        for (i = 0 ; i < groups.options.length ; i++){
            group = groups.options[i];
            if (group.selected == true){
                for (j = 0 ; j < tasks.options.length ; j++){
                    task = tasks.options[j];
                    if (task.selected == true){
                        break;
                    }
                }
                break;
            }
        }

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addTaskToGroup',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_id='+group.value + '&task_id=' + task.value
        };

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                $scope.serverFeedback = "המטלה נשלחה בהצלחה"
                $scope.doneSendTask = true;
            }).error(function(data,status,headers,config){
            $scope.serverFeedback = "שגיאה בשליחת המטלה"

        });

        // alert("group" + group.value  + "\n task:"  + task.value);              // this is T_id

    }







    $scope.sendTaskToGroup = function(){
        //get group and task selection

        var groups = document.getElementById("available_group");
        var tasks = document.getElementById("available_task");
        var group;
        var task;

        for (i = 0 ; i < groups.options.length ; i++){
            group = groups.options[i];
            if (group.selected == true){
                for (j = 0 ; j < tasks.options.length ; j++){
                    task = tasks.options[j];
                    if (task.selected == true){
                        break;
                    }
                }
                break;
            }
        }

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addTaskToGroup',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_id='+group.value + '&task_id=' + task.value
        };

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                $scope.serverFeedback = "המטלה נשלחה בהצלחה"
                $scope.doneSendTask = true;
            }).error(function(data,status,headers,config){
                $scope.serverFeedback = "שגיאה בשליחת המטלה"

        });

        // alert("group" + group.value  + "\n task:"  + task.value);              // this is T_id

    }

});

//  #################################################################################




//* ########################### STUDENTS CONTROLLERS ########################### *//

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


    $scope.finishTask = function () {
        $location.path('tasks');

    };

    $scope.oneMoreTry = function(){
        $scope.triedOnce = true;
        $scope.start();
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
            if (data[0].UserType == "1"){
                // alert("go teacher!");
                $location.path('teacher');
            }
            else if (data[0].UserType == "2") {
                // alert("go student!");
                $location.path('student');
            }

        }).error(function(data,status,headers,config){
            $scope.showError = true;
            $scope.showSuccess = false;

        });


    }


});