var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware");

//Index route
router.get("/", function(req, res){
    Photo.find({}, function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos/index", {photos:allPhotos});
        }
    });
});

//Create route
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPhoto = {name: name, image: image, description: desc, author: author};
    Photo.create(newPhoto, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/photos");
        }
    });
});

//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("photos/new");
});

//Show route
router.get("/:id", function(req, res){
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err){
            console.log(err);
        } else {
            res.render("photos/show", {photo: foundPhoto});
        }
    });
    req.params.id;
});

//Edit route
router.get("/:id/edit", middleware.checkPhotoOwnership, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
       res.render("photos/edit", {photo: foundPhoto});
    });
});

//Update route
router.put("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err){
            res.redirect("/photos");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
});

//Destroy route
router.delete("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    });
});

module.exports = router;