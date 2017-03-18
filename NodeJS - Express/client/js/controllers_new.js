var _url = "http://localhost:8081";
//var _url = "http://textrategia.com";

var tasks_parsed_jason_lst = [
    {"T_id":1,"T_title":"מיניונים","T_description":"כל המיניונים הם בצבע צהוב. מדוע זאת? האם זהו ביטוי לטבעם הפחדני, או שמא מחלת עור הנובעת מאכילת יתר של בננות?"},
    {"T_id":2,"T_title":"זברות בפיג'מות","T_description":"לעיתים רבות זברות ישנות לובשות פיג'מות. יש הגורסים כי מדובר בהצהרה אופנתית. האומנם?!"}
    ];


var answers_parsed_jason_lst = [
    {"A_id":1, "Q_id":1, "answer":"מיניונים אוכלים בננות","isCorrect":1},
    {"A_id":2, "Q_id":1, "answer":"מיניונים הם מוגיי לב","isCorrect":0},
    {"A_id":3, "Q_id":1, "answer":"למיניונים אין כבד","isCorrect":0},
  
    {"A_id":1, "Q_id":2, "answer":"מספר משתנה","isCorrect":1},
    {"A_id":2, "Q_id":2, "answer":"עין אחת","isCorrect":0},
    {"A_id":3, "Q_id":2, "answer":"שתי עיניים","isCorrect":0}
];

var question1_parsed_jason_lst = {
"Q_id":1, "Q_question":"מדוע המיניונים צהובים?", 
"Q_correctFB":"נכון מאוד, מיניונים אוכלים כמות גדולה של בננות!", 
"Q_notCorrectFB":"נסה שוב, השתמשת בעלילה כרמז",
"Q_skill":"מודעות קולנועית"
};


var questions = [

{"Q_id":1, "Q_question":"מדוע המיניונים צהובים?", 
"Q_correctFB":"נכון מאוד, מיניונים אוכלים כמות גדולה של בננות!",
"Q_notCorrectFB":"נסה שוב, השתמשת בעלילה כרמז",
"Q_skill":"מודעות קולנועית"
},

{"Q_id":2, "Q_question":"כמה עיניים יש למיניונים?", 
"Q_correctFB":"נכון מאוד, מספר עיניים קבוע זה פאסה", 
"Q_notCorrectFB":"באמת? תנסה שוב",
"Q_skill":"שיפוטיות"
}

];


textrategiaApp.controller("StudentController",function($scope){
	$scope.studentname = "שקד";
});



textrategiaApp.controller("TasksController",function($scope,$http){
    //$scope.tasks = tasks_parsed_jason_lst;
          
        var req = {
                method: 'POST',
                cache: false,
                url: _url +'/getListOfTasks',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'user_id=1' /*CHANGE TO COOKIE*/
        };  

        $http(req)
        .success(function(data,status,headers,config){
            $scope.tasks  = data;
        }).error(function(data,status,headers,config){
            $scope.tasks  = data;
        });


    $scope.questionSum = 4; //remove in future. should be a query or calculation
    $scope.studentname = "שקד"; /*CHANGE TO COOKIE*/
});

textrategiaApp.controller("oneQuestionController", function($scope){
    $scope.answers = answers_parsed_jason_lst;
    $scope.question = question1_parsed_jason_lst;
    $scope.task_name = "מיניונים צהובים";

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


    // $scope.getQuestion = function(){
    //     var q = 
    //         if (scope.id < question.length){
    //             return questions[scope.id];
    //         } else {
    //             return false;
    //         }
    //     };



    


});

textrategiaApp.controller("LoginController", function($scope, $http,$location) {
  // $scope.user={'username':'','password':''};
    //var user = 'shakedkr@post.bgu.ac.il';
   //var password='123456';

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
            $scope.showError = false;
            $scope.showSuccess = true;
            $location.path('student');


        }).error(function(data,status,headers,config){
            $scope.showError = true;
            $scope.showSuccess = false;

        });


        //-------- set error or success flags
        // if(flag){
        //     $scope.showError = false;
        //     $scope.showSuccess = true;
        //     $location.path('student');
        // }
        // else{ 
        //     $scope.showError = true;
        //     $scope.showSuccess = false;
        // }
    }
});
