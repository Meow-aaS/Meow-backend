const storage = require('@google-cloud/storage');
const fs = require('fs');
const mmm = require('mmmagic');
const Magic = mmm.Magic;
const Promise = require("bluebird");
const path = require("path");
const gcs = storage({
  projectId: 'senior-project-database',
  keyFilename: path.join(__dirname, '../configs/senior-project-database-0468afe5b0d8.json')
});
const bucket = gcs.bucket('senior-project-cat-image-bucket');

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

exports.upload = function(file_path){
    return new Promise((resolve, reject) => {
        bucket.upload(file_path, function(err, file) {
            if (!err) {
                var image_url = `https://storage.googleapis.com/${file.metadata.bucket}/${file.metadata.name}`;
                resolve(image_url);
            } else {
                console.log(err)
                reject(err)
            }
        });
    })    
}