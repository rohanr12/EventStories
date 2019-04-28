var Event = require('./models/event');
var Comment = require('./models/comment');

ensureAuthenticated =  function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    console.log('User not logged in');
    res.redirect('/login');
}

forwardAuthenticated = function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/events');
}

eventOwnerCheck = function(req, res, next){
    if(req.isAuthenticated()){
        Event.findById(req.params.id)
                .exec()
                .then(foundEvent=>{
                    if(req.user._id.toString() === foundEvent.author.id.toString()){
                        return next()
                    }
                    else{
                        return res.send('You do not have permission for that!');
                    }
                })
                .catch(err=>{
                    console.log(err);
                    return res.send('Error');
                });
    }
    else{
        return res.send('User not authenticated');
    }
}

commentOwnerCheck = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id)
                .exec()
                .then(foundComment=>{
                    if(req.user._id.toString() === foundComment.author.id.toString()){
                        return next();
                    }
                    return res.send('You do not have permission for that');
                })
                .catch(err=>{
                    console.log(err);
                    return res.send('Error');
                }) 
    }
    else{
        return res.send('User not authenticated');
    }
}

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated,
    commentOwnerCheck,
    eventOwnerCheck
};

