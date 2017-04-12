const controller = require("../controllers/DetectionController.js");

exports.name = "Detection";

exports.getOperations = function(){

    return [
        {
            "spec": {
                "description": "get",
                "path": "/detection/list",
                "method": "GET"
            },
            "action": function(req, res){
                controller.list(req, res);
            }
        },
        {
            "spec": {
                "description": "post",
                "path": "/detection",
                "method": "POST"
            },
            "action": function (req, res) {
                controller.post(req, res);
            }
        }
    ]
}