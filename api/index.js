/**
 * @file 接口入口文件
 * @author 刘彪(liubiao@itoxs.com)
 * @version V0.01
 * @date 2016-09-30
 */
module.exports = {
    init: function(app) {
        var get = require('./GET/');
        var post = require('./POST/');
        get.init(app);
        post.init(app);
    }
};