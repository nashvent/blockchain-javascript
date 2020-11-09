var SHA256 = require("crypto-js/sha256");
class Block {
    constructor(index, data, previous = ""){
        this.index = index;
        this.date = new Date();
        this.data = data;
        this.previous = previous;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    createHash(){
        return SHA256(
            this.index + 
            this.date +
            this.data + 
            this.previous + 
            this.nonce
            ).toString();
    }

    mine(difficulty){
        while(!this.hash.startsWith(difficulty)){
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}


class Blockchain {
    constructor(genesis, difficulty = "00"){
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = difficulty;
    }

    createFirstBlock(genesis){
        return new Block(0, genesis);
    }

    getLastBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(data){
        let prevBlock = this.getLastBlock();
        let block = new Block(prevBlock.index+1, data, prevBlock.hash);
        block.mine(this.difficulty);
        console.log("Success! hash:"+ block.hash + " nonce:" + block.nonce);
        this.chain.push(block)
    }

    isValid(){
        for(let i = 1; i < this.chain.length; i++){
            let prevBlock = this.chain[i-1];
            let currBlock = this.chain[i];
            
            if(currBlock.previous != prevBlock.hash)
                return false;
            if(currBlock.createHash() != currBlock.hash)
                return false;
        }
        return true;
    }

    toString(){
        return JSON.stringify(this, null, 2);
    }
}

let coin = new Blockchain('info de genesis', "000");
coin.addBlock("transaction 1");
coin.addBlock("transaction 2");

console.log(coin.toString());
console.log("is valid", coin.isValid());