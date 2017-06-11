/**
 * Created by ganim on 10/6/2017.
 */



textrategiaApp.controller("QuestionManagmentController",function($scope,$location,$http){
    $scope.teacherName = getUserName();
    $scope.getQuestionsToEditMode = true;  

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
        $scope.approved = param;

        if (param==0){
             choiseButton0.style.backgroundColor  =  "#269ABC";
             choiseButton1.style.backgroundColor  = "#5bc0de";
             alert("approved? " + approved);
        }
        else {
            choiseButton0.style.backgroundColor  =  "#5bc0de";
            choiseButton1.style.backgroundColor  = "#269ABC";
            alert("approved? " + approved);

        }

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
        // question_title is argument 1
        var question_title = $scope.question.question_title;

        // (IS MULTIPLE ANS QUESTION) opt1.value is argument 2
        // var is_multiple;
        // var sel1 = document.getElementById("is_multiple_ans");
        // for (i = 0 ; i < sel1.options.length ; i++){
        //     is_multiple = sel1.options[i];
        //     if (is_multiple.selected == true){
        //         // alert(is_multiple.value);              // 1 means yes, 0 means no
        //         break;
        //     }
        // }

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




        var quest_skill = $scope.question.selected_skill;


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
        // alert("y: " + quest_correct_fb + " n: " + quest_incorrect_fb + " skill: " + quest_skill );
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

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addQuestion',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'question_title='+ question_title
            +'&is_multiple_ans='+ '0'
            + '&question_media_type=' + media_type.value
            + '&question_media=' + question_media
            + '&quest_correct_fb=' + quest_correct_fb
            +'&quest_incorrect_fb=' + quest_incorrect_fb
            +'&quest_skill=' +  quest_skill
            + '&quest_difficulty=' +   quest_difficulty.value
            + '&quest_proffesion=' + 'הבעה'
            + '&quest_is_approved=' + is_approved
            + '&quest_disabled=' + '1'
            + '&who_created=' + getUserID()
            + '&answer1=' + possible_ans_1
            + '&answer2=' + possible_ans_2
            + '&answer3=' + possible_ans_3
            + '&answer4=' + possible_ans_4
            + '&correctAnswerIndex=' + opt3.value
        };

        // alert(JSON.stringify(req));

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
