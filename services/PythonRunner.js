const Promuse = require("bluebird");

const uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};

exports.run = function(path, args){
    return new Promise((resolve, reject) => {
        console.log("Running python...");
        var spawn = require("child_process").spawn;
        var returnedData = [];
        var process = spawn('python',[path], args);
        
        process.stdout.on('data', (data) => {
            var strData = uint8arrayToString(data);
            console.log(strData);
            returnedData.push(strData);
        });

        process.stdout.on('end', () => {
            console.log("Run python completed.");
            resolve(returnedData);
        });
    });
}
