const Apuesta = artifacts.require("Apuesta");
const ApuestaManager = artifacts.require("ApuestaManager");
// const Commons = artifacts.require("Commons");

const events = [
  [100, 14], // gana nacional
  [101, 13]  // gana peñarol
];

module.exports = function(deployer) {
  deployer.deploy(Apuesta, "Partido", events, "0xd574B00686bE215F307BD64d761fF1F34352FB6c");
  deployer.deploy(ApuestaManager);
  // deployer.deploy(Commons);
};
