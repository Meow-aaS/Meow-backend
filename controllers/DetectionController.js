const PythonRunner = require("../services/PythonRunner.js");
const PostService = require("../services/models/Post.js");
const ImageService = require("../services/ImageService.js");
const Promise = require("bluebird");

var escapeHTML = function(str) { 
    return str.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

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
    if(req.body.caption.length > 255){
        return res.status(400).send("Caption must be less than 255 characters.");
    }
    if(req.body.owner_name.length > 255){
        return res.status(400).send("Name must be less than 255 characters.");
    }
    if(!req.files.image){
        return res.status(400).send("No image.");
    }
    var postParams = {
        caption: escapeHTML(req.body.caption),
        image_blob: ImageService.convToBlob(req.files.image.path),
        owner_name: escapeHTML(req.body.owner_name)
    }
    var pythonArgs = ['--cpu', '--net=zf', '--image=']
    ImageService.isImage(req.files.image.path)
    .then((isImage) => {
        console.log(" >>>>> ", isImage);
        return new Promise((resolve, reject) => {
            if(!isImage){
                res.status(400).send("No image");
            } else {
                resolve("python_scripts/PythonFacade.py", pythonArgs);
            }
        })
    })
    .then(PythonRunner.run)
    .then((data) => {
        return new Promise((resolve, reject) => {
            console.log("Print from controller...", data);
            postParams.bboxes = JSON.parse(data[0]) || [0,0,0,0];
            resolve(postParams);
        })
    })
    .then(PostService.create)
    .then((postKey) => {
        console.log(postKey);
        return res.status(201).send();
    })
    .error((err) => {
        return res.status(500).send(err);
    })
}

exports.delete = function(req, res){
    PostService.delete(req.query.id)
    .then(() => {
        return res.status(200).send();
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    })
}

exports.like = function(req, res){
    PostService.like(req.query.id)
    .then(() => {
        return res.status(200).send();
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    })
}

exports.comment = function(req, res){
    var commentText = escapeHTML(req.body.text);
    var postID = req.query.id;
    if(commentText.length > 255 || !postID) {
        return res.status(400).send("Comment must be less than 255 characters.");
    }
    PostService.comment(postID, commentText)
    .then(() => {
        return res.status(200).send();
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    })
}