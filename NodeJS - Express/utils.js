var express = require('express');
var router = express.Router();
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