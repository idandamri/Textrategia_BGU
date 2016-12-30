var express = require('express');
var mysql=require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connection = mysql.createConnection({
	//properties..
	connectionLimit: 10000,
	host:'localhost',
	user:'root',
	password:'1q2w3e4r',
	database:'textra_db'
});

connection.connect(function(error){
	if(!!error){
		console.log('Error');
	}
	else{
		console.log('Connected');
	}
});


/*app.get('/', function(req, resp){
	// about mysql
	connection.query("SELECT * FROM textra_db.mother_of_all_tables;", function(error, rows, fields){
		if(!error){
			console.log('success');
			var jsonGotten = resp.json(rows);
			resp.send('Hellow ' + rows[1].FirstName + ' ' + rows[1].LastName +
						' from ' + rows[1].City + '...\nThis is the hole row in json:\n' + jsonGotten);	
		}
		else{
			console.log(error);
		}
	})
});
*/



app.get('/',function(req,res){
res.sendFile(__dirname + '/homepage.html');
});

app.get('/secondpage',function(req,res){
res.sendFile(__dirname + '/secondpage.html');
});

app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
	var query = "SELECT FirstName FROM textra_db.users "+
  				"WHERE FirstName = \'"+user_name+"\' and Pass = \'" + password+"\';";
  				console.log(query);
  connection.query(query, 
  					function(error, rows, fields){
  						if(error){
							console.log("\n"+password+user_name+"Error!!!!\n0" + error)
						}
						else{
							// res.send('done');
							// res.sendFile(__dirname + '/secondpage.html');
							res.send('secondpage');
						}
  					});
});

app.listen(1337);




