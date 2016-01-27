var express = require('express');
var path = require('path');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

//미들웨어의 로드 순서는 중요하며, 먼저 로드되는 미들웨어 함수가 먼저 실행됩니다.

//루트 경로에 대한 라우팅 이후에 myLogger가 로드되면,
//루트 경로의 라우트 핸들러가 요청-응답 주기를 종료하므로 요청은 절대로 myLogger에 도달하지 못하며 앱은 “LOGGED”를 인쇄하지 않습니다.
var myLogger = function (req, res, next) {
    console.log('LOGGED');
    next(); // 다음 미들웨어 함수 요청 전달위해 next() 함수 호출
};

var myLogger_1 = function (req, res, next) {
    console.log('LOGGED_1');
    next(); // 다음 미들웨어 함수 요청 전달위해 next() 함수 호출
};

app.use(myLogger);
app.use(myLogger_1);

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
