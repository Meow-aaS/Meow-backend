var fs = require('fs');
var mmm = require('mmmagic');
var Magic = mmm.Magic;
var Promise = require("bluebird");

function base64_encode(file_path) {
    var bitmap = fs.readFileSync(file_path);
    return new Buffer(bitmap).toString('base64');
}

exports.convToBlob = function(file_path){
    return base64_encode(file_path);
}

exports.isImage = function(file_path){
    return new Promise((resolve, reject) => {
        var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);
        magic.detectFile(file_path, function(err, result) {
            if (err) {
                console.log("ERRORRRR");
                throw err;
            }
            console.log(result);
            resolve((/(jpg|jpeg|png)/).test(result));
        });
    })
    
}