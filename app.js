// Servidor.
var express = require('express');
var app = express();

var http = require('http').Server(app);

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var port = process.env.PORT || 3000;
var dataBase = require('./config/database');

mongoose.connect(dataBase.url);

require('./config/connect')(passport);

// Setup de la aplicación.
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

//Se le indica a express que debe utilizar el direcotio public.
app.use(express.static(__dirname + '/public'));

// Requeridos para Passport.
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:'1nY0urR00m$#!'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

http.listen(port, function(){
  console.log("Escuchando por el puerto *:3000...");
});
