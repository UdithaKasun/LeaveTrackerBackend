var http = require('http'),
  path = require('path'),
  methods = require('methods'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose');
logger = require('./routes/logger');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/employee_leave_db');
  mongoose.set('debug', true);
}

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  logger.info("MongoDB database connection initiated with url");
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  logger.fatal(err.message);
  process.exit(-1);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  logger.info("MongoDB database Connection Disconnected");
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.info("MongoDB database Connection Disconnected through Application Termination");
    process.exit(0);
  });
});

require('./models/User');
require('./models/Leave');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    logger.error(err.stack)
    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function () {
  logger.info("Express Server Started at Port : " + server.address().port);
});

module.exports = server; 