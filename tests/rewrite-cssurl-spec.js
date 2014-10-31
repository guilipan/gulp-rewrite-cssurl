var chai = require("chai");
var expect = chai.expect;
var gutil = require("gulp-util");
var File = gutil.File;
var path = require("path");
var fs = require("fs");
var rewriteCSSURL = require("../index");

describe("gulp-rewrite-cssurl,用户给css中的url重写前缀", function () {

    it("提供基础路径,重写css的url", function (done) {

        var fakeFile = new File({
            path: "/test/hello.css",
            contents: new Buffer("body{background-image:url(a.jpg)}")
        })

        var stream = rewriteCSSURL({prefix: "http://pay.qq.com/images/"});

        stream.write(fakeFile);

        stream.once("data", function (file) {

            var contents = file.contents.toString();
            expect(contents).to.contain("http://pay.qq.com/images/a.jpg");
            done();

        })
    })

    it("如果css的url中已经是个绝对地址,提取最后的文件名并合并前缀",function(done){
        //todo sdfsdf
    })

    it("传入的文件是stream,抛出异常", function (done) {

        var streamPath = path.join(__dirname, "fixtures/a.css");

        var fakeFile = new File({
            base: "/test/",
            path: "/test/a.css",
            contents: fs.createReadStream(streamPath)
        });

        var stream = rewriteCSSURL();

        stream.on("error", function (error) {
            expect(error).to.be.an.instanceOf(gutil.PluginError);
            expect(error.message).to.include("streaming not supported");
            done();
        })


        stream.write(fakeFile);
    })


})