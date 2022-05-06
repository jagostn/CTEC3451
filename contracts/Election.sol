pragma solidity ^0.5.16;

contract Election {
  // Create a candidate model
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  // Store total number of candidates
  uint public candidatesCount;

  // Store start and end time for consensus process
  /*uint public startTime;
  uint public duration;*/

  // Store candidate details
  mapping(uint => Candidate) public candidates;

  // Store addresses that have already cast a vote
  mapping(address => bool) public voters;

  // Create an event for voting
  event votedEvent (uint indexed candidateId);

  /* Create an event for the result of the election
  event result (string name, uint voteCount);

  modifier timeDoneMsg{
    require(block.timestamp<=duration,"Consensus process is complete.");
    _;
  }*/

  // Function; allows for candidates to be added (custom number of candidates/voting options)
  function addCandidate (string memory name) private {
    //Increment vote count
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
  }

  /*function setStartTime(uint period) public {
    startTime = now+period;
  }

  function setDuration(uint period) public {
    duration = period+startTime;
  }*/

  constructor () public {
    addCandidate("Jago");
    addCandidate("Laine");
    addCandidate("Lucy");
    /*setStartTime(0);
    //setDuration(100);*/
  }

  // Function; allows for voters to vote if they pass checks
  function vote (uint candidateId) public {
    // Require that they have not voted before and have selected a valid candidate
    require(!voters[msg.sender]);
    require(candidateId > 0 && candidateId <= candidatesCount);
    // Record vote
    voters[msg.sender] = true;
    // Increment vote count
    candidates[candidateId].voteCount++;
    // Trigger voting event
    emit votedEvent(candidateId);

  /* function finish () {
    require(now >= endTime);*/
  }
}
