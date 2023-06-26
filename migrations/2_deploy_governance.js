const governance = artifacts.require('Governance');

module.exports = function(deployer) {
	deployer.deploy(governance);
};
