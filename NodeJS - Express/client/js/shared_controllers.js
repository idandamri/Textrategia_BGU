/**
 * Created by krigel on 5/9/2017.
 */
var _url = "";
//var _url = "http://localhost:8081";


textrategiaApp.controller("emptyController",function($scope,$http ,$location){
    $location.path('questionManagment');
});

textrategiaApp.controller("RegisterController",function($scope,$http ,$location){

    $scope.doneRegister = false;
    $scope.checkedCode = false ;            // init to false

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip()  ;
    });

    $scope.goToLogin = function () {
        $location.path('login');
    };

    // validate user code with server, and set feedback
    $scope.checkUserCode  = function(){

        var badFeedback = "הקוד לא תקין, אנא פנה לרכז טקסטרטגיה";

        $scope.userCode  = $scope.user.userCode;
        setGroupCode($scope.userCode);

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/checkIfGroupCodeExists',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_code='+ getGroupCode()
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200){
                    $scope.checkedCode = true;
                    setUserType(data[0].isTeacherGroup);
                    $scope.serverFeedback = "הקוד נקלט, הנך מוזמן להמשיך בתהליך הרישום " ;               
                } 
                else if (status == 204){
                     $scope.serverFeedback = "הקוד לא קיים במערכת!";
                }
            }).error(function(data,status,headers,config){
                $scope.serverFeedback = "שגיאה בשרת";
        });
    }

    $scope.registerUser = function(){
        $scope.registerMod = true;

        var userFirstName = $scope.user.userFirstName;
        var userLastName = $scope.user.userLastName;
        var userIdNumber = $scope.user.userIdNumber;
        
        var userEmail1 = $scope.user.userEmail1;
        var userPassword1 = $scope.user.userPassword1;

        var userEmail2 = $scope.user.userEmail2;
        var userPassword2 = $scope.user.userPassword2;

        if (userEmail1 != userEmail2){
            $scope.inputAlert = "כתובת הדואר האלקטרוני לא זהות";
        }

        if (userPassword1 != userPassword2){
            $scope.inputAlert = "2 הסמסאות שהכנסת אינן זהות";
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
                '&user_type=' + getUserType() + '&email=' + userEmail1 + '&password=' + userPassword1
            };

            $http(req)
                .success(function(data,status,headers,config){
                    $scope.serverFeedback = "הרישום התבצע בהצלחה!"
                    $scope.doneRegister = true;
                }).error(function(data,status,headers,config){
                if (status==401){
                    $scope.serverFeedback = "כתובת הדואר האלקטרוני כבר קיימת במערכת";
                }
                else if (status==409) {
                    $scope.serverFeedback = "שגיאה בהכנסת הפרטים. יכול להיות שאתה כבר רשום למערכת?";
                }
                else {
                    $scope.serverFeedback = "שגיאה ברישום";
                }
            });
        }
    }
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
                 if (status==200){
                setUserName(data[0].FirstName);
                setUserID(data[0].PersonalID);
                setUserType(data[0].UserType);
                $scope.showError = false;
                $scope.showSuccess = true;
                if (data[0].UserType == "1"){
                    $location.path('teacher');
                }
                else if (data[0].UserType == "0") {
                    $location.path('student');
                }
                else if (data[0].UserType == "2") {
                    $location.path('superUser');
                }
            }else if (status==204){
                $scope.showError = true;
                $scope.showSuccess = false;  
            }

            }).error(function(data,status,headers,config){
                $scope.showError = true;
                $scope.showSuccess = false;


        });
    }


});