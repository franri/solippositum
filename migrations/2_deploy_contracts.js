const Apuesta = artifacts.require("Apuesta");
// const Commons = artifacts.require("Commons");

const events = [
  [100, 14], // gana nacional
  [101, 13]  // gana peñarol
];

module.exports = function(deployer) {
  deployer.deploy(Apuesta, "Partido", events, "0x19fE5F5728f52A71439De01170d47B2D1870967B");
  // deployer.deploy(Commons);
};
