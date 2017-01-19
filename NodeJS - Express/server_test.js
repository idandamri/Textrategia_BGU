  var express = require('express');
  var mysql = require('mysql');
  var path = require('path');
  var app = express();
  var queries = require("./queryForDB.js");
  var bodyParser = require('body-parser');
  app.use('/static', express.static(path.join(__dirname, '/client')));
  app.use(bodyParser.urlencoded({ extended: false }));
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

  app.get('/test',function(req,res){
    var query = queries.getAllAnswersToQuestion("1"); 
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


  /*GOOD*/
  /*get: user_id
  return: task infomation*/
  /*TO-DO: add number od q in task*/
  app.get('/getTasks', function (req, res) {
    console.log("Got a get task request");
    var u_id = req.body.user_id;
    console.log(u_id);
    const query = queries.gelAllTaskTitleByStudentId(user_id); /*hard coded. need to change*/
    connection.query (query , function(err,ans,field){
      if (err){
        console.log(err)
        res.send("wrong - in task request");  
      }
      else{
        res.send(ans);
      }
    });

  })

  /* GOOD
  get - t_id , user_id
  return -list json: first -  qustion info, second to last - answer info */
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
