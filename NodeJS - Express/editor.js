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
require('path');
var app = express();
app.use(cors());
var queries = require("./queryForDB.js");
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.post('/disableQuestion', function (req, res) {
    try {
        var disableStatus = mysql.escape(req.body.disable_status);
        var qId = mysql.escape(req.body.q_id);

        var query = queries.disableQuestion(qId, disableStatus);
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


router.post('/editQuestion', function (req, res) {

    try {
        var q_id = mysql.escape(req.body.id);
        var q_question = mysql.escape(req.body.question);
        var q_media_type = mysql.escape(req.body.mediaType);
        var q_media = mysql.escape(req.body.media);
        var isMul = mysql.escape(req.body.is_multiple_ans);
        var q_correctFB = mysql.escape(req.body.correctFB);
        var q_notCorrectFB = mysql.escape(req.body.notCorrectFB);
        var q_skill = mysql.escape(req.body.skill);
        var q_diff = mysql.escape(req.body.difficulty);
        var q_prof = mysql.escape(req.body.proffesion);
        var reported_offensive = mysql.escape(req.body.Q_reported_Offensive);
        var reported_question = mysql.escape(req.body.Q_reported_Question);
        var reported_answer = mysql.escape(req.body.Q_reported_Answer);
        var q_app = mysql.escape(req.body.approved);
        var q_disabled = mysql.escape(req.body.disabled);
        var answersArray = JSON.parse(req.body.answers);

        var query = queries.updateQuestion(q_id, q_question, q_media, q_media_type, isMul, q_correctFB, q_notCorrectFB,
            q_skill, q_diff, q_prof, q_app, q_disabled, reported_offensive, reported_question, reported_answer);
        connection.query(query, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error - check DB! - question not updated");
            }
            else {
                // answersArray = answersArray.split(',');
                var bigQuery = "";
                for (var i = 0; i < answersArray.length; i++) {
                    var a_id = answersArray[i].A_id;
                    var answer = answersArray[i].answer;
                    var is_corr = answersArray[i].isCorrect;
                    var query = queries.updateAnswer(a_id, q_id, answer, is_corr);
                    bigQuery = bigQuery + query;
                }
                connection.query(bigQuery, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(400).send("DB error - check DB! - answers not updated");
                        }
                        else {
                            res.status(200).send("updated!");
                        }
                    }
                );
            }
        });

    } catch
        (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});

router.post('/getAnswersByQid', function (req, res) {
    var qId = mysql.escape(req.body.q_id);
    try {
        var query = queries.getAnswersByQid(qId);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, listOfAnswers) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send(listOfAnswers);//
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
                } else {
                    res.status(200).send(questions);
                }
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


router.post('/getUnapprovedQuestion', function (req, res) {
    try {
        var query = "select * from textra_db.questions where Q_approved=0 and disabled=0;";
        console.log('\n' + query + '\n');
        connection.query(query, function (err, questions) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                if (questions != null && questions.length == 0) {
                    res.status(204).send();
                } else {
                    res.status(200).send(questions);
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


setInterval(function () {
    connection.query('SELECT 3');
}, 5000);


module.exports = router;