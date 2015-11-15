var express = require('express');
var app = express();
var bodyParser     	= require("body-parser");

app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

app.get('/', function (req, res) {
  res.send('Hello World to Nafta FC API!');
});

var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect('localhost', 'naftaapi', 27017, config.dbOptions);


//routes
app.use('/parser', 	require('./controllers/parser'));
app.use('/api', 	require('./controllers/api'));




var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
