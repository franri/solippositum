// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

library Commons {

  struct Bid{
    uint256 eventId;
    address bidder;
    uint256 amount;
    bool paid;
  }

  struct PossibleEvent{
    uint256 id;
    string name;
    uint256 totalBidded;
    uint256 ratio; // dividir entre 10 para tener el posta. Ponele, 14 significa 1.4
    // mapping(address => uint256) bidsIndex;
    Bid[] bids; 

  }
  
  enum State{
    AcceptingBids,
    EventHappened,
    WaitingForBacker,
    BidFinished
  }

}
