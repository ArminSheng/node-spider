'use strict';
console.log('loading...')

const {downloadHtml} = require('./lib/utils.js')
var fs = require('fs');

var pageSize, page, urls = [], HOST, UA, targetPath;

HOST = 'vipthz.com',
page = 1,
targetPath = `/forum-42-${page}.html`,
pageSize = 2;

function getHtml(path) {

    downloadHtml({targetPath: path, targetHost: HOST}).then($ => {
        console.log($('#waterfall'))
    }, console.log)
    // res.on('end', function() {
    //     var $ = cheerio.load(pageData);

    //      var html = $(".joke-list-item .joke-main-content a img");
    //      for (let i = html.length - 1; i >= 0; i--) {
             
    //          var src = html[i].attribs.src;

    //          if (src.indexOf('image.haha.mx') > -1) {
    //             urls.push(src);
    //          }
    //      }

    //      if (params == (pageNum + startNum)) {
    //         console.log('HTML GOTCHA !', 'length: ' + urls.length);

    //         if (urls.length > 0) {
    //             downloadImg(urls.shift());
    //         } else {
    //             console.log('downloaded');
    //         }
    //      }
    // });
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
// http://vipthz.com/forum-42-1.html?security_verify_data=313638302c31303530
init();
function init() {
    // for (var i = startNum; i <= (startNum + pageSize); i++) {
    //     getHtml();
    // }
    // getHtml(`/forum-42-${page}.html`)
    getHtml(`/thread-1801661-1-1.html`)
}