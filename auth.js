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

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated
};

