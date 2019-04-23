var express= require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var Event = require('./models/event');
var Comment = require('./models/comment');
var seedDB = require('./seed');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var {ensureAuthenticated, forwardAuthenticated} = require('./auth');
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

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/login', forwardAuthenticated, function(req, res){
    res.render('login');
});

app.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/events',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

app.get('/register', forwardAuthenticated, function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    User.register(
        new User({username: req.body.username, email: req.body.email}), req.body.password,
        function(err, user){
            if(err){
                console.log(err);
                return res.redirect('/'); 
            }
            passport.authenticate('local')(req, res, function(){
                return res.redirect('/events');
            });
        })
});

app.get('/logout', ensureAuthenticated, (req, res)=>{
    req.logout();
    res.redirect('/');
})

app.get('/events', ensureAuthenticated, function(req, res){
    Event.find({}, function(err, events){
        if(err){
            console.log(err);
        }
        else{
            console.log("Events Retrieved");
            res.render('events/index', {events: events})
        }
    });

});

app.get('/events/new', ensureAuthenticated, function(req, res){
    res.render('events/new');
});

app.get('/events/:id', ensureAuthenticated, function(req, res){
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            res.render('events/show',{event: foundEvent});    
        }
    })
    
});

app.post('/events', ensureAuthenticated, function(req, res){
    var eventName = req.body.eventName;
    var eventImage = req.body.eventImage;
    var eventDesc = req.body.description;

    Event.create({
        name: eventName,
        image: eventImage,
        description: eventDesc,
    }, function(err, event){
        if(err){
            console.log(err);
        }
        else{
            console.log('Event successfully created');
            console.log(event);
        }
    });
    res.redirect('/events');
})

//Comment Routes

app.get('/events/:id/comments/new', ensureAuthenticated, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {event: foundEvent});
        }
    });
});

app.post("/events/:id/comments", ensureAuthenticated, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        }
        Comment.create(req.body.comment, function(err, createdComment){
            if(err){
                console.log(err);
            }
            else{
                console.log("Comment created");
                foundEvent.comments.push(createdComment);
                foundEvent.save();
                res.redirect("/events/"+ req.params.id);
            }
        });
    });  
});


if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.listen(8000, function(){
    console.log("Listening on port 8000")
})
