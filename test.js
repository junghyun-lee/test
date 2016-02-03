var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var methodOverride = require('method-override');
var app = express();
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

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
var app = express();

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
app.use(session({ secret: 'your secret here' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/login_success',
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
})
function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
}

app.listen(3000);
