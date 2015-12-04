var trumpet = require('trumpet'),
    through = require('through2')

//injects a <script> tag into the body
module.exports = function scriptInjector(opt) {
    var type = opt.type || 'text/javascript'
    var src = opt.src
    var contents = opt.contents || ''

    var script = '<script type="'+type+'"'
    if (src)
        script += ' src="'+src+'"'
    script += '>'+contents+'</script>'
            
    var tr = trumpet()
    var bodyTag = tr.createStream('body')
    bodyTag
        .pipe(inject())
        .pipe(bodyTag)

    return tr

    function inject() {
        var out = through()
        out.push(script)
        return out
    }
}