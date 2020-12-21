const {ServerNode, RippleNode} = require("./Components");
const {generateUUID} = require("../../helpers/GeneralHelpers");
const Blockchain = require("../../models/Blockchain/Blockchain");

const SERVER_NODE_SIZE = 10;
const PERCENTAGE_MIN_VOTED = 0.8;

class Ripple{
    blockchain = null;
    serverNodes = [];

    // TEST
    consensusTime = []; // Miliseconds
    transactionsTime = []; // Miliseconds

    constructor(quantityOfNodes){
        this.createNodes(quantityOfNodes)
        this.blockchain = new Blockchain();
    }

    createNodes(quantity){
        const nodes = [];
        for(let counter = 0; counter<quantity; counter++){
            const uuid = generateUUID();
            nodes.push(new RippleNode(uuid));
        }
        
        const quantityOfServerNodes = Math.ceil( nodes.length / SERVER_NODE_SIZE)

        for(let i = 0; i < nodes.length; i += quantityOfServerNodes){
            const nodesForServer = nodes.slice(i, i+quantityOfServerNodes);
            const serverNode = new ServerNode(nodesForServer);
            this.serverNodes.push(serverNode);
        }
    }

    addNewBlock(data){
        // TIME
        let begin = Date.now();
        // END TIME
        
        for(let serverNode of this.serverNodes){
            const block = this.blockchain.createBlock(data);
            serverNode.createBlock(block);
        }

        const electedNode = this.excecuteConsensus();

        if(this.blockchain.addBlock(electedNode.currentBlock)){
             // TIME
            this.transactionsTime.push(Date.now()-begin);
            // END TIME
            return true;
        }
        else{
            //console.log("Invalid block. No added.");
            return false;
            
        }
    }

    excecuteConsensus(){
        // TIME
        let begin = Date.now();
        // END TIME
        const votingNodesCounter = {};
        const votedNodes = [];
        for(let serverNode of this.serverNodes){
            const votedNode = serverNode.executeVote();
            if(votedNode){
                //console.log(votedNode);
                votingNodesCounter[votedNode.id] =  (votingNodesCounter[votedNode.id])?(votingNodesCounter[votedNode.id] + 1): 1;
                votedNodes.push(votedNode);
            }
        }
        
        let arrayOfVoting = Object.keys(votingNodesCounter).map(key => ({value: votingNodesCounter[key], key: key}));
        console.log("Array of voting", Object.keys(votingNodesCounter));
        console.log("VotedNodes", votedNodes);
        arrayOfVoting = arrayOfVoting.sort( (a, b) => a.value - b.value); 
        const moreVoted = arrayOfVoting[0];
        const percentage = (moreVoted.value * 100) / this.serverNodes.length;
        
        // TIME
        this.consensusTime.push(Date.now()-begin);
        // END TIME
        
        if(percentage >= PERCENTAGE_MIN_VOTED){
            const nodeMostVoted = votedNodes.find(node => node.id === moreVoted.key ); 
            console.log("nodeMostVoted", nodeMostVoted);
            return nodeMostVoted;
        }
        return null;
    }

    toString(){
        return this.blockchain.toString();
    }
}

module.exports = Ripple; 
