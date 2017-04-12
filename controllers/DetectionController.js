const pythonRunner = require("../services/PythonRunner.js");
const q = require("q");

exports.list = function(req, res){
    pythonRunner.run("python_scripts/PythonFacade.py")
    .then(function(data){
        console.log("Print from controller...", data);
        return res.status(200).send(data)
    })
}

exports.post = function(req, res){

}