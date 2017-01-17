module.exports = 
{

	/* get groups_id for student (by id)*/
	getGroupsIdByStudentId : function(student_id){
		var query = "SELECT * FROM textra_db.students_per_group where StudentId ='" + student_id + "'";	
		return query;
	},

	/*get user data*/
	getAllDataForUser : function(user_name,password){
		var query = "SELECT * FROM textra_db.users "+
  				"WHERE FirstName = \'"+user_name+"\' and Pass = \'" + password+"\';";
		return query;
	},

	/*get all task's title for student*/
	gelAllTaskTitleByStudentId : function (user_id){
		var query = "SELECT T_title from tasks JOIN tasks_and_question_for_student_instances ON tasks.T_id" +
		"= tasks_and_question_for_student_instances.taskId WHERE studentId ="
		+ user_id + ";";

		return query;
	},

	/*get all task's title and task's id for student*/
	gelAllTaskDataByStudentId : function (user_id){
		/*select task_id, title from task_for_questuin_for*/
		var query = "SELECT T_title,T_id,T_description from tasks JOIN tasks_and_question_for_student_instances ON tasks.T_id"
		+"= tasks_and_question_for_student_instances.taskId WHERE studentId ="
		+ user_id + ";";

		return query;
	},

	getQuestionIDForTask : function (user_id,taks_id){
		var query = "select Q_id from tasks_and_question_for_student_instances where studentId=" +user_id+ "and taskId =" +  task_id +";" ; 
		return query;
	},

	getQuestionDataForTask : function (q_id){
		var query = 
		"SELECT * FROM textra_db.questions where Q_id ="+ q_id +";";
		return query;
	},

	/* 
	*/
	getNumberOfCorrectAnswersForTask : function (taks_id){
		/*
				SELECT T1.studentId,T1.taskId,T1.Q_id,T1.A_id 
		FROM textra_db.mother_of_all_tables AS T1, textra_db.mother_of_all_tables AS T2
		where T1.studentId=2 and T1.taskId=1	 
		and T2.studentId=2 and T2.taskId=1
		and T1.Q_id = T2.Q_id 
		and T1.instanceTime > T2.instanceTime
		;
		*/
	},
	
	getAllAnswersToQuestion : function (q_id){
		var query = "SELECT * FROM textra_db.answers where Q_id ="+  q_id + ";" ;
	},

	
	
/*
	updateAnsForQuestion : function (user_id,taskId,q_id){

	}
*/



/*
	getPasswordForPersonalID : function (PersonalID){
		var query = "SELECT Pass FROM textra_db.users where FirstName='" +name + "';";	
	}
*/
};

/*
private function!
*/


/*need to add var queries = require("./queryForDB.js"); */
