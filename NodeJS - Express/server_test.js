var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var path = require('path');
var app = express();
app.use(cors());
var queries = require("./queryForDB.js");
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/client'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// This responds with "Hello World" on the homepage


/*
 app.get('/how_to request_from_data', function (req, res) {
 console.log("Got a GET request for the homepage");

 connection.query ("SELECT * FROM textra_db.answers;" , function(err,row,field){
 if(err) console.log(err);
 else
 res.send(row)
 });

 })
 */

// app.get('/test',function(req,res){
//   var query = queries.getAllAnswersToQuestion("1");
//   connection.query (query , function(err,ans,field){
//     if (err){
//       console.log(err);
//     }
//     else{
//       console.log(ans);
//       res.send(ans);
// app.get('/test',function(req,res){
//   var query = queries.getNumberOfQuestionForTask(1);
//   connection.query (query , function(err,ans,field){
//     if (err){
//       console.log(err);
//     }
//     else{
//       console.log(ans);
//       res.send(ans);
//
//     }
//   });
// });


app.post('/testForTests', function (req, res) {
    res.send("HELLO TESTER");
});

app.get('/', function (req, res) {
    res.redirect('/index.html');
});


app.post('/getListOfTasks', function (req, res) {
    var user_id = req.body.user_id;
    var query = queries.gelAllTaskTitleByStudentId(user_id);
    console.log(query);
    connection.query(query, function (err, tasks, field) {

        if (!err) {
            console.log("got a list of task response")
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


app.post('/getTasks', function (req, res) {
    console.log("Got a get task request from:");
    var u_id = req.body.user_id;
    var t_id;
    var merge;
    var listOfmerge = [];

    console.log(u_id);
    var query = queries.gelAllTaskTitleByStudentId(u_id);
    /*hard coded. need to change*/
    connection.query(query, function (err, tasks, field) {
        if (err) {
            console.log(err);
            res.status(400).send("Err in task req: " + err);
        }
        else {
            console.log("Got a task response")
            t_id = tasks[0]["T_id"];
            console.log(t_id);
            query = queries.getNumberOfQuestionForTask(t_id);
            connection.query(query, function (err, numberOfQuestion, field) {
                if (err) {
                    res.status(400).send("Number of questions in task error - check DB");
                    console.log("Number of questions in task error - check DB\nError:" + err);
                }
                else {
                    console.log("Got a response from DB")
                    var i;
                    for (i = 0; i < tasks.length; i++) {
                        console.log("num of question:" + numberOfQuestion);
                        merge = {};
                        Object.assign(merge, tasks[i], numberOfQuestion[i]);
                        console.log("merge:" + merge);
                        listOfmerge.push(merge);
                        //res.send(merge);
                    }
                    console.log("listofmerge: " + listOfmerge);
                    res.send(listOfmerge);
                }
            });
        }
    });
});


app.post('/getQuestion', function (req, res) {
    console.log("Got a question request");
    var user_id = req.body.user_id;
    var t_id = req.body.t_id;
    var question = "";
    var tasksQid = queries.getSingleQuestionIdFromTaskIdAndUserId(user_id, t_id);
    var tasksQid = queries.getSingleQuestionIdFromTaskIdAndUserId(user_id, t_id);
    connection.query(tasksQid, function (err, row, field) {
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
                    connection.query(query, function (err, ans, field) {
                        var query = queries.getAnswersByTaskAndUser(user_id, t_id);
                        console.log(query);
                        connection.query(query, function (err, listOfAnswers, field) {
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
                //console.log("Sent 204 status");
            }
        }
    });
});


app.post('/questionDone', function deleteQuestionFromQueue(req, res, err) {
    var quest_id = req.body.q_id;
    var stud_id = req.body.s_id;
    var task_id = req.body.t_id;

    var query2 = queries.DeleteQuestionsFromInstance(stud_id, task_id, quest_id);
    console.log('\n' + query2 + '\n');
    connection.query(query2, function (err, ans, field) {
        if (err) {
            res.status(400).send("Delete action had an error - check DB");
        }
        else {
            res.status(200).send("Delete succeded!");
        }
    });
});


app.post('/updateAnswer', function (req, res) {
    var sId = req.body.stud_id;
    var tId = req.body.task_id;
    var qId = req.body.quest_id;
    var aId = req.body.ans_id;
    var query = queries.SubmitStudentsAnswerForQuestion(sId, tId, qId, aId);
    //console.log('\n' + query + '\n');
    connection.query(query, function (err, ans, field) {
        if (err) {
            console.log(err);
            res.status(400).send("Update had an error - check DB");
        }
        else {
            res.status(200).send("Updated!");
        }
    });
});


app.post('/login', function (req, res) {
    var user_name = req.body.user;
    /* user_name can be id or email */
    var password = req.body.password;
    console.log('Got a login request from: \n\n!!!\n\n' + user_name + "," + password);
    var query = queries.getDataForUserByIdOrEmail(user_name, password);
    console.log("This is the query: " + query);
    connection.query(query, function (err, ans, field) {
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


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',//'123456' to upload*/
    database: 'textra_db'
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
var server = app.listen(8081, "127.0.0.1", function () {
    console.log("Example app listening at ");
});
module.exports = app;