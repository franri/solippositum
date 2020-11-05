const SimpleStorage = artifacts.require("SimpleStorage");
const TutorialToken = artifacts.require("TutorialToken");
const ComplexStorage = artifacts.require("ComplexStorage");

const Bid = artifacts.require("Bid");
// const Commons = artifacts.require("Commons");

module.exports = function(deployer) {
  deployer.deploy(Bid);
  // deployer.deploy(Commons);
};
