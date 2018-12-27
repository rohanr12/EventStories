var express= require('express');
var bodyParser = require('body-parser');

var app = express();


app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended: true}));

events=[
    {name: "Rock Concert", img: "https://bit.ly/2Sk0W2o"},
    {name: "Cookery Show", img: "https://bit.ly/2Ct1Bc6"},  
    {name: "Informative workshop", img: "https://bit.ly/2EJP1aC"},
    {name: "Rock Concert", img: "https://bit.ly/2Sk0W2o"},
    {name: "Cookery Show", img: "https://bit.ly/2Ct1Bc6"},  
    {name: "Informative workshop", img: "https://bit.ly/2EJP1aC"},

    {name: "Rock Concert", img: "https://bit.ly/2Sk0W2o"},
    {name: "Cookery Show", img: "https://bit.ly/2Ct1Bc6"},  
    {name: "Informative workshop", img: "https://bit.ly/2EJP1aC"}
];
app.get('/', function(req, res){
    res.render("landing");
});


app.get('/events', function(req, res){
    res.render('events', {events: events});
});

app.get('/events/new', function(req, res){
    res.render('new');
})

app.post('/events', function(req, res){
    var eventName = req.body.eventName;
    var eventImage = req.body.eventImage;

    events.push({
        name: eventName,
        img: eventImage
    });
    res.redirect('/events');
})

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.listen(8000, function(){
    console.log("Listening on port 8000")
})
