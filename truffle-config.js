const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config(); // Load .env file

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*' // Match any network id
		},
		goerli: {
			provider: () => new HDWalletProvider({
				privateKeys: [process.env.PRIVATE_KEY_GOERLI],
				providerOrUrl: process.env.INFURIA_URL_GOERLI,
				numberOfAddresses: 1
			}),
			networkCheckTimeout: 1000000,
			network_id: 5,
			// gas: 4465030,
			// gasPrice: 10000000000,
			confirmations: 1,
			timeoutBlocks: 50000,
			skipDryRun: true
		},
		matic: {
			provider: () => new HDWalletProvider({
				privateKeys: [process.env.PRIVATE_KEY_MATIC],
				providerOrUrl: process.env.URL_MATIC,
				numberOfAddresses: 1
			}),
			network_id: 80001,
			confirmations: 1,
			timeoutBlocks: 200,
			skipDryRun: true,
			networkCheckTimeout: 100000
		}
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000
	},

	contracts_directory: './src/contracts/',
	contracts_build_directory: './src/abis/',
	compilers: {
		solc: {
			version: '^0.8.9'
		}
	}
};