var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('express-fileupload')
var session = require('express-session');
var cors = require("cors");
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');

var usersRouter = require('./src/routes/users');
var indexRouter = require('./src/routes/index');
var courseRouter = require('./src/routes/courses');

const passport = require('passport');

const passportService = require("./src/services/passport");

// use the strategy
passportService.applyPassportStrategy(passport)

var app = express();

app.use(passport.initialize());

require("./src/database/connection")
//limit file size
app.use(cookieSession({
  name: 'sessions',
  keys: ['omega'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1)
app.use(logger('dev'));
app.use(express.json());

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(cors({
  //credentials: true
  //origin: 'http://localhost:9000'
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 6 * 60 * 10000
  }
}))

app.use(upload());
app.use(express.urlencoded({limit: "50mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/course', courseRouter);

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
  res.render('error');
});

module.exports = app;
