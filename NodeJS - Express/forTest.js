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


router.post('/truncateTasksAndStudTable', function (req, res) {
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


router.post('/removeTestUsersFromGroup', function (req, res) {
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


router.post('/addTestTaskQuestions', function (req, res) {
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


router.post('/removeRegisterUser', function (req, res) {
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


router.post('/truncateInstancesOfAnswers', function (req, res) {
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


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    // password: '1q2w3e4r',//'123465' to upload*/
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