module.exports =
    {
        /*get user data (names,school name,user type) by user identifier (id or email) and password*/
        getDataForUserByIdOrEmail: function (user_identifier, password) {
            var query = "SELECT * FROM textra_db.users " +
                "WHERE (PersonalID like \'" + user_identifier + "\' or Email like \'" + user_identifier + "\')  and Pass like \'" + password + "\';";
            return query;
        },

        /*get all tasks's information (id,title and description) by student id*/
        gelAllTaskTitleByStudentId: function (user_id) {
            var query =

                "select tasks.* from " +
                "(select T_id " +
                "from tasks_and_question_for_student_instances " +
                "where studentId like \'" + user_id + "\' " +
                "group by (T_id)) as t1 " +
                "inner join tasks " +
                "on t1.T_id like tasks.T_id;";

            return query;
        },

        //TODO - check if needed
        /* not yet final. will update in the maraton (see notes.txt file)
         get number of correct answer for a task by task id and student id
         *return 2 attribute - number of correct ans | number of total qustion in task
         */
        getNumberOfCorrectAnswersForTask: function (taks_id, student_id) {
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
                "and isCorrect=1;";
            return query;
        },

        getNumberOfQuestionForTask: function (t_id) {
            var query = "select count(*) as numberOfQuestion from tasks_joined_with_questions where T_id =" +
                t_id + ";"
            return query;
        },

        getAnswersByTaskAndUser: function (user_id, t_id) {
            var query = "select " + /*T.Q_id, T.Q_qeustion, T.isMultipuleAns, T.Q_correctFB, T.Q_notCorrectFB,*/" answers.A_id, " +
                "answers.answer, answers.isCorrect from ((select * from questions " +
                "where questions.Q_id = (select questions.Q_id from tasks_and_question_for_student_instances " +
                "join questions on tasks_and_question_for_student_instances.T_id = \'" + t_id + "\'" +
                "and tasks_and_question_for_student_instances.studentID = \'" + user_id + "\' " +
                "and tasks_and_question_for_student_instances.Q_id = questions.Q_id limit 1))" +
                "as T JOIN answers on T.Q_id = answers.Q_id);"
            return query;
        },

        SubmitStudentsAnswerForQuestion: function (student_id, task_id, q_id, a_id) {
            var query = "insert into textra_db.instances_of_answers " +
                "values(current_timestamp," + student_id + "," + task_id + "," + q_id + "," + a_id + ");\n";
            return query;
        },

        //delete from textra_db.tasks_and_question_for_student_instances where studentId like '2' and T_id = '1' and Q_id = '1'
        DeleteQuestionsFromInstance: function (student_id, task_id, q_id) {
            var query = "delete from textra_db.tasks_and_question_for_student_instances where studentId like \'" +
                student_id + "\' and T_id = \'" + task_id + "\' and Q_id = \'" + q_id + "\';";
            return query;
        },

        getTasks: function () {
            var query = "select * from textra_db.tasks;";
            return query;
        },

        addUsersToGroup: function (user_id, group_id) {
            var query = "insert into textra_db.students_per_group values (" + user_id + "," + group_id + ");";
            return query;
        },

        getGroupsByUser: function (user_id) {
            var query = "SELECT * FROM textra_db.groups where teacherID = " + user_id + ";";
            return query;
        },

        getStudentsFromGroup: function (group_id) {
            var query = "SELECT StudentId FROM textra_db.students_per_group where GroupId = " + group_id + ";";
            return query;
        },

        getUserId: function (email) {
            var query = "SELECT PersonalID FROM textra_db.users where Email = '" + email + "';";
            return query;
        },

        getQestionsAndTasksForinstance: function (t_id) {
            var query = "select T_id, Q_id from textra_db.tasks_joined_with_questions where T_id = " + t_id + ";";
            return query;
        },

        addTaskQuestionStudentInstance: function (stud_id, t_id, q_id) {
            var query = "insert into textra_db.tasks_and_question_for_student_instances values(" + stud_id + "," + t_id + "," + q_id + ");";
            return query;
        },

        addQustion: function (question_title, isMultipleAns, question_media, question_media_type,
                              quest_correct_FB, quest_incorrect_FB, quest_skill, quest_difficulty, quest_proffesion,
                              quest_is_approved, quest_disabled, quest_creator) {
            var query = "INSERT INTO textra_db.questions VALUES (null,'" + question_title + "','" + isMultipleAns + "','"
                + question_media_type + "','" + question_media + "','" + quest_correct_FB + "','" + quest_incorrect_FB + "','"
                + quest_skill + "','" + quest_difficulty + "','" + quest_proffesion + "','" + quest_is_approved + "','"
                + quest_disabled + "','" + quest_creator + "');";
            return query;
        },

        createGroup: function (g_id, g_name, teacher_id, is_master_g, g_code) {
            var query = "INSERT INTO textra_db.groups VALUES (" + g_id + "," +
                "'" + g_name + "'," + teacher_id + "," + is_master_g + "," + g_code + ");";
            return query;
        },

        getGroupIdfromcode: function (g_code) {
            var query = "select GroupId from textra_db.groups where GroupeCode = " + g_code + ";";
            return query;
        },

        registerUser: function (lastName, firstName, school, city, userType, email, password) {
            var query = "insert into textra_db.users values(null, '" + lastName + "', '" + firstName + "',' " + school
                + "', '" + city + "', '" + userType + "', '" + email + "', '" + password + "');";
            return query;
        },

        approveQuestion: function (q_id, isApproved) {
            var query = "UPDATE textra_db.questions SET Q_approved = " + isApproved + " WHERE Q_id = " + q_id + ";";
            return query;
        },

        getFullQuestionByQid: function (q_id) {
            var query = "select T.Q_id, T.Q_qeustion, T.isMultipuleAns, " +
                "T.Q_correctFB, T.Q_mediaType, T.Q_media," +
                "T.Q_notCorrectFB, T.Q_skill, T.Q_difficulty," +
                "T.Q_proffession, T.Q_approved, T.Q_disabled " +
                "from (select * from questions where questions.Q_id = \'" + q_id + "\') as T;";
            return query;
        },

        getSingleQuestionIdFromTaskIdAndUserId: function (user_id, t_id) {
            var query = "SELECT Q_id FROM textra_db.tasks_and_question_for_student_instances " +
                "where studentId = " + user_id + " and T_id = " + t_id + " limit 1;";
            return query;
        },

        //TODO check if needed..
        /*getAnswersByTidQidSid: function (/!*s_id, t_id, *!/q_id) {
         var query = "select * from textra_db.tasks where Q_id like /'" + q_id + "'/";
         return query;
         }*/
        addNewTask: function (t_title, t_description, t_owner, t_approved) {
            var query = "insert into textra_db.tasks values(null,'" + t_title + "','" + t_description + "',"
                + t_owner + "," + t_approved + ");";
            return query;
        },

        joinNewTaskWithQuestion: function (t_id, q_id) {
            var query = "insert into textra_db.tasks values(" + t_id + "," + q_id + ");";
            return query;
        }


    };