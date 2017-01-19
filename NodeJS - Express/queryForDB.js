module.exports = 
{

	/* get all groups_id by student id*/
	getGroupsIdByStudentId : function(student_id){
		var query = "SELEC T * FROM textra_db.students_per_group where StudentId ='" + student_id + "'";	
		return query;
	},

	/*get user data (names,school name,user type) by user identifier (id or email) and password*/
	getDataForUserByIdOrEmail : function(user_identifier,password){
		var query = "SELECT FirstName,LastName,School,UserType FROM textra_db.users "+
  				"WHERE (PersonalID like \'"+user_identifier+"\' or Email like \'"+user_identifier+"\')  and Pass like \'" + password+"\';";
		return query;
	},


	/*not in use*/
	/*get user data (names,school name,user type) by id and password*/
	getDataForUserById : function(id,password){
		var query = "SELECT FirstName,LastName,School,UserType FROM textra_db.users "+
  				"WHERE PersonalID like \'"+id+"\' and Pass like \'" + password+"\';";
		return query;
	},

	/*not in use*/
	/*get user data (names,school name,user type) by email and password*/
	getDataForUserByEmail : function(email,password){
		var query = "SELECT FirstName,LastName,School,UserType FROM textra_db.users "+
  				"WHERE Email like \'"+email+"\' and Pass like \'" + password+"\';";
		return query;
	},

	/*get all tasks's information (id,title and description) by student id*/
	gelAllTaskTitleByStudentId : function (user_id){
		var query = 
	
		"select tasks.* from " + 
		"(select T_id " + 
		"from tasks_and_question_for_student_instances " + 
		"where studentId like \'1\' "+ 
		"group by (T_id)) as t1 " + 
		"inner join tasks " +
		"on t1.T_id like tasks.T_id;";
		
		return query;
	},

	
	/*get all question data by question id*/
	getQuestionDataForTask : function (q_id){
		var query = 
		"SELECT * FROM textra_db.questions where Q_id ="+ q_id +";";
		return query;
	},

	/* not yet final. will update in the maraton (see notes.txt file)
	get number of correct answer for a task by task id and student id
	return 2 attribute - number of correct ans | number of total qustion in task
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

	getQustionByTaskAndUserID(user_id,t_id){
		var query = 
		"select questions.* " + 
		"from tasks_and_question_for_student_instances " + 
		"join questions " + 
		"on tasks_and_question_for_student_instances.T_id = " + t_id + 
		" and tasks_and_question_for_student_instances.studentID = " + user_id + 
		" and tasks_and_question_for_student_instances.Q_id = questions.Q_id " +
		"limit 1;" ; 
		return query;
	},

	
	SubmitStudentsAnswerForQuestion : function (student_id, task_id, q_id, a_id){
		var query = "insert into textra_db.instances_of_answers " + 
		"values(null," + student_id + "," + task_id + "," + q_id + "," + a_id + ");\n";
		return query;
	},

	DeleteQuestionsFromInstance : function (student_id, task_id, q_id){
		var query = "delete from textra_db.tasks_and_question_for_student_instances where studentId like \'" + 
		student_id + "\' and T_id = " + task_id + " and Q_id = " + q_id + ";";
		return query;
	},
};

/*
private function!
*/

/*need to add var queries = require("./queryForDB.js"); */


