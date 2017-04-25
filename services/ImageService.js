var fs = require('fs');
var mmm = require('mmmagic');
var Magic = mmm.Magic;

function base64_encode(file_path) {
    var bitmap = fs.readFileSync(file_path);
    return new Buffer(bitmap).toString('base64');
}

exports.convToBlob = function(file_path){
    return base64_encode(file_path);
}

exports.isImage = function(file_path){
    var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);
    magic.detectFile('node_modules/mmmagic/build/Release/magic.node', function(err, result) {
        if (err) throw err;
        console.log(result);
    });
}