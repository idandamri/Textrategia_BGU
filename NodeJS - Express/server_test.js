var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
app.use(cors());
var path = require('path');
var app = express();
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


app.get('/testForTests', function (req, res) {
    res.send("HELLO TESTER");
});

app.get('/', function (req, res) {
    res.redirect('/index.html');
});
//
// app.get('/homepage', function (req, res) {
//     res.sendFile(__dirname + '/homepage.html');
// });
//

app.get('/getListOfTasks', function (req, res) {
    var user_id = req.body.user_id;
    var query = queries.gelAllTaskTitleByStudentId(user_id);
    console.log(query);
    connection.query(query, function (err, tasks, field) {
        console.log(JSON.stringify(tasks));
        if (tasks.length > 0)
            res.status(200).json(tasks);
        //send list of tasks
        else
            res.status(204).send();
        /*empty content*/
    });
});

/*GOOD
 getTasks
 get: user_id
 return: a list of tasks information*/

app.get('/getTasks', function (req, res) {
    console.log("Got a get task request");
    var u_id = req.body.user_id;
    var t_id;
    var merge;
    var listOfmerge = [];
    console.log(u_id);
    var query = queries.gelAllTaskTitleByStudentId('1');
    /*hard coded. need to change*/
    connection.query(query, function (err, tasks, field) {
        if (err) {
            console.log(err);
            res.send("Err in task req: " + err);
        }
        else {
            t_id = tasks[0]["T_id"];
            console.log(t_id);
            query = queries.getNumberOfQuestionForTask(t_id);
            connection.query(query, function (err, numberOfQuestion, field) {
                if (err) {
                    console.log(err);
                }
                else {
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

/* GOOD
 getQuestion
 get - t_id , user_id
 return -A list of jsons. The first one is a question info, second to last - answer info */
app.get('/getQuestion', function (req, res) {
    console.log("Got a question request");
    var user_id = req.body.user_id;
    var t_id = req.body.t_id;

    var isTaskExist_query = queries.getTaskDeatils(t_id);
    if (isTaskExist_query)
        var query = queries.getQustionByTaskAndUserID(user_id, t_id);
    /*hard coded. need to change*/
    console.log(query);
    connection.query(query, function (err, listOfQuestion, field) {
        console.log("listOfQuestion.length:" + listOfQuestion.length);
        if (err) {
            console.log(err);
            res.send("ERR in question request:" + err);
        }
        else if (listOfQuestion.length == 0) {
            res.status(204).send("No more Question for this task");
            /*empty content*/
        }
        else {
            /*if(listOfQuestion.length>1){
             for(i=0; i<listOfQuestion.length;i++){
             res.status(200).json(listOfQuestion[i]);
             }
             }*/
            res.status(200).json(listOfQuestion/*[0]["Q_id"]*/);
        }


        //   var q_id = listOfQuestion[0]["Q_id"];
        //   console.log(q_id);
        //   var query = queries.getAllAnswersToQuestion(q_id);
        //   connection.query (query , function(err,listOfAnswer,field){
        //     if (err){
        //      console.log(err);
        //    }
        //    else{
        //     console.log(listOfQuestion);
        //     res.send(listOfQuestion.concat(listOfAnswer));
        //
        //   }
        // });

    });
});


/*get: student_id, questio_id,task_id,answer_id
 */
app.post('/questionDone', function deleteQuestionFromQueue(req, res, err) {
    var quest_id = req.body.q_id;
    var stud_id= req.body.s_id;
    var task_id = req.body.t_id;


    var query2 = queries.DeleteQuestionsFromInstance(stud_id, task_id, quest_id);
    console.log('\n' + query2 + '\n');
    connection.query(query2, function (err, ans, field) {
        if (err) {
            return res.status(204);
        }
        else {
            return res.status(200);
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
            res.status(400).send();
        }
        else {
            // /*delete q from queue*/
            // console.log('Ended with inserting!\n');
            // var deleteSucceeded = deleteQuestionFromQueue(sId, tId, qId, res);
            // connection.query(deleteSucceeded, function (err, ans, field) {
            //     if (!err)
            res.status(200).send();
            //     else
            //         res.status(400).send();
            // });
        }

    });
});


/*GOOD
 get :  user and password
 return : OK or ERROR
 */
// app.post('/login', function (req, res) {
//   console.log("Got a login request");
//   var user_name= req.body.user; /* user_name can be id or email */
//   var password = req.body.password;
//   console.log('\n\nUsername:'+user_name + "\nPassword:" + password + '\n')
//   var query = queries.getDataForUserByIdOrEmail(user_name,password);
//   console.log(query);
//   connection.query (query , function(err,ans,field){
//     if(err)
//       console.log(err);
//     else{
//       console.log(ans);
//       //res.send(row[1]);
//       if(ans.length > 0){ /*check if the resault is empty*/
//         res.send('OK') /*change to user id*/
//       }
//     }
//   });
// });


/*GOOD
 get :  user and password
 return : OK or ERROR
 */
app.post('/login', function (req, res) {
    var user_name = req.body.user;
    /* user_name can be id or email */
    var password = req.body.password;
    console.log('Got a login request from: \n\n!!!\n\n' + user_name + "," + password);
    var query = queries.getDataForUserByIdOrEmail(user_name, password);
    console.log("This is the query: " + query);
    connection.query(query, function (err, ans, field) {
        if (err)
            console.log("err" + err);
        else {
            console.log("ans:" + ans);
            //res.send(row[1]);
            if (ans.length > 0) { /*check if the resault is empty*/
                res.status(200).send('OK.');
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


// app.get('/',function(req,res){
//   res.sendFile(__dirname + '/static' );
// });


  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',//'123456' to upload
    database: 'textra_db'
});

connection.connect(function (err) {
    console.error(err);
    // connected! (unless `err` is set)
});


var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});

module.exports = app;