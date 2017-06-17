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
                $scope.jason_data_hadas = data;


          }).error(function(data,status,headers,config){
        $scope.jason_data_hadas = {
            answers: [
                            {
                              "A_id": 5,
                              "answer": "zebra!",
                              "isCorrect": 1
                            },
                            {
                              "A_id": 6,
                              "answer": "blimps",
                              "isCorrect": 0
                            }
                     ]
                 }
        });

   
});
