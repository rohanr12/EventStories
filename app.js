var express= require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/event_stories", {useNewUrlParser: true });
mongoose.set('useCreateIndex', true);


var eventSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    image: String,
    description: String,
});

var Event = mongoose.model("Event", eventSchema);


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
            res.render('events', {events: events})
        }
    });

});

app.get('/events/new', function(req, res){
    res.render('new');
});

app.get('/events/:id', function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            res.render('show',{event: foundEvent});    
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

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.listen(8000, function(){
    console.log("Listening on port 8000")
})
