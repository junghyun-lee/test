
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));//개발용 response에 따른 색상 구별
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));
app.use(bodyParser.json());//application x www form urlencoded
app.use(cookieParser());

app.get('/skip', function(req, res) {
    console.log('access skip');
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    res.end('success!!');
});
app.get('/logging', function(req, res) {
    console.log('access logging');
    res.writeHead(404, { 'Content-Type' : 'text/html' });
    res.end('error!!');
});

app.use(logger('combined'));
app.use('/', routes);
app.use('/users', users);

app.get('/', function(req, res) {
    console.log("Cookies: ", req.cookies);
})

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);
