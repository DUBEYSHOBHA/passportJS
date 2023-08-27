const { response } = require('express');
var express = require('express');
var router = express.Router();
var userModel = require("./users");
var passport = require("passport");

const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/profile',
    function(req, res, next) {
        res.send('profile page!');
    });

router.post('/register', function(req, res, next) {
    var data = new userModel({
        username: req.body.username,
        email: req.body.email
    })

    userModel.register(data, req.body.password)
        .then(function(registereduser) {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/profile')
            })
        })
});


router.post('/login', passport.authenticate("local", {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }),
    function(req, res) {});

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });

    function isloggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();

        } else {
            response.redirect('/login')
        }
    }
})

module.exports = router;