var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------- ROUTES: steering GET, POST etc requests -------------------------------

// get an instance of router
var router = express.Router();

// GET: home page route 
router.get('/', function(req, res) {
	res.send('Colab Server default nodejs home page - you shouldnt really be here ...');	
});

// GET: videoViewerPage
router.get('/viewvideos', function(req, res) {
        res.sendfile(__dirname + '/public/viewvideos.html');
});

// GET: about page route 
router.get('/about', function(req, res) {
	res.send('in the about page!');	
});

// POST: video upload route
// multer approach
var multer = require('multer');
app.use(multer({dest:'./uploaded_videos/'}));
router.post('/videoupload', function(req, res) {
	res.send('Video Uploading');
	console.dir(req.files);
});


// POST: form video upload (video upload from a user on a website rather than a mobile using a REST API
router.post('/formvideoupload', function(req, res) {
        res.sendfile(__dirname + '/public/formvideouploading.html');
        console.dir(req.files);
});

// GET: file progress route
router.get('/uploadprogress', function(req, res) {
        console.dir('Handling file size request');
	var fs = require("fs");
	var stats = fs.statSync("myfile.txt");
	var fileSizeInBytes = stats["size"];
	//Convert the file size to megabytes 
	var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
	res.send('File size so far is: ' + fileSizeInMegabytes);
});

// GET: video file list
router.get('/video_list', function(req, res) {
	var _p;
	if (req.query.id == 1) {
      		_p = path.resolve(__dirname, '..', 'uploaded_videos');
      		processReq(_p, res);
    	} else {
      		if (req.query.id) {
        		_p = req.query.id;
        		processReq(_p, res);
      		} else {
        		res.json(['No valid data found']);
      		}	
    	}
  });



// apply the routes to our application
app.use('/', router);
app.use('/users', users);

//----------------------------------------------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;