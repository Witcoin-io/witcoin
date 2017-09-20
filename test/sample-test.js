var SampleContract = artifacts.require("./SampleContract.sol");

contract('SampleContract', function(accounts) {
    var sender = accounts[0];

    it("Sample Contract Tests", function() {
        var sampleInstance;

        return SampleContract.deployed().then(function(instance) {
            sampleInstance = instance;
            return sampleInstance.increase();
        }).then(function(trans) {
            return sampleInstance.add(2);
        }).then(function(trans) {
            return sampleInstance.getCount.call();
        }).then(function(count) {
            assert.equal(count.valueOf(), 3, "Count doesn't match.");
            return sampleInstance.sayHello.call();
        }).then(function(hello) {
            assert.equal(hello.valueOf(), "Hello World!", "He doesn't say hello...");
            return sampleInstance.sayHelloAndIncrease();
        }).then(function(trans) {
            return sampleInstance.getCount.call();
        }).then(function(count) {
            assert.equal(count.valueOf(), 4, "Count doesn't match.");
        });
    });

});
