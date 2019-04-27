var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Comment = require('../models/comment');
var { ensureAuthenticated } = require('../auth');

//Event routes

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

router.get('/:id/edit', ensureAuthenticated, (req, res)=>{
    Event.findById(req.params.id)
                .exec()
                .then(foundEvent=>{
                    return res.render('events/edit', {event: foundEvent})
                })
                .catch(err=>{
                    console.log(err);
                    return res.redirect('back');
                })
});

router.put('/:id', ensureAuthenticated, (req, res)=>{
    Event.findByIdAndUpdate(req.params.id, req.body.event)
            .exec()
            .then(updatedEvent=>{
                console.log('event updated!');
                console.log(updatedEvent);
                return res.redirect('/events/'+req.params.id);
            })
            .catch(err=>{
                console.log(err);
                return res.redirect('back');
            });
});

router.delete('/:id', (req, res)=>{
    Event.findByIdAndDelete(req.params.id)
            .exec()
            .then(async deletedEvent=>{
                try{
                    var count = 0;
                    for(i in deletedEvent.comments){
                        let commentID = deletedEvent.comments[i];
                        let deletedComment = await Comment.findByIdAndDelete(commentID);
                        console.log("Comment Deleted!");
                        console.log(deletedComment.text);
                        count++;
                    }
                }
                catch(err){
                    console.log(err);
                    return res.redirect('/events');
                }
                console.log('Number of comments deleted: '+count);
                return res.redirect('/events');
            })  
});

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

router.get('/:id/comments/:comment_id/edit', ensureAuthenticated, (req, res)=>{
    Event.findById(req.params.id)
            .exec()
            .then(async (foundEvent)=>{
                try{
                    var foundComment = await Comment.findById(req.params.comment_id).exec();
                    console.log(foundComment);
                }
                finally{
                    return res.render('comments/edit', {event: foundEvent, comment: foundComment});
                }
            })
            .catch(err=>{
                console.log(err);
                return res.redirect('back');
            })
});

router.put('/:id/comments/:comment_id', async (req, res)=>{
    try{
        var retrievedEvent = await Event.findById(req.params.id).populate('comments');
        for(var i in retrievedEvent.comments){
            console.log(i);
            var commentObj = retrievedEvent.comments[i];
            console.log(commentObj.author.id);
            if(commentObj._id.toString() === req.params.comment_id){
                console.log('Equality achieved');
            }
        }
        retrievedEvent.comments[i].text = req.body.comment.text;
        commentObj.save();
        console.log(retrievedEvent)
    }
    catch(err){
        console.log(err);
        res.redirect('back');
    }
    finally{        
        console.log('Successfully updated comment');
        return res.render('events/show', {event: retrievedEvent});
    }
})

router.delete('/:id/comments/:comment_id', (req, res)=>{
    Event.findById(req.params.id)
            .exec()
            .then(async retrievedEvent=>{
                try{
                    let commentsArray = retrievedEvent.comments;
                    for(var i in commentsArray){
                        let commentID = commentsArray[i];
                        if(commentID.toString() === req.params.comment_id){
                            break;
                        }
                    }
                    retrievedEvent.comments.splice(i, 1);
                    retrievedEvent.save();
                    let deletedComment = await Comment.findByIdAndDelete(req.params.comment_id);
                    console.log('Comment deleted');
                    console.log(deletedComment);
                }
                catch(err){
                    console.log(err);
                }
                finally{
                    return res.redirect('/events/'+ retrievedEvent._id);
                }
            })
    
})

module.exports = router;