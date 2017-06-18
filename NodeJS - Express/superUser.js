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


function makeid() {
    try {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
}


router.post('/createGroup', function (req, res) {
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


router.post('/getQuestionStatistics', function (req, res) {
    var qID = req.body.q_id;
    var query = queries.getQuestionStatistics(qID);
    connection.query(query, function (err, ans) {
        if (err) {
            console.log(err);
            res.status(400).send("DB error - check DB!");
        }
        else {
            res.status(200).send(ans);
        }
    });
});


router.post('/getGroupsBySchool', function (req, res) {
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


router.post('/getGroupsByTeacherAndCity', function (req, res) {
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


router.post('/getAllTeachersBySchoolAndCity', function (req, res) {
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


router.post('/getAllSchollByCity', function (req, res) {
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


router.post('/getGroupBySchoolAndCity', function (req, res) {
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


router.post('/addNewSchool', function (req, res) {
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


router.post('/getTeachersGroupByCityAndSchool', function (req, res) {
    try {
        var city = mysql.escape(req.body.city);
        var school = mysql.escape(req.body.school);
        var query = queries.getGroupsOfTeachersByCityAndSchool(city, school);
        console.log('\n' + query + '\n');
        connection.query(query, function (err, teachers) {
            if (err) {
                console.log(err);
                res.status(400).send("DB error");
            }
            else {
                res.status(200).send(teachers);
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        res.status(404).send();
    }
});


router.post('/getReported', function (req, res) {
    try {
        var query = "select * from textra_db.questions where Q_reported_Offensive>=1" +
            " or Q_reported_Question>=1" +
            " or Q_reported_Answer>=1;";
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


router.post('/disableQuestion', function (req, res) {
    try {
        var query = "";
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


router.post('/getQuestionsWithOneAnsByParamter', function (req, res) {
    try {
        var media_types = mysql.escape(req.body.media_types.split(","));
        var skills = mysql.escape(req.body.skills.split(","));
        var difficulties = mysql.escape(req.body.difficulties.split(","));
        var user_id = mysql.escape(req.body.user_id);

        var query = queries.getQuestionsByParamterAndIdWithOneAns(media_types, skills, difficulties, user_id);
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