module.exports = 
{

	/* get all groups_id for some student (by id)*/
	getGroupsIdByStudentId : function(student_id){
		var query = "SELECT * FROM textra_db.students_per_group where StudentId ='" + student_id + "'";	
		return query;
	},

	/*get user data by use id and password*/
	getDataForUserByIdOrEmail : function(user_identifier,password){
		var query = "SELECT FirstName,LastName,School,UserType FROM textra_db.users "+
  				"WHERE (PersonalID like \'"+user_identifier+"\' or Email like \'"+user_identifier+"\')  and Pass like \'" + password+"\';";
		return query;
	},


	/*get user data by use id and password*/
	getDataForUserById : function(id,password){
		var query = "SELECT FirstName,LastName,School,UserType FROM textra_db.users "+
  				"WHERE PersonalID like \'"+id+"\' and Pass like \'" + password+"\';";
		return query;
	},

	/*get user data by use email and password*/
	getDataForUserByEmail : function(email,password){
		var query = "SELECT FirstName,LastName,School,UserType FROM textra_db.users "+
  				"WHERE Email like \'"+email+"\' and Pass like \'" + password+"\';";
		return query;
	},

	/*need to re-check!!!!! - not working*/
	/*get all task's title for student*/
	gelAllTaskTitleByStudentId : function (user_id){
		var query = "select tasks.T_id , tasks.T_title" + 
					"from tasks" + 
					"inner join" + 
					"(select T_id" + 
					"from question_for_student" + 
					"where studentId =\'1\'" + 
					"group by (studentId)" + 
					") as t1" + 
					"where t1.T_id like tasks.T_id;"  ;

		return query;
	},
	
	getQuestionDataForTask : function (q_id){
		var query = 
		"SELECT * FROM textra_db.questions where Q_id ="+ q_id +";";
		return query;
	},

	/* 
	*/
	getNumberOfCorrectAnswersForTask : function (taks_id,student_id){
		var query = 
		"select * from" + 
			"(select * from" +  
			"(select *" + 
			"from textra_db.mother_of_all_tables" +  
			"where studentId = " + student_id + 
			"and taskId =" + task_id + 
			"order by instanceTime desc) as t1 /* this sort by instance time and requested value */" + 
			"group by studentId,taskId,Q_id) as t2 /*this remove the first record (if exist)*/" + 
	    "inner join textra_db.answers /*in order to check if the answer is correctanswers*/" +
	    "on textra_db.answers.Q_id= t2.Q_id" + 
	    "and textra_db.answers.A_id= t2.A_id " + 
		"and isCorrect=1;" ;
		return query;
	},
	
	getAllAnswersToQuestion : function (q_id){
		var query = "SELECT * FROM textra_db.answers where Q_id ="+  q_id + ";" ;
		return query;
	},

	
	
};

/*
private function!
*/

/*need to add var queries = require("./queryForDB.js"); */
