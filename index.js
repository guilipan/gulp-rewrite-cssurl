var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var through = require("through2");
var CSSURLRewriter = require("cssurl").URLRewriter;
var pluginName = "gulp-rewrite-cssurl";
var urlUtils = require("url");

module.exports = function (options) {

    options = options || {
        prefix: "/"
    };

    var stream = through.obj(function (file, enc, cb) {

        if (!file) {

            thie.emit("error", new PluginError(pluginName, "files can not be empty"));

            return cb();
        }

        if (file.isStream()) {

            this.emit("error", new PluginError(pluginName, "streaming not supported"));

            return cb();
        }

        if (file.isBuffer()) {

            var rewriter = new CSSURLRewriter(function (url) {
                // automatically append a query string with a unique value to bust caches
                return urlUtils.resolve(options.prefix, url);
            });

            var result = rewriter.rewrite(file.contents.toString());

            file.contents = new Buffer(result);

            this.push(file);

            return cb();
        }

    })

    return stream;
}