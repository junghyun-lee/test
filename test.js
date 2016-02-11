var express = require('express');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multiparty = require('connect-multiparty');
var cors = require('cors');
var methodOverride = require('method-override');
var RedisStore  = require('connect-redis')(session);
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
    , KakaoStrategy = require('passport-kakao').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy;

var uploadRoutes = require('./routes/upload/');

var app = express();

// serialize
// 인증후 사용자 정보를 세션에 저장
passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});


// deserialize
// 인증후, 사용자 정보를 세션에서 읽어서 request.user에 저장
passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize');
    done(null, user);
    //});
});

passport.use(new FacebookStrategy({
        clientID: '554951971338220',
        clientSecret: 'bd24a86926d37078ccdafd04791fcdd8',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null,profile);
    }
));

passport.use(new KakaoStrategy({
        clientID : '8650aae30233db35b3ccf2a06d36c948',
        callbackURL : "http://localhost:3000/auth/kakao/callback"
    },
    function(accessToken, refreshToken, profile, done){
            done(null, profile);
    }
));

passport.use(new TwitterStrategy({
        consumerKey: 'rR9kdMiq2pVczGwLYF9pBfH78',
        consumerSecret: '5DuwUQsyU2YRQpEzOzRElAgp3ZZotMHU3zhYUfTE01tec8WDOl',
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null,profile);
    }
));

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//개발용 response에 따른 색상 구별
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());// parse application/json
app.use(methodOverride());//X-HTTP-Method-Override Header
//app.use(session({ secret: 'your secret here',cookie: { maxAge: 2592000000 }}));
app.use(session({ store: new RedisStore({
    host:'localhost',
    port:'6379',
    pass:'1234'
    }),
    secret: 'foo',
    cookie: { maxAge: 2592000000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/kakao', passport.authenticate('kakao'));

app.get('/auth/kakao/callback', passport.authenticate('kakao', { successRedirect: '/login_success',
    failureRedirect: '/login_fail' }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/login_success',
        failureRedirect: '/login_fail' }));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/login_success',
        failureRedirect: '/login_fail' }));

app.get('/login_success', ensureAuthenticated, function(req, res){
    res.send(req.user);
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/',function(req,res){
    console.log(req.session);
    res.send("야호");
});

app.get('/image', uploadRoutes.confirmHandler);

app.post('/upload', multiparty() ,uploadRoutes.uploadHandler);

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
}

app.listen(3000);
