  var express = require('express');
  var mysql = require('mysql');
  var path = require('path');
  var absorb = require('absorb');
  var app = express();
  var queries = require("./queryForDB.js");
  var bodyParser = require('body-parser');
  //app.use('/static', express.static(path.join(__dirname, '/client')));
  app.use(express.static(__dirname + '/client'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // This responds with "Hello World" on the homepage

  app.get('/test',function(req,res){
    var query = queries.getNumberOfQuestionForTask(1); 
    connection.query (query , function(err,ans,field){
      if (err){
        console.log(err);  
      }
      else{
        console.log(ans);
        res.send(ans);
        
      }
    }); 
  });

  app.get('/homepage',function(req,res){
    res.sendFile(__dirname + '/homepage.html');
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
    var listOfmerge=[];
    console.log(u_id);
    var query = queries.gelAllTaskTitleByStudentId('1'); /*hard coded. need to change*/
    connection.query (query , function(err,tasks,field){
      if (err){
        console.log(err)
        res.send("wrong - in task request");  
      }
      else{
        t_id = tasks[0]["T_id"];
        console.log(t_id);
        query = queries.getNumberOfQuestionForTask(t_id); 
        connection.query (query , function(err,numberOfQuestion,field){
          if (err){
           console.log(err);  
         }
         else{
          var i;
          for (i=0; i<tasks.length ; i++){
            console.log("num of question:" + numberOfQuestion);
            merge ={};
            Object.assign(merge,tasks[i],numberOfQuestion[i]);
            console.log (merge );
            listOfmerge.push(merge);
            // res.send(merge );
          }
          res.send(listOfmerge);
        }
      }); 
      }
    });

  })

  /* GOOD
  getQuestion
  get - t_id , user_id
  return -A list of jsons. The first one is a question info, second to last - answer info */
  app.get('/getQuestion', function (req, res) {
    console.log("Got a question request");
    var user_id= req.body.user_id;
    var t_id= req.body.t_id;

    var query = queries.getQustionByTaskAndUserID(user_id,t_id); /*hard coded. need to change*/
    connection.query (query , function(err,listOfQuestion,field){
      if (err){
        console.log(err)
        res.send("wrong - in question request");  
      }
      else{
        var q_id = listOfQuestion[0]["Q_id"];
        console.log(q_id);
        var query = queries.getAllAnswersToQuestion(q_id); 
        connection.query (query , function(err,listOfAnswer,field){
          if (err){
           console.log(err);  
         }
         else{
          console.log(listOfQuestion);
          res.send(listOfQuestion.concat(listOfAnswer));
          
        }
      }); 
      }
    });

  });


  /*get: student_id, questio_id,task_id,answer_id
  */
  app.post('/updateAnswer', function (req, res) {
  });


  /*GOOD
  get :  user and password
  return : OK or ERROR
  */
  app.post('/login', function (req, res) {
    console.log("Got a login request");
    var user_name= req.body.user; /* user_name can be id or email */
    var password = req.body.password;
    console.log('\n\n!!!\n\n'+user_name + "," + password)
    var query = queries.getDataForUserByIdOrEmail(user_name,password);
    console.log(query);
    connection.query (query , function(err,ans,field){
      if(err)   
        console.log(err);
      else{
        console.log(ans);
        //res.send(row[1]);
        if(ans!="[]"){ /*check if the resault is empty*/
          res.send('OK') /*change to user id*/
        }
        else {
          res.send('ERROR');
        }
      }
    });
  }); 


  app.get('/',function(req,res){
    res.sendFile(__dirname + '/static' );
  });






  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database: 'textra_db'
  });




  connection.connect(function(err) {
    // connected! (unless `err` is set)
  });



  var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
  });
