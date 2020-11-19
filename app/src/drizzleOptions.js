//import ComplexStorage from "./contracts/ComplexStorage.json";
//import SimpleStorage from "./contracts/SimpleStorage.json";
//import TutorialToken from "./contracts/TutorialToken.json";
import Apuesta from "./contracts/Apuesta.json"
import ApuestaManager from "./contracts/ApuestaManager.json"

const options = {
  //web3: {
  //  block: false,
  //  customProvider: new Web3("ws://localhost:7545"),
  //},
  //contracts: [SimpleStorage, ComplexStorage, TutorialToken],
  contracts: [Apuesta, ApuestaManager], //
  /*events: {
    SimpleStorage: ["StorageSet"],
  },*/
};


export default options;
