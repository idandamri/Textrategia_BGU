//dependencies
var express = require('express');
var mysql = require('mysql');
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
    var user_name = req.body.user;
    /* user_name can be id or email */
    var password = req.body.password;

    console.log('Got a login request from: \n\n!!!\n\n' + user_name + "," + password);
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
                res.status(401).send('ERROR');
                console.log('ERROR \n');
            }
        }
    });
});


app.post('/getListOfTasks', function (req, res) {
    var user_id = req.body.user_id;
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
});


app.post('/getQuestion', function (req, res) {
    console.log("Got a question request");
    var user_id = req.body.user_id;
    var t_id = req.body.t_id;
    var question = "";
    var tasksQid = queries.getSingleQuestionIdFromTaskIdAndUserId(user_id, t_id);
    connection.query(tasksQid, function (err, row) {
        if (err) {
            console.log("Error with query for question for task");
        }
        else {
            console.log("Got a question id");
            if (row.length > 0 /*&& row != null*/) {
                console.log("Question id is larger then one");
                if (row[0].Q_id != null) {
                    var query = queries.getFullQuestionByQid(row[0].Q_id);
                    console.log(query);
                    console.log("Got full question");
                    connection.query(query, function (err, ans) {
                        var query = queries.getAnswersByTaskAndUser(user_id, t_id);
                        console.log(query);
                        connection.query(query, function (err, listOfAnswers) {
                            console.log("listOfAnswers.length:" + listOfAnswers.length);
                            if (err) {
                                console.log(err);
                                res.send("ERR in question request:" + err);
                            }
                            else if (listOfAnswers.length == 0) {
                                res.status(204).send("No more Question for this task");
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
        }
    });
});


app.post('/questionDone', function deleteQuestionFromQueue(req, res) {
    var quest_id = req.body.quest_id;
    var stud_id = req.body.user_id;
    var task_id = req.body.task_id;

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
});


app.post('/updateAnswer', function (req, res) {
    var sId = req.body.user_id;
    var tId = req.body.task_id;
    var qId = req.body.quest_id;
    var aId = req.body.ans_id;
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
});


app.post('/questionApproveOrNot', function (req, res) {
    var isApproved = req.body.is_approved;
    var qId = req.body.q_id;

    var query = queries.approveQuestion(qId, isApproved);
    console.log('\n' + query + '\n');
    connection.query(query, function (err, ans) {
        if (err) {
            console.log(err);
            res.status(400).send("Update error - check DB (Question may not exist or value is same!)");
        }
        else {
            if (ans.affectedRows == 0) {
                res.status(400).send("Update error - check DB (Question may not exist or value is same!)");
            }
            else {
                res.status(200).send("updated!");
            }
        }
    });
});


app.post('/addTaskToGroup', function (req, res) {
    var gId = req.body.group_id;
    var tId = req.body.task_id;

    var query = queries.getStudentsFromGroup(gId);
    console.log('\n' + query + '\n');
    connection.query(query, function (err, students) {
        if (err) {
            console.log(err);
            res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
        }
        else {
            var query2 = queries.getQestionsAndTasksForinstance(tId);
            console.log('\n' + query2 + '\n');
            connection.query(query2, function (err2, QuestsAndTasks) {
                if (err2) {
                    console.log(err);
                    res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                } else {
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
                }
            });
        }
    });
});


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


app.post('/createGroup', function (req, res) {
    var teacherId = req.body.teacher_id;
    var gName = req.body.group_name;
    var school = req.body.school;
    var city = req.body.city;
    var isTeacherGroup = req.body.is_teacher_group;
    var groupUserType = req.body.group_user_type;
    var isMaster = req.body.is_master;
    var isApp = req.body.is_approved;
    var gCode = makeid();

    var query = queries.createGroup(gName, school, city, teacherId, isTeacherGroup, isMaster, gCode, groupUserType, isApp);
    console.log('\n' + query + '\n');
    connection.query(query, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
        }
        else {
            res.status(200).send("inserted!");
        }
    });
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
    var personalId = req.body.personal_id;
    var groupCode = req.body.group_code;
    var lastName = req.body.last_name;
    var firstName = req.body.first_name;
    var userType = req.body.user_type;
    var email = req.body.email;
    var password = req.body.password;

    var query = queries.checkIfEmailExist(email);
    console.log(query);
    connection.query(query, function (err, ans) {
        if (err) {
            console.log(err);
            res.send(400);
        }
        else {
            console.log(ans);
            console.log(ans.length);

            if (ans.length > 0)
                res.send(401);
            else {
                var query = queries.getGroupIdfromcode(groupCode);
                console.log('\n' + query + '\n');
                connection.query(query, function (err, groups) {
                    if (err) {
                        console.log(err);
                        res.status(400).send("No group Id found error!");
                    }
                    else {
                        var group_id = groups[0].GroupId;

                        var query2 = queries.registerUser(personalId, lastName, firstName, userType, email, password);
                        console.log('\n' + query2 + '\n');
                        connection.query(query2, function (err) {
                            if (err) {
                                console.log(err);
                                res.status(409).send("Insertion error - check DB (student does not exist or relation) error!");
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
                                    }
                                });
                            }
                        });
                    }
                });


            }
        }
    });
});


app.post('/addUsersToGroup', function (req, res) {

    var users = req.body.users;
    var groupId = req.body.group_id;
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
});


app.post('/getGroupByUser', function (req, res) {
    var teacherId = req.body.teacher_id;

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
});


app.post('/addQuestion', function (req, res) {
    var qTitle = req.body.question_title;
    var isMulAns = req.body.is_multiple_ans;
    var qMediaType = req.body.question_media_type;
    var qMedia = req.body.question_media;
    var qCorrFB = req.body.quest_correct_fb;
    var qIncorrFB = req.body.quest_incorrect_fb;
    var qSkill = req.body.quest_skill;
    var qDiff = req.body.quest_difficulty;
    var qProff = req.body.quest_proffesion;
    var qIsApp = req.body.quest_is_approved;
    var qDisabled = req.body.quest_disabled;
    var qWhoCreated = req.body.who_created;
    var correctAnswerIndex = req.body.correctAnswerIndex;
    var answers = [];
    answers.push(req.body.answer1);
    answers.push(req.body.answer2);
    answers.push(req.body.answer3);
    answers.push(req.body.answer4);

    // var answer1 = req.body.answer1;
    // var answer2 = req.body.answer2;
    // var answer3 = req.body.answer3;
    // var answer4 = req.body.answer4;

    // console.log('QPROF: ' + qProff);

    var query = queries.addQustion(qTitle, isMulAns, qMedia, qMediaType, qCorrFB, qIncorrFB,
        qSkill, qDiff, qProff, qIsApp, qDisabled, qWhoCreated);
    console.log('\n' + query + '\n');
    connection.query(query, function (err,ans) {
        if (err) {
            console.log(err);
            res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
        }
        else {
            console.log(ans);
            console.log("insertId: " + ans.insertId);
            var insertCommandList=[];
            var question_id  = ans.insertId;
            // var query = queries.insertAllAnswer(correctAnswer,answer1,answer2,answer3,answer4);
            var i;
            for (i= 0 ; i< answers.length ; i++ ){
                if (correctAnswerIndex==i)
                    insertCommandList.push(queries.insertAnswer(question_id, answers[i],1));
                else
                    insertCommandList.push(queries.insertAnswer(question_id, answers[i],0));
            }

            var bigQuery = insertCommandList.join(" ");
            console.log(bigQuery);
            connection.query(bigQuery,function (err) {
                if (err){
                    console.log(err);
                    res.status(400).send();
                }
                else{
                    res.status(200).send("inserted!");
                }
                
            });
        }
    });
});


app.post('/createTask', function (req, res) {

    var tTitle = req.body.t_title;
    var tDesc = req.body.t_description;
    var tOwner = req.body.t_owner;
    var tApproved = req.body.t_approved;
    var questionsForTask = req.body.questions;

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
                    tId = taskRow[0].T_id;
                    var questionsArray = [];
                    for (i = 0; i < questionsForTask.length; i++) {
                        var qId = questionsForTask[i];
                        questionsArray[i] = queries.joinNewTaskWithQuestion(tId, qId);
                    }

                    var insertStatement = questionsArray.join(" ");

                    connection.query(insertStatement, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
                        } else {
                            res.status(200).send("inserted!");
                        }
                    });
                }
            });
        }
    });
});

/***************MARATON2*****************/
app.post('/getAllTasks', function (req, res) {

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
});


app.post('/getAllGroupForTask', function (req, res) {
    var task_id = req.body.task_id;
    var teacher_id = req.body.teacher_id;
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
});


app.post('/checkIfGroupCodeExists', function (req, res) {
    var groupCode = req.body.group_code;
    var query = queries.checkIfGroupCodeExists(groupCode);
    console.log('\n' + query + '\n');
    connection.query(query, function (err, isTeacher) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error");
        }
        else {
            if (isTeacher.length==0)
                res.status(401).send();//
            else
                res.status(200).send(isTeacher);//
        }
    });
});


app.post('/getStudentListFromGroupId', function (req, res) {
    var groupCode = req.body.group_id;
    var query = queries.getStudentsFromGroup(groupCode);
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
});


app.post('/getGroupsBySchool', function (req, res) {
    var schoolName = req.body.school;
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
});


app.post('/getValidQuestions', function (req, res) {
    var isApproved = req.body.is_app;
    var isDisabled = req.body.is_disabled;
    var query = queries.getValidQuestions(isApproved,isDisabled);
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
});


app.post('/getGroupsByTeacherAndCity', function (req, res) {
    var teacherId = req.body.teacher_id;
    var CityName = req.body.city;
    var query = queries.getGroupsByTeacherAndCity(teacherId,CityName);
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
});

app.post('/getAllStudentForGroup', function (req, res) {
    var group_id = req.body.group_id;
    var query = queries.getAllStudentForGroup(group_id);
    console.log('\n' + query + '\n');
    connection.query(query, function (err, listOfStudents) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error");
        }
        else {
            if (listOfStudents.length==0){
                res.status(204).send();
            }
            else {
                res.status(200).send(listOfStudents);
            }
        }
    });
});


app.post('/getAllGroupForTeacher', function (req, res) {
    var user_id = req.body.user_id;
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
});


app.post('/getAllSchollByCity', function (req, res) {
    var city = req.body.city;
    var query = queries.getAllSchollByCity(city);
    console.log('\n' + query + '\n');
    connection.query(query, function (err, schools) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error");
        }
        else {
            if (schools.length==0){
                res.status(204).send();
            }
            else {
                res.status(200).send(schools);
            }
        }
    });
});

app.post('/getGroupBySchoolAndCity', function (req, res) {
    var city = req.body.city;
    var school = req.body.school;
    var query = queries.getGroupBySchoolAndCity(school,city);
    console.log('\n' + query + '\n');
    connection.query(query, function (err, groups) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error");
        }
        else {
            if (groups.length==0){
                res.status(204).send();
            }
            else {
                res.status(200).send(groups);
            }
        }
    });
});


app.post('/addNewSchool', function (req, res) {
    var city = req.body.city;
    var school= req.body.school;
    var query = queries.addNewSchool(city,school);
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
});




var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',//'1q2w3e4r' to upload*/
    database: 'textra_db',
    multipleStatements: true
});


connection.connect(function (err) {
    if (err) {
        console.log("Connection Error")
    }
});


// var server = app.listen(8081, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log("Example app listening at http://%s:%s", host, port)
// });

// //TODO - Hadas you need this/TESTS!!!
app.listen(8081, "127.0.0.1", function () {
    console.log("App is running ");
});

setInterval(function () {
    connection.query('SELECT 1');
}, 5000);


module.exports = app;
