var SampleContract = artifacts.require("./SampleContract.sol");

module.exports = function(callback) {
    // Pre deployed contract
    SampleContract.deployed().then(function(instance) {
        // This runs a transaction on function sayHelloAndIncrease
        return instance.sayHelloAndIncrease();
    }).then(function(tx) {
        // The returned value is a transaction. A transaction
        console.log(tx);

        // This consults de constant value of the function sayHelloAndIncrease
        return instance.sayHelloAndIncrease.call();
    }).then(function(result) {
        // The returned value is the function returned value
        console.log("Result:");
        console.log(result);
        return callback();
    });


};