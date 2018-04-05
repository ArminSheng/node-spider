'use strict';
console.log('loading...')

var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');

var targetUrl, params, pageNum, startNum, urls = [], HOST, UA, targetPath;

// targetUrl = 'http://www.haha.mx/topic/1/new/';
HOST = 'www.haha.mx',
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
params = '1',
startNum = 1,
targetPath = '/topic/1/new/'
pageNum = 20;

function getHtml(url, params) {
    var pageData = '';

    const options = {
        host: HOST,
        path: url + params,
        'accept': '*/*',
        headers: {
            'User-Agent': UA
        }
    }

    const req = https.get(options, function(res) {
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

                 if (src.indexOf('image.haha.mx') > -1) {
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

    req.on('error', console.log)
    return req
}

function downloadImg(imgurl) {
    var urlInfo = imgurl.replace("//image.haha.mx/", "").split("/");
    let targetImgUrl = 'http:' + imgurl
    
    targetImgUrl = targetImgUrl.replace("/small/", "/big/")

    http.get(targetImgUrl, function(res) {
        var images = '';

        res.setEncoding('binary');

        res.on('data', function(data) {
            images += data;
        });

        res.on('end', function() {
            var savePath = './download/2/' +  urlInfo[0]  + urlInfo[1] + urlInfo[2] + "_" + urlInfo[4];

            fs.writeFile(savePath, images, 'binary', function(err) {
                err && console.log('下载错误', err);
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
        getHtml(targetPath, i);
    }
}