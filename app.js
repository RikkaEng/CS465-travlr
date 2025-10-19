var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('hbs'); // <-- added handle bars
var passport = require('passport');

// Bring in our environment file, environemtn variable capabilities
require('dotenv').config();
require('./app_api/models/db');        // MOVE HERE
require('./app_api/config/passport');  // AFTER DB

var indexRouter = require('./app_server/routes/index'); // <-- changed new paths
var usersRouter = require('./app_server/routes/users'); // <-- changed new paths
var travelRouter = require('./app_server/routes/travel'); // <-- added
var apiRouter = require('./app_api/routes/index'); // <-- added module 5

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views')); // <-- changed
app.set('view engine', 'hbs');
handlebars.registerPartials(__dirname + '/app_server/views/partials'); // <--- added handle bars



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Enable CORS
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({"message": err.name + ": " + err.message});
  }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter); // <-- added
app.use('/api', apiRouter); // <-- added module 5


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
