
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());// same-origin policy 우회 방법
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//파비콘 적용 안됨
app.use(logger('dev'));//개발용 response에 따른 색상 구별
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());// parse application/json
app.use(methodOverride());//X-HTTP-Method-Override Header
app.use(cookieParser());
app.use(logger('combined'));
app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);