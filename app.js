var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SessionStore = require("session-mongoose")(express);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/web/dist'));
app.set('view engine', 'html');
app.set('port', process.env.PORT || 8989);
// 站点favicon
app.use(express.favicon('http://odflit039.bkt.clouddn.com/favicon.ico'));
// app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.cookieParser('manager_花夏'));
app.use(express.static(path.join(__dirname, '/web/dist')));

//引入mongoose模块
var mongoose = require('mongoose');
var config = require('./db/config');
// 链接数据库
var db = mongoose.connect(config.db.mongodb);
app.set('db', db);
var store = new SessionStore({
    url: config.db.mongodb,
    interval: 120000
});
app.use(express.session({
    store: store,
    resave: true, // don't save session if unmodified  
    saveUninitialized: false, // don't create session until something stored  
    secret: 'secret',
    key: 'usid',
    cookie: {
        maxAge: 1000 * 60 * 30 //过期时间设置(单位毫秒)
    }
}));
// API接口
var api = require('./api/index');
api.init(app);
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 启动及端口
http.createServer(app).listen(app.get('port'), function(){
    console.log('启动成功，端口为' + app.get('port'));
    console.log('主页地址：http://localhost:' + app.get('port'));
});
module.exports = app;
