var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

app.use(cookieParser());
app.use(session({secret:'foo',  cookie: { maxAge: 60000, secure:true}}));//session 설정
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res,next){
    console.log(req.session);
    next();
});

app.get('/test', function(req, res){
    res.send(JSON.stringify(req.flash('test')));
});

app.listen(3000);
