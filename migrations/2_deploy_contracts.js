const Apuesta = artifacts.require("Apuesta");
// const Commons = artifacts.require("Commons");

const events = [
  [100, 14], // gana nacional
  [101, 13]  // gana peñarol
];

module.exports = function(deployer) {
  deployer.deploy(Apuesta, "partido", events, "0xdc18d13e7D5AE14350f9642919CB990082204B74");
  // deployer.deploy(Commons);
};
