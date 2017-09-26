var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;
    var fee = 0;
    var level = 1;

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(ins1) {
        platform = ins1;
        WitCoin.deployed().then(function(ins2) {
            coin = ins2;

            // Aprove transferFrom + first wit creation

            return coin.approve(WitcoinPlatform.address, 1500 * Math.pow(10, 8));
        }).then(function(tx) {
            console.log("Aprove: "+tx.receipt.gasUsed);
            return platform.register("0x0001111111111111111111111111111111111111", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A", "0x000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0", fee, level);
        }).then(function(tx) {


            return coin.balanceOf("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3");
        }).then(function(tx) {
            console.log("Balance Account 2: " + tx);


            /**
             * No create
             */
            fee = 0;
            console.log("No Creation");

            /**
             * LEVEL 1
             */
            level = 1;
            console.log(level + " Level");

            return platform.register("0x1111111111111111111111111111111111111111", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x1111111111111111111111111111111111111112", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x1111111111111111111111111111111111111113", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x1111111111111111111111111111111111111114", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);

            /**
             * LEVEL 2
             */
            level = 2;
            console.log(level + " Level");

            return platform.register("0x2222222222222222222222222222222222222222", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x2222222222222222222222222222222222222223", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x2222222222222222222222222222222222222224", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x2222222222222222222222222222222222222225", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);

            /**
             * LEVEL 3
             */
            level = 3;
            console.log(level + " Level");

            return platform.register("0x3333333333333333333333333333333333333333", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x3333333333333333333333333333333333333334", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x3333333333333333333333333333333333333335", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x3333333333333333333333333333333333333336", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);

            /**
             * LEVEL 4
             */
            level = 4;
            console.log(level + " Level");

            return platform.register("0x4444444444444444444444444444444444444444", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x4444444444444444444444444444444444444445", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x4444444444444444444444444444444444444446", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x4444444444444444444444444444444444444447", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);


            /**
             * Create
             */
            fee = 1;
            console.log("");
            console.log("Creation");

            /**
             * LEVEL 1
             */
            level = 1;
            console.log(level + " Level");

            return platform.register("0x0111111111111111111111111111111111111111", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x0111111111111111111111111111111111111112", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x0111111111111111111111111111111111111113", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x0111111111111111111111111111111111111114", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);

            /**
             * LEVEL 2
             */
            level = 2;
            console.log(level + " Level");

            return platform.register("0x0222222222222222222222222222222222222222", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x0222222222222222222222222222222222222223", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x0222222222222222222222222222222222222224", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x0222222222222222222222222222222222222225", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);

            /**
             * LEVEL 3
             */
            level = 3;
            console.log(level + " Level");

            return platform.register("0x0333333333333333333333333333333333333333", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x0333333333333333333333333333333333333334", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x0333333333333333333333333333333333333335", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x0333333333333333333333333333333333333336", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);

            /**
             * LEVEL 4
             */
            level = 4;
            console.log(level + " Level");

            return platform.register("0x0444444444444444444444444444444444444444", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("1;",tx.receipt.gasUsed);
            return platform.register("0x0444444444444444444444444444444444444445", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("2;",tx.receipt.gasUsed);
            return platform.register("0x0444444444444444444444444444444444444446", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0x0",
                                     fee, level);
        }).then(function(tx) {
            console.log("3;",tx.receipt.gasUsed);
            return platform.register("0x0444444444444444444444444444444444444447", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
                                     fee, level);
        }).then(function(tx) {
            console.log("4;",tx.receipt.gasUsed);


            // Balances

        //     return coin.balanceOf("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A");
        // }).then(function(tx) {
        //     console.log("Balance Register: " + tx);
        //     return coin.balanceOf("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3");
        // }).then(function(tx) {
        //     console.log("Balance Account 2: " + tx);
        //     return coin.balanceOf("0xcFe984B059De5fBFd8875e4A7e7A16298721B823");
        // }).then(function(tx) {
        //     console.log("Balance Account 3: " + tx);


            callback();
        }).catch(function(e) {
            console.log(e);
        });

    });
};