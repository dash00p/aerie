// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
  
// load up the user model
var User = require('../model/user');
// expose this function to our app using module.exports
module.exports = passport = function(passportParam) {
    passport.passportRef = passportParam;
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.passportRef.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.passportRef.deserializeUser(function(id, done) {
        User.findById(id, function(user) {
            done(user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.passportRef.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    async function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({where:{ username :  username }}).then( (user) => {
            // if no user is found, return the message
            if (!user)
                return done(null, false, {text:'No user found.', type:'danger'}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            bcrypt.compare(password, user.password).then(match => {
                if (!match)
                    return done(null, false, {text:'Oops! Wrong password.', type:'danger'}); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        })
        .catch( err => {
            return done(err);
        });

    }));

};
