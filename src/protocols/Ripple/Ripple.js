const {ServerNode, RippleNode} = require("./Components");
const {generateUUID} = require("../../helpers/GeneralHelpers");
const Blockchain = require("../../models/Blockchain/Blockchain");

const SERVER_NODE_SIZE = 10;

class Ripple{
    blockchain = null;
    serverNodes = [];

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
        for(let serverNode of this.serverNodes){
            const block = this.blockchain.createBlock(data);
            serverNode.createBlock(block);
        }
        
        const electedNode = this.excecuteConsensus();
        if(this.blockchain.addBlock(electedNode.currentBlock)){
            console.log("Valid block added");
        }
        else{
            console.log("Invalid block. No added.");
        }
    }

    excecuteConsensus(){
        const votingNodesCounter = {};
        const votedNodes = [];
        for(let serverNode of this.serverNodes){
            const votedNode = serverNode.executeVote();
            if(votedNode){
                console.log(votedNode);
                votingNodesCounter[votedNode.id] =  (votingNodesCounter[votedNode.id])?(votingNodesCounter[votedNode.id] + 1): 1;
                votedNodes.push(votedNode);
            }
        }
        
        let arrayOfVoting = Object.keys(votingNodesCounter).map(key => ({value: votingNodesCounter[key], key: key}));
        arrayOfVoting = arrayOfVoting.sort( (a, b) => a.value - b.value); 
        const moreVoted = arrayOfVoting[0];
        const percentage = (moreVoted.value * 100) / this.serverNodes.length;
        if(percentage >= 0.8){
            return votedNodes.find(node => node.id === moreVoted.key );
        }
        return null;
    }

    toString(){
        return this.blockchain.toString();
    }
}

module.exports = Ripple; 
