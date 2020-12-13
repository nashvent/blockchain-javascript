const Blockchain = require("../../models/Blockchain/Blockchain");
const {StellarNode} = require("./Components");
const {generateUUID} = require("../../helpers/GeneralHelpers");
const VALIDATORS_SIZE = 10;

class Stellar{
    nodes = [];
    blockchain = null;
    quorumSlices = []; // [  [node, node], [node, node] ]
    validators = []; // [node, node, node]
    
    constructor(quantityOfNodes){
        this.createNodes(quantityOfNodes)
        this.blockchain = new Blockchain();
    }

    createNodes(quantity){
        this.nodes = [];
        for(let counter = 0; counter<quantity; counter++){
            const uuid = generateUUID();
            this.nodes.push(new StellarNode(uuid));
        }
    }

    selectNodesAndValidators(){
        this.validators = this.nodes.slice(0, VALIDATORS_SIZE);
        const nodes = this.nodes.slice(VALIDATORS_SIZE, this.nodes.length);
        const quorumSize = Math.ceil(nodes.length / VALIDATORS_SIZE);
        this.quorumSlices = [];
        for(let i = 0; i < nodes.length; i += quorumSize){
            const quorumSlice = nodes.slice(i, i+quorumSize);
            this.quorumSlices.push(quorumSlice);
        }
    }    

    addNewBlock(data){
        // All nodes create your block
        for(let node of this.nodes){
            const block = this.blockchain.createBlock(data);
            node.setBlock(block);
        }
        const electedNode = this.excecuteConsensus();
        
        if(this.blockchain.addBlock(electedNode.block)){
            console.log("Valid block added");
        }
        else{
            console.log("Invalid block. No added.");
        }
    }

    excecuteConsensus(){
        this.selectNodesAndValidators();
        let electedNodes = [];
        for(let i=0; i < this.validators.length; i+= 1){
            const electedNode = this.validators[i].validateNodes(this.quorumSlices[i]);
            electedNodes.push(electedNode);
        }

        const validator = electedNodes[0];
        const finalQuorum = electedNodes.slice(1, electedNodes.length);
        return validator.validateNodes(finalQuorum);
    }

    toString(){
        return this.blockchain.toString();
    }
}

module.exports = Stellar; 
