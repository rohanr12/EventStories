var express= require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var seedDB = require('./seed');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

//Settings
app.set('view engine','pug');

//Mongoose Config
mongoose.connect("mongodb://localhost:27017/event_stories", {useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'shhhh',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

//Setup Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

app.use('/', require('./routes/index'));
app.use('/events', require('./routes/events'));

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.listen(8000, function(){
    console.log("Listening on port 8000")
})
