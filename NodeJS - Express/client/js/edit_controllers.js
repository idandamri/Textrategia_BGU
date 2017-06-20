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
    
    $scope.flagEditQuestionMode = false;
    $scope.approved = 5;
    $scope.searched_parameters_once = false;
    $scope.ask_if_should_disable = false;
    $scope.question_is_legal = true;     
    $scope.doneWithPage = false;


    // start in searchquestion by profiling mode
    var choiseButton1 = document.getElementById("choiseButton1");
    choiseButton1.style.backgroundColor  = "#398439";
    $scope.searchQuestionByProfiling = true;
    

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

    $scope.goToQuestionManagment = function () {
        // $state.reload(true);
            $location.path('empty');
    }   


    $scope.approvedQuestions= function (param) {
        var choiseButton0 = document.getElementById("choiseButton0");
        var choiseButton1 = document.getElementById("choiseButton1");
        var choiseButton2 = document.getElementById("choiseButton2");
        $scope.approved = param;

        if (param==1){
            choiseButton0.style.backgroundColor  =  "#D58512"; //yellow pressed
            choiseButton1.style.backgroundColor  = "#449d44";   // green 
            choiseButton2.style.backgroundColor  = "#c9302c";   // red
            $scope.searchQuestionByProfiling = false;
            $scope.flagEditQuestionMode = false;
            $scope.myQuestionsStock = [];

            get_all_questions("/getUnapprovedQuestion");

        }
        else if (param==0){ // doesnt happend no more
            choiseButton0.style.backgroundColor  =  "#ec971f";      // yellow
            choiseButton1.style.backgroundColor  = "#398439";       // green pressed
            choiseButton2.style.backgroundColor  =  "#c9302c";      // red
            $scope.searchQuestionByProfiling = true;
        }
        else if (param==2){
            choiseButton0.style.backgroundColor  =  "#ec971f"; // yellow
            choiseButton1.style.backgroundColor  =  "#449d44";  // green
            choiseButton2.style.backgroundColor  = "#9F221C";   // red pressed
            $scope.searchQuestionByProfiling = false;
            $scope.flagEditQuestionMode = false;
            $scope.myQuestionsStock = [];

            get_all_questions("/getReported");
        } 

     };


        var get_all_questions = function(param){   

           var req = {
                method: 'POST',
                cache: false,
                url: _url + param,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            $http(req)
                .success(function(data,status,headers,config){
                    if (status==200){
                        $scope.myQuestionsStock = data;
                    }
                    else if ( status==204){
                        $scope.myQuestionsStock = [];
                        $scope.serverFeedbackForNoQuestions = "אין שאלות שיש לטפל בהן";

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
                    $scope.searched_parameters_once = true;
                    
                }
                else if ( status==204){
                    $scope.myQuestionsStock = [];
                    $scope.serverFeedbackForNoQuestions = "אין שאלות עם הנתונים שנבחרו. נסה להוסיף התמקצעויות נוספות ";
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
        var question_id = $scope.myQuestionsStock[jasonIndex].Q_id;
  
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getAnswersByQid',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'q_id='+question_id
        };

        $http(req)
            .success(function(data,status,headers,config){
            $scope.question.answer = data;

            $scope.question.possible_ans_1 = data[0].answer;
            $scope.question.possible_ans_2 = data[1].answer;
            $scope.question.possible_ans_3 = data[2].answer;
            $scope.question.possible_ans_4 = data[3].answer;

            $scope.question.answer1_is_correct = data[0].isCorrect;
            $scope.question.answer2_is_correct = data[1].isCorrect;
            $scope.question.answer3_is_correct = data[2].isCorrect;
            $scope.question.answer4_is_correct = data[3].isCorrect;

            }).error(function(data,status,headers,config){
            $scope.question.possible_ans_1 = [];
        });
        
        $scope.question = {
            question_id:        $scope.myQuestionsStock[jasonIndex].Q_id,
            question_title:     $scope.myQuestionsStock[jasonIndex].Q_qeustion,
            quest_correct_fb:   $scope.myQuestionsStock[jasonIndex].Q_correctFB,
            quest_incorrect_fb: $scope.myQuestionsStock[jasonIndex].Q_notCorrectFB,
            media_type:         $scope.myQuestionsStock[jasonIndex].Q_mediaType,
            question_media:     $scope.myQuestionsStock[jasonIndex].Q_media,
            selected_skill:     $scope.myQuestionsStock[jasonIndex].Q_skill,
            difficulty:         $scope.myQuestionsStock[jasonIndex].Q_difficulty,
            isMultipuleAns:     $scope.myQuestionsStock[jasonIndex].isMultipuleAns,
            
            Q_reported_Offensive:     $scope.myQuestionsStock[jasonIndex].Q_reported_Offensive,
            Q_reported_Question:     $scope.myQuestionsStock[jasonIndex].Q_reported_Question,
            Q_reported_Answer:     $scope.myQuestionsStock[jasonIndex].Q_reported_Answer,

            Q_approved:     $scope.myQuestionsStock[jasonIndex].Q_approved

        };


           
    }




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


    $scope.editQuestionMode = function(){
        $scope.insertPossibleAnswersMode = false;
    }


    $scope.possibleAnswersMode = function(){
        $scope.insertPossibleAnswersMode = true;






    }
       $scope.changeStatusOfAnswer = function(changed_element){

            switch(changed_element) {
                case "0":
                    $scope.question.answer1_is_correct = 1 - $scope.question.answer1_is_correct;
                    break;
                case "1":
                    $scope.question.answer2_is_correct = 1 - $scope.question.answer2_is_correct;
                    break;
                case "2":
                    $scope.question.answer3_is_correct = 1 - $scope.question.answer3_is_correct;
                    break;
                case "3":
                    $scope.question.answer4_is_correct = 1- $scope.question.answer4_is_correct;
                    break;
                case "blimp":
                    $scope.question.isMultipuleAns = 1- $scope.question.isMultipuleAns;
                    break;
            } ;

        };



    $scope.sendNewQuestionWraper = function(){
        $scope.question_is_legal = false;   
        var isMultipuleAns = parseInt($scope.question.isMultipuleAns);
        var sum = parseInt($scope.question.answer1_is_correct) +  parseInt($scope.question.answer2_is_correct) +
            parseInt($scope.question.answer3_is_correct) +  parseInt($scope.question.answer4_is_correct) ;

        if (sum == 0){
            $scope.serverFeedback = "חייב לבחור לפחות תשובה נכונה אחת";
        }
        else if( !isMultipuleAns && sum != 1){
            $scope.serverFeedback = "אסור לבחור יותר מתשובה נכונה אחת";    

        }
        else {
            $scope.serverFeedback = "האם ברצונך לשלוח את השאלה לעריכה?";   
            $scope.question_is_legal = true;       
        };

    };
    $scope.resetFlags = function(){
         $scope.question_is_legal = true;      

    };

    $scope.sendNewQuestion = function (){

        var question_id = $scope.question.question_id;
        var question_title = $scope.question.question_title;
        var media_type =  $scope.question.media_type;
        var quest_skill = $scope.question.selected_skill;
        var quest_difficulty = $scope.question.difficulty;
        var question_media = $scope.question.question_media;
        var quest_correct_fb = $scope.question.quest_correct_fb;
        var quest_incorrect_fb = $scope.question.quest_incorrect_fb;
        var isMultipuleAns = $scope.question.isMultipuleAns;

        // get possible answers infomation!
        var possible_ans_1 = $scope.question.possible_ans_1;
        var possible_ans_2 = $scope.question.possible_ans_2;
        var possible_ans_3 = $scope.question.possible_ans_3;
        var possible_ans_4 = $scope.question.possible_ans_4;
                

        // var correct_ans = [];
        // correct_ans.push($scope.question.answer1_is_correct);
        // correct_ans.push($scope.question.answer2_is_correct);
        // correct_ans.push($scope.question.answer3_is_correct);
        // correct_ans.push($scope.question.answer4_is_correct);

        var isCorrect_a1 = $scope.question.answer1_is_correct;
        var isCorrect_a2 = $scope.question.answer2_is_correct;
        var isCorrect_a3 = $scope.question.answer3_is_correct;
        var isCorrect_a4 = $scope.question.answer4_is_correct;

        var a_id1 = $scope.question.answer[0].A_id;
        var a_id2 = $scope.question.answer[1].A_id;
        var a_id3 = $scope.question.answer[2].A_id;
        var a_id4 = $scope.question.answer[3].A_id;

        var ans1 = {
            "A_id": a_id1,
            "answer": possible_ans_1,
            "isCorrect": isCorrect_a1
        };
        var ans2 = {
            "A_id": a_id2,
            "answer": possible_ans_2,
            "isCorrect": isCorrect_a2
        };
        var ans3 = {
            "A_id": a_id3,
            "answer": possible_ans_3,
            "isCorrect": isCorrect_a3
        };
        var ans4 = {
            "A_id": a_id4,
            "answer": possible_ans_4,
            "isCorrect": isCorrect_a4
        };
        var correct_ans = [];
        correct_ans.push(JSON.stringify(ans1));
        correct_ans.push(JSON.stringify(ans2));
        correct_ans.push(JSON.stringify(ans3));
        correct_ans.push(JSON.stringify(ans4));

        // alert(correct_ans);

        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################

        /*set quest_is_approved */
        var is_approved;
        if (getUserType() == 2)
            is_approved=1;
        else
            is_approved=0;

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/editQuestion',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'id='+ question_id
            + '&question='+ question_title
            + '&mediaType=' + media_type
            + '&media=' + question_media
            + '&is_multiple_ans=' + isMultipuleAns
            + '&correctFB=' + quest_correct_fb
            + '&notCorrectFB=' +  quest_incorrect_fb
            + '&skill=' +   quest_skill
            + '&difficulty=' + quest_difficulty
            + '&proffesion=' + 'הבעה'
            + '&approved=' + '1'
            + '&disabled=' + '0'
            + '&Q_reported_Offensive=' + '0'
            + '&Q_reported_Question=' + '0'
            + '&Q_reported_Answer=' + '0'
            + '&answers=[' + correct_ans + ']'
        };
        // data: 'students=['+ studentIDlst + ']

         // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                $scope.serverFeedback = "השאלה נערכה בהצלחה!"
                $scope.doneRegisterQuestion = true;
                $scope.doneWithPage = true;
            }).error(function(data,status,headers,config){
            $scope.serverFeedback = "שגיאה בעריכת השאלה";
            $location.path('superUser');

        });

 


    };


        $scope.dontEdit = function(){
            $location.path('superUser');
        };

        $scope.disableQuestionPermanentlyWrapper = function(){
            $scope.serverFeedback = "אתה בטוח שברצותך להשבית את השאלה??";
            $scope.serverSecondFeedback = "שים לב, השבתת שאלה תמנע את הופעתה במערכת!";
            $scope.ask_if_should_disable = true;

        };

        $scope.disableQuestionPermanently = function(){
        
            $scope.ask_if_should_disable = false;
            var question_id = $scope.question.question_id;



          var req = {
                method: 'POST',
                cache: false,
                url: _url +'/disableQuestion',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'disable_status='+ 1
                 + '&q_id='+ question_id
            };

            $http(req)
                .success(function(data,status,headers,config){
                    if (status==200) {
                          $scope.doneWithPage = true;
                        $scope.serverFeedback = "השאלה הושבתה בהצלחה"
                    }
                    else if (status==204) {
                          $scope.doneWithPage = true;
                        $scope.serverFeedback = "השאלה הושבתה בהצלחה"
                    }
                }).error(function(data,status,headers,config){
                $scope.serverFeedback = "בהעיה בהשבתת השאלה..."
            });        

        };

        $scope.dontDisableQuestion = function(){
            $scope.ask_if_should_disable = false;
            $location.path('empty');
        };


});
