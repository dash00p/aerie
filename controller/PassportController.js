const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const User = require('../model/UserModel');
const Sequelize = require('sequelize');


    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        User.findById(user.id, function(result) {
            done(result);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
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
            bcrypt.compare(password, user.password).then( async match => {
                if (!match)
                    return done(null, false, {text: req.i18n_texts.WRONG_PASSWORD, type:'danger'}); // create the loginMessage and save it to session as flashdata

                await User.update({loggedAt : Sequelize.literal('CURRENT_TIMESTAMP')}, {where:{id: user.id}});
                //TODO
                //user.loggedAt =  Sequelize.literal('CURRENT_TIMESTAMP');

                // all is well, return successful user
                return done(null, user);
            });

        })
        .catch( err => {
            return done(err);
        });

    }));

module.exports = passport;