module.exports = 
{

	/* get all groups_id by student id*/
	getGroupsIdByStudentId : function(student_id){
		var query = "SELEC T * FROM textra_db.students_per_group where StudentId ='" + student_id + "'";	
		return query;
	},

	/*get user data (names,school name,user type) by user identifier (id or email) and password*/
	getDataForUserByIdOrEmail : function(user_identifier,password){
		var query = "SELECT * FROM textra_db.users "+
  				"WHERE (PersonalID like \'%"+user_identifier+"%\' or Email like \'%"+user_identifier+"%\')  and Pass like \'%" + password+"%\';";
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
		"where studentId like \'"+ user_id +"\' " +
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
	*return 2 attribute - number of correct ans | number of total qustion in task
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
	
	getNumberOfQuestionForTask :function (t_id){
		var query = "select count(*) as numberOfQuestion from tasks_joined_with_questions where T_id =" +
		t_id + ";"
		return query;
	},

	getAnswersByTaskAndUser : function(user_id,t_id){
		var query ="select "+/*T.Q_id, T.Q_qeustion, T.isMultipuleAns, T.Q_correctFB, T.Q_notCorrectFB,*/" answers.A_id, " +
			"answers.answer, answers.isCorrect from ((select * from questions " +
			"where questions.Q_id = (select questions.Q_id from tasks_and_question_for_student_instances " +
			"join questions on tasks_and_question_for_student_instances.T_id = \'" + t_id + "\'" +
			"and tasks_and_question_for_student_instances.studentID = \'" + user_id + "\' " +
			"and tasks_and_question_for_student_instances.Q_id = questions.Q_id limit 1))" +
			"as T JOIN answers on T.Q_id = answers.Q_id);"
		return query;
	},
/*

	getQustionByTaskAndUserID : function(user_id,t_id){
		var query =
		"select questions.* " +
		"from tasks_and_question_for_student_instances " +
		"join questions " +
		"on tasks_and_question_for_student_instances.T_id = " + t_id +
		" and tasks_and_question_for_student_instances.studentID = " + user_id +
		" and tasks_and_question_for_student_instances.Q_id = questions.Q_id " +
		";" ;
		return query;
	},
*/

	
	SubmitStudentsAnswerForQuestion : function (student_id, task_id, q_id, a_id){
		var query = "insert into textra_db.instances_of_answers " +
		"values(current_timestamp," + student_id + "," + task_id + "," + q_id + "," + a_id + ");\n";
		return query;
	},
//delete from textra_db.tasks_and_question_for_student_instances where studentId like '2' and T_id = '1' and Q_id = '1'
	DeleteQuestionsFromInstance : function (student_id, task_id, q_id){
		var query = "delete from textra_db.tasks_and_question_for_student_instances where studentId like \'" + 
		student_id + "\' and T_id = \'" + task_id + "\' and Q_id = \'" + q_id + "\';";
		return query;
	},

	getTaskDeatils:function (t_id) {
		var query = "select * from textra_db.tasks where T_id like /'%" + t_id + "%'/";
		return query;
    },

	getFullQuestionByQid:function (q_id) {
		var query = "select T.Q_id, T.Q_qeustion, T.isMultipuleAns, " +
			"T.Q_correctFB, T.Q_mediaType, T.Q_media," +
			"T.Q_notCorrectFB, T.Q_skill, T.Q_difficulty," +
            "T.Q_proffession, T.Q_approved, T.Q_disabled " +
			"from (select * from questions where questions.Q_id = \'" + q_id + "\') as T;";
			return query;
    },
	getSingleQuestionIdFromTaskIdAndUserId:function (user_id, t_id) {
		var query = "SELECT Q_id FROM textra_db.tasks_and_question_for_student_instances " +
			"where studentId = " + user_id + " and T_id = " + t_id + " limit 1;";
			return query;
    },

    getAnswersByTidQidSid:function (/*s_id, t_id, */q_id) {
        var query = "select * from textra_db.tasks where Q_id like /'" + q_id + "'/";
        return query;
    }

};

/*
private function!
*/

/*need to add var queries = require("./queryForDB.js"); */


