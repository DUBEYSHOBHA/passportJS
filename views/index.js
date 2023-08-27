var express = require('express');
const passport = require('passport');
var router = express.Router();
var usermodel = require("./users");

const localStrategy = require('passport-local');

passport.use(new localStrategy(usermodel.authenticate()));

router.get("/", function(req, res) {
    res.render("index", { title: 'Express' });
})


router.get("/profile", isLoggedIn, function(req, res) {
    usermodel.findOne({ username: req.session.passport.user })
        .then(function(user) {
            res.render("profile", { user })
        })
})

router.get("/login", function(req, res) {
    res.render("login");
})

router.post("/register", function(req, res, next) {
    var data = new usermodel({
        username: req.body.username,
        email: req.body.email,
        photo: req.body.photo
    })
    usermodule.register(data, req.body.password)
        .then(function() {
            passport.authenticate("local")(req, res, function() {
                res.redirect('/message');
            })
        })
})

router.get('/message', function(req, res, next) {
    res.send("registered")
})

router.post('/login', passport.authenticate("local", {
    successRedirect: '/profile',
}), function(req, res) {});

router.get("/edit", isLoggedIn, function(req, res) {
    usermodule.findOne({ username: req.session.passport.user })
        .then(function(user) {
            res.render("edit", { user })
        })
})

router.post('/update', function(req, res, next) {
    usermodule.findOneAndUpdate({ username: req.session.passport.user }, { username: req.body.username, email: req.body.email, photo: req.body.photo })
        .then(function(updatedUser) {
            res.redirect('/profile')
        })
})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;