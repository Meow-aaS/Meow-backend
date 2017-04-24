const Promuse = require("bluebird");

const uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};

exports.run = function(path, args){
    console.log("Running python...");
    let spawn = require("child_process").spawn;
    let returnedData = [];
    let process = spawn('python',[path], args);
    
    process.stdout.on('data', function (data){
        let strData = uint8arrayToString(data);
        console.log(strData);
        returnedData.push(strData);
    });

    return new Promise((resolve, reject) => {
        process.stdout.on('end', function (){
            console.log("Run python completed.");

            resolve(returnedData);
        });
    });
}
