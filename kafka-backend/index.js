//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var kafka = require('./kafka/client');
const multer = require('multer');
const port = 3001;
var passport = require('passport');
var crypt = require('./crypt');
var pool = require('./pool');
var {mongoose} = require('./db/mongoose');
var jwt = require('jsonwebtoken');
var config = require('./settings');
const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {

      
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage });

var mysql = require('mysql');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 50 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client/build")));
app.use('/uploads', express.static('uploads'));

 // Set up middleware
 var requireAuth = passport.authenticate('jwt', {session: false});
 app.use(passport.initialize());
 // Bring in defined Passport Strategy
require('./passport')(passport);
 

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


//requiring router modules
var loginRouter           = require('./routes/loginRouter');
var signupRouter          = require('./routes/signupRouter');
var logout                = require('./routes/logout');
var jobupdate             = require ('./routes/jobupdate');
var postjob               = require('./routes/postjob');
var profile               = require('./routes/profile');
var uploadphotos          = require('./routes/uploadphotos');
var mingraph              = require('./routes/mingraph');
var searchjob              = require('./routes/searchjob');

// routing to different routes
app.use('/login', loginRouter);
app.use('/userSignup', signupRouter);
app.use('/logout', logout);
app.use('/jobupdate', jobupdate);
app.use('/postjob', postjob);
app.use('/profile',profile);
app.use('/uploadphotos',uploadphotos);
app.use('/mingraph',mingraph);
app.use('/searchjob',searchjob);


//Protected authenticated route with JWT
app.get('/protectedRoute', requireAuth, function (request, response) {
    response.send('Your User id is: ' + request.user.firstname + ', username is: ' + request.user.username + '.');
}); 


//start your server on port 3001
app.listen(port);
console.log("Server Listening on port",port);