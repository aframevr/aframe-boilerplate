var test = require('tap').test;
var responseStream = require('../');

var http = require('http');
var es = require('event-stream');
var filed = require('filed');

var fs = require('fs');
var fileContents = fs.readFileSync(__dirname + '/data.txt');

test('filed response', function (t) {
    t.plan(5);
    
    var port = Math.floor(Math.random() * 5e4 + 1e4);
    var server = http.createServer(function (req, res) {
        filed(__dirname + '/data.txt')
            .pipe(capStream())
            .pipe(res)
        ;
    });
    server.listen(port);
    
    server.on('listening', function () {
        var opts = {
            host : 'localhost',
            port : port,
            path : '/'
        };
        http.get(opts, function (res) {
            var data = '';
            res.on('data', function (buf) { data += buf });
            res.on('end', function () {
                t.equal(data, String(fileContents).toUpperCase());
                t.equal(
                    Number(res.headers['content-length']),
                    fileContents.length
                );
                t.equal(
                    res.headers['content-type'],
                    'TEXT/PLAIN'
                );
                t.notOk(res.headers.etag);
            });
        });
    });
    
    t.on('end', function () {
        server.close();
    });
    
    function capStream () {
        var caps = es.mapSync(function (s) {
            return String(s).toUpperCase()
        });
        var s = responseStream(caps);
        t.notEqual(caps, s);
        
        s.on('setHeader', function (args, pass) {
            if (args[0] === 'content-type') {
                args[1] = String(args[1]).toUpperCase();
            }
            if (args[0] === 'etag') {
                pass();
            }
        });
        
        return s;
    }
});
