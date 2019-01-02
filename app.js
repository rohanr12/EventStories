var express= require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Event = require('./models/event');  
var seedDB = require('./seed');

var app = express();

app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/event_stories", {useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

seedDB();

app.get('/', function(req, res){
    res.render("landing");
});


app.get('/events', function(req, res){
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

app.get('/events/new', function(req, res){
    res.render('events/new');
});

app.get('/events/:id', function(req, res){
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            res.render('events/show',{event: foundEvent});    
        }
    })
    
});

app.post('/events', function(req, res){
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

app.get('/events/:id/comments/new', function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {event: foundEvent});
        }
    });
});

//Find event by the id
//get data from the form
//Create a new comment using Comment model
//push new comment into comments array of retrieved event

app.post("/events/:id/comments", function(req, res){
    
})


if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.listen(8000, function(){
    console.log("Listening on port 8000")
})
