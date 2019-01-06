//const passport = require('passport');
const conf = require('../conf');
// var passport = require('passort'),
//     LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
module.exports = (app, passport) => {
/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Les tests de Bernie',
    message: ''//req.flash('loginMessage')
    //current_url : req.baseUrl
  });
});

app.get('/login', function(req, res, next) {
  
  message = "";
  if(req.session && req.session.loginStatus){
    message = req.session.loginStatus.message;
    delete req.session.loginStatus;
  }

  if(req.isAuthenticated())
    return res.redirect('registry');
  res.render('login', {
    title: 'Connexion',
    message: message//req.flash('loginMessage')
  });
});

// router.post('/login', passport.authenticate('local-login', {
//   successRedirect : '/registry', // redirect to the secure profile section
//   failureRedirect : '/login', // redirect back to the signup page if there is an error
//   failureFlash : true // allow flash messages
// }));
app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, message) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }

    if (err) {
        return next(err);
    }

    if (!user) {
      if(!message.text)
        message = { text: message.message, type:'danger'};
      return res.render('login', {
        title: 'Connexion',
        message: message
      });
  }

    req.logIn(user, { session: true }, function(err) {
      if (err) { return next(err); }
      req.session.passport = JSON.stringify(req.session.passport);
      req.session.save( function(err){
        res.redirect('/registry');
      });
      // let passport = req.session.passport;
      // req.session.regenerate(function(err) {
      //   // session saved
      //   if(err)
      //     return console.log(err);

      //   let username = user.username;
      //   req.session.username = username;
      //   req.session.email = user.email;
      //   req.session.verified = user.verified;
      //   req.session.connected = true;
      //   req.session.passport = passport;
      //   return res.redirect('/someURL');
      // })
      
    });
  })(req, res, next);
});

app.get('/logout', function(req, res, next) {
  if(req.isAuthenticated()){
    req.session.destroy();
    return res.redirect('/');
  }
});

app.post('/timeout', function(req, res, next) {
  setTimeout(function(){
    res.send("ok");
  }, req.body.delay);
});

return app;
}




