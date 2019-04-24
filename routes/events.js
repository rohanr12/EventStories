var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Comment = require('../models/comment');
var { ensureAuthenticated } = require('../auth');

router.get('/', ensureAuthenticated, function(req, res){
    Event.find({}, function(err, events){
        if(err){
            console.log(err);
        }
        else{
            console.log("Events Retrieved");
            return res.render('events/index', {events: events})
        }
    });
}); 

router.get('/new', ensureAuthenticated, function(req, res){
    return res.render('events/new');
});

router.get('/:id', ensureAuthenticated, function(req, res){
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            return res.render('events/show',{event: foundEvent});    
        }
    })
});

router.post('/', ensureAuthenticated, function(req, res){
    var eventName = req.body.eventName;
    var eventImage = req.body.eventImage;
    var eventDesc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    Event.create({
        name: eventName,
        image: eventImage,
        description: eventDesc,
        author: author
    }, function(err, event){
        if(err){
            console.log(err);
        }
        else{
            console.log('Event successfully created');
            console.log(event);
        }
    });
    return res.redirect('/events');
})

//Comment Routes

router.get('/:id/comments/new', ensureAuthenticated, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        }
        else{
            return res.render("comments/new", {event: foundEvent});
        }
    });
});

router.post("/:id/comments", ensureAuthenticated, function(req, res){
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
                createdComment.author.id = req.user._id;
                createdComment.author.username = req.user.username;
                createdComment.save();
                foundEvent.comments.push(createdComment);
                foundEvent.save();
                return res.redirect("/events/"+ req.params.id);
            }
        });
    });  
});

module.exports = router;