var express = require("express");
var router = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: photo});
        }
    });
});

//Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
            res.redirect("/photos");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    photo.comments.push(comment);
                    photo.save();
                    req.flash("success", "Successfully added a comment.");
                    res.redirect("/photos/" + photo._id);
                }
            });
        }
    });
});

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {photo_id: req.params.id, comment: foundComment}); 
        }
    });
});

//Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
});

//Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/photos/" + req.params.id);
        }
    });
});

module.exports = router;