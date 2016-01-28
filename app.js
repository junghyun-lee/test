
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));
app.use(bodyParser.json());//application x www form urlencoded
app.use(cookieParser());

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
