var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.use(function(req, res, next) {
    console.log("호호호");
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' , title2:'svsd'});
  res.render('index', {user:{name:'Dalkom'}});
});

module.exports = router;
