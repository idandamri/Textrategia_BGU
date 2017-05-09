/**
 * Created by krigel on 5/9/2017.
 */
var _url = "http://localhost:8081";


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
                $scope.checkedCode = true;
                //$scope.tmp = data.userType;
                //alert(data);
                //alert(data[0].isTeacherGroup);
                //alert($scope.tmp);
                setUserType(data[0].isTeacherGroup);
                //alert(getUserType());

                $scope.serverFeedback = "הקוד נקלט, הנך מוזמן להמשיך בתהליך הרישום " ;
            }).error(function(data,status,headers,config){
            if (status==400){
                $scope.serverFeedback = "הקוד לא קיים במערכת!";
            }
            else {
                $scope.serverFeedback = "שגיאה בשרת";
            }
        });

        //alert("dude!!!");

        $scope.isUserTeacher = false; // this get set by server response

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
                '&user_type=' + getUserType() + '&email=' + userEmail1 + '&password=' + userPassword1
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

