import pkg from 'truffle';
const { artifacts } = pkg;

//REQUIRES FIXING
//TypeError: Cannot read properties of undefined (reading 'require')

var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("Initializes with correct number of candidates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 3); //The number after count should match the number of candidates input in the contract
    });
  });

  it("Initializes candidates with the correct values", function() {
    return electionInstance.candidates(1).then(function(candidate) {
      assert.equal(candidate.id, 1, "ID CORRECT");
      assert.equal(candidate.name, "Jago", "NAME CORRECT");
      assert.equal(candidate.voteCount, 0, "VOTE COUNT CORRECT");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate.id, 2, "ID CORRECT");
      assert.equal(candidate.name, "Laine", "NAME CORRECT");
      assert.equal(candidate.voteCount, 0, "VOTE COUNT CORRECT");
      return electionInstance.candidates(3);
    }).then(function(candidate) {
      assert.equal(candidate.id, 3, "ID CORRECT");
      assert.equal(candidate.name, "Lucy", "NAME CORRECT");
      assert.equal(candidate.voteCount, 0, "VOTE COUNT CORRECT");
    });
  });

  it("Vote can be cast", function() {
    var candidateId = 1;
    return electionInstance.vote(candidateId, { from: accounts[0] }).then(function(receipt) {
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "VOTE COMPLETE");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate.voteCount;
      assert.equal(voteCount, 1, "INCREASE VOTE COUNT");
    });
  });

});
