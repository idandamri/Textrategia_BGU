var express = require('express');
var mysql = require('mysql');
var app = express();
var queries = require("./queryForDB.js");
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

app.post('/test', function (req, res) {
  console.log("Got a test request");
  //var ans = getTasksForStudent("1");
  var ans = req.body;
  console.log(ans);
  res.send (ans);

});


app.post('/login', function (req, res) {
  console.log("Got a login request");
  var user_name= req.headers['username']; /* user_name can be id/email */
  var password = req.headers['password'];
  var ans;

  var query = queries.getDataForUserByIdOrEmail(user_name,password);
  connection.query (query , function(err,ans,field){
    if(err) 
      console.log(err);
    else{
      //res.send(row[1]);
      if(ans!="[]"){ /*check if the resault is empty*/
        //res.send(ans);
        ans = getTasksForStudent ("1");
        /*ask for all student task before redirecting*/
        
        //res.redirect ('./secondpage') /*how should we do it?*/
      }
      else {
        res.send("Please try Again.");
      }
    }
 });

}) 


/*
app.post('/tasks', function (req, res) {
  var chosen_task= req.headers['task'];
  res.send(chosen_task);
  var query = getQuestionIDForTask (someUserId,someTaskId);
  connection.query (query , function(err,row,field){
    if(err) 
      console.log(err);
    else{
      
      if(ans!="[]"){ //check if the resault is empty
        ans = row;
        //res.send(ans);
        res.redirect ('./secondpage')
      }
      else {
        res.send("Please try Again.");
      }
    }
 });
*/





  //res.send(chosen_task);

function getTasksForStudent (studentId){
var query = queries.gelAllTaskTitleByStudentId(studentId); /*hard coded. need to change*/
connection.query (query , function(err,ans,field){
  if (err){
    console.log(err)
    return "";
  }
  else{
    return ans;
  }
});
}




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
})