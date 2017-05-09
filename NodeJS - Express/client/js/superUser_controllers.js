/**
 * Created by krigel on 5/9/2017.
 */


textrategiaApp.controller("SuperUserController",function($scope, $http,$location){
    $scope.userName = getUserName();



});


textrategiaApp.controller("AddSchoolInCityController",function($scope){

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
        var group_city;
        sel1 = document.getElementById("group_city");
        for (i = 0 ; i < sel1.options.length ; i++){
            group_city = sel1.options[i];
            if (group_city.selected == true){
                //alert(group_city.value);             
                break;
            }
        } 

        // ####################################################
        // SEND INFORMATION TO SERVER HERE
        // ####################################################


        $scope.schools = $scope.schoolsMock;
 		$scope.showSchools = true;
	}


    $scope.createNewSchool = function (){


      	var schoolName = $scope.user.schoolName;

        // ####################################################
        // SEND NEW SCHOOL NAME 
        // ####################################################
        
        // IS Succeded update schools name
       
		// this is for hadas
        var schoolsMock2 = $scope.schoolsMock;
        var t = {"S_id":5, "S_Name":schoolName};
        schoolsMock2.push(t);

        // NOTE - MAKE SURE NO DUPLICATE
        // this to be updated for real, You can just push if possible,
        // no need to actually do line 82
        $scope.schools = schoolsMock2;

        // // change server feedback acording to succuss or failure!
        // $scope.serverFeedback = "הקבוצה נוצר בהצלחה, קוד הקבוצה הוא: "
        // $scope.output_groupCode = "1234"; // this will be provided to the user, so he will know the code.
    }

});
