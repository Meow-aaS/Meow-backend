var fs = require('fs');

function base64_encode(file_path) {
    var bitmap = fs.readFileSync(file_path);
    return new Buffer(bitmap).toString('base64');
}

exports.convToBlob = function(file_path){
    return base64_encode(file_path);
}