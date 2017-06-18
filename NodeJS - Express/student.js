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


router.post('/getListOfTasks', function (req, res) {
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

router.post('/getQuestion', function (req, res) {
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
                    if (row.length > 0) {
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


router.post('/questionDone', function deleteQuestionFromQueue(req, res) {
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

router.post('/updateAnswer', function (req, res) {
    try {
        var sId = req.body.user_id;
        var tId = req.body.task_id;
        var qId = req.body.quest_id;
        var aId = req.body.ans_id;
        var secondChance = mysql.escape(req.body.second_chance);
        var queryCheckIfExists = queries.checkIfAnsExists(sId, tId, qId, aId, secondChance);
        connection.query(queryCheckIfExists, function (err, rows) {
            if (rows != null && rows.length > 0) {
                res.status(200).send("Same answer!");
            }
            else {
                answers = [];
                answers = aId.split(',');
                var bigQuery = "";
                for (var i = 0; i < answers.length; i++) {
                    a_id = answers[i];
                    var query = queries.submitStudentsAnswerForQuestion(sId, tId, qId, a_id, secondChance);
                    bigQuery = bigQuery + query;
                }
                console.log('\n' + bigQuery + '\n');
                connection.query(bigQuery, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Update had an error - check DB");
                    }
                    else {
                        res.status(200).send("Updated!");
                    }
                });
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

router.post('/reportQuestion', function (req, res) {
    try {
        var QID = mysql.escape(req.body.q_id);
        var reportOffensive = req.body.report_offensive;
        var reportQuestion = req.body.report_question;
        var reportAnswer = req.body.report_answer;

        var query = queries.reportQuestion(QID, reportOffensive, reportQuestion, reportAnswer);
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


router.post('/generateRandTask', function (req, res) {

    try {
        var stud_id = req.body.student_id;
        var tTitle = "\'מטלה לתרגול עצמאי\'";
        var tOwner = 6;
        var tApproved = 1;
        var num = 3;//req.body.rand_num;
        var media_types;
        if (req.body.media_types != "") {
            media_types = req.body.media_types.split(",");
        } else {
            media_types = [];
        }
        var skills;
        if (req.body.skills != "") {
            skills = req.body.skills.split(",")
        } else {
            skills = [];
        }
        var difficulties;
        if (req.body.difficulties != "") {
            difficulties = req.body.difficulties.split(",");
        } else {
            difficulties = [];
        }

        var tDesc = "\'" + "המטלה נוצרה ב- " + moment().format('l') + " , " + moment().format('LTS') + "\'";

        var query = queries.addNewTask(tTitle, tDesc, tOwner, tApproved);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, taskRow) {
            if (err) {
                console.log(err, taskRow);
                res.status(400).send("Insertion error - check DB (group/student does not exist or relation error!");
            }
            else {
                try {
                    var tId = taskRow.insertId;
                    var med = "";
                    var skil = "";
                    var diffi = "";
                    if (media_types.length > 0) {
                        med = JSON.stringify(media_types).toString().replace("[", "").replace("]", "");
                    }
                    else {
                        med = "\"\"";
                    }
                    if (skills.length > 0) {
                        skil = JSON.stringify(skills).toString().replace("[", "").replace("]", "");
                    } else {
                        skil = "\"\"";
                    }
                    if (difficulties.length > 0) {
                        diffi = JSON.stringify(difficulties).toString().replace("[", "").replace("]", "");
                    }
                    else {
                        diffi = "\"\"";
                    }
                    var query = queries.getQuestionsByParamter(med, skil, diffi);
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
                                    taskId = tId;
                                    queryDel = queries.deleteTaskForNotEnoughQuestions(taskId);
                                    connection.query(queryDel, function (err3) {
                                        if (err3) {
                                            console.log(err3);
                                            res.status(400).send("Deletion error");
                                        } else {
                                            res.status(415).send("Not Enough questions to generate task by filtering");
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
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r',//'123465' to upload*/
    // password: '123456',//'123465' to upload*/
    database: 'textra_db',
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
        console.log("Connection Error")
    }
});

module.exports = router;