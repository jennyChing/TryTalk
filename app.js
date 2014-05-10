var express = require('express');
var routes = require('./routes');
var index = require('./routes/index');
var talk = require('./routes/talk');
var http = require('http');
var path = require('path');
var portNum = process.env.PORT || 3000;
var mongo = require('mongoskin');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/robotserver';
//var db = mongo.db(mongoUri, {native_parser:true});
var db = require('./db');
var app = express();

// all environments

app.set('port', portNum);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.load);
//app.post('/create', talk.create);
app.post('/createTalk', createTalk);
// app.post('/update', talk.update);
app.get('/search', index.search);
app.get('/load', index.load);
//add the url of your function
app.post('/show', talk.show);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


function createTalk (req, res) {
    var data = {
        topic: req.body.topic,
        speaker: req.body.speaker,
        category: req.body.category,
        description: req.body.description
    };
    talk.create(data);
    res.send('data', data);
    console.log('data', data);
};
