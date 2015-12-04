var select = require('../');
var fs = require('fs');
var test = require('tape');
var through = require('through2');
var tokenize = require('html-tokenize');

var expected = [
    '<div class="row cool">',
    '  <div key="msg">wow</div>',
    '</div>',
    ''
].join('\n');;

test('attr and deeper', function (t) {
    t.plan(1);
    var sel = select();
    sel.select('.row', function (elem) {
        elem.setAttribute('class', 'row cool');
    });
    sel.select('[key="msg"]', function (elem) {
        elem.createWriteStream({ inner: true })
            .end(['text',Buffer('wow')])
        ;
    });
    fs.createReadStream(__dirname + '/attr_and_deeper/index.html')
        .pipe(tokenize())
        .pipe(sel)
        .pipe(collect(function (body) {
            t.equal(body, expected);
        }))
    ;
});

function collect (cb) {
    var bufs = [];
    return through.obj(write, end);
    function write (row, enc, next) {
        bufs.push(Buffer(row[1]));
        next();
    }
    function end () {
        cb(Buffer.concat(bufs).toString('utf8'));
    }
}
