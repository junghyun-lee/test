var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var methodOverride = require('method-override');
var session = require('express-session');
var RedisStore  = require('connect-redis')(session);
var flash = require('connect-flash');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(cookieParser('foo'));
app.use(cors());// same-origin policy 우회 방법
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//개발용 response에 따른 색상 구별
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());// parse application/json
app.use(methodOverride());//X-HTTP-Method-Override Header
app.use(session({
    resave: true,
    secret: 'foo',
    store: new RedisStore({
        host: 'localhost',
        port: 3000
    }),
    saveUninitialized: true,
    cookie: { maxAge: 60000, secure:true}
}));//session 설정
app.use(logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

passport.use(new LocalStrategy({
        usernameField : 'userid',
        passwordField : 'password',
        passReqToCallback : true
    }
    ,function(req,userid, password, done) {
        console.log(done);
        console.log(req.session)
        if(userid=='hello' && password=='world'){
            var user = { 'userid':'hello',
                'email':'hello@world.com'};
            return done(null,user);
        }else{
            return done(null,false);
        }
    }
));

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    console.log(req.isAuthenticated());
    //console.log(req.session.passport.user);
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    else res.redirect('/login.html');
}

passport.serializeUser(function(user, done) {
    console.log(user.userid);
    console.log(done);
    try{
        //세션 저장
        done(null, user);

    }catch(e){
        console.log(e);
    }
});

passport.deserializeUser(function(id, done) {
    //User.findById(user, function(err, user) {
    console.log('!!!'+done);
    done(err, user);
    //});
});

app.get('/mypage',function(req,res){
    console.log(req.session.passport.user);
    res.end();
});

app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login_fail', failureFlash: true }),
    function(req, res) {
        res.redirect('/login_success');
    });

app.get('/login_success', ensureAuthenticated, function(req, res){
    res.send(req.user);
    // res.render('users', { user: req.user });
});

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);