/**
 * Created by krigel on 5/9/2017.
 */


textrategiaApp.controller("SuperUserController",function($scope, $http,$location){
    $scope.userName = getUserName();



});


textrategiaApp.controller("AddSchoolInCityController",function($scope,$http){

    $scope.getUserName = getUserName();
    $scope.myCities = cities;
    $scope.showSchools = false;
    $scope.serverFeedback = "";

    $scope.schoolsMock = [
          {
            "S_id": 1,
            "S_Name": "שזר",
          },
          {
            "S_id": 2,
            "S_Name": "רעים",
          },
        {
            "S_id": 3,
            "S_Name": "רננים",
          },
          {
            "S_id": 4,
            "S_Name": "ביאליק",
          }
        ];

    // Only 2 arguments. name & is_master_group
    $scope.showSchoolsList = function (){

        // group_city is argument 3
        var city;
        sel1 = document.getElementById("group_city");
        for (i = 0 ; i < sel1.options.length ; i++){
            city = sel1.options[i];
            if (city.selected == true){
                //alert(city.value);
                break;
            }
        } 

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
            data: 'city=' + city.value
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


    $scope.createNewSchool = function (){
        var city;
        sel1 = document.getElementById("group_city");
        for (i = 0 ; i < sel1.options.length ; i++){
            city = sel1.options[i];
            if (city.selected == true){
                //alert(city.value);
                break;
            }
        }

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
            data: 'city=' + city.value +'&school='+ schoolName
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


textrategiaApp.controller("CreatTaskController",function($scope,$http){

    $scope.getUserName = getUserName();
    $scope.searchQuestion = false;

    // ####################################################
    // get skills list from server
    // ####################################################

    $scope.skills = [
    {"q_skill": "בלימפים"},
    {"q_skill": "דוליז"},
    {"q_skill": "בובים"}
    ];

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
        alert("selectedMedia: " + $scope.selectedMedia + 
            " | selectedDiff: " + $scope.selectedDiff +
            " | selectedSkill: " + $scope.selectedSkill
            );
    };


    // ####################################################
    // send the list: selectedMedia, selectedDiff, selectedSkill 
    // get the question instead
    // ####################################################


    // Cיhange questions to server response question
    $scope.myQuestions = [
    { "Q_id": 2,"Q_qeustion": "לפניך סרטון קצר. צפה בו וענה על השאלה - מהי מטרתו המרכזית של יוצר הסרטון? "},
    { "Q_id": 3,"Q_qeustion": "קאפקייק אנד פיש אנד צ'יפס? דיס איז מאדנס' "},
    { "Q_id": 4,"Q_qeustion": "בוב, בוב,בוב, בוב,בוב, בוב,בוב, בוב,בוב, בוב,בוב, בוב,בוב, בוב, "}
    ];

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
                if ( $scope.myQuestions[j].Q_id== $scope.selectedQuestionsIndex[i]){
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



    $scope.sendTaskToServer = function(){
        var questionID = [];
        alert("test");

        for (i = 0 ; i< $scope.myTaskQuestions.length ; i++){
            questionID.push($scope.myTaskQuestions[i].Q_id);
        }

        alert(questionID);


    };

 





});

textrategiaApp.controller("CreateGroupController",function($scope,$http,$location){

    $scope.teacherName = getUserName();
    $scope.myCities = cities;

    $scope.goToSuperUser = function () {
        $location.path('superUser');
    };

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
                    $scope.group_school.push({
                        "School": "אין בתי ספר קיימים"
                    });
                }
            }).error(function(data,status,headers,config){
            $scope.group_school = 0;
        });
    };

    $scope.createGroup = function () {
        var groupName = $scope.text_group;
        var city = $scope.selected_city;
        var school = $scope.selected_school;
        var type= $scope.selected_group_master;

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
            +'&teacher_id='+ getUserID()
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
