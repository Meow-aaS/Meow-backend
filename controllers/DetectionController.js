const PythonRunner = require("../services/PythonRunner.js");
const PostService = require("../services/models/Post.js");
const ImageService = require("../services/ImageService.js");
const Promise = require("bluebird");

exports.list = function(req, res, page){
    var page = req.query.page || Date.now();
    PostService.list(page)
    .then((posts) => {
        var nextPage = posts.length > 0 ? posts[posts.length - 1].updated_at : 0;
        return res.status(200).send({
            nextPage: nextPage,
            data: posts
        });
    })
}

exports.post = function(req, res){
    pythonArgs = ['--cpu', '--net=zf', '--image=']
    PythonRunner.run("python_scripts/PythonFacade.py", pythonArgs)
    .then((data) => {
        console.log("Print from controller...", data);

        return new Promise((resolve, reject) => {
            resolve(JSON.parse(data[0]))
        })
    })
    .then((data) => {
        console.log(">>>", data);
        return PostService.create({
            caption: "caption",
            image_blob: ImageService.convToBlob('test'),
            bboxes: data, 
            owner_name: "owner_name"
        })
        
    })
    .then((postKey) => {
        console.log(postKey);
        return res.status(200).send(postKey);
    })
}

exports.delete = function(req, res){
    return res.status(200).send([])
}