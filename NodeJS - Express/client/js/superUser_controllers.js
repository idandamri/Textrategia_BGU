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
                alert("בית ספר התווסף בהצלחה לרשימה");
                $scope.showSchoolsList();
            })
            .error(function(data,status,headers,config) {
                alert("שגיאה בהכנסת בית הספר. יכול להיות שבית הספר כבר קיים בעיר זו?");
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
