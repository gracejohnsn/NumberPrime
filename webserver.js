const http = require('http'); 
const fs = require('fs');
const url = require('url');
//const sqlite3 = require('sqlite3');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + (q.pathname.length > 1 ? q.pathname : "/blah.html");
    console.log(filename);

	fs.readFile(filename, function(err, data) {
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.write(data);
		return res.end();
	});
}).listen(8080);
