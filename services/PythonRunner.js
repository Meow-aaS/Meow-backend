const q = require("q");

const uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};

exports.run = function(path){
    console.log("Running python...");
    let spawn = require("child_process").spawn;
    let returnedData = [];
    let deferred = q.defer();
    let process = spawn('python',[path]);
    
    process.stdout.on('data', function (data){
        let strData = uint8arrayToString(data);
        console.log(strData);
        returnedData.push(strData);
    });

    process.stderr.on('data', function (data){
        let strData = uint8arrayToString(data);
        console.log(strData);
        
        deferred.reject(strData);
    });

    process.stdout.on('end', function (){
        console.log("Run python completed.");

        deferred.resolve(returnedData)
    });

    return deferred.promise;
}
