var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var fs = require('fs');

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

// GET: route to return list of upload videos 
router.get('/video_list', function(req, res) {
	
	// Get the path for the uploaded_video directory - in a real app the video list would likely be taken from 
	// a database index table, but this is fine for us for now
	var _p;
    _p = path.resolve(__dirname, 'uploaded_videos');
	
	//Find all the files in the diectory and add to a JSON list to return
	var resp = [];
	fs.readdir(_p, function(err, list) {
		//Check if the list is undefined or empty first and if so just return 
		if ( typeof list == 'undefined' || !list ) {
			return;
		}
		for (var i = list.length - 1; i >= 0; i--) {
			
			// For each file in the directory add an id and filename to the response
			console.log('Looping through video files in directory: ', list, 'at index: ', i);
			console.dir(list);
	    	resp.push( 
				{"id": path.join(_p, list[i]),
				"text": list[i]}
			);
			console.log('resp at iteration: ', i, " is: ", resp);
	    }
		
		// Set the response to be sent
		res.json(resp);
	});
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