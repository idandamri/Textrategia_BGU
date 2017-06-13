/**
 * Created by ganim on 10/6/2017.
 */





var get_jason_index = function(ans_lst, id ) {

    for (i=0 ; i < ans_lst.length ; i++){
        if (ans_lst[i].Q_id == id){
           
            break;
        }
    }
    return i;
};

textrategiaApp.controller("QuestionManagmentController",function($scope,$location,$http){
    $scope.teacherName = getUserName();
    
    $scope.searchQuestionByProfiling = false;  
    $scope.flagEditQuestionMode = false;
    $scope.approved = 5;


     $scope.serverFeedback = "" ;
    $scope.serverSecondFeedback= "";

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

    $scope.approvedQuestions= function (param) {
        var choiseButton0 = document.getElementById("choiseButton0");
        var choiseButton1 = document.getElementById("choiseButton1");
        var choiseButton2 = document.getElementById("choiseButton2");
        $scope.approved = param;

        if (param==1){
            choiseButton0.style.backgroundColor  =  "#269ABC";
            choiseButton1.style.backgroundColor  = "#5bc0de";
            choiseButton2.style.backgroundColor  = "#c9302c";
            $scope.searchQuestionByProfiling = false;
            $scope.myQuestionsStock = [];

            alert("not yet working1");
            //get_all_questions("getUnapprovedQuestion");

        }
        else if (param==0){
            choiseButton0.style.backgroundColor  =  "#5bc0de";
            choiseButton1.style.backgroundColor  = "#269ABC";
            choiseButton2.style.backgroundColor  =  "#c9302c";
            $scope.searchQuestionByProfiling = true;
        }
        else {
            choiseButton0.style.backgroundColor  =  "#5bc0de";
            choiseButton1.style.backgroundColor  =  "#5bc0de";
            choiseButton2.style.backgroundColor  = "#9F221C";
            $scope.searchQuestionByProfiling = false;
            $scope.myQuestionsStock = [];

            alert("not yet working2");
            //get_all_questions("getUnapprovedQuestion");

        }

    };


        var get_all_questions = function(request_name){   

        var req = {
            method: 'POST',
            cache: false,
            url: _url + request_name,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: ''
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200){
                    $scope.myQuestionsStock = data;
                }
                else if ( status==204){
                    $scope.myQuestionsStock = [];

                }
            }).error(function(data,status,headers,config){
        });
    };



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



    $scope.searchQuestionsByParamter = function(){   
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getQuestionsByParamter',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'media_types='+$scope.selectedMedia
            +'&skills='+$scope.selectedSkill
            +'&difficulties='+$scope.selectedDiff
            +'&user_id=' + getUserID()
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200){
                    $scope.myQuestionsStock = data;
                }
                else if ( status==204){
                    $scope.myQuestionsStock = [];

                }
            }).error(function(data,status,headers,config){
        });
    };

    $scope.id_question_to_edit = "";
    $scope.editChosenQuestion = function(q_id, q_question){
        $scope.serverFeedback = "האם ברצונך לערוך את השאלה:" ;
        $scope.serverSecondFeedback= q_question;
        $scope.id_question_to_edit = q_id;



    };

    $scope.backToQuestionStockView = function(){
        if ($scope.approved == 0){
            $scope.searchQuestionByProfiling = true;
        } else {
            $scope.searchQuestionByProfiling = false;
        }
        $scope.flagEditQuestionMode = false;
        $scope.clicked = 1;
    }



    $scope.backToEditQuestionView = function(){
    $scope.searchQuestionByProfiling = false;
    $scope.flagEditQuestionMode = true;
    $scope.clicked = 0;
}



    $scope.getQuestionToEditFromStock = function(){
        $scope.searchQuestionByProfiling = false;
        $scope.flagEditQuestionMode = true;

  
       var jasonIndex = get_jason_index($scope.myQuestionsStock ,  $scope.id_question_to_edit);
 

        $scope.jasonOfQuestionToEdit = $scope.myQuestionsStock[jasonIndex];
        //   $scope.jasonOfQuestionToEdit = $scope.myQuestionsStock[1];
        
        $scope.question = {
            question_title:     $scope.myQuestionsStock[jasonIndex].Q_qeustion,
            quest_correct_fb:   $scope.myQuestionsStock[jasonIndex].Q_correctFB,
            quest_incorrect_fb: $scope.myQuestionsStock[jasonIndex].Q_notCorrectFB,
            media_type:         $scope.myQuestionsStock[jasonIndex].Q_mediaType,
            question_media:     $scope.myQuestionsStock[jasonIndex].Q_media,
            selected_skill:     $scope.myQuestionsStock[jasonIndex].Q_skill,
            difficulty:         $scope.myQuestionsStock[jasonIndex].Q_difficulty
        };

        alert("does jason OF question works? " + jasonOfQuestionToEdit.Q_qeustion);
    
    }


// ~~~~~~~~~~~~~~~~~~~~~~~~~ TO DO TO DO TO DO ~~~~~~~~~~~~~~~~~~~~~~~~~

        // ####################################################
        // GET POSSIBLE ANSWER HERE!!!!!
        // ####################################################







// ~~~~~~~~~~~~~~~~~~~~~~~~~ /TO DO TO DO TO DO ~~~~~~~~~~~~~~~~~~~~~~~~~






// ~~~~~~~~~~~~~~ EDIT QUESTION MODE!!!!! ~~~~~~~~~~~~~~~~~~
    $scope.insertPossibleAnswersMode = false;
    $scope.doneRegisterQuestion = false;
    $scope.enter_new_skill_mode = false;


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
        $scope.insertPossibleAnswersMode = true;

    }


    $scope.sendNewQuestion = function (){

        var question_title = $scope.question.question_title;
        var media_type =  $scope.question.media_type;
        var quest_skill = $scope.question.selected_skill;
        var quest_difficulty = $scope.question.difficulty;
        var question_media = $scope.question.question_media;
        var quest_correct_fb = $scope.question.quest_correct_fb;
        var quest_incorrect_fb = $scope.question.quest_incorrect_fb;

        // get possible answers infomation!
        var possible_ans_1 = $scope.question.possible_ans_1;
        var possible_ans_2 = $scope.question.possible_ans_2;
        var possible_ans_3 = $scope.question.possible_ans_3;
        var possible_ans_4 = $scope.question.possible_ans_4;
        

        var correct_ans = $scope.question.correct_ans;

       
        //alert("title: " + question_title + " media_type: " + media_type + " quest_difficulty: " + quest_difficulty + " question_media :" + question_media);
        //  alert("y: " + quest_correct_fb + " n: " + quest_incorrect_fb + " skill: " + quest_skill );
       // alert("1: " + possible_ans_1 + " 2: " + possible_ans_2 + " 3: " +  possible_ans_3 + " 4: " + possible_ans_4)

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

        // var req = {
        //     method: 'POST',
        //     cache: false,
        //     url: _url +'/editQuestion',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     data: 'question_title='+ question_title
        //     +'&is_multiple_ans='+ '0'
        //     + '&question_media_type=' + media_type
        //     + '&question_media=' + question_media
        //     + '&quest_correct_fb=' + quest_correct_fb
        //     +'&quest_incorrect_fb=' + quest_incorrect_fb
        //     +'&quest_skill=' +  quest_skill
        //     + '&quest_difficulty=' +   quest_difficulty
        //     + '&quest_proffesion=' + 'הבעה'
        //     + '&quest_is_approved=' + is_approved
        //     + '&quest_disabled=' + '1'
        //     + '&who_created=' + getUserID()
        //     // + '&answer1=' + possible_ans_1
        //     // + '&answer2=' + possible_ans_2
        //     // + '&answer3=' + possible_ans_3
        //     // + '&answer4=' + possible_ans_4
        //     // + '&correctAnswerIndex=' + correct_ans
        // };

        // // alert(JSON.stringify(req));

        // $http(req)
        //     .success(function(data,status,headers,config){
        //         $scope.serverFeedback = "השאלה נערכה בהצלחה!"
        //         $scope.doneRegisterQuestion = true;
        //     }).error(function(data,status,headers,config){
        //     $scope.serverFeedback = "שגיאה בהכנסת שאלה";
        // });

        alert("עריכה עדיין לא זמינה כרגע");

        // $scope.serverFeedback = "השאלה נשלחה בהצלחה!"
    }
});
