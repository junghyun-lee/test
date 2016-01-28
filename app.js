
var express = require('express');
var path = require('path');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//NODE_ENV 지정 안되어있을 때
//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase);

/*production 모드 일때는
파일 캐싱, 에러 메시지 감추기 등 배포의 적합한 환경 설정을 하구요.
development 모드 일 때는
파일 캐싱 방지, 디버그를 위한 상세한 에러 메시지 보이기 등


if (app.get('env') === 'development') {
    console.log("!!!");

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));

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
