/**
 * Created by krigel on 18/06/2017.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var _ = require('underscore');
var moment = require('moment');
var cors = require('cors');
var multer = require('multer');
// var utils = require('./utils/utils');
require('path');
var app = express();
app.use(cors());
var queries = require("./queryForDB.js");
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.post('/addTaskToGroup', function (req, res) {
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
                                        var s_id = Number(students[indxStud].PersonalID);
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
                    res.status(200).send();
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

router.post('/getStudentsMissingTaskInGroup', function (req, res) {

    var taskID = req.body.t_id;
    var groupID = req.body.group_id;
    var query = queries.getStudentsMissingTaskInGroup(taskID, groupID);
    console.log(query);
    connection.query(query, function (err, listOfStudents) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send(listOfStudents);
        }
    });
});

router.post('/getGroupByUser', function (req, res) {
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

router.post('/getAllTasks', function (req, res) {
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

router.post('/getMyTasks', function (req, res) {
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

router.post('/getAllApprovedTasks', function (req, res) {
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

router.post('/addQuestion', function (req, res) {
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
        var correctAnswerArray = [];
        correctAnswerArray = correctAnswerIndex.split(',');

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
                    var x = 0;
                    if (correctAnswerArray.length > 0 && correctAnswerArray[0] != "") {
                        x = correctAnswerArray[0];
                        if (correctAnswerArray.length > 1 && isMulAns == "'0'") {
                            correctAnswerArray = [correctAnswerArray[0]];//makes it array in size of one with first cell
                        }
                    }
                    for (i = 0; i < answers.length; i++) {
                        if (x == i) {
                            insertCommandList.push(queries.insertAnswer(question_id, answers[i], 1));
                            if (correctAnswerArray.length > 1) {
                                x++;
                                x = correctAnswerArray[x];
                            }
                        }
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

router.post('/createTask', function (req, res) {

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
                            questionsForTask = questionsForTask.split(",");
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

router.post('/getAllGroupForTask', function (req, res) {
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

router.post('/getStudentListFromGroupId', function (req, res) {
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

router.post('/getAllStudentForGroup', function (req, res) {
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

router.post('/getAllGroupForTeacher', function (req, res) {
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


router.post('/getStudentStatistics', function (req, res) {
    try {
        var sID = req.body.s_id;
        var query = queries.getStudentStatistics(sID);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, stats) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (stats!= null && stats.length == 0) {
                    res.status(204).send();
                } else {
                    res.status(200).send(stats);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

router.post('/checkIfpassIsCorrectByID', function (req, res) {
    try {
        var id = req.body.personal_id;
        var pass = mysql.escape(req.body.password);
        var query = queries.checkIfPassIsCorrectForID(id, pass);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, id) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (id != null && id.length > 0) {
                    res.status(200).send(id);
                } else {
                    res.status(205).send("wrong pass");
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

router.post('/sendTaskToStudents', function (req, res) {
    try {
        var studentsArray = JSON.parse(req.body.students);
        var taskId = req.body.task_id;

        if (studentsArray != null || studentsArray.length > 0) {
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
    password: '123456',//'123465' to upload*/
    database: 'textra_db',
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
        console.log("Connection Error")
    }
});

module.exports = router;