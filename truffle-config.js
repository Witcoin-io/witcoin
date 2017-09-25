module.exports = {
    networks: {
        rpc: {
            host: "localhost",
            port: 8545
        },
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*",
            from: "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A"
        },
        rinkeby: {
            host: "localhost", // Connect to geth on the specified ip
            port: 8545, // Geth port
            from: "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d7", // default address to use for any
            network_id: 4, // Network ID
            gas: 4612388 // Gas limit used for deploys
        }
    }
};