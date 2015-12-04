var http = require('http');
var es = require('event-stream');
var filed = require('filed');
var responseStream = require('../');

var server = http.createServer(function (req, res) {
    filed(__dirname + '/data.txt')
        .pipe(capStream())
        .pipe(res)
    ;
});
server.listen(8000);

function capStream () {
    return responseStream(es.mapSync(function (s) {
        return String(s).toUpperCase()
    }));
}
