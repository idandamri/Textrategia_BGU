/**
 * Created by krigel on 5/9/2017.
 */

textrategiaApp.controller("TeacherController",function($scope, $http,$location){
    $scope.teacherName = getUserName();

});


textrategiaApp.controller("StatisticsTeacherController",function($scope, $http,$location){
    $scope.teacherName = getUserName();
    $scope.chooseGroupMod = true;


   var req = {
        method: 'POST',
        cache: false,
        url: _url +'/getAllGroupForTeacher',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'user_id='+getUserID()
    };

    $http(req)
        .success(function(data,status,headers,config){
            $scope.allGroups= data;
        }).error(function(data,status,headers,config){
    });


    $scope.showGroupsMembersList = function(g_id){

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getStudentListFromGroupId',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_id='+ g_id
        };

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.studentsForStatistics = data;
                    $scope.chooseGroupMod = false;
                }
                else if (status==204){
                    $scope.studentsForStatistics = [];
                    $scope.serverFeedback = "אין תלמידים בקבוצה";
                }
            }).error(function(data,status,headers,config){
                $scope.studentsForStatistics = [];
        });
      }

 $scope.getStatisticForStudent= function (s_id, index) {

        // alert(s_id);

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getStudentStatistics',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 's_id=' + s_id
        };

        $http(req)
            .success(function(data,status,headers,config){
                $scope.studentsForStatistics[index].statistics = data;
                 $scope.studentsForStatistics[index].gotStats = true;
                // alert(data);

            })
            .error(function(data,status,headers,config) {
                $scope.studentsForStatistics[index].Q_skill =  "";
                $scope.studentsForStatistics[index].totalAnsForSkill = "";
                $scope.studentsForStatistics[index].correctAnsForSkill = "";
                $scope.studentsForStatistics[index].gotStats = false;
            });

    };




});



textrategiaApp.controller("CreateQuestionController",function($scope,$location,$http){
    $scope.teacherName = getUserName();
    $scope.insertPossibleAnswersMode = false;
    $scope.doneRegisterQuestion = false;
    $scope.enter_new_skill_mode = false;
    $scope.isImg= false;
    $scope.isMultipleAns= false;


    $scope.changeMultiple= function () {
        type = $scope.question.is_multiple_ans;
        /*one question only*/
        if (type ==0){
            $scope.isMultipleAns= false;
        }
        else {
            $scope.isMultipleAns= true;
        }
    }

    $scope.changeMediaType = function () {
        type = $scope.question.question_media_type;
        /*teache group*/
        if (type =="img"){
            $scope.isImg= true;
        }
        else {
            $scope.isImg= false;
        }
    }

    var imgUrl="";
    $scope.uploadFile = function(){

        var file = $scope.myFile;
        var uploadUrl = "/multer";
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data,status,headers,config){
                // alert("data:" +   data);
                // alert("data to string:" + data.toString());

                imgUrl = "img/" + data ;
                alert("קובץ עלה בהצלחה!");
            })
            .error(function(){
                // alert("error!!");
            });
    };

    $scope.new_skill_mode = function(){
        if ($scope.question.selected_skill == "enter_new_skill"){
            $scope.enter_new_skill_mode = true;            
        } else {
        $scope.enter_new_skill_mode = false;
        }
    };

    
    if (getUserType()==2){
        $scope.isAdmin = true;
    } else {
        $scope.isAdmin = false; 
    }

    $scope.goToTeacher = function () {
        $location.path('teacher');
    };

    $scope.editQuestionMode = function(){
        $scope.insertPossibleAnswersMode = false;
    }

    $scope.possibleAnswersMode = function(){

        if (media_type.value=="img" && (imgUrl=="" ||imgUrl==null)){
            alert("אל תשכח להעלות את התמונה - לחץ על כפתור upload")
        }
        else if (media_type.value=="img" && ($scope.question.question_media=="" || $scope.question.question_media==null)){
            alert("יכול להיות ששכחת להוסיף מדיה?")
        }
        else {
            alert($scope.question.question_media);
            $scope.insertPossibleAnswersMode = true;
        }
    }

    // $scope.mock_skills = [
    // {"Q_skill": "בלימפים"},
    // {"Q_skill": "דוליז"},
    // {"Q_skill": "בובים"}
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


        $scope.checkCorrectAnsLst = [];              // Arg1
        $scope.checkCorrectAns = function (checkStatus,element){
            if(checkStatus)        {
                $scope.checkCorrectAnsLst.push(element);
            }
            else{
                const index = $scope.checkCorrectAnsLst.indexOf(element);
                if (index !== -1){
                   $scope.checkCorrectAnsLst.splice(index, 1);
                }
            }
        };

    $scope.sendNewQuestion = function (){
        // question_title is argument 1
        var question_title = $scope.question.question_title;

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

        var quest_difficulty = $scope.question.quest_difficulty;

        // arguments 4 - 8

        var question_media;
        if (media_type.value=="img"){
            question_media = imgUrl;
            // alert("question_media = imgURL: " + question_media);
        }
        else if(media_type.value=="youtube"){
            question_media = $scope.question.question_media.split('=')[1];
        }
        else {
            question_media = $scope.question.question_media;
        }


        var quest_correct_fb = $scope.question.quest_correct_fb;
        var quest_incorrect_fb = $scope.question.quest_incorrect_fb;

        var quest_skill = $scope.question.selected_skill;


        // the information:
        // quest_proffesion /// quest_is_approved //// who_created /// quest_disabled
        // is not user inserted

        // get possible answers infomation!
        var possible_ans_1 = $scope.question.possible_ans_1;
        var possible_ans_2 = $scope.question.possible_ans_2;
        var possible_ans_3 = $scope.question.possible_ans_3;
        var possible_ans_4 = $scope.question.possible_ans_4;



        // (IS MULTPLE QUESTION?) opt3.value is argument
        var opt3;
        var sel3 = document.getElementById("is_multiple_ans");
        for (i = 0 ; i < sel3.options.length ; i++){
            opt3 = sel3.options[i];
            if (opt3.selected == true){
                // alert(opt3.value);              // 0 is ans1 , 1 is ans2 ...
                break;
            }
        }



        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################


        // change server feedback acording to succuss or failure!

        /*set quest_is_approved */
        var is_approved;
        if (getUserType() == 2)
            is_approved=1;
        else
            is_approved=0;

        alert("isMultipleAns:" + $scope.isMultipleAns);
        var correctAnswer;
        if (! $scope.isMultipleAns){
            alert("!");
            correctAnswer = $scope.selected_ans;
            // alert(correctAnswer);
        }
        else{
            correctAnswer = $scope.checkCorrectAnsLst;
            // alert(correctAnswer);
        }

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addQuestion',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'question_title='+ question_title
            +'&is_multiple_ans='+ opt3.value
            + '&question_media_type=' + media_type.value
            + '&question_media=' + question_media
            + '&quest_correct_fb=' + quest_correct_fb
            +'&quest_incorrect_fb=' + quest_incorrect_fb
            +'&quest_skill=' +  quest_skill
            + '&quest_difficulty=' +   quest_difficulty
            + '&quest_proffesion=' + 'הבעה'
            + '&quest_is_approved=' + is_approved
            + '&quest_disabled=' + '0'
            + '&who_created=' + getUserID()
            + '&answer1=' + possible_ans_1
            + '&answer2=' + possible_ans_2
            + '&answer3=' + possible_ans_3
            + '&answer4=' + possible_ans_4
            + '&correctAnswerIndex=' + correctAnswer
        };

        //alert(JSON.stringify(req));

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


textrategiaApp.controller("GroupManagementController",function($scope,$http,$location){

    $().button('toggle')
    
    $scope.teacherName = getUserName();

    $scope.doneSendTask =false;         // different model button in case of server error
    $scope.serverFeedback = "אופס... אין תשובה מהשרת.";
    $scope.askForUserPassword = false;

    var groups = document.getElementById("available_group");
    var tasks = document.getElementById("available_task");

    $scope.send_task_mod = false;  // else group managment mode
    $scope.send_task_for_some_student_mod = false;

    $scope.sendTaskMode = function (){
        $scope.send_task_mod = true;
    }
    $scope.sendTaskForSomeStudentMod = function (){
        $scope.send_task_for_some_student_mod = true;
    }

    $scope.groupManagmentMode = function (){
        $scope.send_task_mod = false;
        $scope.send_task_for_some_student_mod = false;
    }

    // ~~~~~~ group managment mode ~~~~~~



    // ~~~~~ send task mode ~~~~~~~~

    $scope.getAllGroupForTask= function () {
        $scope.studentToSendTaskToList = [];
        task_id = $scope.selected_task;
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getAllGroupForTask',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'task_id='+task_id + '&teacher_id='+getUserID()
        };

        $http(req)
            .success(function(data,status,headers,config){
                $scope.groups = data;
            }).error(function(data,status,headers,config){
        });
    };

    $scope.choise = $scope.color;

    $scope.changeTaskType= function (param) {
        var choiseButton0 = document.getElementById("choiseButton0");
        var choiseButton1 = document.getElementById("choiseButton1");
        var choiseButton2 = document.getElementById("choiseButton2");
        var choiseButton3 = document.getElementById("choiseButton3");


        if (param==0){
            $scope.allTasks =$scope.allApprovedTasks;
             choiseButton0.style.backgroundColor  =  "#269ABC";
             choiseButton1.style.backgroundColor  = "#5bc0de";
             choiseButton2.style.backgroundColor  =  "#269ABC";
             choiseButton3.style.backgroundColor  = "#5bc0de";
        }
        else {
            $scope.allTasks =$scope.myTasks;
            choiseButton0.style.backgroundColor  =  "#5bc0de";
            choiseButton1.style.backgroundColor  = "#269ABC";
            choiseButton2.style.backgroundColor  =  "#5bc0de";
            choiseButton3.style.backgroundColor  = "#269ABC";
        }
    };


    $scope.goToTeacher = function () {
        $location.path('teacher');
    };

    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/getAllApprovedTasks',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    $http(req)
        .success(function(data,status,headers,config){
            $scope.allTasks = data;
            $scope.allApprovedTasks= data;
        }).error(function(data,status,headers,config){
    });

    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/getMyTasks',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'user_id='+getUserID()
    };

    $http(req)
        .success(function(data,status,headers,config){
            $scope.myTasks = data;
        }).error(function(data,status,headers,config){
    });

    var req = {
        method: 'POST',
        cache: false,
        url: _url +'/getAllGroupForTeacher',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'user_id='+getUserID()
    };

    $http(req)
        .success(function(data,status,headers,config){
            $scope.allGroups= data;
        }).error(function(data,status,headers,config){
    });






    $scope.sendTaskToGroup = function(){
        var group = selected_group;
        var task = selected_task;
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addTaskToGroup',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_id='+group + '&task_id=' + task
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


//~~~~~~~~~~~~~~~~~~ send_task_for_some_student_mod ~~~~~~~~~~~~~~~~~~~~~~~


$scope.studentToSendTaskToList = [];


    $scope.deleteThisStudent = function (element){
        const index = $scope.studentToSendTaskToList.indexOf(element);
        if (index !== -1)
        {
           $scope.studentToSendTaskToList.splice(index, 1);
        }
    };

    $scope.addThisStudent = function (element){
        const index = $scope.studentToSendTaskToList.indexOf(element);
                if (index == -1)
                {
                   $scope.studentToSendTaskToList.push(element);
                }
        };



    $scope.showGroupsMembersList = function(g_id){

 var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getStudentListFromGroupId',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_id='+g_id
        };

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.groupsStudentLst = data;
                }
                else if (status==204){
                    $scope.groupsStudentLst = [];
                    alert("אין ילדים בקבוצה");
                    $scope.serverFeedback = "אין ילדים בקבוצה";
                }
            }).error(function(data,status,headers,config){
                $scope.groupsStudentLst = [];
                alert("אין ילדים בקבוצה");

        });



    }
 $scope.showGroupsMembersList2 = function(g_id){
    var selected_task2 = $scope.selected_task2;
 var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getStudentsMissingTaskInGroup',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_id='+g_id + '&t_id=' + selected_task2
        };


        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.groupsStudentLst2 = data;
                }
                else if (status==204){
                    $scope.groupsStudentLst2 = [];
                    alert("אין ילדים בקבוצה");
                    $scope.serverFeedback = "אין ילדים בקבוצה";
                }
            }).error(function(data,status,headers,config){
                $scope.groupsStudentLst2 = [];
                alert("אין ילדים בקבוצה");

        });



    }




    $scope.sendTaskForSomeStudent = function(){

        var studentIDlst = [];
        var selected_task2 = $scope.selected_task2;


        for (i=0 ; i< $scope.studentToSendTaskToList.length ; i++){
            studentIDlst.push($scope.studentToSendTaskToList[i].PersonalID);
        }

        $scope.serverFeedback = "didnot finish just yet.....";

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/sendTaskToStudents',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'students=['+ studentIDlst + ']&task_id=' + selected_task2
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


    $scope.showStudnetPassword = function(stud){
        $scope.askForUserPassword = true;
        $scope.serverFeedback = "הזן את ססימתך האישית, על מנת לקבל קישה לסיסמת התלמיד"
        $scope.studentObject = stud;
        $scope.showPassword = false;

    }

    $scope.askPremession = function(){

    // ask server here
    var userPass = $scope.pass.superPassword;
    var userId = getUserID();

    var req = {
            method: 'POST',
            cache: false,
            url: _url +'/checkIfpassIsCorrectByID',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'personal_id='+userId + '&password=' + userPass
        };

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                $scope.showPassword = true;
                $scope.serverFeedback = "סיסמת התלמיד/ה "+ $scope.studentObject.FirstName +  " היא: "
                }  else if (status==204){
                    $scope.showPassword = false;
                     $scope.serverFeedback = "הסיסמא ששלחת אינה סיסמתך"
                    }
            }).error(function(data,status,headers,config){
            $scope.serverFeedback = "שגיאת שרת"

        });


    $scope.askForUserPassword = false;
    }


});

//  #################################################################################




var cities =
    {
        "cities": [
            "אבטליון",
            "אביאל",
            "אביבים",
            "אביגדור",
            "אביחיל",
            "אביטל",
            "אביעזר",
            "אבירים",
            "אבן יהודה",
            "אבן יצחק",
            "אבן מנחם",
            "אבן ספיר",
            "אבן שמואל",
            "אבני איתן",
            "אבני חפץ",
            "אדירים",
            "אדמית",
            "אדרת",
            "אודים",
            "אודם",
            "אוהד",
            "אומץ",
            "אופקים",
            "אור הגנוז",
            "אור הנר",
            "אור יהודה",
            "אור עקיבא",
            "אורה",
            "אורות",
            "אורטל",
            "אורים",
            "אורנית",
            "אושרת",
            "אזור",
            "אחווה",
            "אחוזם",
            "אחיהוד",
            "אחיטוב",
            "אחיסמך",
            "אחיעזר",
            "אייל",
            "איילת השחר",
            "אילון",
            "אילות",
            "אילניה",
            "אילת",
            "איתמר",
            "איתן",
            "איתנים",
            "אלומה",
            "אלומות",
            "אלון",
            "אלון הגליל",
            "אלון מורה",
            "אלון שבות",
            "אלוני אבא",
            "אלוני הבשן",
            "אלוני יצחק",
            "אלונים",
            "אילי סיני",
            "אליעד",
            "אליכין",
            "אליפז",
            "אליפלט",
            "אליקים",
            "אלישיב",
            "אלישמע",
            "אלמגור",
            "אלמוג",
            "אלעזר",
            "אלפי מנשה",
            "אלקוש",
            "אלקנה",
            "אלרום",
            "אמונים",
            "אמירים",
            "אמנון",
            "אמציה",
            "אניעם",
            "אפיק",
            "אפק",
            "אפרת",
            "ארבל",
            "ארגמן",
            "ארז",
            "אריאל",
            "אשבול",
            "אשדוד",
            "אשדות יעקב",
            "אשחר",
            "אשכולות",
            "אשלים",
            "אשקלון",
            "אשתאול",
            "באר טוביה",
            "באר יעקב",
            "באר שבע",
            "בארות יצחק",
            "בארותיים",
            "בארי",
            "בדולח",
            "בוסתן הגליל",
            "בורגתה",
            "בחן",
            "ביצרון",
            "בית אורן",
            "בית אל",
            "בית אלעזרי",
            "בית אלפא",
            "בית אריה",
            "בית ברל",
            "בית גוברין",
            "בית גמליאל",
            "בית ג'ן",
            "בית דגן",
            "בית הגדי",
            "בית הילל",
            "בית הלוי",
            "בית העמק",
            "בית הערבה",
            "בית השיטה",
            "בית זית",
            "בית זרע",
            "בית חגי",
            "בית חורון",
            "בית חנן",
            "בית חנניה",
            "בית חרות",
            "בית חשמונאי",
            "בית יהושוע",
            "בית יוסף",
            "בית ינאי",
            "בית יצחק",
            "בית לחם הגלילית",
            "בית ליד",
            "בית מאיר",
            "בית מירסים",
            "בית נחמיה",
            "בית ניר",
            "בית נקופה",
            "בית עובד",
            "בית עוזיאל",
            "בית עזרא",
            "בית קמה",
            "בית קשת",
            "בית רבן",
            "בית רימון",
            "בית שאן",
            "בית שמש",
            "בית שערים",
            "בית שקמה",
            "ביתן אהרון",
            "ביתר",
            "בן זכאי",
            "בן עמי",
            "בן שמן",
            "בני ברק",
            "בני דרום",
            "בני דרור",
            "בני יהודה",
            "בני נעים",
            "בני עטרות",
            "בני עי ש",
            "בני עצמון",
            "בני ציון",
            "בני רא ם",
            "בניה",
            "בנימינה",
            "בסמת טבעון",
            "בצרה",
            "בצת",
            "בקוע",
            "בקעות",
            "בר גיורא",
            "בר יוחאי",
            "ברור חיל",
            "ברוש",
            "ברכה",
            "ברעם",
            "ברק",
            "ברקאי",
            "ברקן",
            "ברקת",
            "בת חפר",
            "בת ים",
            "בת עין",
            "בת שלמה",
            "גאולי תימן",
            "גאולים",
            "גבולות",
            "גבים",
            "גבע",
            "גבע בנימין",
            "גבע כרמל",
            "גבעולים",
            "גבעון החדשה",
            "גבעת אבני",
            "גבעת אלה",
            "גבעת ברנר",
            "גבעת השלושה",
            "גבעת זאב",
            "גבעת חיים",
            "גבעת ח ן",
            "גבעת יואב",
            "גבעת יערים",
            "גבעת ישעיהו",
            "גבעת נילי",
            "גבעת עדה",
            "גבעת עוז",
            "גבעת שמואל",
            "גבעת שפירא",
            "גבעתי",
            "גבעתיים",
            "גברעם",
            "גבת",
            "גדות",
            "גדיד",
            "גדיש",
            "גדעונה",
            "גדרה",
            "גונן",
            "גורן",
            "גורנות הגליל",
            "גזית",
            "גזר",
            "גיאה",
            "גיבתון",
            "גיזו",
            "גילגל",
            "גילון",
            "גילת",
            "גינוסר",
            "גינתון",
            "גיתה",
            "גיתית",
            "גלאון",
            "גליל ים",
            "גלעד",
            "גמזו",
            "גן אור",
            "גן הדרום",
            "גן השומרון",
            "גן חיים",
            "גן יאשיה",
            "גן יבנה",
            "גן נר",
            "גן שורק",
            "גן שלמה",
            "גן שמואל",
            "גנות",
            "גנות הדר",
            "גני הדר",
            "גני טל",
            "גני יהודה",
            "גני יוחנן",
            "גני תקווה",
            "גניגר",
            "גנים",
            "געש",
            "געתון",
            "גפן",
            "גרופית",
            "גשור",
            "גשר",
            "גשר הזיו",
            "גת",
            "דליאת א-כרמל",
            "דבורה",
            "דביר",
            "דגניה",
            "דובב",
            "דוברת",
            "דוגית",
            "דולב",
            "דור",
            "דורות",
            "דימונה",
            "דישון",
            "דליה",
            "דלתון",
            "דן",
            "דפנה",
            "דקל",
            "האון",
            "הבונים",
            "הגושרים",
            "הדר עם",
            "הוד השרון",
            "הודיה",
            "הודיות",
            "הושעיה",
            "הזורע",
            "הזורעים",
            "החותרים",
            "היוגב",
            "הילה",
            "המעפיל",
            "הנשיא",
            "הסוללים",
            "העוגן",
            "הר אדר",
            "הראל",
            "הרדוף",
            "הרצליה",
            "הררית",
            "ורד ירחו",
            "זוהר",
            "זימרת",
            "זיקים",
            "זיתן",
            "זיכרון יעקב",
            "זכריה",
            "זנוח",
            "זרועה",
            "זרזיר",
            "זרחיה",
            "זרעית",
            "חבצלת השרון",
            "חברון",
            "חגור",
            "חד נס",
            "חדרה",
            "חולדה",
            "חולון",
            "חולית",
            "חולתה",
            "חומש",
            "חוסן",
            "חופית",
            "חוקוק",
            "חורה",
            "חורפיש",
            "חורשים",
            "חזון",
            "חיבת ציון",
            "חיננית",
            "חיפה",
            "חלוץ",
            "חלמיש",
            "חלץ",
            "חמד",
            "חמדיה",
            "חמרה",
            "חניאל",
            "חניתה",
            "חנתון",
            "חספין",
            "חפץ חיים",
            "חפצי-בה",
            "חצב",
            "חצבה",
            "חצור אשדוד",
            "חצור הגלילית",
            "חצרות יסף",
            "חצרים",
            "חרב לאת",
            "חרוצים",
            "חרות",
            "חריש",
            "חרמש",
            "חרשים",
            "חשמונאים",
            "טבעון",
            "טבריה",
            "טירת יהודה",
            "טירת כרמל",
            "טירת צבי",
            "טל שחר",
            "טללים",
            "טלמון",
            "טנא",
            "טפחות",
            "יאנוח",
            "יבול",
            "יבנאל",
            "יבנה",
            "יגור",
            "יגל",
            "יד בנימין",
            "יד השמונה",
            "יד חנה",
            "יד מרדכי",
            "יד נתן",
            "יד רמבם",
            "ידידיה",
            "יהוד",
            "יהל",
            "יובל",
            "יובלים",
            "יודפת",
            "יוטבתה",
            "יונתן",
            "יוקנעם",
            "יושיביה",
            "יזרעאל",
            "יחיעם",
            "ייטב",
            "יינון",
            "יכיני",
            "ינוב",
            "יסוד המעלה",
            "יסודות",
            "יסעור",
            "יעד",
            "יעלון",
            "יעף",
            "יערה",
            "יערית",
            "יפו",
            "יפית",
            "יפעת",
            "יפתח",
            "יצהר",
            "יציץ",
            "יקום",
            "יקיר",
            "יראון",
            "ירדנה",
            "ירוחם",
            "ירושלים",
            "ירחיב",
            "ירכא",
            "ירקונה",
            "ישע",
            "ישעי",
            "ישרש",
            "יתד",
            "כברי",
            "כדים",
            "כוכב השחר",
            "כוכב יאיר",
            "כוכב יעקב",
            "כוכב מיכאל",
            "כורזים",
            "כחל",
            "כינרת",
            "כיסופים",
            "כלנית",
            "כנות",
            "כנף",
            "כפר אביב",
            "כפר אדומים",
            "כפר אוריה",
            "כפר אזר",
            "כפר אחים",
            "כפר ביאליק",
            "כפר בילו",
            "כפר בלום",
            "כפר בן נון",
            "כפר ברוך",
            "כפר גדעון",
            "כפר גלים",
            "כפר גליקסון",
            "כפר גילעדי",
            "כפר דניאל",
            "כפר דרום",
            "כפר החורש",
            "כפר המכבי",
            "כפר הנגיד",
            "כפר הנשיא",
            "כפר הס",
            "כפר הרואה",
            "כפר הריף",
            "כפר ויתקין",
            "כפר ורבורג",
            "כפר ורדים",
            "כפר זיתים",
            "כפר חבד",
            "כפר חיטים",
            "כפר חיים",
            "כפר חנניה",
            "כפר חסידים",
            "כפר חרוב",
            "כפר טרומן",
            "כפר יאסיף",
            "כפר יהושוע",
            "כפר יונה",
            "כפר יחזקאל",
            "כפר יעבץ",
            "כפר כנא",
            "כפר מונש",
            "כפר מימון",
            "כפר מלל",
            "כפר מנחם",
            "כפר מסריק",
            "כפר מרדכי",
            "כפר נטר",
            "כפר סבא",
            "כפר סולד",
            "כפר סילבר",
            "כפר סירקין",
            "כפר עזה",
            "כפר עציון",
            "כפר פינס",
            "כפר קדום",
            "כפר קיש",
            "כפר קרע",
            "כפר רופין",
            "כפר רות",
            "כפר שמאי",
            "כפר שמואל",
            "כפר שמריהו",
            "כפר תבור",
            "כפר תפוח",
            "כרכום",
            "כרכור",
            "כרם בן זמרה",
            "כרם מהרל",
            "כרם שלום",
            "כרמי יוסף",
            "כרמי צור",
            "כרמיאל",
            "כרמיה",
            "כרמים",
            "כרמל",
            "לבון",
            "לביא",
            "להב",
            "להבות הבשן",
            "להבות חביבה",
            "להבים",
            "לוד",
            "לוחמי הגטאות",
            "לוטם",
            "לוטן",
            "ליבנים",
            "לימן",
            "לכיש",
            "לפידות",
            "מאור",
            "מאיר שפיה",
            "מבוא ביתר",
            "מבוא דותן",
            "מבוא חורון",
            "מבוא חמה",
            "מבוא מודיעים",
            "מבועים",
            "מבטחים",
            "מבקיעים",
            "מבשרת ציון",
            "מגדים",
            "מגדל",
            "מגדל העמק",
            "מגדל עוז",
            "מגדלים",
            "מגידו",
            "מגל",
            "מגן",
            "מגן שאול",
            "מגשימים",
            "מדרך עוז",
            "מודיעין",
            "מולדת",
            "מוצא",
            "מורג",
            "מורן",
            "מורשת",
            "מזור",
            "מזכרת בתיה",
            "מזרע",
            "מזרעה",
            "מחולה",
            "מחניים",
            "מטולה",
            "מטע",
            "מי עמי",
            "מיטב",
            "מיצר",
            "מירב",
            "מירון",
            "מישור אדומים",
            "מישר",
            "מיתר",
            "מכבים",
            "מכורה",
            "מכמורת",
            "מכמנים",
            "מלאה",
            "מלילות",
            "מלכיה",
            "מלכישוע",
            "מנוחה",
            "מנוף",
            "מנורה",
            "מנות",
            "מנחמיה",
            "מנרה",
            "מסד",
            "מסדה",
            "מסילות",
            "מסילת ציון",
            "מעאר",
            "מעברות",
            "מעגלים",
            "מעגן",
            "מעגן מיכאל",
            "מעוז חיים",
            "מעון",
            "מעונה",
            "מעיין ברוך",
            "מעיין צבי",
            "מעיליה",
            "מעלה אדומים",
            "מעלה אפריים",
            "מעלה גלבוע",
            "מעלה גמלא",
            "מעלה החמישה",
            "מעלה לבונה",
            "מעלה מיכמש",
            "מעלה עמוס",
            "מעלה שומרון",
            "מעלות תרשיחא",
            "מענית",
            "מפלסים",
            "מצדות יהודה",
            "מצובה",
            "מצליח",
            "מצפה",
            "מצפה אביב",
            "מצפה יריחו",
            "מצפה נטופה",
            "מצפה רמון",
            "מצפה שלם",
            "מצר",
            "מרגליות",
            "מרום גולן",
            "מרחביה",
            "משאבי שדה",
            "משגב דב",
            "משגב עם",
            "משואה",
            "משואות יצחק",
            "משמר איילון",
            "משמר דוד",
            "משמר הירדן",
            "משמר הנגב",
            "משמר העמק",
            "משמר השבעה",
            "משמר השרון",
            "משמרות",
            "משמרת",
            "משען",
            "מתן",
            "מתת",
            "מתתיהו",
            "נאות גולן",
            "נאות הכיכר",
            "נאות מרדכי",
            "נבטים",
            "נגבה",
            "נהורה",
            "נהלל",
            "נהריה",
            "נוב",
            "נוגה",
            "נווה אור",
            "נווה אטיב",
            "נווה אילן",
            "נווה איתן",
            "נווה אפרים",
            "נווה דניאל",
            "נווה דקלים",
            "נווה זוהר",
            "נווה חריף",
            "נווה ים",
            "נווה ימין",
            "נווה ירק",
            "נווה מבטח",
            "נווה מיכאל",
            "נווה עובד",
            "נווה שלום",
            "נועם",
            "נופים",
            "נופך",
            "נוקדים",
            "נורדיה",
            "נחושה",
            "נחל אבנת",
            "נחל אלישע",
            "נחל אשבל",
            "נחל גבעות",
            "נחל חמדת",
            "נחל משכיות",
            "נחל נמרוד",
            "נחל עוז",
            "נחל רותם",
            "נחל רחלים",
            "נחלה",
            "נחליאל",
            "נחלים",
            "נחם",
            "נחף",
            "נחשולים",
            "נחשון",
            "נחשונים",
            "נטועה",
            "נטור",
            "נטעים",
            "נטף",
            "נילי",
            "ניסנית",
            "ניצני סיני",
            "ניצני עוז",
            "ניצנים",
            "ניר אליהו",
            "ניר בנים",
            "ניר גלים",
            "ניר דוד",
            "ניר חן",
            "ניר יפה",
            "ניר יצחק",
            "ניר ישראל",
            "ניר משה",
            "ניר עוז",
            "ניר עם",
            "ניר עציון",
            "ניר עקיבא",
            "ניר צבי",
            "נירים",
            "נירית",
            "נס הרים",
            "נס עמים",
            "נס ציונה",
            "נערן",
            "נעורים",
            "נעלה",
            "נעמה",
            "נען",
            "נצר חזני",
            "נצר סרני",
            "נצרים",
            "נצרת עלית",
            "נשר",
            "נתיב הגדוד",
            "נתיב הלה",
            "נתיב העשרה",
            "נתיב השיירה",
            "נתיבות",
            "נתניה",
            "סאסא",
            "סביון",
            "סבסטיה",
            "סגולה",
            "סג ור",
            "סוסיה",
            "סופה",
            "סלעית",
            "סעד",
            "ספיר",
            "עברון",
            "עגור",
            "עדי",
            "עולש",
            "עומר",
            "עופר",
            "עופרה",
            "עופרים",
            "עוצם",
            "עותניאל",
            "עזוז",
            "עזר",
            "עזריאל",
            "עזריה",
            "עזריקם",
            "עטרת",
            "עידן",
            "עיינות",
            "עין איילה",
            "עין גב",
            "עין גדי",
            "עין דור",
            "עין הבשור",
            "עין הוד",
            "עין החורש",
            "עין המפרץ",
            "עין הנציב",
            "עין העמק",
            "עין השופט",
            "עין השלושה",
            "עין ורד",
            "עין זיוון",
            "עין חוד",
            "עין חצבה",
            "עין חרוד",
            "עין יהב",
            "עין יעקב",
            "עין כרמל",
            "עין מאהל",
            "עין עירון",
            "עין צורים",
            "עין שמר",
            "עין שריד",
            "עין תמר",
            "עינת",
            "עוספיא",
            "עכו",
            "עלומים",
            "עלי",
            "עלי זהב",
            "עלמה",
            "עלמון",
            "עמוקה",
            "עמינדב",
            "עמיעד",
            "עמיעוז",
            "עמיקם",
            "עמיר",
            "עמישב",
            "עמנואל",
            "עמקה",
            "ענב",
            "עפולה",
            "עץ אפרים",
            "ערבונה",
            "ערד",
            "ערוגות",
            "ערוער",
            "עשרת",
            "עתלית",
            "פארן",
            "פאת שדה",
            "פדואל",
            "פדויים",
            "פדייה",
            "פוריה",
            "פורת",
            "פטיש",
            "פי נר",
            "פלך",
            "פלמחים",
            "פני חבר",
            "פסגות",
            "פעמי תשז",
            "פצאל",
            "פקיעין",
            "פרדס חנה",
            "פרדסיה",
            "פרי גן",
            "פתח תקווה",
            "פתחיה",
            "צאלים",
            "צביה",
            "צבעון",
            "צובה",
            "צופיה",
            "צופים",
            "צופית",
            "צופר",
            "צור הדסה",
            "צור יגאל",
            "צור משה",
            "צור נתן",
            "צוריאל",
            "צורית",
            "צורן",
            "ציפורי",
            "צלפון",
            "צפריה",
            "צפרירים",
            "צפת",
            "צרופה",
            "צרעה",
            "קבוצת יבנה",
            "קדומים",
            "קדימה",
            "קדמה",
            "קדמת צבי",
            "קדרון",
            "קדרים",
            "קדש ברנע",
            "קוממיות",
            "קורנית",
            "קטורה",
            "קטיף",
            "קטנה",
            "קידר",
            "קיסריה",
            "קלחים",
            "קליה",
            "קלע",
            "קציר",
            "קצרין",
            "קריות",
            "קריית אונו",
            "קריית ארבע",
            "קריית אתא",
            "קריית ביאליק",
            "קריית גת",
            "קריית חיים",
            "קריית טבעון",
            "קריית ים",
            "קריית יערים",
            "קריית מוצקין",
            "קריית מלאכי",
            "קריית נטפים",
            "קריית ספר",
            "קריית ענבים",
            "קריית עקרון",
            "קריית שמונה",
            "קרני שומרון",
            "קשת",
            "ראש הניקרה",
            "ראש העין",
            "ראש פינה",
            "ראש צורים",
            "ראשון לציון",
            "רבבה",
            "רבדים",
            "רביבים",
            "רביד",
            "רגבה",
            "רגבים",
            "רהט",
            "רוגלית",
            "רווחה",
            "רוויה",
            "רוחמה",
            "רועי",
            "רחוב",
            "רחובות",
            "ריחן",
            "רימונים",
            "רכסים",
            "רם און",
            "רמה",
            "רמון",
            "רמות",
            "רמות השבים",
            "רמות מאיר",
            "רמות מנשה",
            "רמות נפתלי",
            "רמלה",
            "רמת אפעל",
            "רמת גן",
            "רמת דוד",
            "רמת הכובש",
            "רמת השופט",
            "רמת השרון",
            "רמת יוחנן",
            "רמת ישי",
            "רמת מגשימים",
            "רמת פנקס",
            "רמת צבי",
            "רמת רזיאל",
            "רמת רחל",
            "רנן",
            "רעות",
            "רעים",
            "רעננה",
            "רפיח ים",
            "רקפת",
            "רשפון",
            "רשפים",
            "רתמים",
            "שאר ישוב",
            "שבי ציון",
            "שבי שומרון",
            "שגב",
            "שגב שלום",
            "שדה אילן",
            "שדה אליהו",
            "שדה אליעזר",
            "שדה בוקר",
            "שדה דוד",
            "שדה ורבורג",
            "שדה יואב",
            "שדה יעקב",
            "שדה יצחק",
            "שדה משה",
            "שדה נחום",
            "שדה נחמיה",
            "שדה ניצן",
            "שדה עוזיהו",
            "שדה צבי",
            "שדות ים",
            "שדות מיכה",
            "שדי אברהם",
            "שדי חמד",
            "שדי תרומות",
            "שדמה",
            "שדמות דבורה",
            "שדמות מחולה",
            "שדרות",
            "שהם",
            "שואבה",
            "שובה",
            "שובל",
            "שומרה",
            "שומריה",
            "שומרת",
            "שורש",
            "שורשים",
            "שושנת העמקים",
            "שזור",
            "שחר",
            "שחרות",
            "שיבולים",
            "שיזפון",
            "שילה",
            "שילת",
            "שלווה",
            "שלוחות",
            "שלומי",
            "שליו",
            "שמיר",
            "שני",
            "שניר",
            "שעל",
            "שעלבים",
            "שער אפרים",
            "שער הגולן",
            "שער העמקים",
            "שער מנשה",
            "שערי תקווה",
            "שפיים",
            "שפיר",
            "שפר",
            "שפרעם",
            "שקד",
            "שקף",
            "שרונה",
            "שריד",
            "שרשרת",
            "שתולה",
            "שתולים",
            "תדהר",
            "תובל",
            "תומר",
            "תושייה",
            "תימורים",
            "תירוש",
            "תל אביב",
            "תל יוסף",
            "תל יצחק",
            "תל מונד",
            "תל עדשים",
            "תל קציר",
            "תל שבע",
            "תל תאומים",
            "תלם",
            "תלמי אליהו",
            "תלמי אלעזר",
            "תלמי בילו",
            "תלמי יוסף",
            "תלמי יחיאל",
            "תלמי יפה",
            "תלמי מנשה",
            "תלמים",
            "תנובות",
            "תעוז",
            "תפוח",
            "תפרח",
            "תקומה",
            "תקוע",
            "תרום"
        ]
    }