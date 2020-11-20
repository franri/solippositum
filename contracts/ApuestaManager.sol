// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "./Apuesta.sol";

contract ApuestaManager {

  
  struct Dupla {
    string name;
    address addr;
  }

  Dupla[] public apuestas;
  uint256 public apuestasLength;

  constructor() public {

  }

  function createApuesta(string memory name, uint256[][] memory outerEvents, address oraculoExterno) public {
    Apuesta a = new Apuesta(name, outerEvents, oraculoExterno);
    Dupla memory d;
    d.name = name;
    d.addr = address(a);
    apuestas.push(d);
    apuestasLength++;
  }

  function getApuestas() public view returns ( Dupla[] memory ){
    return apuestas;
  }
}
