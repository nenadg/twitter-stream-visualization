// datalove <3
// dependencies
var http = require('http'),
    express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    twit = require("twit"),
    //logger = require('morgan'),
    //methodOverride = require('method-override'),
    //session = require('express-session'),
    //bodyParser = require('body-parser'),
    //multer = require('multer'),
    //errorHandler = require('errorhandler'),
    oauth = require('oauth');
    routes = require('./shared/routes');
    
// all environments
app.set('port', process.env.PORT || 3001);
//app.use(logger('dev'));
//app.use(methodOverride());
// app.use(session({ resave: true,
//                saveUninitialized: true,
//                secret: 'bla' 
//              }));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false /*true*/ }));
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(res, req, next){
    res.header('X-XSS-Protection' ,  '1; mode=block');
    
    next(); 
});

// error handling middleware should be loaded after the loading the routes
// if ('development' == app.get('env')) {
//   app.use(errorHandler());
// }

var server = http.createServer(app),
    io = require("socket.io").listen(server, { log: false });

global.io = io;
global.oauth = oauth;
global.twit = twit;
global.app = app;
global.users = [];
global.stream;


routes.stream(function(){
    console.log('Streaming should start ...');
})

/*global.appconfig = appconfig.config(app, oauth);
global.io = require("socket.io").listen(server, { log: false });
global.twit = require("twit");
global.streaming = require('./shared/streaming');
global.app = app;
global.oauth = oauth;*/

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    
    
});