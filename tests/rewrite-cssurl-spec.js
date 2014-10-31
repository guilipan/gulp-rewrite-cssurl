var chai = require("chai");
var expect = chai.expect;
var gutil = require("gulp-util");
var File = gutil.File;

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
})