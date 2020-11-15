// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "./Apuesta.sol";

contract ApuestaManager {

  

  address[] public apuestas;
  uint256 public apuestasLength;

  constructor() public {

  }

  function createApuesta(string memory name, uint256[][] memory outerEvents, address oraculoExterno) public {
    Apuesta a = new Apuesta(name, outerEvents, oraculoExterno);
    apuestas.push(address(a));
    apuestasLength++;
  }

  function getApuestas() public view returns ( address[] memory ){
    return apuestas;
  }
}
