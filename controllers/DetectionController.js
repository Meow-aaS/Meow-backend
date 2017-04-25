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
    console.log(req.files.image.path);
    var postParams = {
        caption: req.body.caption,
        image_blob: ImageService.convToBlob(req.files.image.path),
        owner_name: req.body.owner_name
    }
    pythonArgs = ['--cpu', '--net=zf', '--image=']
    PythonRunner.run("python_scripts/PythonFacade.py", pythonArgs)
    .then((data) => {
        console.log("Print from controller...", data);
        postParams.bboxes = JSON.parse(data[0]) || [0,0,0,0];
        return PostService.create(postParams)
    })
    .then((postKey) => {
        console.log(postKey);
        return res.status(200).send(postKey);
    })
}

exports.delete = function(req, res){
    return res.status(200).send([])
}