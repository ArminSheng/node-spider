'use strict';
console.log('loading...')

var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');

var targetUrl, params, pageNum, startNum, urls = [];

targetUrl = 'http://www.haha.mx/topic/1/new/';
params = '1',
startNum = 55,
pageNum = 20;

function getHtml(url, params) {
    var pageData = '';
    http.get(url + params, function(res) {
        res.setEncoding('utf8');

        res.on('data', function(data) {
            pageData += data;
        });

        res.on('error', function(err) {
            console.log(err)
        });


        res.on('end', function() {
            var $ = cheerio.load(pageData);

             var html = $(".joke-list-item .joke-main-content a img");

             for (let i = html.length - 1; i >= 0; i--) {
                 var src = html[i].attribs.src;

                 if (src.indexOf('http://image.haha.mx') > -1) {
                    urls.push(src);
                 }
             }

             if (params == (pageNum + startNum)) {
                console.log('HTML GOTCHA !', 'length: ' + urls.length);

                if (urls.length > 0) {
                    downloadImg(urls.shift());
                } else {
                    console.log('downloaded');
                }
             }
        });
    });
}

function downloadImg(imgurl) {
    var urlInfo = imgurl.replace("http://image.haha.mx/", "").split("/");

    http.get(imgurl.replace("/small/", "/big/"), function(res) {
        var images = '';

        res.setEncoding('binary');

        res.on('data', function(data) {
            images += data;
        });

        res.on('end', function() {
            var savePath = './download/2/' +  urlInfo[0]  + urlInfo[1] + urlInfo[2] + "_" + urlInfo[4];

            fs.writeFile(savePath, images, 'binary', function(err) {
                err && console.log(err);
                console.log(urlInfo[0]  + urlInfo[1] + urlInfo[2] + "_" + urlInfo[4]);

                if (urls.length > 0) {
                    downloadImg(urls.shift());
                } else {
                    console.log("下载完毕");
                }
            });
        });
    });
}

init();
function init() {
    for (var i = startNum; i <= (startNum + pageNum); i++) {
        getHtml(targetUrl, i);
    }
}