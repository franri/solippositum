// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/payment/PaymentSplitter.sol";


import "./Commons.sol";

contract Bid {

  using SafeMath for uint256;

  mapping(string => Commons.PossibleEvent) events;
  string ocurredEvent;
  address organizer;
  address oracle;
  
  Commons.State currentState;

  modifier onlyOracle(){
    require(msg.sender == oracle, "Only oracle can notify which event ocurred.");
    _;
  }


  constructor(Commons.PossibleEvent[] memory outerEvents, address allowedOracle) public {
    // cada evento ya tiene name y ratio definido

    currentState = Commons.State.AcceptingBids;
    oracle = allowedOracle;

    for(uint i = 0; i < outerEvents.length; i++){
      Commons.PossibleEvent memory e = outerEvents[i];
      e.id = i;
      events[e.name] = e;      
    }
  }

  function registerOcurredEvent(string memory name) public onlyOracle {
    require(events[name].name == name, "That event does not exist");
    currentState = Commons.State.EventHappened;
    ocurredEvent = name;
    uint256[] memory moneyOfFailedEvents = 0;
    uint256 moneyOfOcurredEvent;
    uint256 ratio;
    Bid[] memory bids;
    for (uint i = 0; i < events.length; i++){
      if (events[i].name == ocurredEvent){
        moneyOfOcurredEvent = events[i].totalBidded;
        ratio = events[i].ratio;
        bids = events[i].bids;
        // o bids = storage events[i].bids;
        // xq no sabemos si copia o qué
      } else {
        moneyOfFailedEvents += events[i].totalBidded;
      }
    }
    moneyOfOcurredEvent *= ratio/10; 
    // send money to winners
    for (uint i = 0; i < bids.length; i++){
      uint256 amount = bids[i].amount;
      uint256 winner = bids[i].amount;
      bids[i].amount = 0;
      bids[i].paid = true;
      winner.transfer(amount);
      }
    // send money to organizer
    // lo que queda va todo para el organizador
    organizer.transfer(address(this).balance);
  }

  function getState() view public {
    return this.on;
  }
}
