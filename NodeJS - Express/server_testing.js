//dependencies
var express = require('express');
var mysql = require('mysql');
var _ = require('underscore');
var moment = require('moment');
var cors = require('cors');
/*var path = */
require('path');
var app = express();
app.use(cors());
var queries = require("./queryForDB.js");
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/client'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.redirect('/index.html');
});

/*
 app.get('/deleteItems', function (req, res) {
 var querieOfDeletion = "DELETE FROM `textra_db`.`students_per_group` WHERE `StudentId`='12121211' and`GroupId`='123456';"
 + "DELETE FROM `textra_db`.`users` WHERE `PersonalID`='12121211';"
 + "DELETE FROM `textra_db`.`instances_of_answers` WHERE `A_id`='1' and`Q_id`='1' and`T_id`='1' and`studentId`='2';";
 console.log('\n' + querieOfDeletion + '\n');
 connection.query(querieOfDeletion, function (err) {
 if (err) {
 console.log(err);
 res.status(400).send("deletion error");
 }
 else {
 res.status(200).send("Deleted!");
 }
 });

 });*/


app.post('/login', function (req, res) {
    try {
        var user_name = mysql.escape(req.body.user);
        /* user_name can be id or email */
        var password = mysql.escape(req.body.password);

        console.log('Got a login request from: \n' + user_name + "," + password);
        var query = queries.getDataForUserByIdOrEmail(user_name, password);
        console.log("This is the query: " + query);
        connection.query(query, function (err, ans) {
            if (err) {
                console.log("err" + err);
                res.status(400).send("login Fail Error");
            }
            else {
                console.log("ans:" + ans);
                //res.send(row[1]);
                if (ans.length > 0) { /*check if the resault is empty*/
                    res.status(200).json(ans);
                    /*change to user id*/
                    console.log('OK');
                }
                else {
                    res.status(204).send('ERROR');
                    console.log('ERROR \n');
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getListOfTasks', function (req, res) {
    try {
        var user_id = mysql.escape(req.body.user_id);
        var query = queries.gelAllTaskTitleByStudentId(user_id);
        console.log(query);
        connection.query(query, function (err, tasks) {

            if (!err) {
                console.log("got a list of task response");
                console.log(JSON.stringify(tasks));
                if (tasks.length > 0)
                    res.status(200).json(tasks);
                else
                    res.status(204).send("Empty list of tasks");
            } else {
                res.status(400).send("List task had an error - check DB");
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getQuestion', function (req, res) {
    try {
        console.log("Got a question request");
        var user_id = mysql.escape(req.body.user_id);
        var t_id = mysql.escape(req.body.t_id);
        var question = "";
        var tasksQid = queries.getSingleQuestionIdFromTaskIdAndUserId(user_id, t_id);
        console.log("This is the query: " + tasksQid);
        connection.query(tasksQid, function (err, row) {
            if (err) {
                console.log("Error with query for question for task");
            }
            else {
                try {
                    console.log("Got a question id");
                    if (row.length > 0 /*&& row != null*/) {
                        console.log("Question id is larger then one");
                        if (row[0].Q_id != null) {
                            var query = queries.getFullQuestionByQid(row[0].Q_id);
                            console.log(query);
                            console.log("Got full question");
                            connection.query(query, function (err, ans) {
                                try {
                                    var query = queries.getAnswersByTaskAndUser(user_id, t_id);
                                    console.log(query);
                                    connection.query(query, function (err, listOfAnswers) {
                                        console.log("listOfAnswers.length:" + listOfAnswers.length);
                                        if (err) {
                                            console.log(err);
                                            res.send("ERR in question request:" + err);
                                        }
                                        else if (listOfAnswers.length == 0) {
                                            res.status(676).send("No more Question for this task");
                                            /*empty content*/
                                        }
                                        else {
                                            questionFromDB = ans;
                                            var responseJson = {};
                                            responseJson["question"] = questionFromDB[0];
                                            responseJson["answers"] = listOfAnswers;
                                            res.status(200).json(responseJson);
                                        }
                                    });
                                } catch (err) {
                                    console.log("Error - " + err);
                                    res.status(404).send();
                                }
                            });
                        }
                        else {
                            res.status(676);//End of task
                        }
                    }
                    else {
                        console.log("Question id amount is smaller then one");
                        res.status(676).send("End of task");//End of task
                    }
                } catch (err) {
                    console.log("Error - " + err);
                    res.status(404).send();
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/questionDone', function deleteQuestionFromQueue(req, res) {
    try {
        var quest_id = mysql.escape(req.body.quest_id);
        var stud_id = mysql.escape(req.body.user_id);
        var task_id = mysql.escape(req.body.task_id);

        var query2 = queries.deleteQuestionsFromInstance(stud_id, task_id, quest_id);
        console.log('\n' + query2 + '\n');
        connection.query(query2, function (err) {
            if (err) {
                res.status(400).send("Delete action had an error - check DB");
            }
            else {
                res.status(200).send("Delete succeded!");
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/updateAnswer', function (req, res) {
    try {
        var sId = mysql.escape(req.body.user_id);
        var tId = mysql.escape(req.body.task_id);
        var qId = mysql.escape(req.body.quest_id);
        var aId = mysql.escape(req.body.ans_id);
        var query = queries.submitStudentsAnswerForQuestion(sId, tId, qId, aId);
        console.log('\n' + query + '\n');
        connection.query(query, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("Update had an error - check DB");
            }
            else {
                res.status(200).send("Updated!");
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/questionApproveOrNot', function (req, res) {
    try {
        var isApproved = mysql.escape(req.body.is_approved);
        var qId = mysql.escape(req.body.q_id);

        var query = queries.approveQuestion(qId, isApproved);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("Update error - check DB (Question may not exist or value is same!)");
            }
            else {
                if (ans.affectedRows == 0) {
                    res.status(204).send("Update error - check DB (Question may not exist or value is same!)");
                }
                else {
                    res.status(200).send("updated!");
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/disableQuestion', function (req, res) {
    try {
        var disableStatus = mysql.escape(req.body.disable_status);
        var qId = mysql.escape(req.body.q_id);

        var query = queries.approveQuestion(qId, disableStatus);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("Update error - check DB (Question may not exist or value is same!)");
            }
            else {
                if (ans.affectedRows == 0) {
                    res.status(204).send("Update error - check DB (Question may not exist or value is same!)");
                }
                else {
                    res.status(200).send("updated!");
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/addTaskToGroup', function (req, res) {
    try {
        var gId = mysql.escape(req.body.group_id);
        var tId = mysql.escape(req.body.task_id);

        console.log("gId: " + gId);
        console.log("tId: " + tId);

        var query = queries.getStudentsFromGroup(gId);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, students) {
            if (err) {
                console.log(err);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                if (students.length > 0) {
                    var query2 = queries.getQestionsAndTasksForinstance(tId);
                    console.log('\n' + query2 + '\n');
                    connection.query(query2, function (err2, QuestsAndTasks) {
                        if (err2) {
                            console.log(err);
                            res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                        } else {
                            try {
                                var indxStud = 0;
                                var megaQuery = [];

                                while (students.length > indxStud) {
                                    var indxTask = 0;
                                    while (QuestsAndTasks.length > indxTask) {
                                        var s_id = Number(students[indxStud].StudentId);
                                        var t_id = QuestsAndTasks[indxTask].T_id;
                                        var q_id = QuestsAndTasks[indxTask].Q_id;
                                        var query3 = queries.addTaskQuestionStudentInstance(s_id, t_id, q_id);
                                        console.log('\n' + query3 + '\n');
                                        megaQuery[indxTask + indxStud * QuestsAndTasks.length] = query3;
                                        indxTask++;
                                    }
                                    indxStud++;
                                }

                                var bigQuery = megaQuery.join(" ");

                                connection.query(bigQuery, function (err3) {
                                    if (err3) {
                                        console.log(err3);
                                        res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                                    } else {
                                        console.log("Added: " + bigQuery);
                                        res.status(200).send();
                                    }
                                });
                            } catch (err) {
                                console.log("Error - " + err);
                                res.status(404).send();
                            }
                        }
                    });
                }
                else {
                    res.status(200).send();//empty list of group - added to all (actually no one)
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


function makeid() {
    try {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
}


app.post('/createGroup', function (req, res) {
    try {
        var teacherId = mysql.escape(req.body.teacher_id);
        var gName = mysql.escape(req.body.group_name);
        var school = mysql.escape(req.body.school);
        var city = mysql.escape(req.body.city);
        var isTeacherGroup = mysql.escape(req.body.is_teacher_group);
        var groupUserType = mysql.escape(req.body.group_user_type);
        var isMaster = mysql.escape(req.body.is_master);
        var isApp = mysql.escape(req.body.is_approved);
        var gCode = mysql.escape(makeid());

        connection.query(queries.checkIfGroupCodeExists(gCode), function (err, ans) {


            var query = queries.createGroup(gName, school, city, teacherId, isTeacherGroup, isMaster, gCode, groupUserType, isApp);
            console.log('\n' + query + '\n');
            connection.query(query, function (err, ans) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                }
                else {
                    try {
                        if (ans == null || ans.length > 0) {
                            gCode = (makeid() + (Math.floor(Math.random() * 1000)));
                        }
                        var group_id = ans.insertId;
                        var query = queries.getGroupCode(group_id);
                        console.log('\n' + query + '\n');
                        connection.query(query, function (err, ans) {
                            if (err) {
                                console.log(err);
                                res.status(400).send("");
                            }
                            else {
                                res.status(200).send(ans);
                            }
                        });
                    } catch (err) {
                        console.log("Error - " + err);
                        res.status(404).send();
                    }
                }
            });
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/truncateTasksAndStudTable', function (req, res) {
    var query = "TRUNCATE TABLE textra_db.tasks_and_question_for_student_instances;";
    connection.query(query, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send("inserted!");
        }
    });
});


app.post('/removeTestUsersFromGroup', function (req, res) {
    var query = "delete from textra_db.students_per_group where studentId = 3 or 2;";
    connection.query(query, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send("inserted!");
        }
    });
});


app.post('/reportQuestion', function (req, res) {
    try {
        var QID = mysql.escape(req.body.q_id);

        var query = queries.reportQuestion(QID);
        connection.query(query, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error - check DB!");
            }
            else {
                res.status(200).send("reported!");
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/addTestTaskQuestions', function (req, res) {
    var query = "insert into tasks_and_question_for_student_instances values(3,1,1);" +
        "insert into tasks_and_question_for_student_instances" +
        "values(3,1,2);" +
        "insert into tasks_and_question_for_student_instances" +
        "values(3,1,3);" +
        "insert into tasks_and_question_for_student_instances" +
        "values(3,1,4);";
    connection.query(query, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send("inserted!");
        }
    });
});


app.post('/removeRegisterUser', function (req, res) {
    var query = "delete from textra_db.students_per_group where StudentId = 12121211;" +
        "delete from textra_db.users where PersonalID = 12121211;";
    connection.query(query, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send("inserted!");
        }
    });
});


app.post('/truncateInstancesOfAnswers', function (req, res) {
    var query = "TRUNCATE TABLE textra_db.instances_of_answers;";
    connection.query(query, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send("inserted!");
        }
    });
});


app.post('/editQuestion', function (req, res) {

    try {
        var q_id = mysql.escape(req.body.id);
        var q_question = mysql.escape(req.body.question);
        var q_media = mysql.escape(req.body.media);
        var q_correctFB = mysql.escape(req.body.correctFB);
        var q_notCorrectFB = mysql.escape(req.body.notCorrectFB);
        var q_skill = mysql.escape(req.body.skill);
        var q_diff = mysql.escape(req.body.difficulty);
        var q_prof = mysql.escape(req.body.proffesion);
        var q_app = mysql.escape(req.body.approved);
        var q_disabled = mysql.escape(req.body.disabled);

        var query = queries.updateQuestion(q_id, q_question, q_media, q_correctFB, q_notCorrectFB, q_skill, q_diff, q_prof, q_app, q_disabled);
        connection.query(query, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error - check DB!");
            }
            else {
                res.status(200).send("updated!");
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


/*
 app.post('/checkGroup', function (req, res) {
 var groupCode = req.body.group_code;

 var query = queries.getGroupIdfromcode(groupCode);
 console.log('\n' + query + '\n');
 connection.query(query, function (err, isTeacher, field) {
 if (err) {
 console.log(err);
 res.status(400).send("No group found by code error!");
 }
 else {
 res.status(200).send(isTeacher[0].);
 }
 });
 });
 */

app.post('/registerUser', function (req, res) {
    try {
        var personalId = mysql.escape(req.body.personal_id);
        var groupCode = mysql.escape(req.body.group_code);
        var lastName = mysql.escape(req.body.last_name);
        var firstName = mysql.escape(req.body.first_name);
        var userType = mysql.escape(req.body.user_type);
        var email = mysql.escape(req.body.email);
        var password = mysql.escape(req.body.password);

        var query = queries.checkIfEmailExist(email);
        console.log(query);
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.send(400);
            }
            else {
                try {
                    console.log(ans);
                    console.log(ans.length);

                    if (ans.length < 0)
                        res.status(401).send("Email already exists");
                    else {
                        var query = queries.getGroupIdfromcode(groupCode);
                        console.log('\n' + query + '\n');
                        connection.query(query, function (err, groups) {
                            if (err) {
                                console.log(err);
                                res.status(400).send("No group Id found error!");
                            }
                            else {
                                try {
                                    var group_id = groups[0].GroupId;
                                    var query2 = queries.registerUser(personalId, lastName, firstName, userType, email, password);
                                    console.log('\n' + query2 + '\n');
                                    connection.query(query2, function (err) {
                                        if (err) {
                                            console.log(err);
                                            res.status(409).send("Already registered");
                                        }
                                        else {
                                            var query3 = queries.getUserId(email);
                                            console.log('\n' + query3 + '\n');
                                            connection.query(query3, function (err, u_id) {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(400).send("No PersonalID found error!");
                                                }
                                                else {
                                                    try {
                                                        console.log(" u_id[0]: " + JSON.stringify(u_id[0]));
                                                        console.log(" u_id: " + JSON.stringify(u_id));

                                                        var user_id = u_id[0].PersonalID;

                                                        var query4 = queries.addUsersToGroup(user_id, group_id);
                                                        console.log('\n' + query4 + '\n');
                                                        connection.query(query4, function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                                                            }
                                                            else {
                                                                res.status(200).send("Registered!!");
                                                            }
                                                        });
                                                    } catch (err) {
                                                        console.log("Error - " + err);
                                                        res.status(404).send();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } catch (err) {
                                    console.log("Error - " + err);
                                    res.status(404).send();
                                }
                            }
                        });
                    }
                } catch (err) {
                    console.log("Error - " + err);
                    res.status(404).send();
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/addUsersToGroup', function (req, res) {

    try {
        var users = req.body.users;
        var groupId = mysql.escape(req.body.group_id);
        var indx = 0;
        var queriesArr = [];

        if (indx < users.length) {
            while (indx < users.length) {
                var user = users[indx];
                var query = queries.addUsersToGroup(user, groupId);
                console.log('\n' + query + '\n');
                queriesArr[indx] = query;
                indx++;
            }
            if (queriesArr.length > 0) {
                var bigQuery = queriesArr.join(" ");
                connection.query(bigQuery, function (err) {
                    if (err) {
                        console.log(err);
                        // hasError = true;
                        res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");

                    } else {
                        res.status(200).send("inserted!!");
                    }
                });
            }
        }
        else {
            res.status(204).send();
            /*empty content*/
        }
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getGroupByUser', function (req, res) {
    try {
        var teacherId = mysql.escape(req.body.teacher_id);

        var query = queries.getTasks();
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                var query2 = queries.getGroupsByUser(teacherId);

                console.log('\n' + query2 + '\n');
                connection.query(query2, function (err2, ans2) {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Check DB (group/student does not exist or relation error!");
                    }
                    else {
                        groupsOfUser = ans2;
                        var responseJson = {};
                        responseJson["groups"] = groupsOfUser;
                        responseJson["tasks"] = ans;
                        res.status(200).json(responseJson);
                    }
                });
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getAllTasks', function (req, res) {
    try {
        var query = queries.getAllTasks();
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).json(ans);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getMyTasks', function (req, res) {
    try {
        var user_id = mysql.escape(req.body.user_id);
        var query = queries.getMyTasks(user_id);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).json(ans);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getAllApprovedTasks', function (req, res) {
    try {
        var query = queries.getAllApprovedTasks();
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).json(ans);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getMyTasks', function (req, res) {
    try {
        var user_id = mysql.escape(req.body.user_id);
        var query = queries.getMyTasks(user_id);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).json(ans);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/addQuestion', function (req, res) {
    try {
        var qTitle = mysql.escape(req.body.question_title);
        var isMulAns = mysql.escape(req.body.is_multiple_ans);
        var qMediaType = mysql.escape(req.body.question_media_type);
        var qMedia = mysql.escape(req.body.question_media);
        var qCorrFB = mysql.escape(req.body.quest_correct_fb);
        var qIncorrFB = mysql.escape(req.body.quest_incorrect_fb);
        var qSkill = mysql.escape(req.body.quest_skill);
        var qDiff = mysql.escape(req.body.quest_difficulty);
        var qProff = mysql.escape(req.body.quest_proffesion);
        var qIsApp = mysql.escape(req.body.quest_is_approved);
        var qDisabled = mysql.escape(req.body.quest_disabled);
        var qWhoCreated = mysql.escape(req.body.who_created);
        var correctAnswerIndex = req.body.correctAnswerIndex;
        var answers = [];
        answers.push(mysql.escape(req.body.answer1));
        answers.push(mysql.escape(req.body.answer2));
        answers.push(mysql.escape(req.body.answer3));
        answers.push(mysql.escape(req.body.answer4));

        // var answer1 = req.body.answer1;
        // var answer2 = req.body.answer2;
        // var answer3 = req.body.answer3;
        // var answer4 = req.body.answer4;
        // console.log('QPROF: ' + qProff);
        var query = queries.addQustion(qTitle, isMulAns, qMedia, qMediaType, qCorrFB, qIncorrFB,
            qSkill, qDiff, qProff, qIsApp, qDisabled, qWhoCreated);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, ans) {
            if (err) {
                console.log(err);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                try {
                    console.log(ans);
                    console.log("insertId: " + ans.insertId);
                    var insertCommandList = [];
                    var question_id = ans.insertId;
                    // var query = queries.insertAllAnswer(correctAnswer,answer1,answer2,answer3,answer4);
                    var i;
                    for (i = 0; i < answers.length; i++) {
                        if (correctAnswerIndex == i)
                            insertCommandList.push(queries.insertAnswer(question_id, answers[i], 1));
                        else
                            insertCommandList.push(queries.insertAnswer(question_id, answers[i], 0));
                    }
                    var bigQuery = insertCommandList.join(" ");
                    console.log(bigQuery);
                    connection.query(bigQuery, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(400).send();
                        }
                        else {
                            res.status(200).send("inserted!");
                        }

                    });
                } catch (err) {
                    console.log("Error - " + err);
                    res.status(404).send();
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/createTask', function (req, res) {

    try {
        var tTitle = mysql.escape(req.body.t_title);
        var tDesc = mysql.escape(req.body.t_description);
        var tOwner = mysql.escape(req.body.t_owner);
        var tApproved = mysql.escape(req.body.t_approved);
        // var questionsForTask = mysql.escape(req.body.questions);
        var questionsForTask = req.body.questions;
        // console.log("questionsForTask: " + questionsForTask.toString() );
        var query = queries.addNewTask(tTitle, tDesc, tOwner, tApproved);
        console.log('\n' + query + '\n');
        connection.query(query, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                var query2 = queries.getHighestIdFromTable('tasks', 'T_id');
                console.log('\n' + query2 + '\n');
                connection.query(query2, function (err, taskRow) {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                    }
                    else {
                        try {
                            tId = taskRow[0].T_id;
                            var questionsArray = [];
                            // questionsForTask = questionsForTask.split(",");
                            for (i = 0; i < questionsForTask.length; i++) {
                                var qId = questionsForTask[i];
                                questionsArray[i] = queries.joinNewTaskWithQuestion(tId, qId);
                            }

                            var insertStatement = questionsArray.join(" ");
                            console.log(insertStatement);
                            connection.query(insertStatement, function (err) {
                                if (err) {
                                    console.log(err);
                                    res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                                } else {
                                    res.status(200).send("inserted!");
                                }
                            });
                        } catch (err) {
                            console.log("Error - " + err);
                            res.status(404).send();
                        }
                    }
                });
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

/***************MARATON2*****************/
app.post('/getAllTasks', function (req, res) {

    try {
        var query = queries.getTasks();
        console.log('\n' + query + '\n');
        connection.query(query, function (err, tasks) {
            if (err) {
                console.log(err);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                res.status(200).json(tasks);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getAllGroupForTask', function (req, res) {
    try {
        var task_id = mysql.escape(req.body.task_id);
        var teacher_id = mysql.escape(req.body.teacher_id);
        var query = queries.chooseGroupsAvalibleToTask(task_id, teacher_id);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, groups) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (groups.length > 0)
                    res.status(200).json(groups);
                else
                    res.status(204).send();
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/checkIfGroupCodeExists', function (req, res) {
    try {
        var groupCode = mysql.escape(req.body.group_code);
        var query = queries.checkIfGroupCodeExists(groupCode);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, isTeacher) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (isTeacher.length == 0)
                    res.status(204).send();//
                else
                    res.status(200).send(isTeacher);//
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getStudentListFromGroupId', function (req, res) {
    var groupId = mysql.escape(req.body.group_id);
    try {
        var query = queries.getStudentsFromGroup(groupId);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfStudents) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send(listOfStudents);//
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getGroupsBySchool', function (req, res) {
    try {
        var schoolName = mysql.escape(req.body.school);
        var query = queries.getGroupsBySchool(schoolName);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfGroups) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send(listOfGroups);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getValidQuestions', function (req, res) {
    try {
        var isApproved = mysql.escape(req.body.is_app);
        var isDisabled = mysql.escape(req.body.is_disabled);
        var query = queries.getValidQuestions(isApproved, isDisabled);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfQuestions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send(listOfQuestions);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/generateRandTask', function (req, res) {

    try {
        var stud_id = req.body.student_id;
        var tTitle = "מטלה לתרגול עצמאי";
        var tOwner = 6;
        var tApproved = 1;
        var num = req.body.rand_num;
        var media_types = req.body.media_types.split(",");
        var skills = req.body.skills.split(",");
        var difficulties = req.body.difficulties.split(",");

        var tDesc = "המטלה נוצרה ב- " + moment().format('l') + " , " + moment().format('LTS');

        var query = queries.addNewTask(tTitle, tDesc, tOwner, tApproved);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, taskRow) {
            if (err) {
                console.log(err, taskRow);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                try { // if (taskRow.length > 0) {
                    var tId = taskRow.insertId;
                    // [0].T_id;
                    // var query = queries.getQuestionsByParamter(JSON.stringify(media_types[0]), JSON.stringify(skills[0]),
                    //     JSON.stringify(difficulties[0]));
                    var query = queries.getQuestionsByParamter(
                        JSON.stringify(media_types).toString().replace("[", "").replace("]", ""),
                        JSON.stringify(skills).toString().replace("[", "").replace("]", ""),
                        JSON.stringify(difficulties).toString()).replace("[", "").replace("]", "");
                    console.log('\n' + query + '\n');
                    connection.query(query, function (err, questions) {
                        if (err) {
                            console.log(err);
                            res.status(400).send("DB error");
                        } else {
                            try {
                                var questionsArray = [];

                                if (questions.length >= num) {
                                    var questIds = _.sample(questions, num);

                                    for (var i = 0; i < num; i++) {
                                        questionsArray[i] = queries.joinNewTaskWithQuestion(tId, questIds[i].Q_id);
                                    }

                                    var insertStatement = questionsArray.join(" ");

                                    connection.query(insertStatement, function (err) {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                                        } else {
                                            try {
                                                var megaQuery = [];

                                                var index = 0;

                                                while (questIds.length > index) {
                                                    var qid = questIds[index].Q_id;
                                                    var query3 = queries.addTaskQuestionStudentInstance(stud_id, tId, qid);
                                                    console.log('\n' + query3 + '\n');
                                                    megaQuery[index] = query3;
                                                    index++;
                                                }
                                                var bigQuery = megaQuery.join(" ");
                                                connection.query(bigQuery, function (err3) {
                                                    if (err3) {
                                                        console.log(err3);
                                                        res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                                                    } else {
                                                        console.log("Added: " + bigQuery);
                                                        res.status(200).send(tId.toString());
                                                    }
                                                });
                                            } catch (err) {
                                                console.log("Error - " + err);
                                                res.status(404).send();
                                            }
                                        }
                                    });
                                }
                                else {
                                    res.status(415).send("Not Enough questions to generate task by filtering");
                                }
                            } catch (err) {
                                console.log("Error - " + err);
                                res.status(404).send();
                            }
                        }
                    });
                } catch (err) {
                    console.log("Error - " + err);
                    res.status(404).send();
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getGroupsByTeacherAndCity', function (req, res) {
    try {
        var teacherId = mysql.escape(req.body.teacher_id);
        var CityName = mysql.escape(req.body.city);
        var query = queries.getGroupsByTeacherAndCity(teacherId, CityName);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfQuestions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send(listOfQuestions);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getAllTeachersBySchoolAndCity', function (req, res) {
    try {
        var school = mysql.escape(req.body.school);
        var CityName = mysql.escape(req.body.city);
        var query = queries.getTeachesByCityAndSchool(CityName, school);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfTeachers) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                try {
                    if (listOfTeachers.length > 0) {
                        var indexOfTeacher = 0;
                        var query = queries.getUserById(listOfTeachers[indexOfTeacher].teacherID);
                        if (listOfTeachers.length > 1) {
                            indexOfTeacher = indexOfTeacher + 1;
                            while (indexOfTeacher < listOfTeachers.length) {
                                query = query + " or PersonalID = " + listOfTeachers[indexOfTeacher].teacherID;
                                indexOfTeacher = indexOfTeacher + 1;
                            }
                        }
                        query = query + ";";
                        console.log('\n' + query + '\n');
                        connection.query(query, function (err, fullListOfTeachers) {
                            if (err) {
                                console.log(err);
                                res.status(400).send("DB error");
                            } else {
                                res.status(200).send(fullListOfTeachers);
                            }
                        });
                    }
                } catch (err) {
                    console.log("Error - " + err);
                    res.status(404).send();
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getAllStudentForGroup', function (req, res) {
    try {
        var group_id = mysql.escape(req.body.group_id);
        var query = queries.getAllStudentForGroup(group_id);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfStudents) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (listOfStudents.length == 0) {
                    res.status(204).send();
                }
                else {
                    res.status(200).send(listOfStudents);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getAllGroupForTeacher', function (req, res) {
    try {
        var user_id = mysql.escape(req.body.user_id);
        console.log(user_id);
        var query = queries.getAllGroupForTeacher(user_id);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, groups) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (groups.length == 0) {
                    res.status(204).send();
                }
                else {
                    res.status(200).send(groups);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getAllSchollByCity', function (req, res) {
    try {
        var city = mysql.escape(req.body.city);
        var query = queries.getAllSchollByCity(city);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, schools) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (schools.length == 0) {
                    res.status(204).send();
                }
                else {
                    res.status(200).send(schools);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getGroupBySchoolAndCity', function (req, res) {
    try {
        var city = mysql.escape(req.body.city);
        var school = mysql.escape(req.body.school);
        var query = queries.getGroupBySchoolAndCity(school, city);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, groups) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (groups.length == 0) {
                    res.status(204).send();
                }
                else {
                    res.status(200).send(groups);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/addNewSchool', function (req, res) {
    try {
        var city = mysql.escape(req.body.city);
        var school = mysql.escape(req.body.school);
        var query = queries.addNewSchool(city, school);
        console.log('\n' + query + '\n');
        connection.query(query, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send();
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getReported', function (req, res) {
    try {
        var query = "select * from textra_db.questions where Q_reported>=1;";
        console.log('\n' + query + '\n');
        connection.query(query, function (err, questions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (questions != null && questions.length == 0) {
                    res.status(204).send();
                }
                res.status(200).send(questions);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getApprovedQuestion', function (req, res) {
    try {
        var query = "select * from textra_db.questions where Q_approved=1;";
        console.log('\n' + query + '\n');
        connection.query(query, function (err, questions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (questions != null && questions.length == 0) {
                    res.status(204).send();
                }
                res.status(200).send(questions);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/getUnapprovedQuestion', function (req, res) {
    try {
        var query = "select * from textra_db.questions where Q_approved=0;";
        console.log('\n' + query + '\n');
        connection.query(query, function (err, questions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (questions != null && questions.length == 0) {
                    res.status(204).send();
                }
                res.status(200).send(questions);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getQuestionsByParamter', function (req, res) {
    try {
        var media_types = mysql.escape(req.body.media_types.split(","));
        var skills = mysql.escape(req.body.skills.split(","));
        var difficulties = mysql.escape(req.body.difficulties.split(","));
        var user_id = mysql.escape(req.body.user_id);

        var query = queries.getQuestionsByParamterAndId(media_types, skills, difficulties, user_id);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, questions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (questions.length == 0) {
                    res.status(204).send();
                }
                else {
                    res.status(200).send(questions);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

app.post('/getAllSkills', function (req, res) {

    try {
        var query = queries.getAllSkills();
        console.log('\n' + query + '\n');
        connection.query(query, function (err, skills) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (skills.length == 0) {
                    res.status(204).send();
                }
                else {
                    res.status(200).send(skills);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


app.post('/sendTaskToStudents', function (req, res) {
    try {
        var studentsArray = JSON.parse(req.body.students);
        var taskId = req.body.task_id;

        if (studentsArray == null || studentsArray.length > 0) {
            var query = queries.getQestionsListForTasks(taskId);
            console.log('\n' + query + '\n');
            connection.query(query, function (err, questions) {
                if (err) {
                    console.log(err);
                    res.status(400).send("DB error");
                }
                else {
                    try {
                        if (questions == null || questions.length == 0) {
                            res.status(204).send();
                        }
                        else {
                            var questionsArray = [];
                            var j = 0;
                            while (j < studentsArray.length) {
                                var i = 0;
                                while (i < questions.length) {
                                    questionsArray[i + j * questions.length] = queries.addTaskQuestionStudentInstance(studentsArray[j], taskId, questions[i].Q_id);
                                    i++;
                                }
                                j++;
                            }
                            var bigQuery = questionsArray.join(" ");
                            console.log('\n' + bigQuery + '\n');
                            connection.query(bigQuery, function (err, ans) {
                                if (err) {
                                    console.log(err);
                                    res.status(400).send("DB error");
                                }
                                else {
                                    res.status(200).send();
                                }
                            });
                        }
                    } catch (err) {
                        console.log("Error - " + err);
                        res.status(404).send();
                    }
                }
            });
        }
        else {
            res.status(204).send("No Students selected");
        }
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r',//'123456' to upload*/
    database: 'textra_db',
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
        console.log("Connection Error")
    }
});


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});

// TODO - Hadas you need this/TESTS!!!
// app.listen(8081, "127.0.0.1", function () {
//     console.log("App is running ");
// });

setInterval(function () {
    connection.query('SELECT 1');
}, 5000);


module.exports = app;
