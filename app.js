var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var flash = require('connect-flash');
var session = require('express-session');
var methodOverride = require('method-override');
var mongoose   = require('mongoose');
var passport = require('passport');

var index = require('./routes/index');
var sites = require('./routes/sites');
var users = require('./routes/users');

var passportConfig = require('./lib/passport-config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongodb connect
mongoose.Promise = global.Promise; // ES6 Native Promise를 mongoose에서 사용한다.
const connStr = 'mongodb://localhost/forpdb';
mongoose.connect(connStr, {useMongoClient: true });
mongoose.connection.on('error', console.error);

// _method를 통해서 method를 변경할 수 있도록 함. PUT이나 DELETE를 사용할 수 있도록.
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

// session을 사용할 수 있도록.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));

app.use(flash()); // flash message를 사용할 수 있도록
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;  // passport는 req.user로 user정보 전달
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', index);
app.use('/sites', sites);
app.user('/users', users);
require('./routes/auth')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
