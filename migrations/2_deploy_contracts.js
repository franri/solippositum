const Apuesta = artifacts.require("Apuesta");
const ApuestaManager = artifacts.require("ApuestaManager");
// const Commons = artifacts.require("Commons");

const events = [
  [100, 14], // gana nacional
  [101, 13]  // gana peñarol
];

module.exports = function(deployer) {
  deployer.deploy(Apuesta, "Partido", events, "0xCD4F50983939b2C6EF91EfD6d4d9baB42d673D6c");
  deployer.deploy(ApuestaManager);
  // deployer.deploy(Commons);
};
