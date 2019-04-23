var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var {ensureAuthenticated, forwardAuthenticated} = require('../auth');

router.get('/', function(req, res){
    return res.render("landing");
});

router.get('/login', forwardAuthenticated, function(req, res){
    return res.render('login');
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/events',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/register', forwardAuthenticated, function(req, res){
    return res.render('register');
});

router.post('/register', function(req, res){
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

router.get('/logout', ensureAuthenticated, (req, res)=>{
    req.logout();
    return res.redirect('/');
});

module.exports = router;