module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*",
            from: "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
            gas: 4712387,
            gasPrice: 9000000000 // 9 GWei
        },
        rinkeby: {
            host: "localhost", // Connect to geth on the specified ip
            port: 8545, // Geth port
            from: "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d7", // default address to use for any
            network_id: 4, // Network ID
            gas: 4612388, // Gas limit used for deploys
            gasPrice: 3000000000 // 3 GWei
        }
    }
};
