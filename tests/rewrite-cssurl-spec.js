var chai = require("chai");
var expect = chai.expect;
var gutil = require("gulp-util");
var File = gutil.File;
var path = require("path");
var fs = require("fs");
var rewriteCSSURL = require("../index");

describe("gulp-rewrite-cssurl,用户给css中的url重写前缀", function () {

    it("css中文件路径为文件名情况下,提供基础路径,重写css的url", function (done) {

        var fakeFile = new File({
            path: "/test/hello.css",
            contents: new Buffer("body{background-image:url(a.jpg)}")
        })

        var stream = rewriteCSSURL({prefix: "//a.com/images"});

        stream.write(fakeFile);

        stream.once("data", function (file) {

            var contents = file.contents.toString();
            expect(contents).to.contain("//a.com/images/a.jpg");
            done();

        })
    })

    it("当css中路径为一个相对路径,获取css中的文件名部分,用前缀prefix拼接文件名得到常用的CDN路径",function(done){

        var fakeFile = new File({
            path: "/test/hello.css",
            contents: new Buffer("body{background-image:url(../../a.jpg)}")
        })

        var stream = rewriteCSSURL({prefix: "//a.com/images"});

        stream.write(fakeFile);

        stream.once("data", function (file) {

            var contents = file.contents.toString();
            expect(contents).to.contain("//a.com/images/a.jpg");
            done();

        })

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

    it("传params,新的url带上querystring",function(done){

        var fakeFile = new File({
            path: "/test/hello.css",
            contents: new Buffer("body{background-image:url(../../a.jpg)}")
        })

        var stream = rewriteCSSURL({
            prefix: "//a.com/images/",
            params:{
                foo:1,
                bar:2
            }
        });

        stream.write(fakeFile);

        stream.once("data", function (file) {

            var contents = file.contents.toString();
            expect(contents).to.contain("//a.com/images//a.jpg?foo=1&bar=2");
            done();

        })
    })

    it("不传params,新的url没有querystring",function(done){

        var fakeFile = new File({
            path: "/test/hello.css",
            contents: new Buffer("body{background-image:url(../../a.jpg)}")
        })

        var stream = rewriteCSSURL({
            prefix: "//a.com/images"
        });

        stream.write(fakeFile);

        stream.once("data", function (file) {

            var contents = file.contents.toString();
            expect(contents).to.equal("body{background-image:url(//a.com/images/a.jpg)}");
            done();

        })
    })


})