const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const conf = require('../conf');
const bcrypt = require('bcrypt');
  const saltRounds = 10;
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;

const sequelize = new Sequelize(conf.db.name, conf.db.username, conf.db.password, {
    host: conf.db.host,
    dialect: conf.db.dialect,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // SQLite only
    //storage: 'path/to/database.sqlite',
  
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  });

  const User = sequelize.define('user', {
    username: Sequelize.STRING(50),
    password: Sequelize.STRING,
    email: Sequelize.STRING(100),
    rank: Sequelize.TINYINT
  });

//   passport.use('local-login', new LocalStrategy({
//     usernameField: 'username',  
//     passwordField: 'password', 
//     passReqToCallback: true //passback entire req to call back
//   },
//   function(req, username, password, done) {
//     User.findOne({ username: username }).then(user => {
//       if (!user)
//         return done(null, false, req.flash('Incorrect username.'));
      
//       if (!bcrypt.compare(password, user.password))
//         return done(null, false, req.flash('Incorrect password.'));
      
//       return done(null, user);
//     }).catch( err => {
//       return done(err);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, {id:user.id, rank:user.rank});
// });

// passport.deserializeUser(function(user, done) {
//   User.findById(user.id, function(err, user) {
//     done(err, user);
//   });
// });

  //User.sync({force:true});

  const UserController = {
    //passport : passport,
    init : passportParam => {
      passport = passportParam;
    },
    create : async user => {
      let response = {message:{text:""}};
      let hash = await bcrypt.hash(user.sub_password, saltRounds);
      let result = await User.findOrCreate({
        where: {[Op.or]: [
        { username: user.sub_username },
        { email: user.sub_email }]},
        defaults: { username : user.sub_username, email : user.sub_email, password : hash, rank: 0 }});

      let isCreated =  result[result.length-1];
      if(!isCreated){
        response.success = false;
        response.message.type = "danger"
        if(result[0].username.toLowerCase() == user.sub_username.toLowerCase())
          response.message.text += "Pseudo déjà utilisé";
        if(result[0].email.toLowerCase() == user.sub_email.toLowerCase()){
          if(response.message.text.length > 0)
            response.message.text += ", ";
          response.message.text += "Adresse mail déjà utilisée";
        }
      }
      else{
        response.success = true;
        response.message.type = "success";
        response.message.text = "Compte créé avec succès !";
      }
      return response;

    },
    // login : (req, res) => {
    //   passport.authenticate('local', {failureRedirect: '/'} ,function(err, user, info) {
    //     if (err) {
    //       return res.serverError(err);
    //     }
    //     if (!user){
    //       return res.redirect('/login');
    //     }
    //     return res.redirect('/users/' + user.username);      
    //   });
    //   // await passport.authenticate('local', {
    //   //   successRedirect: '/',
    //   //   failureRedirect: '/login',
    //   //   failureFlash: true
    //   // });
    // },
    comparePassword : async (username, password) => {
      const user = await User.findOne({ where: {username: username}});

      return match = await bcrypt.compare(password, user.password);
    }
  }

  module.exports = UserController;