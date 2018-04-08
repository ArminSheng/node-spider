var http = require('http')
var https = require('https')
var cheerio = require('cheerio')
var fs = require('fs')

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'

const downloadHtml = ({targetPath, targetHost, isHttps = false}) => {
	return new Promise((resolve, reject) => {
		var pageData = '';

	    const request = isHttps ? https : http

	    const options = {
	        host: targetHost,
	        path: targetPath,
	        'accept': '*/*',
	        headers: {
	            'User-Agent': UA
	        }
	    }

	    const req = request.get(options, function(res) {
	        res.setEncoding('utf8')

	        res.on('data', function(data) {
	            pageData += data;
	        })

	        res.on('error', function(err) {
	            console.log(err)
	            reject(err)
	        })


	        res.on('end', function() {
	            var $ = cheerio.load(pageData);

	            resolve($)
	        })
	    })

	    req.on('error', reject)
	})
}

module.exports = {
	downloadHtml
}