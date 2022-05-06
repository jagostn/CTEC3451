//CODE FROM THIS FILE WAS INSPIRED BY DAPPUNIVERSITY
//FIXES AND ADAPTATIONS FROM MY OWN WORK HAVE BEEN APPLIED

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  //Initialise web3 upon page launch, links to below
  init: function(){
    return App.initWeb3();
  },

  initWeb3: function(){ 
      //Get web3 instance from MetaMask wallet
      if (typeof web3 !== 'undefined') {
        //If instance already provided by MetaMask
        App.web3Provider = web3.currentProvider;
        ethereum.enable();
        web3 = new Web3(web3.currentProvider);
      } else {
        //Return to default
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(App.web3Provider);
      }
     return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      //Create a new truffle contract
      App.contracts.Election = TruffleContract(election);
      //Connect to MetaMask to allow for interactions with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  //Listen for events in the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: '0',
        toBlock: 'latest'
      }).watch(function(event){
        //Reload webpage when vote is cast/event is triggered
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    //Load and display account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    //Allow vote casting
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }

    //Load contract data
  App.contracts.Election.deployed().then(function(instance) {
    electionInstance = instance;
    return electionInstance.candidatesCount();
  }).then(function(candidatesCount) {

    const promises = [];
    for (var i = 1; i <= candidatesCount; i++) {
      promises.push(electionInstance.candidates(i));
      }

      Promise.all(promises).then(function(candidates) {
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        //Fit array
        candidates.forEach(candidate => {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          
          //Fit template
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td class='td-fit'>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          //Fit options
          var candidateOption = "<option value='" + id + "'>" + name + "</option>"
          candidatesSelect.append(candidateOption);
        })
      });
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
