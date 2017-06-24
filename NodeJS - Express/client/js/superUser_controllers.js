/**
 * Created by krigel on 5/9/2017.
 */


textrategiaApp.controller("SuperUserController",function($scope, $http,$location){
    $scope.userName = getUserName();



});




textrategiaApp.controller("superUserGroupManagmentController",function($scope,$http,$location){
    $scope.userName = getUserName();
     $scope.groupIsEmpty = false;

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

    $scope.showGroupsMembersList = function(g_id,g_name){
        $scope.choosenGroupName = g_name;

     var req = {
                method: 'POST',
                cache: false,
                url: _url +'/getStudentListFromGroupId',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'group_id='+g_id
            };

            $http(req)
                .success(function(data,status,headers,config){
                    if (status==200) {
                        $scope.groupsStudentLst = data;
                        $scope.groupIsEmpty = false;
                       
                    }
                    else if (status==204){
                        $scope.groupsStudentLst = [];
                        $scope.groupIsEmpty = true;
                        $scope.serverFeedback = "אין תלמידים בקבוצה";
                    }
                }).error(function(data,status,headers,config){
                    $scope.groupsStudentLst = [];
                    alert("אין תלמידים בקבוצה");
            });
        }



    $scope.showStudnetPassword = function(stud){
        $scope.askForUserPassword = true;
        $scope.serverFeedback = "הזן את ססימתך האישית, על מנת לקבל קישה לסיסמת המשתמש"
        $scope.studentObject = stud;
        $scope.showPassword = false;
    }

    $scope.askPremession = function(){

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
                    $scope.serverFeedback = "סיסמת המשתמש: "+ $scope.studentObject.FirstName +  " היא: "
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
















textrategiaApp.controller("AddSchoolInCityController",function($scope,$http){

    $scope.getUserName = getUserName();
    $scope.myCities = cities;
    $scope.showSchools = false;
    $scope.serverFeedback = "";

    // Only 2 arguments. name & is_master_group
    $scope.showSchoolsList = function (){

        // group_city is argument 3
        var city = $scope.city.city_name;


        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################


        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getAllSchollByCity',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'city=' + city
        };

        // alert(JSON.stringify(req));
        $http(req)
            .success(function(data,status,headers,config){
                $scope.showSchools = true;
                if (status==200) {
                    $scope.schools = data;
                }
                else if (status==204){
                    $scope.schools = [{"School":"אין בתי ספר זמינים בעיר זו"}]
                }
                // alert("data: " + $scope.schools);
            })
            .error(function(data,status,headers,config) {
            });
    }

    $scope.createNewSchoolWraper = function (){
        $scope.readyToSendServer = false;
        $scope.serverFeedback = "האם ברוצנך להוסיף את בית הספר: " 
        $scope.secondServerFeedback = "אל העיר: " 
    }


    $scope.createNewSchool = function (){
        $scope.readyToSendServer = true;
        var city =  $scope.city.city_name;;
        var schoolName = $scope.user.schoolName;

        // alert("schoolname: " + schoolName );
        // alert("city.value: " + city.value );

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/addNewSchool',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'city=' + city +'&school='+ schoolName
        };

        $http(req)
            .success(function(data,status,headers,config){
                //alert("בית ספר התווסף בהצלחה לרשימה");
                $scope.serverFeedback = "בית ספר התווסף בהצלחה לרשימה";
                $scope.showSchoolsList();
            })
            .error(function(data,status,headers,config) {
               // alert("שגיאה בהכנסת בית הספר. יכול להיות שבית הספר כבר קיים בעיר זו?");
                $scope.serverFeedback = "שגיאה בהכנסת בית הספר. יכול להיות שבית הספר כבר קיים בעיר זו?";
                $scope.showSchoolsList();
            });


    }

});


textrategiaApp.controller("CreatTaskController",function($scope,$http,$location){


    $scope.getUserName = getUserName();
    $scope.searchQuestion = false;
    $scope.userApprovedSending = false;
    $scope.showApproveQuestion = false;

     $scope.serverFeedbackForNoQuestions = "";
 $scope.searched_q_clicked = false;

    $scope.backToHomePage = function () {
        if (getUserType() == 2)
            $location.path('superUser');
        else
            $location.path('teacher');

    };

        if (getUserType()==2){
        $scope.isAdmin = true;
    } else {
        $scope.isAdmin = false; 
    }


    // ####################################################
    // get skills list from server
    // ####################################################


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



    $scope.addQuestions = function(){
        $scope.searchQuestion = true;
    }

    $scope.backToTaskDef = function(){
        $scope.searchQuestion = false;
    }

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


    $scope.showSelectedQuestion = function(){
        // alert("selectedMedia: " + $scope.selectedMedia +
        //     " | selectedDiff: " + $scope.selectedDiff +
        //     " | selectedSkill: " + $scope.selectedSkill
        //     );
        $scope.feedback = "";
        $scope.generate_task= false;
        $scope.searched_q_clicked = true;

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

        // alert(JSON.stringify(req));

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200){
                    $scope.myQuestions = data;
                    $scope.serverFeedbackForNoQuestions = "";
                }
                else if ( status==204){
                    $scope.myQuestions = [];
                    $scope.serverFeedbackForNoQuestions = "אין במאגר שאלות עם הנתונים שנבחרו. נסה להוסיף התמקצעויות נוספות.";
                }
            }).error(function(data,status,headers,config){
        });
    };


    // ####################################################
    // send the list: selectedMedia, selectedDiff, selectedSkill 
    // get the question instead
    // ####################################################

// This is the scope choosen question
    $scope.selectedQuestionsIndex = [];  //// [2,3,5,6]
    $scope.checkQuestionSelected = function (checkStatus,element){
        if(checkStatus){
            $scope.selectedQuestionsIndex.push(element);
        }
        else{
            const index = $scope.selectedQuestionsIndex.indexOf(element);

            if (index !== -1){
               $scope.selectedQuestionsIndex.splice(index, 1);
            }
        }
    };


// ##########################################################
// THIS IS THE ANSWER, the question selected outside of scope
  $scope.myTaskQuestions = []; // THIS IS A JASON LIST

    $scope.addSelectedQuestions = function(){ 
        for (i= 0 ; i< $scope.selectedQuestionsIndex.length ; i++){
            for (j= 0 ; j< $scope.myQuestions.length ; j++){
                if ( $scope.myQuestions[j].Q_id == $scope.selectedQuestionsIndex[i]
                    && $scope.myTaskQuestions.indexOf($scope.myQuestions[j]) == -1 ){
                    $scope.myTaskQuestions.push($scope.myQuestions[j]);
                }
            }
        }
    };

    // this function delete a spesific answer from tasks's answers list
    $scope.deleteThisQuestion = function (element){
        const index = $scope.myTaskQuestions.indexOf(element);
        if (index !== -1)
        {
           $scope.myTaskQuestions.splice(index, 1);
        }
    };


       $scope.changeStatusOfAnswer = function(changed_element){
           $scope.userApprovedSending = 1 - $scope.userApprovedSending;
       };

    $scope.sendTaskToServerWrapper = function(){
        $scope.searchQuestion = false;
        $scope.showApproveQuestion = true;


    };


    $scope.sendTaskToServer = function(){
        var questionID = [];
        // alert("test");

        for (i = 0 ; i< $scope.myTaskQuestions.length ; i++){
            questionID.push($scope.myTaskQuestions[i].Q_id);
        }

        var is_approved;
        if (getUserType() == 2)
            is_approved=1;
        else
            is_approved=0;

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/createTask',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 't_title='+$scope.task.taskName
            +'&t_description='+$scope.task.taskDesc
            +'&t_owner=' + getUserID()
            +'&t_approved=' + is_approved
            +'&questions=' +questionID
        };

        $http(req)
            .success(function(data,status,headers,config){
                $scope.serverFeedback = "המטלה נוספה בהצלחה!";
                // alert("המטלה נוספה בהצלחה");
                // $location.path('superUser');
            }).error(function(data,status,headers,config){
                $scope.serverFeedback = "שגיאה בהוספת המטלה";
        });

    };

 





});

textrategiaApp.controller("CreateGroupController",function($scope,$http,$location){

    $scope.teacherName = getUserName();
    $scope.myCities = cities;
    $scope.isStudentGroup = true;

    $scope.goToSuperUser = function () {
        $location.path('superUser');
    };

    if (getUserType()==2){
        $scope.isAdmin = true;
    } else {
        $scope.isAdmin = false; 
    }

    $scope.changeGroupType = function () {
        type = $scope.selected_group_master;
        /*teache group*/
        if (type ==0){
            $scope.isStudentGroup = true;
        }
        else {
            $scope.isStudentGroup = false;
        }
    }


    // ####################################################
    // GET FROM SERVER SCHOOL FROM THIS CITY
    // ####################################################


    $scope.getSchoolByCity= function () {
        city = $scope.selected_city;
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getAllSchollByCity',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'city='+city
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.group_school = data;
                }
                else if (status==204){
                    $scope.group_school = [];
                    // $scope.group_school.push({
                    //     "School": "אין בתי ספר קיימים"
                    // });
                }
            }).error(function(data,status,headers,config){
            $scope.group_school = 0;
        });
    };



    $scope.getTeacherByCityAndSchool= function () {
        city = $scope.selected_city;
        school = $scope.selected_school;
        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getAllTeachersBySchoolAndCity',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'city='+city + '&school=' + school
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.teachers = data;
                }
                else if (status==204){
                    $scope.teachers = [];
                    $scope.teachers.push({
                        "School": "אין מורים בבית ספר זה"
                    });
                }
            }).error(function(data,status,headers,config){
            $scope.teachers = 0;
        });
    };


    $scope.createGroup = function () {
        var groupName = $scope.text_group;
        var city = $scope.selected_city;
        var school = $scope.selected_school;
        var type= $scope.selected_group_master;

        var teacher_id;
        if ($scope.isStudentGroup == true){
            teacher_id = $scope.selected_teacher;
        }
        else {
            teacher_id = getUserID(); /*teacher id = super user id*/
        }

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/createGroup',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'group_name='+groupName
            +'&school='+ school
            +'&city='+ city
            +'&is_teacher_group='+ type
            +'&group_user_type=1'
            +'&teacher_id='+ teacher_id
            +'&is_master=1'
            +'&is_approved= 1'
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.serverFeedback = "הקבוצה נוצר בהצלחה, קוד הקבוצה הוא: "
                    $scope.output_groupCode = data[0].GroupeCode; // this will be provided to the user, so he will know the code.

                }
            }).error(function(data,status,headers,config){
        });

    }


    // Only 2 arguments. name & is_master_group
    $scope.createGroup2 = function (){
        // groupName is argument 1
        var groupName = $scope.group.groupName;

        //group_master is argument 2
        var group_master;
        var sel1 = document.getElementById("group_master");
        for (i = 0 ; i < sel1.options.length ; i++){
            group_master = sel1.options[i];
            if (group_master.selected == true){
                //alert(group_master.value);              // 1 means yes, 0 means no
                break;
            }
        }

        // group_city is argument 3
        var group_city;
        sel1 = document.getElementById("group_city");
        for (i = 0 ; i < sel1.options.length ; i++){
            group_city = sel1.options[i];
            if (group_city.selected == true){
                //alert(group_city.value);              // 1 means yes, 0 means no
                break;
            }
        }

        // group_school is argument 4
        var group_school;
        sel1 = document.getElementById("group_school");
        for (i = 0 ; i < sel1.options.length ; i++){
            group_school = sel1.options[i];
            if (group_school.selected == true){
                //alert(group_school.value);              // 1 means yes, 0 means no
                break;
            }
        }

        // alert("v1: " + groupName + " v2: " +
        // group_master.value + " v3: " +group_school.value + " v4: " + group_city.value);

        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################

        // change server feedback acording to succuss or failure!
        $scope.serverFeedback = "הקבוצה נוצר בהצלחה, קוד הקבוצה הוא: "
        $scope.output_groupCode = "1234"; // this will be provided to the user, so he will know the code.
    }

});


textrategiaApp.controller("StatisticsSuperUserController",function($scope, $http,$location){

    $scope.userName = getUserName();

    // $scope.searchQuestionMode = false;
    $scope.searchQuestionMode = true;
    

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



    // CHANGE THIS
    $scope.showSelectedQuestion = function(){

        // alert("selectedMedia: " + $scope.selectedMedia +
        //     " | selectedDiff: " + $scope.selectedDiff +
        //     " | selectedSkill: " + $scope.selectedSkill
        $scope.feedback = "";
        $scope.generate_task= false;

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getQuestionsWithOneAnsByParamter',
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
                    $scope.questionForStatistics= data;
                    $scope.searchQuestionMode = false;
                }
                else if ( status==204){
                    $scope.questionForStatistics = [];
                    $scope.serverFeedback = "אין שאלות במאגר"
                }
            }).error(function(data,status,headers,config){
        });
    }; 



    $scope.getStatisticForQuestion= function (q_id, index) {
        
        // alert(index);

        var req = {
            method: 'POST',
            cache: false,
            url: _url +'/getQuestionStatistics',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'q_id=' + q_id
        };

        $http(req)
            .success(function(data,status,headers,config){
                if (status==200) {
                    $scope.questionForStatistics[index].sThatWereWrong =data[0].StudentsThatWereWrong;
                    $scope.questionForStatistics[index].sCorrectFirstTry =data[0].StudentsCorrectFirstTry;
                    $scope.questionForStatistics[index].sCorrectSecondTry =data[0].StudentsCorrectSecondTry;
                    $scope.questionForStatistics[index].gotStats = true;
                } else if (status==204){
                    $scope.questionForStatistics[index].gotStats = true;
                    $scope.questionForStatistics[index].sThatWereWrong = [];
                    $scope.questionForStatistics[index].sCorrectFirstTry = [];
                    $scope.questionForStatistics[index].sCorrectSecondTry = [];
                    $scope.serverFeedback = "אין עדיין נתוני סטטיסטיקה על שאלה זו";
                }
                // alert(data);

            })
            .error(function(data,status,headers,config) {
                $scope.questionForStatistics[index].sThatWereWrong = 0;
                $scope.questionForStatistics[index].sCorrectFirstTry = 0;
                $scope.questionForStatistics[index].sCorrectSecondTry = 0;
                $scope.questionForStatistics[index].gotStats = false;
            });

    };





});