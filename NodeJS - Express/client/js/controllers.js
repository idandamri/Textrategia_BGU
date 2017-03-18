var tasks_parsed_jason_lst = [
    {"T_id":1,"T_title":"מיניונים","T_description":"כל המיניונים הם בצבע צהוב. מדוע זאת? האם זהו ביטוי לטבעם הפחדני, או שמא מחלת עור הנובעת מאכילת יתר של בננות?"},
    {"T_id":2,"T_title":"זברות בפיג'מות","T_description":"לעיתים רבות זברות ישנות לובשות פיג'מות. יש הגורסים כי מדובר בהצהרה אופנתית. האומנם?!"}
    ];


var answers_parsed_jason_lst = [
    {"A_id":1, "Q_id":1, "answer":"מיניונים אוכלים בננות","isCorrect":1},
    {"A_id":2, "Q_id":1, "answer":"מיניונים הם מוגיי לב","isCorrect":0},
    {"A_id":3, "Q_id":1, "answer":"למיניונים אין כבד","isCorrect":0}
];

var question1_parsed_jason_lst = 
{"Q_id":1, "Q_question":"מדוע המיניונים צהובים?", 
"Q_correctFB":"נכון מאוד, מיניונים אוכלים כמות גדולה של בננות!", "Q_notCorrectFB":"נסה שוב, השתמשת בעלילה כרמז",
"Q_skill":"מודעות קולנועית"
}


textrategiaApp.controller("StudentController",function($scope){
	$scope.studentname = "שקד";
});



textrategiaApp.controller("TasksController",function($scope){
    $scope.tasks = tasks_parsed_jason_lst;
    $scope.questionSum = 4; //remove in future. should be a query or calculation
    $scope.studentname = "שקד";
});

textrategiaApp.controller("oneQuestionController", function($scope){
    $scope.answers = answers_parsed_jason_lst;
    $scope.question = question1_parsed_jason_lst;
    $scope.task_name = "מיניונים צהובים";
});



textrategiaApp.controller("LoginController", function($scope, $http) {
    $scope.user={'username':'','password':''};
    
    //----- Users json
    var validUsers= [ 
        {'username':'chandler@friends.com', 'password':'1234'},
        {'username':'ross@friends.com', 'password':'1234'},
        {'username':'joey@friends.com', 'password':'1234'},
        {'username':'rechal@friends.com', 'password':'1111'},
        {'username':'hadas@gmail.com', 'password':'1111'},
        {'username':'shaked@gmail.com', 'password':'1111'}

    ];
    
    $scope.showError = false; // set Error flag
    $scope.showSuccess = false; // set Success Flag

    //------- Authenticate function
    $scope.authenticate = function (){
        var flag= false;
        
        for(var i in validUsers){ // loop on users array
            if($scope.user.username == validUsers[i].username &&
             $scope.user.password == validUsers[i].password){
                flag = true;
                break;
            }
            else{
                flag = false;
            }               
        }

        //-------- set error or success flags
        if(flag){
            $scope.showError = false;
            $scope.showSuccess = true;
        }
        else{
            $scope.showError = true;
            $scope.showSuccess = false;
        }


    }

});
