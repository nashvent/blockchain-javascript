const PERCENTAGE_MIN_VOTED = 0.5;
class Node {       
    currentBlock = null; // generate in the network
    transactions = [];
    constructor(id){
        this.id = id; // stellar: public key        
    }

    setCurrentBlock(block){
        this.currentBlock = block;
    }
    
    getCurrentBlock(){
        return this.currentBlock;
    }

    voteForNode(nodes){
        const segmentGroup = {};
        for(let node of nodes){
            const data = node.currentBlock.data;
            const parseData = JSON.stringify(data); 
            if(!segmentGroup[parseData]) {
                segmentGroup[parseData] = [];
            }
            segmentGroup[parseData].push(node);
        }     
       
        let keyOfBigger = Object.keys(segmentGroup)[0]; 
        for(let segmentKey in segmentGroup){
            if( segmentGroup[keyOfBigger].length < segmentGroup[segmentKey].length ){
                keyOfBigger = segmentKey;
            }
        }
       
        const percentage = (segmentGroup[keyOfBigger].length * 100) / nodes.length;   
        
        if(percentage >= PERCENTAGE_MIN_VOTED){  
            return segmentGroup[keyOfBigger][0];
        }
        return null;
    }
}

class ServerNode {
    unl = []; // unique node list
    nodes = []; // regular nodes

    constructor(nodes){
        const unl_size = Math.round(nodes.length * 0.2); // 20% of size for validares o unl nodes
        this.unl = nodes.slice(0, unl_size);
        this.nodes = nodes.slice(unl_size, nodes.length);
    }

    createBlock(block){
        for(let node of this.nodes){
            node.setCurrentBlock(block);
        }
    }

    executeVote(){
        //console.log("this.unl", this.unl);
        const votingState = {}; 
        for(let unlNode of this.unl){
            const votedNode = unlNode.voteForNode(this.nodes);
            if(!!votedNode){
                votingState[votedNode.id] = (votingState[votedNode.id] ? (votingState[votedNode.id] + 1) : 1); 
            }
        }
        let arrayState = Object.keys(votingState).map(key => ({value: votingState[key], key: key}));
        arrayState = arrayState.sort( (a, b) => a.value - b.value); 
        const percentage = (arrayState[0].value * 100) / this.nodes.length;
        if(percentage >= PERCENTAGE_MIN_VOTED){
            return this.getNode(arrayState[0].key);
        }
        return null;
    }

    getNode(id){
        return this.nodes.find(node => node.id === id );
    }

}

module.exports = {
    RippleNode : Node,
    ServerNode: ServerNode
};