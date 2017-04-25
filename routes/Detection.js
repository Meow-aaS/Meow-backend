const controller = require("../controllers/DetectionController.js");

exports.name = "Detection";

exports.getOperations = function(){

    return [
        {
            "spec": {
                "description": "get",
                "path": "/post/list",
                "method": "GET"
            },
            "action": function(req, res){
                controller.list(req, res);
            }
        },
        {
            "spec": {
                "description": "post",
                "path": "/post",
                "method": "POST"
            },
            "action": function (req, res) {
                controller.post(req, res);
            }
        },
        {
            "spec": {
                "description": "like",
                "path": "/post/like",
                "method": "PUT"
            },
            "action": function(req, res){
                controller.like(req, res);
            }
        },
        {
            "spec": {
                "description": "delete",
                "path": "/post",
                "method": "DELETE"
            },
            "action": function(req, res){
                controller.delete(req, res);
            }
        },
        {
            "spec": {
                "description": "comment",
                "path": "/post/comment",
                "method": "POST"
            },
            "action": function(req, res){
                controller.comment(req, res);
            }
        }
    ]
}