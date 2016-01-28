var express = require('express');
var path = require('path');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

//하나의 경로로 두개의 라우터 선언됨
//요청 응답 주기를 종료하므로 두번째 라우터 절대 호출 안됨
//next('route') 사용 시 미들웨어 스택의 나머지 미들웨어 함수를 건너뛰게됨
//그리하여 두번째 라우터 호출됨
app.get('/user/:id', function (req, res, next) {
    console.log('ID:', req.params.id);
    next('route');
}, function (req, res, next) {
    res.send('User Info');
});

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', function (req, res, next) {
    console.log('야호');
    res.end(req.params.id);
});
////////////////////////////////////////////
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
