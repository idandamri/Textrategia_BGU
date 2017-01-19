var express = require('express');
var mysql = require('mysql');
var path = require('path');
var app = express();
var queries = require("./queryForDB.js");
var bodyParser = require('body-parser');
app.use('/static', express.static(path.join(__dirname, '/client')));
app.use(bodyParser.urlencoded({ extended: true }));
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
  res.sendFile(__dirname + '/static/client/index.html');
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

/*get - t_id , user_id
return - qustion info */
app.get('/getQuestion', function (req, res) {
  console.log("Got a question request");
  var user_id= req.body.user_id;
  var t_id= req.body.t_id;

  var query = queries.getQustionByTaskAndUserID(user_id,t_id); /*hard coded. need to change*/
  connection.query (query , function(err,ans,field){
    if (err){
      console.log(err)
      res.send("wrong - in question request");  
    }
    else{
      res.send(ans);
    }
  });

})



/*get: student_id, questio_id,task_id,answer_id
*/
app.post('/updateAnswer', function (req, res) {
  var s_id= req.body.s_id;
  var t_id= req.body.t_id;
  var q_id= req.body.q_id;
  var a_id= req.body.a_id;
  var query = queries.SubmitStudentsAnswerForQuestion(s_id,t_id,q_id,a_id);
  console.log('\n'+query+'\n');
  connection.query (query , function(err,ans,field){
    if (err){
      console.log(err)
      res.send("wrong - in question request");  
    }
    else{
      console.log(ans);
      res.send(ans);
    }
  });
  console.log('Ended with inserting!\n');
  var query2 = queries.DeleteQuestionsFromInstance(s_id,t_id,q_id);
  console.log('\n'+query2+'\n');
  connection.query (query2 , function(err,ans,field){
    if (err){
      console.log(err)
      res.send("wrong - in question request");  
    }
    else{
      console.log(ans);
      res.send(ans);
    }
  });
});


/*GOOD
get :  user and password
return : OK or ERROR
*/
app.post('/login', function (req, res) {
  console.log("Got a login request");
  var user_name= req.body.user; /* user_name can be id or email */
  var password = req.body.password;
    console.log('\n\nUsername:'+user_name + "\nPassword:" + password + '\n')
  var query = queries.getDataForUserByIdOrEmail(user_name,password);
  console.log(query);
  connection.query (query , function(err,ans,field){
    if(err)   
      console.log(err);
    else{
      console.log(ans);
      //res.send(row[1]);
      if(ans.length > 0){ /*check if the resault is empty*/
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
  password : '1q2w3e4r',
  database: 'textra_db'
});




connection.connect(function(err) {
  // connected! (unless `err` is set)
});






var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
