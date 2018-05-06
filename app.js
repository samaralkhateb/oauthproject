var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var logger = require('morgan');

async = require("async");
////  AOUTH2 ////

var con = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password:'',
  database: 'tumblr'
});



////////////


/*      start    OAUTH 2 SERVER           */


const mySqlConnection = require('./databaseHelpers/mySqlWrapper')
const accessTokenDBHelper = require('./databaseHelpers/accessTokensDBHelper')(mySqlConnection)
const userDBHelper = require('./databaseHelpers/userDBHelper')(mySqlConnection)
const oAuthModel = require('./authorisation/accessTokenModel')(userDBHelper, accessTokenDBHelper)
const oAuth2Server = require('node-oauth2-server')
const express = require('express')
const expressApp = express()
expressApp.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})

const restrictedAreaRoutesMethods = require('./restrictedArea/restrictedAreaRoutesMethods.js')
const restrictedAreaRoutes = require('./restrictedArea/restrictedAreaRoutes.js')(express.Router(), expressApp, restrictedAreaRoutesMethods)
const authRoutesMethods = require('./authorisation/authRoutesMethods')(userDBHelper)
const authRoutes = require('./authorisation/authRoutes')(express.Router(), expressApp, authRoutesMethods)
const bodyParser = require('body-parser')

//MARK: --- REQUIRE MODULES

//MARK: --- INITIALISE MIDDLEWARE & ROUTES

//set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }))

//set the oAuth errorHandler
expressApp.use(expressApp.oauth.errorHandler())

//set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes)

//set the restrictedAreaRoutes used to demo the accesiblity or routes that ar OAuth2 protected
expressApp.use('/restrictedArea', restrictedAreaRoutes)

//MARK: --- INITIALISE MIDDLEWARE & ROUTES

//init the server


/*      end    OAUTH 2 SERVER           */

var homeRouter = require('./routes/home');
var textRouter = require('./routes/text');
var photoRouter = require('./routes/photo');
var accountRouter = require('./routes/account');



// view engine setup
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'ejs');
expressApp.use(logger('dev'));
expressApp.use(bodyParser.json());
//expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cookieParser());
expressApp.use(express.static(path.join(__dirname, 'public')));


expressApp.use(function(req, res, next){
  req.con = con;
  next();
});



expressApp.use('/home' ,homeRouter);
expressApp.use('/text' ,textRouter);
expressApp.use('/photo' ,photoRouter);



/*
// catch 404 and forward to error handler
expressApp.use(function(req, res, next) {
  next(createError(404));
});
*/
// error handler
/*
  expressApp.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/



module.exports = expressApp;



expressApp.listen(8000 , 'localhost');
