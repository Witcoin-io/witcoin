module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
      rinkeby: {
          host: "localhost", // Connect to geth on the specified
          port: 8545,
          from: "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d7", // default address to use for any transaction Truffle makes during migrations
          network_id: 4,
          gas: 4612388 // Gas limit used for deploys
      }
  }
};
