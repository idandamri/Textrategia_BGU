//dependencies
var express = require('express');
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
app.use(require('./teacher'));
app.use(require('./student'));
app.use(require('./editor'));
app.use(require('./superUser'));


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
                if (ans.length > 0) {
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

app.get('/', function (req, res) {
    res.redirect('/index.html');
});

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

/*NOT IN USE*/
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

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './client/views/img');
    },
    filename: function (req, file, callback) {
        // callback(null, +file.originalname.substr(file.originalname.indexOf('.'))
        callback(null, Date.now() + "_" + file.originalname
        );
    }
});

var upload = multer({storage: storage}).single('file');

app.post('/multer', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.status(400).send();
        }
        var s = req.file.filename;
        res.status(200).send(s);
    });
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
