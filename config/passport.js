var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

//tell passport how to store the user in the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, email, password, done) {
        req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 4 });
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            })
            return done(null, false, req.flash('error', messages));
        }

        User.findOne({ 'email': email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, { message: 'Email is already in use!' })
            }
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save((err, result) => {
                if (err) {
                    done(err);

                }
                return done(null, newUser);
            })
        })

    }));



passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, (req, email, password, done) => {
    req.checkBody('email', 'Invalid Email').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        var messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({ 'email': email }, function (err, user) {
        console.log(password);
        //console.log('user.validPassword(password)', user.validPassword(password));


        if (err) {
            console.log(err);

            return done(err);
        }
        if (!user) {
            return done(null, false, { message: `No user found.` });
        }
        console.log('given password-->', password);
        console.log('??', user.validPassword(password));
        
        if(!user.validPassword(password)){
            return done(null, false, { message: 'Wrong password.' });
        }
        return done(null, user);
    })

}));