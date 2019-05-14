var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var i18n = require("i18n-express");
//var gulp = require('gulp');
var passport = require('passport');
var conf = require('./conf');

var app = express();
const indexRouter = require('./routes/IndexRouter');
const usersRouter = require('./routes/UserRouter');
const eventRouter = require('./routes/EventRouter');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// var sessionStore = new MySQLStore({
//   host: conf.db.host,
//   port : conf.db.port,
//   user : conf.db.username,
//   password : conf.db.password,
//   database : conf.db.name
// });
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  //store: sessionStore,
  key: 'session_cookie_aerie'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: false,
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en","fr"],
  textsVarName: 'lng'
}));
app.use(express.static(path.join(__dirname, 'public')));

//Parse passport object
app.use(function(req, res, next) {
  if(req.session && req.session.passport && typeof req.session.passport == "string"){
    res.locals.user = req.user = JSON.parse(req.session.passport).user;
    res.locals.isAuthenticated = true;
  }
  res.locals.version = conf.version;
  res.locals.cookies = req.cookies;
  next();
});
app.use(function(req, res, next) {
  if(req.session && req.session.passport && typeof req.session.passport != "string")
    req.session.passport = JSON.stringify(req.session.passport);
  next();
});

/* ROUTERS */
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/event', eventRouter);
/**/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(err.status===404)
    res.render('404');
  else
    res.render('error');
  next();
});

module.exports = app;