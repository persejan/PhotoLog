var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root route
router.get("/", function(req, res){
    res.render("landing");
});

//Auth REGISTER
router.get("/register", function(req, res){
    res.render("register");
});

//Auth SIGNUP logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to PhotoLog " + user.username);
            res.redirect("/photos");
        });
    });
});

//Auth LOGIN
router.get("/login", function(req, res){
    res.render("login");
});

//Auth LOGIN logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/photos",
        failureRedirect: "/login"
    }), function(req, res){
});

//Auth LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out.");
    res.redirect("/photos");
});

module.exports = router;