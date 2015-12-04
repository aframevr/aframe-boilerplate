var select = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

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
        elem.createWriteStream({ outer: false }).end('wow');
    });
    fs.createReadStream(__dirname + '/attr_and_deeper.html')
        .pipe(sel)
        .pipe(concat(function (body) {
            t.equal(body.toString('utf8'), expected);
        }))
    ;
});
