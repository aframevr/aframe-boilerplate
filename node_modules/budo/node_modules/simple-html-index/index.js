const fromString = require('from2-string')

module.exports = createHtml

function createHtml (opt) {
  opt = opt || {}
  return fromString([
    '<!doctype html>',
    '<head>',
    opt.title ? ('<title>' + opt.title + '</title>') : '',
    '<meta charset="utf-8">',
    opt.css ? ('<link rel="stylesheet" href="' + opt.css + '">') : '',
    '</head><body>',
    opt.entry ? ('<script src="' + opt.entry + '"></script>') : '',
    '</body>',
    '</html>'
  ].join(''))
}
