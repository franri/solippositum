const Apuesta = artifacts.require("Apuesta");
// const Commons = artifacts.require("Commons");

const events = [
  [100, 14], // gana nacional
  [101, 13]  // gana peñarol
];

module.exports = function(deployer) {
  deployer.deploy(Apuesta, events);
  // deployer.deploy(Commons);
};
